import { isAuthenticated } from './api';

type Product = {
  id: number;
  nombre: string;
  slug: string;
  precio: number;
  precio_comparacion: number | null;
  stock: number;
  imagenes: string[];
  es_activo: boolean;
  es_featured: boolean;
  descripcion?: string;
  categoria?: { id: number; nombre: string; slug: string } | null;
  created_at: string;
};

type Categoria = {
  id: number;
  nombre: string;
  slug: string;
  descripcion: string | null;
  imagen: string | null;
  activa: boolean;
};

type CarritoItem = {
  id: number;
  producto_id: number;
  cantidad: number;
  producto: Product;
};

/* v8 ignore start */
type CarritoData = {
  id: number;
  site_id: number;
  items: CarritoItem[];
  total: number;
};
/* v8 ignore stop */

const API_BASE = "/api";
let cartItemTemplate: string | null = null;

function getSiteId(element: Element): number | null {
  const value = (element as HTMLElement).dataset.sitioId;

  if (!value || value === "{{SITIO_ID}}") {
    const bodySiteId = document.body.dataset.sitioId;
    if (!bodySiteId) return null;

    const parsedBodyId = Number(bodySiteId);

    /* v8 ignore next */
    return Number.isNaN(parsedBodyId) ? null : parsedBodyId;
  }

  const parsed = Number(value);
  /* v8 ignore next */
  return Number.isNaN(parsed) ? null : parsed;
}

function getLimit(element: Element, fallback: number): number {
  const value = (element as HTMLElement).dataset.limit;
  /* v8 ignore next */
  if (!value) return fallback;

  const parsed = Number(value);
  /* v8 ignore next */
  return Number.isNaN(parsed) ? fallback : parsed;
}

function getUsuarioId(): number | null {
  try {
    const token = localStorage.getItem("site_token");
    /* v8 ignore next */
    if (!token) return null;

    const payload = JSON.parse(atob(token.split(".")[1]));

    if (payload.exp) {
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp < now) {
        localStorage.removeItem("site_token");
        return null;
      }
    }

    /* v8 ignore next */
    return payload.usuario_id || Number(payload.sub) || null;
  /* v8 ignore start */
  } catch {
    return null;
  }
  /* v8 ignore stop */
}

function formatPrice(value: number): string {
  return `S/ ${value.toFixed(2)}`;
}

