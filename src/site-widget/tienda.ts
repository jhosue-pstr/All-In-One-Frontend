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

type CarritoData = {
  id: number;
  site_id: number;
  items: CarritoItem[];
  total: number;
};

const API_BASE = "/api";
let cartItemTemplate: string | null = null;

function getSiteId(element: Element): number | null {
  const value = element.getAttribute("data-sitio-id");

  if (!value || value === "{{SITIO_ID}}") {
    const bodySiteId = document.body.getAttribute("data-sitio-id");
    if (!bodySiteId) return null;

    const parsedBodyId = Number(bodySiteId);
    return Number.isNaN(parsedBodyId) ? null : parsedBodyId;
  }

  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

function getLimit(element: Element, fallback: number): number {
  const value = element.getAttribute("data-limit");
  if (!value) return fallback;

  const parsed = Number(value);
  return Number.isNaN(parsed) ? fallback : parsed;
}

function getUsuarioId(): number | null {
  try {
    const token = localStorage.getItem("site_token");
    if (!token) return null;

    const payload = JSON.parse(atob(token.split(".")[1]));

    if (payload.exp) {
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp < now) {
        localStorage.removeItem("site_token");
        return null;
      }
    }

    return payload.usuario_id || Number(payload.sub) || null;
  } catch {
    return null;
  }
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
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function normalizeImage(url: string | null | undefined, fallback?: string): string {
  if (!url) return fallback || "https://placehold.co/700x420/e2e8f0/334155?text=Producto";
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
  if (empty) empty.style.display = "block";
  if (checkoutLink) checkoutLink.style.display = "none";
  if (pagarBtn) pagarBtn.style.display = "none";
  if (totalEl) {
    totalEl.textContent = "";
    const section = totalEl.parentElement?.parentElement;
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
  if (opts?.categoria_id) params.set("categoria_id", String(opts.categoria_id));
  if (opts?.featured) params.set("featured", "true");
  if (opts?.limit) params.set("por_pagina", String(opts.limit));

  const qs = params.toString();
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
  if (!usuarioId) return { id: 0, site_id: siteId, items: [], total: 0 };
  return fetchData<CarritoData>(
    `${API_BASE}/v1/sitios/${siteId}/tienda/carrito?usuario_id=${usuarioId}`
  );
}

async function addToCart(siteId: number, productoId: number, cantidad: number, usuarioId: number | null): Promise<void> {
  const body: Record<string, unknown> = { producto_id: productoId, cantidad };
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
    throw new Error(err.detail || "Error al procesar el pedido");
  }

  return response.json();
}

function fillProductItem(item: HTMLElement, product: Product): void {
  const image = item.querySelector<HTMLImageElement>("[data-tienda-product-image]");
  const name = item.querySelector<HTMLElement>("[data-tienda-product-name]");
  const price = item.querySelector<HTMLElement>("[data-tienda-product-price]");
  const compare = item.querySelector<HTMLElement>("[data-tienda-product-compare]");
  const desc = item.querySelector<HTMLElement>("[data-tienda-product-desc]");
  const stock = item.querySelector<HTMLElement>("[data-tienda-product-stock]");
  const badge = item.querySelector<HTMLElement>("[data-tienda-badge-discount]");
  const categoryName = item.querySelector<HTMLElement>("[data-tienda-category-name]");

  if (image) {
    image.src = getFirstImage(product.imagenes);
    image.alt = product.nombre;
  }

  if (name) name.textContent = product.nombre;
  if (price) price.textContent = formatPrice(product.precio);

  if (compare && product.precio_comparacion && product.precio_comparacion > product.precio) {
    compare.textContent = formatPrice(product.precio_comparacion);
    compare.style.display = "";
  } else if (compare) {
    compare.style.display = "none";
  }

  if (badge && product.precio_comparacion && product.precio_comparacion > product.precio) {
    const discount = Math.round((1 - product.precio / product.precio_comparacion) * 100);
    badge.textContent = `-${discount}%`;
    badge.style.display = "";
  } else if (badge) {
    badge.style.display = "none";
  }

  if (desc) desc.textContent = product.descripcion || "";
  if (stock) {
    if (product.stock > 0) {
      stock.textContent = "Disponible";
      stock.style.color = "#16a34a";
    } else {
      stock.textContent = "Agotado";
      stock.style.color = "#ef4444";
    }
  }

  if (categoryName && product.categoria) {
    categoryName.textContent = product.categoria.nombre;
  }

  item.setAttribute("data-tienda-product-id", String(product.id));
}

function renderProductCollection(container: Element, productos: Product[]): void {
  const list = container.querySelector<HTMLElement>("[data-tienda-list]");
  const template = container.querySelector<HTMLElement>("[data-tienda-item]");
  const empty = container.querySelector<HTMLElement>("[data-tienda-empty]");

  if (!list || !template) return;

  if (!productos.length) {
    showEmpty(container);
    return;
  }

  if (empty) empty.style.display = "none";

  const siteId = getSiteId(container);
  const usuarioId = getUsuarioId();

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

        if (!siteId) return;
        if (!usuarioId) {
          showToast("Debes iniciar sesión para agregar al carrito");
          return;
        }

        try {
          addBtn.textContent = "Agregando...";
          addBtn.setAttribute("disabled", "true");
          await addToCart(siteId, product.id, 1, usuarioId);
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
  if (!siteId) {
    showEmpty(container);
    return;
  }

  try {
    const limit = getLimit(container, fallbackLimit);
    const productos = await fetchProductos(siteId, { limit });
    renderProductCollection(container, productos);
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
    const usuarioId = getUsuarioId();

    if (addBtn) {
      addBtn.addEventListener("click", async (event) => {
        event.preventDefault();

        if (!usuarioId) {
          showToast("Debes iniciar sesión para agregar al carrito");
          return;
        }

        try {
          addBtn.textContent = "Agregando...";
          addBtn.setAttribute("disabled", "true");
          await addToCart(siteId, product.id, 1, usuarioId);
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

async function initProductoDetalle(container: Element): Promise<void> {
  const siteId = getSiteId(container);
  if (!siteId) return;

  const params = new URLSearchParams(window.location.search);
  const slug = params.get("producto");
  const productoIdAttr = container.getAttribute("data-producto-id");
  let productoId: number | null = productoIdAttr ? Number(productoIdAttr) : null;

  if (!productoId && !slug) return;

  const empty = container.querySelector<HTMLElement>("[data-tienda-empty]");

  try {
    let product: Product;

    if (productoId) {
      product = await fetchProducto(siteId, productoId);
    } else if (slug) {
      const productos = await fetchProductos(siteId, { limit: 100 });
      const found = productos.find((p) => p.slug === slug);
      if (!found) {
        if (empty) empty.style.display = "block";
        return;
      }
      product = found;
      productoId = product.id;
    } else {
      if (empty) empty.style.display = "block";
      return;
    }

    fillProductItem(container as HTMLElement, product);

    if (empty) empty.style.display = "none";

    const qtyValue = container.querySelector<HTMLElement>("[data-tienda-qty-value]");
    const qtyMinus = container.querySelector<HTMLElement>("[data-tienda-qty-minus]");
    const qtyPlus = container.querySelector<HTMLElement>("[data-tienda-qty-plus]");
    const addBtn = container.querySelector<HTMLElement>("[data-tienda-add-cart]");

    let cantidad = 1;

    if (qtyMinus) {
      qtyMinus.addEventListener("click", () => {
        if (cantidad > 1) {
          cantidad--;
          if (qtyValue) qtyValue.textContent = String(cantidad);
        }
      });
    }

    if (qtyPlus) {
      qtyPlus.addEventListener("click", () => {
        if (cantidad < product.stock) {
          cantidad++;
          if (qtyValue) qtyValue.textContent = String(cantidad);
        }
      });
    }

    const usuarioId = getUsuarioId();

    const pid = productoId;
    if (addBtn && pid) {
      addBtn.addEventListener("click", async (event) => {
        event.preventDefault();

        if (!usuarioId) {
          showToast("Debes iniciar sesión para agregar al carrito");
          return;
        }

        try {
          addBtn.textContent = "Agregando...";
          addBtn.setAttribute("disabled", "true");
          await addToCart(siteId, pid, cantidad, usuarioId);
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
    if (empty) empty.style.display = "block";
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
    allBtn.setAttribute("data-categoria-id", "");
    if (allName) allName.textContent = "Todas";
    allBtn.addEventListener("click", () => filterByCategory(container, null));
    list.appendChild(allBtn);

    categorias.forEach((cat) => {
      const btn = clonedTemplate.cloneNode(true) as HTMLElement;
      const name = btn.querySelector<HTMLElement>("[data-tienda-category-name]");
      btn.setAttribute("data-categoria-id", String(cat.id));
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

      if (item.style.display === "none") return;
    });
  });
}

async function initCarrito(container: Element): Promise<void> {
  const siteId = getSiteId(container);
  const usuarioId = getUsuarioId();

  if (!siteId) {
    showEmpty(container);
    return;
  }

  const list = container.querySelector<HTMLElement>("[data-tienda-list]");
  const empty = container.querySelector<HTMLElement>("[data-tienda-empty]");
  const totalEl = container.querySelector<HTMLElement>("[data-tienda-cart-total]");

  try {
    const carrito = await fetchCarrito(siteId, usuarioId);

    if (!carrito.items || !carrito.items.length) {
      showEmpty(container);
      return;
    }

    if (empty) empty.style.display = "none";

    const checkoutLink = container.querySelector<HTMLElement>("[data-tienda-checkout-link]");
    if (checkoutLink) checkoutLink.style.display = "";
    if (totalEl) {
      const section = totalEl.parentElement?.parentElement;
      if (section) section.style.display = "";
    }

    if (!list) return;
    if (!cartItemTemplate) {
      const te = list.querySelector<HTMLElement>("[data-tienda-item]");
      if (te) cartItemTemplate = te.outerHTML;
    }
    if (!cartItemTemplate) return;
    list.innerHTML = "";

    carrito.items.forEach((item) => {
      const temp = document.createElement("div");
      temp.innerHTML = cartItemTemplate!;
      const el = temp.firstElementChild as HTMLElement;
      el.style.display = "";
      el.setAttribute("data-tienda-item-id", String(item.id));

      const image = el.querySelector<HTMLImageElement>("[data-tienda-product-image]");
      const name = el.querySelector<HTMLElement>("[data-tienda-product-name]");
      const price = el.querySelector<HTMLElement>("[data-tienda-product-price]");
      const qtyValue = el.querySelector<HTMLElement>("[data-tienda-qty-value]");
      const qtyMinus = el.querySelector<HTMLElement>("[data-tienda-qty-minus]");
      const qtyPlus = el.querySelector<HTMLElement>("[data-tienda-qty-plus]");
      const subtotal = el.querySelector<HTMLElement>("[data-tienda-item-subtotal]");
      const removeBtn = el.querySelector<HTMLElement>("[data-tienda-item-remove]");

      if (image) {
        image.src = getFirstImage(item.producto.imagenes);
        image.alt = item.producto.nombre;
      }
      if (name) name.textContent = item.producto.nombre;
      if (price) price.textContent = formatPrice(item.producto.precio);
      if (qtyValue) qtyValue.textContent = String(item.cantidad);
      if (subtotal) subtotal.textContent = formatPrice(item.producto.precio * item.cantidad);

      if (qtyMinus) {
        qtyMinus.addEventListener("click", async () => {
          const newQty = Math.max(1, item.cantidad - 1);
          if (newQty === item.cantidad) return;
          try {
            await updateCartItem(siteId, item.id, newQty);
            item.cantidad = newQty;
            if (qtyValue) qtyValue.textContent = String(newQty);
            if (subtotal) subtotal.textContent = formatPrice(item.producto.precio * newQty);
            refreshCartTotal(container, siteId, usuarioId);
          } catch (error) {
            console.error("[Tienda Widget]", error);
          }
        });
      }

      if (qtyPlus) {
        qtyPlus.addEventListener("click", async () => {
          const newQty = item.cantidad + 1;
          try {
            await updateCartItem(siteId, item.id, newQty);
            item.cantidad = newQty;
            if (qtyValue) qtyValue.textContent = String(newQty);
            if (subtotal) subtotal.textContent = formatPrice(item.producto.precio * newQty);
            refreshCartTotal(container, siteId, usuarioId);
          } catch (error) {
            console.error("[Tienda Widget]", error);
          }
        });
      }

      if (removeBtn) {
        removeBtn.addEventListener("click", async () => {
          try {
            await removeCartItem(siteId, item.id);
            el.remove();
            const remaining = list.querySelectorAll("[data-tienda-item]");
            if (remaining.length === 0) {
              showEmpty(container);
            } else {
              refreshCartTotal(container, siteId, usuarioId);
            }
          } catch (error) {
            console.error("[Tienda Widget]", error);
          }
        });
      }

      list.appendChild(el);
    });

    if (totalEl) {
      const total = carrito.items.reduce((sum, i) => sum + i.producto.precio * i.cantidad, 0);
      totalEl.textContent = formatPrice(total);
    }

    // "Pagar" button → scroll to checkout or prompt login
    const existingBtn = container.querySelector<HTMLElement>("[data-tienda-pagar]");
    if (!existingBtn) {
      const pagarBtn = document.createElement("button");
      pagarBtn.setAttribute("data-tienda-pagar", "");
      pagarBtn.textContent = "Pagar ahora";
      Object.assign(pagarBtn.style, {
        width: "100%",
        padding: "14px",
        marginTop: "16px",
        background: usuarioId ? "#16a34a" : "#f59e0b",
        color: "white",
        border: "none",
        borderRadius: "10px",
        fontSize: "16px",
        fontWeight: "700",
        cursor: "pointer",
      });
      pagarBtn.addEventListener("click", () => {
        if (!usuarioId) {
          showToast("Debes iniciar sesión para pagar");
          return;
        }
        const checkout = document.querySelector<HTMLElement>('[data-tienda="checkout"]');
        if (checkout) checkout.scrollIntoView({ behavior: "smooth" });
        else showToast("Sección de checkout no disponible");
      });
      const totalSection = container.querySelector('[data-tienda-cart-total]')?.closest("div") || container;
      totalSection.appendChild(pagarBtn);
    }
  } catch (error) {
    console.error("[Tienda Widget]", error);
    showEmpty(container);
  }
}

function refreshCartTotal(container: Element, siteId: number, usuarioId: number | null): void {
  fetchCarrito(siteId, usuarioId)
    .then((carrito) => {
      const totalEl = container.querySelector<HTMLElement>("[data-tienda-cart-total]");
      if (totalEl) {
        const total = carrito.items.reduce((sum, i) => sum + i.producto.precio * i.cantidad, 0);
        totalEl.textContent = formatPrice(total);
      }
    })
    .catch(() => {});
}

export function refreshCarritoUI(): void {
  const cartBlocks = document.querySelectorAll<HTMLElement>('[data-tienda="cart"]');
  cartBlocks.forEach((el) => {
    const list = el.querySelector("[data-tienda-list]");
    if (list) list.innerHTML = "";
    initCarrito(el);
  });
}

function initCheckout(container: Element): void {
  const form = container.querySelector<HTMLFormElement>("[data-tienda-checkout-form]");
  const successEl = container.querySelector<HTMLElement>("[data-tienda-checkout-success]");
  const errorEl = container.querySelector<HTMLElement>("[data-tienda-checkout-error]");
  const messageEl = container.querySelector<HTMLElement>("[data-tienda-checkout-message]");

  if (!form) return;

  if (isAuthenticated()) {
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

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const siteId = getSiteId(container);
    const usuarioId = getUsuarioId();

    if (!siteId) {
      if (errorEl) {
        errorEl.textContent = "Sitio no identificado";
        errorEl.style.display = "block";
      }
      return;
    }

    if (!usuarioId) {
      if (errorEl) {
        errorEl.textContent = "Debes iniciar sesión para finalizar la compra";
        errorEl.style.display = "block";
      }
      showToast("Debes iniciar sesión para finalizar la compra");
      return;
    }

    const getField = (name: string): string => {
      const el = form.querySelector<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
        `[data-tienda-field-${name}]`
      );
      return el?.value?.trim() || "";
    };

    const data: Record<string, unknown> = {
      nombre_cliente: getField("nombre"),
      email_cliente: getField("email"),
      telefono_cliente: getField("telefono"),
      direccion_envio: getField("direccion"),
      ciudad_envio: getField("ciudad"),
      pais_envio: getField("pais"),
      codigo_postal: getField("codigo-postal"),
      metodo_pago: getField("metodo-pago"),
      notas: getField("notas"),
      usuario_id: usuarioId,
    };

    const submitBtn = form.querySelector<HTMLElement>('button[type="submit"]');

    try {
      if (submitBtn) {
        submitBtn.textContent = "Procesando...";
        (submitBtn as HTMLButtonElement).disabled = true;
      }

      if (errorEl) errorEl.style.display = "none";

      const result = await postCheckout(siteId, data);

      form.style.display = "none";
      if (successEl) successEl.style.display = "block";
      if (messageEl) messageEl.textContent = result.mensaje || "Pedido confirmado exitosamente";
    } catch (error) {
      console.error("[Tienda Widget]", error);
      if (errorEl) {
        errorEl.textContent = error instanceof Error ? error.message : "Error al procesar el pedido";
        errorEl.style.display = "block";
      }
      if (submitBtn) {
        submitBtn.textContent = "Confirmar pedido";
        (submitBtn as HTMLButtonElement).disabled = false;
      }
    }
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