function showToast(message: string): void {
  const existing = document.querySelector<HTMLElement>(".tw-toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.className = "tw-toast";
  toast.textContent = message;
  Object.assign(toast.style, {
    position: "fixed",
    bottom: "24px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "#1e293b",
    color: "#fff",
    padding: "12px 24px",
    borderRadius: "8px",
    fontSize: "14px",
    zIndex: "99999",
    boxShadow: "0 4px 12px rgba(0,0,0,.25)",
    opacity: "0",
    transition: "opacity .3s ease",
    maxWidth: "90vw",
    textAlign: "center",
  });
  document.body.appendChild(toast);
  requestAnimationFrame(() => { toast.style.opacity = "1"; });
  setTimeout(() => {
    toast.style.opacity = "0";
    /* v8 ignore next */
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function normalizeImage(url: string | null | undefined, fallback?: string): string {
  /* v8 ignore next */
  if (!url) return fallback || "https://placehold.co/700x420/e2e8f0/334155?text=Producto";
  /* v8 ignore next */
  if (url.startsWith("http")) return url;
  return url;
}

function getFirstImage(imagenes: string[] | null | undefined): string {
  if (imagenes && imagenes.length > 0 && typeof imagenes[0] === "string") {
    return normalizeImage(imagenes[0]);
  }
  return "https://placehold.co/700x420/e2e8f0/334155?text=Producto";
}

function showEmpty(container: Element): void {
  const list = container.querySelector<HTMLElement>("[data-tienda-list]");
  const item = container.querySelector<HTMLElement>("[data-tienda-item]");
  const empty = container.querySelector<HTMLElement>("[data-tienda-empty]");
  const totalEl = container.querySelector<HTMLElement>("[data-tienda-cart-total]");
  const checkoutLink = container.querySelector<HTMLElement>("[data-tienda-checkout-link]");
  const pagarBtn = container.querySelector<HTMLElement>("[data-tienda-pagar]");

  if (list) list.innerHTML = "";
  if (item) item.style.display = "none";
  /* v8 ignore next */
  if (empty) empty.style.display = "block";
  if (checkoutLink) checkoutLink.style.display = "none";
  if (pagarBtn) pagarBtn.style.display = "none";
  if (totalEl) {
    totalEl.textContent = "";
    const section = totalEl.parentElement?.parentElement;
    /* v8 ignore next */
    if (section) section.style.display = "none";
  }
}

async function fetchData<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Error HTTP ${response.status}`);
  return response.json();
}

async function fetchProductos(siteId: number, opts?: { categoria_id?: number; featured?: boolean; limit?: number }): Promise<Product[]> {
  const params = new URLSearchParams();
  /* v8 ignore next */
  if (opts?.categoria_id) params.set("categoria_id", String(opts.categoria_id));
  /* v8 ignore next */
  if (opts?.featured) params.set("featured", "true");
  /* v8 ignore next */
  if (opts?.limit) params.set("por_pagina", String(opts.limit));

  const qs = params.toString();

  /* v8 ignore next */
  const json = await fetchData<{ success: boolean; data: Product[] }>(
    `${API_BASE}/v1/sitios/${siteId}/tienda/productos${qs ? "?" + qs : ""}`
  );
  return json.data;
}

async function fetchProducto(siteId: number, productoId: number): Promise<Product> {
  const json = await fetchData<{ success: boolean; data: Product }>(
    `${API_BASE}/v1/sitios/${siteId}/tienda/productos/${productoId}`
  );
  return json.data;
}

async function fetchCategorias(siteId: number): Promise<Categoria[]> {
  const json = await fetchData<{ success: boolean; data: Categoria[] }>(
    `${API_BASE}/v1/sitios/${siteId}/tienda/categorias?solo_activas=true`
  );
  return json.data;
}

async function fetchCarrito(siteId: number, usuarioId: number | null): Promise<CarritoData> {
  /* v8 ignore next */
  if (!usuarioId) return { id: 0, site_id: siteId, items: [], total: 0 };
  return fetchData<CarritoData>(
    `${API_BASE}/v1/sitios/${siteId}/tienda/carrito?usuario_id=${usuarioId}`
  );
}

async function addToCart(siteId: number, productoId: number, cantidad: number, usuarioId: number | null): Promise<void> {
  const body: Record<string, unknown> = { producto_id: productoId, cantidad };
  /* v8 ignore next */
  if (usuarioId) body.usuario_id = usuarioId;

  const response = await fetch(`${API_BASE}/v1/sitios/${siteId}/tienda/carrito/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error("Error al agregar al carrito");
}

async function updateCartItem(siteId: number, itemId: number, cantidad: number): Promise<void> {
  await fetch(`${API_BASE}/v1/sitios/${siteId}/tienda/carrito/items/${itemId}?cantidad=${cantidad}`, {
    method: "PUT",
  });
}

async function removeCartItem(siteId: number, itemId: number): Promise<void> {
  await fetch(`${API_BASE}/v1/sitios/${siteId}/tienda/carrito/items/${itemId}`, {
    method: "DELETE",
  });
}

async function postCheckout(siteId: number, data: Record<string, unknown>): Promise<{ pedido: unknown; mensaje: string }> {
  const response = await fetch(`${API_BASE}/v1/sitios/${siteId}/tienda/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ detail: "Error al procesar el pedido" }));
    /* v8 ignore next */
    throw new Error(err.detail || "Error al procesar el pedido");
  }

  return response.json();
}

function toggleElement(element: HTMLElement | null, visible: boolean): void {
  if (element) element.style.display = visible ? "" : "none";
}

function hasDiscount(product: Product): boolean {
  return Boolean(product.precio_comparacion && product.precio_comparacion > product.precio);
}

function setProductImage(item: HTMLElement, product: Product): void {
  const image = item.querySelector<HTMLImageElement>("[data-tienda-product-image]");
  if (!image) return;

  image.src = getFirstImage(product.imagenes);
  image.alt = product.nombre;
}

function setProductDiscount(item: HTMLElement, product: Product): void {
  const compare = item.querySelector<HTMLElement>("[data-tienda-product-compare]");
  const badge = item.querySelector<HTMLElement>("[data-tienda-badge-discount]");

  if (!hasDiscount(product)) {
    toggleElement(compare, false);
    toggleElement(badge, false);
    return;
  }

  if (compare && product.precio_comparacion) {
    compare.textContent = formatPrice(product.precio_comparacion);
    compare.style.display = "";
  }

  if (badge && product.precio_comparacion) {
    const discount = Math.round((1 - product.precio / product.precio_comparacion) * 100);
    badge.textContent = `-${discount}%`;
    badge.style.display = "";
  }
}

function setProductStock(item: HTMLElement, product: Product): void {
  const stock = item.querySelector<HTMLElement>("[data-tienda-product-stock]");
  if (!stock) return;

  stock.textContent = product.stock > 0 ? "Disponible" : "Agotado";
  stock.style.color = product.stock > 0 ? "#16a34a" : "#ef4444";
}

function fillProductItem(item: HTMLElement, product: Product): void {
  setProductImage(item, product);
  setProductDiscount(item, product);
  setProductStock(item, product);

  const name = item.querySelector<HTMLElement>("[data-tienda-product-name]");
  const price = item.querySelector<HTMLElement>("[data-tienda-product-price]");
  const desc = item.querySelector<HTMLElement>("[data-tienda-product-desc]");
  const categoryName = item.querySelector<HTMLElement>("[data-tienda-category-name]");

  if (name) name.textContent = product.nombre;
  if (price) price.textContent = formatPrice(product.precio);
  if (desc) desc.textContent = product.descripcion || "";
  if (categoryName && product.categoria) categoryName.textContent = product.categoria.nombre;

  item.dataset.tiendaProductId = String(product.id);
}

function renderProductCollection(container: Element, productos: Product[]): void {
  const list = container.querySelector<HTMLElement>("[data-tienda-list]");
  const template = container.querySelector<HTMLElement>("[data-tienda-item]");
  const empty = container.querySelector<HTMLElement>("[data-tienda-empty]");
  /* v8 ignore next */
  if (!list || !template) return;

  if (!productos.length) {
    showEmpty(container);
    return;
  }

  if (empty) empty.style.display = "none";

  const siteId = getSiteId(container);

  const clonedTemplate = template.cloneNode(true) as HTMLElement;
  list.innerHTML = "";

  productos.forEach((product) => {
    const item = clonedTemplate.cloneNode(true) as HTMLElement;
    item.style.display = "";

    fillProductItem(item, product);

    const addBtn = item.querySelector<HTMLElement>("[data-tienda-add-cart]");
    if (addBtn) {
      addBtn.addEventListener("click", async (event) => {
        event.preventDefault();
        event.stopPropagation();
        /* v8 ignore next */
        if (!siteId) return;
        const uid = getUsuarioId();
        /* v8 ignore start */
        if (!uid) {
          showToast("Debes iniciar sesión para agregar al carrito");
          return;
        }
        /* v8 ignore stop */

        try {
          addBtn.textContent = "Agregando...";
          addBtn.setAttribute("disabled", "true");
          await addToCart(siteId, product.id, 1, uid);
          refreshCarritoUI();
          addBtn.textContent = "✓ Agregado";
          setTimeout(() => {
            addBtn.textContent = "Agregar al carrito";
            addBtn.removeAttribute("disabled");
          }, 2000);
        } catch (error) {
          console.error("[Tienda Widget]", error);
          addBtn.textContent = "Error";
          setTimeout(() => {
            addBtn.textContent = "Agregar al carrito";
            addBtn.removeAttribute("disabled");
          }, 2000);
        }
      });
    }

    list.appendChild(item);
  });
}

async function initProductosGrid(container: Element, fallbackLimit: number): Promise<void> {
  const siteId = getSiteId(container);
  /* v8 ignore next 3 */
  if (!siteId) {
    showEmpty(container);
    return;
  }

  try {
    const limit = getLimit(container, fallbackLimit);
    const productos = await fetchProductos(siteId, { limit });
    renderProductCollection(container, productos);
    /* v8 ignore next 4 */
  } catch (error) {
    console.error("[Tienda Widget]", error);
    showEmpty(container);
  }
}

async function initProductoLista(container: Element): Promise<void> {
  const siteId = getSiteId(container);
  if (!siteId) {
    showEmpty(container);
    return;
  }

  try {
    const limit = getLimit(container, 8);
    const productos = await fetchProductos(siteId, { limit });
    renderProductCollection(container, productos);
  } catch (error) {
    console.error("[Tienda Widget]", error);
    showEmpty(container);
  }
}

async function initProductoDestacado(container: Element): Promise<void> {
  const siteId = getSiteId(container);
  if (!siteId) {
    showEmpty(container);
    return;
  }

  try {
    const productos = await fetchProductos(siteId, { featured: true, limit: 1 });
    const product = productos[0];

    if (!product) {
      showEmpty(container);
      return;
    }

    const item = container.querySelector<HTMLElement>("[data-tienda-item]") || (container as HTMLElement);
    fillProductItem(item, product);

    const empty = container.querySelector<HTMLElement>("[data-tienda-empty]");
    if (empty) empty.style.display = "none";

    const addBtn = item.querySelector<HTMLElement>("[data-tienda-add-cart]");

    if (addBtn) {
      addBtn.addEventListener("click", async (event) => {
        event.preventDefault();

        const uid = getUsuarioId();
        /* v8 ignore start */
        if (!uid) {
          showToast("Debes iniciar sesión para agregar al carrito");
          return;
        }
        /* v8 ignore stop */

        try {
          addBtn.textContent = "Agregando...";
          addBtn.setAttribute("disabled", "true");
          await addToCart(siteId, product.id, 1, uid);
          refreshCarritoUI();
          addBtn.textContent = "✓ Agregado";
          setTimeout(() => {
            addBtn.textContent = "Agregar al carrito";
            addBtn.removeAttribute("disabled");
          }, 2000);
        } catch (error) {
          console.error("[Tienda Widget]", error);
          addBtn.textContent = "Error";
        }
      });
    }
  } catch (error) {
    console.error("[Tienda Widget]", error);
    showEmpty(container);
  }
}

async function resolveProductForDetail(
  siteId: number,
  productoId: number | null,
  slug: string | null
): Promise<Product | null> {
  if (productoId) return fetchProducto(siteId, productoId);
  /* v8 ignore next */
  if (!slug) return null;

  const productos = await fetchProductos(siteId, { limit: 100 });
  return productos.find((p) => p.slug === slug) || null;
}

function initQtyControls(container: Element, product: Product): () => number {
  const qtyValue = container.querySelector<HTMLElement>("[data-tienda-qty-value]");
  const qtyMinus = container.querySelector<HTMLElement>("[data-tienda-qty-minus]");
  const qtyPlus = container.querySelector<HTMLElement>("[data-tienda-qty-plus]");
  let cantidad = 1;

  const renderQty = () => {
    if (qtyValue) qtyValue.textContent = String(cantidad);
  };

  qtyMinus?.addEventListener("click", () => {
    cantidad = Math.max(1, cantidad - 1);
    renderQty();
  });

  qtyPlus?.addEventListener("click", () => {
    cantidad = Math.min(product.stock, cantidad + 1);
    renderQty();
  });

  return () => cantidad;
}

function bindDetailAddButton(
  container: Element,
  siteId: number,
  productId: number,
  getCantidad: () => number
): void {
  const addBtn = container.querySelector<HTMLElement>("[data-tienda-add-cart]");
  if (!addBtn) return;

  addBtn.addEventListener("click", async (event) => {
    event.preventDefault();

    const uid = getUsuarioId();
    /* v8 ignore start */
    if (!uid) {
      showToast("Debes iniciar sesión para agregar al carrito");
      return;
    }
    /* v8 ignore stop */
    try {
      addBtn.textContent = "Agregando...";
      addBtn.setAttribute("disabled", "true");
      await addToCart(siteId, productId, getCantidad(), uid);
      refreshCarritoUI();
      addBtn.textContent = "✓ Agregado";
      setTimeout(() => {
        addBtn.textContent = "Agregar al carrito";
        addBtn.removeAttribute("disabled");
      }, 2000);
    } catch (error) {
      console.error("[Tienda Widget]", error);
      addBtn.textContent = "Error";
    }
  });
}

async function initProductoDetalle(container: Element): Promise<void> {
  const siteId = getSiteId(container);
  /* v8 ignore next */
  if (!siteId) return;

  const params = new URLSearchParams(globalThis.location.search);
  const slug = params.get("producto");
  const productoIdAttr = (container as HTMLElement).dataset.productoId;
  const productoId = productoIdAttr ? Number(productoIdAttr) : null;

  if (!productoId && !slug) return;

  const empty = container.querySelector<HTMLElement>("[data-tienda-empty]");

  try {
    const product = await resolveProductForDetail(siteId, productoId, slug);
    if (!product) {
      showEmpty(container);
      return;
    }

    fillProductItem(container as HTMLElement, product);
    toggleElement(empty, false);

    const getCantidad = initQtyControls(container, product);
    bindDetailAddButton(container, siteId, product.id, getCantidad);
  } catch (error) {
    console.error("[Tienda Widget]", error);
    showEmpty(container);
  }
}

async function initCategorias(container: Element): Promise<void> {
  const siteId = getSiteId(container);
  if (!siteId) {
    showEmpty(container);
    return;
  }

  try {
    const categorias = await fetchCategorias(siteId);

    const list = container.querySelector<HTMLElement>("[data-tienda-list]");
    const template = container.querySelector<HTMLElement>("[data-tienda-item]");
    const empty = container.querySelector<HTMLElement>("[data-tienda-empty]");
    /* v8 ignore next */
    if (!list || !template) return;

    if (!categorias.length) {
      showEmpty(container);
      return;
    }

    if (empty) empty.style.display = "none";

    const clonedTemplate = template.cloneNode(true) as HTMLElement;
    list.innerHTML = "";

    const allBtn = clonedTemplate.cloneNode(true) as HTMLElement;
    const allName = allBtn.querySelector<HTMLElement>("[data-tienda-category-name]");
    allBtn.dataset.categoriaId = "";
    if (allName) allName.textContent = "Todas";
    allBtn.addEventListener("click", () => filterByCategory(container, null));
    list.appendChild(allBtn);

    categorias.forEach((cat) => {
      const btn = clonedTemplate.cloneNode(true) as HTMLElement;
      const name = btn.querySelector<HTMLElement>("[data-tienda-category-name]");
      btn.dataset.categoriaId = String(cat.id);
      if (name) name.textContent = cat.nombre;

      btn.addEventListener("click", () => filterByCategory(container, cat.id));
      list.appendChild(btn);
    });
  } catch (error) {
    console.error("[Tienda Widget]", error);
    showEmpty(container);
  }
}

function filterByCategory(_container: Element, categoriaId: number | null): void {
  const allProductBlocks = document.querySelectorAll<HTMLElement>(
    '[data-tienda="products-grid"], [data-tienda="products-list"]'
  );

  allProductBlocks.forEach((block) => {
    const items = block.querySelectorAll<HTMLElement>("[data-tienda-item]");

    items.forEach((item) => {
      if (!categoriaId) {
        item.style.display = "";
        return;
      }
      /* v8 ignore next */
      if (item.style.display === "none") return;
    });
  });
}

function ensureCartTemplate(list: HTMLElement | null): void {
  /* v8 ignore next */
  if (!list || cartItemTemplate) return;

  const template = list.querySelector<HTMLElement>("[data-tienda-item]");
  if (template) cartItemTemplate = template.outerHTML;
}

function showCartSummary(container: Element): void {
  const checkoutLink = container.querySelector<HTMLElement>("[data-tienda-checkout-link]");
  const totalEl = container.querySelector<HTMLElement>("[data-tienda-cart-total]");

  toggleElement(checkoutLink, true);
  if (totalEl) {
    const section = totalEl.parentElement?.parentElement;
    /* v8 ignore next */
    if (section) section.style.display = "";
  }
}

function updateCartItemView(el: HTMLElement, item: CarritoItem): void {
  const image = el.querySelector<HTMLImageElement>("[data-tienda-product-image]");
  const name = el.querySelector<HTMLElement>("[data-tienda-product-name]");
  const price = el.querySelector<HTMLElement>("[data-tienda-product-price]");
  const qtyValue = el.querySelector<HTMLElement>("[data-tienda-qty-value]");
  const subtotal = el.querySelector<HTMLElement>("[data-tienda-item-subtotal]");

  if (image) {
    image.src = getFirstImage(item.producto.imagenes);
    image.alt = item.producto.nombre;
  }
  if (name) name.textContent = item.producto.nombre;
  if (price) price.textContent = formatPrice(item.producto.precio);
  if (qtyValue) qtyValue.textContent = String(item.cantidad);
  if (subtotal) subtotal.textContent = formatPrice(item.producto.precio * item.cantidad);
}

function renderCartTotal(container: Element, items: CarritoItem[]): void {
  const totalEl = container.querySelector<HTMLElement>("[data-tienda-cart-total]");
  if (!totalEl) return;

  const total = items.reduce((sum, i) => sum + i.producto.precio * i.cantidad, 0);
  totalEl.textContent = formatPrice(total);
}

function createCartElement(item: CarritoItem): HTMLElement | null {
  /* v8 ignore next */
  if (!cartItemTemplate) return null;

  const temp = document.createElement("div");
  temp.innerHTML = cartItemTemplate;

  const el = temp.firstElementChild as HTMLElement | null;
  /* v8 ignore next */
  if (!el) return null;

  el.style.display = "";
  el.dataset.tiendaItemId = String(item.id);
  updateCartItemView(el, item);
  return el;
}

function bindCartQuantityButton(
  button: HTMLElement | null,
  container: Element,
  siteId: number,
  usuarioId: number | null,
  item: CarritoItem,
  getQuantity: () => number
): void {
  button?.addEventListener("click", async () => {
    const newQty = getQuantity();
    if (newQty === item.cantidad) return;

    try {
      await updateCartItem(siteId, item.id, newQty);
      item.cantidad = newQty;
      const cartItem = button?.closest<HTMLElement>("[data-tienda-item]");
      if (cartItem) {
        updateCartItemView(cartItem, item);
      }
      refreshCartTotal(container, siteId, usuarioId);
    } catch (error) {
      console.error("[Tienda Widget]", error);
    }
  });
}

function bindCartRemoveButton(
  removeBtn: HTMLElement | null,
  list: HTMLElement,
  container: Element,
  siteId: number,
  usuarioId: number | null,
  item: CarritoItem,
  el: HTMLElement
): void {
  removeBtn?.addEventListener("click", async () => {
    try {
      await removeCartItem(siteId, item.id);
      el.remove();

      const remaining = list.querySelectorAll("[data-tienda-item]");
      if (remaining.length === 0) showEmpty(container);
      else refreshCartTotal(container, siteId, usuarioId);
    } catch (error) {
      console.error("[Tienda Widget]", error);
    }
  });
}

function bindCartItemActions(
  el: HTMLElement,
  list: HTMLElement,
  container: Element,
  siteId: number,
  usuarioId: number | null,
  item: CarritoItem
): void {
  const qtyMinus = el.querySelector<HTMLElement>("[data-tienda-qty-minus]");
  const qtyPlus = el.querySelector<HTMLElement>("[data-tienda-qty-plus]");
  const removeBtn = el.querySelector<HTMLElement>("[data-tienda-item-remove]");

  bindCartQuantityButton(qtyMinus, container, siteId, usuarioId, item, () => Math.max(1, item.cantidad - 1));
  bindCartQuantityButton(qtyPlus, container, siteId, usuarioId, item, () => item.cantidad + 1);
  bindCartRemoveButton(removeBtn, list, container, siteId, usuarioId, item, el);
}

function renderCartItems(
  list: HTMLElement,
  container: Element,
  siteId: number,
  usuarioId: number | null,
  items: CarritoItem[]
): void {
  list.innerHTML = "";

  items.forEach((item) => {
    const el = createCartElement(item);
    /* v8 ignore next */
    if (!el) return;

    bindCartItemActions(el, list, container, siteId, usuarioId, item);
    list.appendChild(el);
  });
}

function ensurePayButton(container: Element, usuarioId: number | null): void {
  const existingBtn = container.querySelector<HTMLElement>("[data-tienda-pagar]");
  if (existingBtn) return;

  const pagarBtn = document.createElement("button");
  pagarBtn.dataset.tiendaPagar = "";
  pagarBtn.textContent = "Pagar ahora";

  let payButtonBackground = "#f59e0b";

  /* v8 ignore next */
  if (usuarioId) {
    payButtonBackground = "#16a34a";
  }

  Object.assign(pagarBtn.style, {
    width: "100%",
    padding: "14px",
    marginTop: "16px",
    background: payButtonBackground,
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
  });

  pagarBtn.addEventListener("click", () => {
    const uid = getUsuarioId();

    if (!uid) {
      showToast("Debes iniciar sesión para pagar");
      return;
    }

    const checkout = document.querySelector<HTMLElement>('[data-tienda="checkout"]');

    if (checkout) checkout.scrollIntoView({ behavior: "smooth" });
    else showToast("Sección de checkout no disponible");
  });

  const totalSection =
    container.querySelector("[data-tienda-cart-total]")?.closest("div") ||
    container;

  totalSection.appendChild(pagarBtn);
}

async function initCarrito(container: Element): Promise<void> {
  const siteId = getSiteId(container);
  const usuarioId = getUsuarioId();

  if (!siteId) {
    showEmpty(container);
    return;
  }

  const list = container.querySelector<HTMLElement>("[data-tienda-list]");
  ensureCartTemplate(list);

  try {
    const carrito = await fetchCarrito(siteId, usuarioId);

    if (!carrito.items?.length) {
      showEmpty(container);
      return;
    }

    if (!list || !cartItemTemplate) return;

    toggleElement(container.querySelector<HTMLElement>("[data-tienda-empty]"), false);
    showCartSummary(container);
    renderCartItems(list, container, siteId, usuarioId, carrito.items);
    renderCartTotal(container, carrito.items);
    ensurePayButton(container, usuarioId);
  /* v8 ignore next 4 */
  } catch (error) {
    console.error("[Tienda Widget]", error);
    showEmpty(container);
  }
}

function refreshCartTotal(container: Element, siteId: number, usuarioId: number | null): void {
  /* v8 ignore next */
  const ignoreRefreshError = () => {};

  fetchCarrito(siteId, usuarioId)
    .then((carrito) => {
      const totalEl = container.querySelector<HTMLElement>("[data-tienda-cart-total]");
      if (totalEl) {
        const total = carrito.items.reduce((sum, i) => sum + i.producto.precio * i.cantidad, 0);
        totalEl.textContent = formatPrice(total);
      }
    })
    .catch(ignoreRefreshError);
}

export function refreshCarritoUI(): void {
  const cartBlocks = document.querySelectorAll<HTMLElement>('[data-tienda="cart"]');
  cartBlocks.forEach((el) => {
    initCarrito(el);
  });
}

function showCheckoutError(errorEl: HTMLElement | null, message: string): void {
  if (!errorEl) return;

  errorEl.textContent = message;
  errorEl.style.display = "block";
}

function getCheckoutField(form: HTMLFormElement, name: string): string {
  const el = form.querySelector<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
    `[data-tienda-field-${name}]`
  );
  return el?.value?.trim() || "";
}

function buildCheckoutData(form: HTMLFormElement, usuarioId: number): Record<string, unknown> {
  return {
    nombre_cliente: getCheckoutField(form, "nombre"),
    email_cliente: getCheckoutField(form, "email"),
    telefono_cliente: getCheckoutField(form, "telefono"),
    direccion_envio: getCheckoutField(form, "direccion"),
    ciudad_envio: getCheckoutField(form, "ciudad"),
    pais_envio: getCheckoutField(form, "pais"),
    codigo_postal: getCheckoutField(form, "codigo-postal"),
    metodo_pago: getCheckoutField(form, "metodo-pago"),
    notas: getCheckoutField(form, "notas"),
    usuario_id: usuarioId,
  };
}

function setSubmitLoading(submitBtn: HTMLElement | null, loading: boolean): void {
  if (!submitBtn) return;

  submitBtn.textContent = loading ? "Procesando..." : "Confirmar pedido";
  (submitBtn as HTMLButtonElement).disabled = loading;
}

function fillCheckoutProfile(form: HTMLFormElement): void {
  if (!isAuthenticated()) return;

  import('./perfil').then(({ fetchProfile }) => {
    fetchProfile().then((profile) => {
      const setField = (name: string, value: string | null | undefined) => {
        const el = form.querySelector<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
          `[data-tienda-field-${name}]`
        );
        if (el && value) el.value = value;
      };

      setField("nombre", `${profile.nombre} ${profile.apellido}`);
      setField("email", profile.correo);
      setField("telefono", profile.telefono);
      setField("direccion", profile.direccion_envio);
      setField("ciudad", profile.ciudad);
      setField("pais", profile.pais);
      setField("codigo-postal", profile.codigo_postal);
    }).catch(() => {});
  });
}

async function handleCheckoutSubmit(
  event: SubmitEvent,
  container: Element,
  form: HTMLFormElement,
  successEl: HTMLElement | null,
  errorEl: HTMLElement | null,
  messageEl: HTMLElement | null
): Promise<void> {
  event.preventDefault();

  const siteId = getSiteId(container);
  const usuarioId = getUsuarioId();

  if (!siteId) {
    showCheckoutError(errorEl, "Sitio no identificado");
    return;
  }

  if (!usuarioId) {
    showCheckoutError(errorEl, "Debes iniciar sesión para finalizar la compra");
    showToast("Debes iniciar sesión para finalizar la compra");
    return;
  }

  const submitBtn = form.querySelector<HTMLElement>('button[type="submit"]');

  try {
    setSubmitLoading(submitBtn, true);
    toggleElement(errorEl, false);

    const result = await postCheckout(siteId, buildCheckoutData(form, usuarioId));

    form.style.display = "none";
    toggleElement(successEl, true);
    if (messageEl) messageEl.textContent = result.mensaje || "Pedido confirmado exitosamente";
  } catch (error) {
    console.error("[Tienda Widget]", error);
    showCheckoutError(errorEl, error instanceof Error ? error.message : "Error al procesar el pedido");
    setSubmitLoading(submitBtn, false);
  }
}

function initCheckout(container: Element): void {
  const form = container.querySelector<HTMLFormElement>("[data-tienda-checkout-form]");
  const successEl = container.querySelector<HTMLElement>("[data-tienda-checkout-success]");
  const errorEl = container.querySelector<HTMLElement>("[data-tienda-checkout-error]");
  const messageEl = container.querySelector<HTMLElement>("[data-tienda-checkout-message]");

  if (!form) return;

  fillCheckoutProfile(form);
  form.addEventListener("submit", (event) => {
    handleCheckoutSubmit(event, container, form, successEl, errorEl, messageEl);
  });
}

export function initTiendaBlocks(): void {
  const productosGrid = document.querySelectorAll('[data-tienda="products-grid"]');
  productosGrid.forEach((block) => {
    initProductosGrid(block, 6);
  });

  const productosLista = document.querySelectorAll('[data-tienda="products-list"]');
  productosLista.forEach((block) => {
    initProductoLista(block);
  });

  const featuredBlocks = document.querySelectorAll('[data-tienda="featured-product"]');
  featuredBlocks.forEach((block) => {
    initProductoDestacado(block);
  });

  const detailBlocks = document.querySelectorAll('[data-tienda="product-detail"]');
  detailBlocks.forEach((block) => {
    initProductoDetalle(block);
  });

  const categoriasBlocks = document.querySelectorAll('[data-tienda="categories"]');
  categoriasBlocks.forEach((block) => {
    initCategorias(block);
  });

  const cartBlocks = document.querySelectorAll('[data-tienda="cart"]');
  cartBlocks.forEach((block) => {
    initCarrito(block);
  });

  const checkoutBlocks = document.querySelectorAll('[data-tienda="checkout"]');
  checkoutBlocks.forEach((block) => {
    initCheckout(block);
  });
}
