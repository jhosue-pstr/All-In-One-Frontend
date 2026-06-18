import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { initTiendaBlocks } from "./tienda";

const { mockIsAuthenticated } = vi.hoisted(() => ({
  mockIsAuthenticated: vi.fn(() => false),
}));

vi.mock("./api", () => ({
  isAuthenticated: mockIsAuthenticated,
  setToken: vi.fn(),
}));

vi.mock('./perfil', () => ({
  fetchProfile: vi.fn().mockResolvedValue({
    id: 0, nombre: '', apellido: '', correo: '',
    telefono: null, direccion_envio: null, ciudad: null,
    pais: null, codigo_postal: null,
  }),
}))

const product = {
  id: 1,
  nombre: "Laptop Gamer",
  slug: "laptop-gamer",
  precio: 1000,
  precio_comparacion: 1200,
  stock: 5,
  imagenes: ["/laptop.png"],
  es_activo: true,
  es_featured: true,
  descripcion: "Laptop potente",
  categoria: {
    id: 1,
    nombre: "Tecnología",
    slug: "tecnologia",
  },
  created_at: "2026-01-01",
};

function loginUser(usuarioId = 7) {
  mockIsAuthenticated.mockReturnValue(true);

  const payload = btoa(
    JSON.stringify({
      sub: String(usuarioId),
      usuario_id: usuarioId,
      exp: Math.floor(Date.now() / 1000) + 3600,
    })
  );

  localStorage.setItem("site_token", `header.${payload}.signature`);
}
const CATEGORY_HTML = `
<section data-tienda="categories" data-sitio-id="1">

  <div data-tienda-empty style="display:none">
    VACIO
  </div>

  <div data-tienda-list>

    <button
      data-tienda-item
      style="display:none"
    >
      <span data-tienda-category-name></span>
    </button>

  </div>

</section>
`;
const CART_HTML = `
  <section data-tienda="cart" data-sitio-id="1">
    <div data-tienda-empty style="display:none">Carrito vacío</div>

    <div data-tienda-list>
      <div data-tienda-item style="display:none">
        <img data-tienda-product-image />
        <span data-tienda-product-name></span>
        <span data-tienda-product-price></span>
        <button data-tienda-qty-minus>-</button>
        <span data-tienda-qty-value></span>
        <button data-tienda-qty-plus>+</button>
        <span data-tienda-item-subtotal></span>
        <button data-tienda-item-remove>Eliminar</button>
      </div>
    </div>

    <a data-tienda-checkout-link style="display:none">Checkout</a>

    <div>
      <div>
        <span data-tienda-cart-total></span>
      </div>
    </div>
  </section>
`;
async function screenText(text: string): Promise<boolean> {
  await vi.waitFor(() => {
    expect(document.body.textContent).toContain(text);
  });

  return true;
}

describe("site-widget tienda", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    vi.doUnmock("./perfil");

    mockIsAuthenticated.mockReturnValue(false);

    document.body.innerHTML = "";
    localStorage.clear();

    vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
      cb(0);
      return 1;
    });

    vi.useFakeTimers();

    globalThis.fetch = vi.fn(async (url: string) => {
      if (url.includes("/productos/1")) {
        return {
          ok: true,
          json: async () => ({
            success: true,
            data: product,
          }),
        } as Response;
      }

      if (url.includes("/productos")) {
        return {
          ok: true,
          json: async () => ({
            success: true,
            data: [product],
          }),
        } as Response;
      }

      if (url.includes("/categorias")) {
        return {
          ok: true,
          json: async () => ({
            success: true,
            data: [
              {
                id: 1,
                nombre: "Tecnología",
                slug: "tecnologia",
                descripcion: "Cat",
                imagen: null,
                activa: true,
              },
            ],
          }),
        } as Response;
      }

      if (url.includes("/carrito")) {
        return {
          ok: true,
          json: async () => ({
            id: 1,
            site_id: 1,
            items: [
              {
                id: 10,
                producto_id: 1,
                cantidad: 2,
                producto: product,
              },
            ],
            total: 2000,
          }),
        } as Response;
      }

      if (url.includes("/checkout")) {
        return {
          ok: true,
          json: async () => ({
            pedido: {
              id: 99,
            },
            mensaje: "Pedido confirmado",
          }),
        } as Response;
      }

      return {
        ok: true,
        json: async () => ({}),
      } as Response;
    }) as any;
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.doUnmock("./perfil");
  });

  it("renders products grid", async () => {
    const { initTiendaBlocks } = await import("./tienda");

    document.body.innerHTML = `
      <section data-tienda="products-grid" data-sitio-id="1" data-limit="4">
        <div data-tienda-empty style="display:none">Sin productos</div>
        <div data-tienda-list>
          <article data-tienda-item style="display:none">
            <img data-tienda-product-image />
            <h3 data-tienda-product-name></h3>
            <span data-tienda-product-price></span>
            <span data-tienda-product-compare></span>
            <p data-tienda-product-desc></p>
            <span data-tienda-product-stock></span>
            <span data-tienda-badge-discount></span>
            <span data-tienda-category-name></span>
            <button data-tienda-add-cart>Agregar al carrito</button>
          </article>
        </div>
      </section>
    `;

    initTiendaBlocks();

    await vi.runAllTimersAsync();

    expect(await screenText("Laptop Gamer")).toBeTruthy();
    expect(document.body.textContent).toContain("S/ 1000.00");
    expect(document.body.textContent).toContain("S/ 1200.00");
    expect(document.body.textContent).toContain("-17%");
    expect(document.body.textContent).toContain("Disponible");
    expect(document.body.textContent).toContain("Tecnología");
  });

  it("shows empty when site id is missing", async () => {
    const { initTiendaBlocks } = await import("./tienda");

    document.body.innerHTML = `
      <section data-tienda="products-grid">
        <div data-tienda-empty style="display:none">Sin productos</div>
        <div data-tienda-list>
          <article data-tienda-item>Item</article>
        </div>
      </section>
    `;

    initTiendaBlocks();

    expect(
      document.querySelector<HTMLElement>("[data-tienda-empty]")!.style.display
    ).toBe("block");
  });

  it("renders featured product and asks login when adding without token", async () => {
    const { initTiendaBlocks } = await import("./tienda");

    document.body.innerHTML = `
      <section data-tienda="featured-product" data-sitio-id="1">
        <div data-tienda-empty style="display:none">Vacío</div>
        <article data-tienda-item>
          <img data-tienda-product-image />
          <h3 data-tienda-product-name></h3>
          <span data-tienda-product-price></span>
          <button data-tienda-add-cart>Agregar al carrito</button>
        </article>
      </section>
    `;

    initTiendaBlocks();

    await vi.runAllTimersAsync();

    document.querySelector<HTMLButtonElement>("[data-tienda-add-cart]")!.click();

    expect(document.body.textContent).toContain(
      "Debes iniciar sesión para agregar al carrito"
    );
  });

  it("adds product to cart when authenticated", async () => {
    const { initTiendaBlocks } = await import("./tienda");

    loginUser();

    document.body.innerHTML = `
      <section data-tienda="products-grid" data-sitio-id="1">
        <div data-tienda-list>
          <article data-tienda-item style="display:none">
            <h3 data-tienda-product-name></h3>
            <span data-tienda-product-price></span>
            <button data-tienda-add-cart>Agregar al carrito</button>
          </article>
        </div>
      </section>

      <section data-tienda="cart" data-sitio-id="1">
        <div data-tienda-empty style="display:none">Carrito vacío</div>
        <div data-tienda-list>
          <div data-tienda-item style="display:none">
            <span data-tienda-product-name></span>
            <span data-tienda-product-price></span>
            <span data-tienda-qty-value></span>
            <span data-tienda-item-subtotal></span>
          </div>
        </div>
        <div>
          <div>
            <span data-tienda-cart-total></span>
          </div>
        </div>
      </section>
    `;

    initTiendaBlocks();

    await vi.runAllTimersAsync();

    document.querySelector<HTMLButtonElement>("[data-tienda-add-cart]")!.click();

    await vi.runAllTimersAsync();

    expect(globalThis.fetch).toHaveBeenCalledWith(
      "/api/v1/sitios/1/tienda/carrito/items",
      expect.objectContaining({
        method: "POST",
      })
    );
  });

  it("renders categories and filters by category click", async () => {
    const { initTiendaBlocks } = await import("./tienda");

    document.body.innerHTML = `
      <section data-tienda="categories" data-sitio-id="1">
        <div data-tienda-empty style="display:none">Sin categorías</div>
        <div data-tienda-list>
          <button data-tienda-item style="display:none">
            <span data-tienda-category-name></span>
          </button>
        </div>
      </section>

      <section data-tienda="products-grid" data-sitio-id="1">
        <div data-tienda-list>
          <article data-tienda-item>Producto</article>
        </div>
      </section>
    `;

    initTiendaBlocks();

    await vi.runAllTimersAsync();

    expect(document.body.textContent).toContain("Todas");
    expect(document.body.textContent).toContain("Tecnología");

    const buttons = document.querySelectorAll<HTMLButtonElement>("[data-tienda-item]");
    buttons[1].click();
    buttons[0].click();
  });

  it("renders cart and updates quantities/removes item", async () => {
    const { initTiendaBlocks } = await import("./tienda");

    loginUser();

    document.body.innerHTML = `
      <section data-tienda="cart" data-sitio-id="1">
        <div data-tienda-empty style="display:none">Carrito vacío</div>
        <div data-tienda-list>
          <div data-tienda-item style="display:none">
            <img data-tienda-product-image />
            <span data-tienda-product-name></span>
            <span data-tienda-product-price></span>
            <button data-tienda-qty-minus>-</button>
            <span data-tienda-qty-value></span>
            <button data-tienda-qty-plus>+</button>
            <span data-tienda-item-subtotal></span>
            <button data-tienda-item-remove>Eliminar</button>
          </div>
        </div>
        <a data-tienda-checkout-link style="display:none">Checkout</a>
        <div>
          <div>
            <span data-tienda-cart-total></span>
          </div>
        </div>
      </section>
    `;

    initTiendaBlocks();

    await vi.runAllTimersAsync();

    expect(document.body.textContent).toContain("Laptop Gamer");
    expect(document.body.textContent).toContain("S/ 2000.00");

    document.querySelector<HTMLButtonElement>("[data-tienda-qty-plus]")!.click();

    await vi.runAllTimersAsync();

    expect(globalThis.fetch).toHaveBeenCalledWith(
      "/api/v1/sitios/1/tienda/carrito/items/10?cantidad=3",
      expect.objectContaining({
        method: "PUT",
      })
    );

    document.querySelector<HTMLButtonElement>("[data-tienda-item-remove]")!.click();

    await vi.runAllTimersAsync();

    expect(globalThis.fetch).toHaveBeenCalledWith(
      "/api/v1/sitios/1/tienda/carrito/items/10",
      expect.objectContaining({
        method: "DELETE",
      })
    );
  });

  it("checkout requires login", async () => {
    const { initTiendaBlocks } = await import("./tienda");

    document.body.innerHTML = `
      <section data-tienda="checkout" data-sitio-id="1">
        <form data-tienda-checkout-form>
          <input data-tienda-field-nombre value="Juan" />
          <input data-tienda-field-email value="j@test.com" />
          <button type="submit">Confirmar pedido</button>
        </form>
        <div data-tienda-checkout-error style="display:none"></div>
      </section>
    `;

    initTiendaBlocks();

    document
      .querySelector<HTMLFormElement>("[data-tienda-checkout-form]")!
      .dispatchEvent(
        new Event("submit", {
          bubbles: true,
          cancelable: true,
        })
      );

    expect(document.body.textContent).toContain(
      "Debes iniciar sesión para finalizar la compra"
    );
  });

  it("checkout succeeds when authenticated", async () => {
    const { initTiendaBlocks } = await import("./tienda");

    loginUser();

    document.body.innerHTML = `
      <section data-tienda="checkout" data-sitio-id="1">
        <form data-tienda-checkout-form>
          <input data-tienda-field-nombre value="Juan" />
          <input data-tienda-field-email value="j@test.com" />
          <input data-tienda-field-telefono value="999" />
          <input data-tienda-field-direccion value="Av 123" />
          <input data-tienda-field-ciudad value="Lima" />
          <input data-tienda-field-pais value="Perú" />
          <input data-tienda-field-codigo-postal value="15001" />
          <input data-tienda-field-metodo-pago value="manual" />
          <textarea data-tienda-field-notas>Nota</textarea>
          <button type="submit">Confirmar pedido</button>
        </form>
        <div data-tienda-checkout-success style="display:none"></div>
        <div data-tienda-checkout-error style="display:none"></div>
        <div data-tienda-checkout-message></div>
      </section>
    `;

    initTiendaBlocks();

    document
      .querySelector<HTMLFormElement>("[data-tienda-checkout-form]")!
      .dispatchEvent(
        new Event("submit", {
          bubbles: true,
          cancelable: true,
        })
      );

    await vi.runAllTimersAsync();

    expect(document.body.textContent).toContain("Pedido confirmado");
  });

  it("renders product detail by product id and handles quantity/add cart", async () => {
    const { initTiendaBlocks } = await import("./tienda");

    loginUser();

    document.body.innerHTML = `
      <section data-tienda="product-detail" data-sitio-id="1" data-producto-id="1">
        <div data-tienda-empty style="display:none">No encontrado</div>
        <img data-tienda-product-image />
        <h3 data-tienda-product-name></h3>
        <span data-tienda-product-price></span>
        <span data-tienda-product-stock></span>
        <button data-tienda-qty-minus>-</button>
        <span data-tienda-qty-value>1</span>
        <button data-tienda-qty-plus>+</button>
        <button data-tienda-add-cart>Agregar al carrito</button>
      </section>
    `;

    initTiendaBlocks();

    await vi.runAllTimersAsync();

    expect(document.body.textContent).toContain("Laptop Gamer");

    document.querySelector<HTMLButtonElement>("[data-tienda-qty-plus]")!.click();

    expect(document.querySelector("[data-tienda-qty-value]")!.textContent).toBe("2");

    document.querySelector<HTMLButtonElement>("[data-tienda-qty-minus]")!.click();

    expect(document.querySelector("[data-tienda-qty-value]")!.textContent).toBe("1");

    document.querySelector<HTMLButtonElement>("[data-tienda-add-cart]")!.click();

    await vi.runAllTimersAsync();

    expect(globalThis.fetch).toHaveBeenCalledWith(
      "/api/v1/sitios/1/tienda/carrito/items",
      expect.objectContaining({
        method: "POST",
      })
    );
  });

  it("renders product detail by slug and shows empty when slug is not found", async () => {
    const { initTiendaBlocks } = await import("./tienda");

    window.history.pushState({}, "", "/?producto=no-existe");

    document.body.innerHTML = `
      <section data-tienda="product-detail" data-sitio-id="1">
        <div data-tienda-empty style="display:none">No encontrado</div>
        <h3 data-tienda-product-name></h3>
      </section>
    `;

    initTiendaBlocks();

    await vi.runAllTimersAsync();

    expect(
      document.querySelector<HTMLElement>("[data-tienda-empty]")!.style.display
    ).toBe("block");
  });

  it("shows empty when products endpoint returns empty", async () => {
    globalThis.fetch = vi.fn(async () => ({
      ok: true,
      json: async () => ({
        success: true,
        data: [],
      }),
    })) as any;

    const { initTiendaBlocks } = await import("./tienda");

    document.body.innerHTML = `
      <section data-tienda="products-list" data-sitio-id="1">
        <div data-tienda-empty style="display:none">Sin productos</div>
        <div data-tienda-list>
          <article data-tienda-item style="display:none">
            <h3 data-tienda-product-name></h3>
          </article>
        </div>
      </section>
    `;

    initTiendaBlocks();

    await vi.runAllTimersAsync();

    expect(
      document.querySelector<HTMLElement>("[data-tienda-empty]")!.style.display
    ).toBe("block");
  });

  it("shows empty when fetch fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    globalThis.fetch = vi.fn(async () => ({
      ok: false,
      status: 500,
      json: async () => ({}),
    })) as any;

    const { initTiendaBlocks } = await import("./tienda");

    document.body.innerHTML = `
      <section data-tienda="products-grid" data-sitio-id="1">
        <div data-tienda-empty style="display:none">Sin productos</div>
        <div data-tienda-list>
          <article data-tienda-item style="display:none">
            <h3 data-tienda-product-name></h3>
          </article>
        </div>
      </section>
    `;

    initTiendaBlocks();

    await vi.runAllTimersAsync();

    expect(
      document.querySelector<HTMLElement>("[data-tienda-empty]")!.style.display
    ).toBe("block");
  });

  it("checkout shows site not identified when site id is missing", async () => {
    const { initTiendaBlocks } = await import("./tienda");

    document.body.innerHTML = `
      <section data-tienda="checkout">
        <form data-tienda-checkout-form>
          <button type="submit">Confirmar pedido</button>
        </form>
        <div data-tienda-checkout-error style="display:none"></div>
      </section>
    `;

    initTiendaBlocks();

    document
      .querySelector<HTMLFormElement>("[data-tienda-checkout-form]")!
      .dispatchEvent(
        new Event("submit", {
          bubbles: true,
          cancelable: true,
        })
      );

    expect(document.body.textContent).toContain("Sitio no identificado");
  });

  it("checkout handles backend error", async () => {
    loginUser();

    globalThis.fetch = vi.fn(async (url: string) => {
      if (url.includes("/checkout")) {
        return {
          ok: false,
          json: async () => ({
            detail: "Stock insuficiente",
          }),
        } as Response;
      }

      return {
        ok: true,
        json: async () => ({
          success: true,
          data: [product],
        }),
      } as Response;
    }) as any;

    const { initTiendaBlocks } = await import("./tienda");

    document.body.innerHTML = `
      <section data-tienda="checkout" data-sitio-id="1">
        <form data-tienda-checkout-form>
          <input data-tienda-field-nombre value="Juan" />
          <input data-tienda-field-email value="j@test.com" />
          <button type="submit">Confirmar pedido</button>
        </form>
        <div data-tienda-checkout-error style="display:none"></div>
      </section>
    `;

    initTiendaBlocks();

    document
      .querySelector<HTMLFormElement>("[data-tienda-checkout-form]")!
      .dispatchEvent(
        new Event("submit", {
          bubbles: true,
          cancelable: true,
        })
      );

    await vi.runAllTimersAsync();

    expect(document.body.textContent).toContain("Stock insuficiente");
  });

  it("cart pay button asks login when user is not authenticated", async () => {
  const { initTiendaBlocks } = await import("./tienda");

  loginUser();

  document.body.innerHTML = `
    <section data-tienda="cart" data-sitio-id="1">
      <div data-tienda-empty style="display:none">Carrito vacío</div>
      <div data-tienda-list>
        <div data-tienda-item style="display:none">
          <span data-tienda-product-name></span>
          <span data-tienda-product-price></span>
          <span data-tienda-qty-value></span>
          <span data-tienda-item-subtotal></span>
        </div>
      </div>
      <div>
        <span data-tienda-cart-total></span>
      </div>
    </section>
  `;

  initTiendaBlocks();

  await vi.runAllTimersAsync();

  mockIsAuthenticated.mockReturnValue(false);
  localStorage.removeItem("site_token");

  const pagarBtn =
    document.querySelector<HTMLButtonElement>("[data-tienda-pagar]")!;

  expect(pagarBtn).toBeTruthy();

  pagarBtn.click();

  expect(document.body.textContent).toContain(
    "Debes iniciar sesión para pagar"
    );
  });

  it("cart pay button scrolls to checkout when authenticated", async () => {
    const { initTiendaBlocks } = await import("./tienda");

    loginUser();

    const scrollIntoView = vi.fn();

    document.body.innerHTML = `
      <section data-tienda="cart" data-sitio-id="1">
        <div data-tienda-empty style="display:none">Carrito vacío</div>
        <div data-tienda-list>
          <div data-tienda-item style="display:none">
            <span data-tienda-product-name></span>
            <span data-tienda-product-price></span>
            <span data-tienda-qty-value></span>
            <span data-tienda-item-subtotal></span>
          </div>
        </div>
        <div>
          <span data-tienda-cart-total></span>
        </div>
      </section>

      <section data-tienda="checkout"></section>
    `;

    document.querySelector<HTMLElement>('[data-tienda="checkout"]')!.scrollIntoView =
      scrollIntoView;

    initTiendaBlocks();

    await vi.runAllTimersAsync();

    const pagarBtn = document.querySelector<HTMLButtonElement>("[data-tienda-pagar]")!;

    expect(pagarBtn).toBeTruthy();

    pagarBtn.click();

    expect(scrollIntoView).toHaveBeenCalledWith({
      behavior: "smooth",
    });
  });

  it("cart pay button shows toast when checkout section is missing", async () => {
    const { initTiendaBlocks } = await import("./tienda");

    loginUser();

    document.body.innerHTML = `
      <section data-tienda="cart" data-sitio-id="1">
        <div data-tienda-empty style="display:none">Carrito vacío</div>
        <div data-tienda-list>
          <div data-tienda-item style="display:none">
            <span data-tienda-product-name></span>
            <span data-tienda-product-price></span>
            <span data-tienda-qty-value></span>
            <span data-tienda-item-subtotal></span>
          </div>
        </div>
        <div>
          <span data-tienda-cart-total></span>
        </div>
      </section>
    `;

    initTiendaBlocks();

    await vi.runAllTimersAsync();

    const pagarBtn = document.querySelector<HTMLButtonElement>("[data-tienda-pagar]")!;

    expect(pagarBtn).toBeTruthy();

    pagarBtn.click();

    expect(document.body.textContent).toContain("Sección de checkout no disponible");
  });

  it("cart shows empty when carrito fetch throws", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    globalThis.fetch = vi.fn(async (url: string) => {
      if (url.includes("/carrito")) {
        return {
          ok: false,
          status: 500,
          json: async () => ({}),
        } as Response;
      }

      return {
        ok: true,
        json: async () => ({
          success: true,
          data: [product],
        }),
      } as Response;
    }) as any;

    const { initTiendaBlocks } = await import("./tienda");

    loginUser();

    document.body.innerHTML = `
      <section data-tienda="cart" data-sitio-id="1">
        <div data-tienda-empty style="display:none">Carrito vacío</div>
        <div data-tienda-list>
          <div data-tienda-item style="display:none">
            <span data-tienda-product-name></span>
          </div>
        </div>
      </section>
    `;

    initTiendaBlocks();

    await vi.runAllTimersAsync();

    expect(
      document.querySelector<HTMLElement>("[data-tienda-empty]")!.style.display
    ).toBe("block");
  });

  it("checkout autofills profile fields when authenticated", async () => {
    vi.doMock("./perfil", () => ({
      fetchProfile: vi.fn(async () => ({
        nombre: "Juan",
        apellido: "Perez",
        correo: "juan@test.com",
        telefono: "999999999",
        direccion_envio: "Av Siempre Viva",
        ciudad: "Lima",
        pais: "Perú",
        codigo_postal: "15001",
      })),
    }));

    loginUser();

    const { initTiendaBlocks } = await import("./tienda");

    document.body.innerHTML = `
      <section data-tienda="checkout" data-sitio-id="1">
        <form data-tienda-checkout-form>
          <input data-tienda-field-nombre />
          <input data-tienda-field-email />
          <input data-tienda-field-telefono />
          <input data-tienda-field-direccion />
          <input data-tienda-field-ciudad />
          <input data-tienda-field-pais />
          <input data-tienda-field-codigo-postal />
        </form>
      </section>
    `;

    initTiendaBlocks();

    await vi.runAllTimersAsync();

    await vi.waitFor(() => {
      expect(
        document.querySelector<HTMLInputElement>("[data-tienda-field-nombre]")!.value
      ).toBe("Juan Perez");
    });

    expect(
      document.querySelector<HTMLInputElement>("[data-tienda-field-email]")!.value
    ).toBe("juan@test.com");

    expect(
      document.querySelector<HTMLInputElement>("[data-tienda-field-telefono]")!.value
    ).toBe("999999999");

    expect(
      document.querySelector<HTMLInputElement>("[data-tienda-field-direccion]")!.value
    ).toBe("Av Siempre Viva");

    expect(
      document.querySelector<HTMLInputElement>("[data-tienda-field-ciudad]")!.value
    ).toBe("Lima");

    expect(
      document.querySelector<HTMLInputElement>("[data-tienda-field-pais]")!.value
    ).toBe("Perú");

    expect(
      document.querySelector<HTMLInputElement>("[data-tienda-field-codigo-postal]")!.value
    ).toBe("15001");
  });


  it('cart without siteId shows empty immediately', async () => {
  document.body.innerHTML = `
    <div data-tienda="cart">
      <div data-tienda-empty>VACIO</div>
    </div>
  `

  initTiendaBlocks()
  await vi.runAllTimersAsync()

  expect(document.body.textContent).toContain('VACIO')
})

it("qty minus handles updateCartItem error", async () => {
  const { initTiendaBlocks } = await import("./tienda");

  loginUser();

  const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

  globalThis.fetch = vi.fn((url: string, options?: RequestInit) => {
    if (options?.method === "PUT") {
      return Promise.reject(new Error("update fail"));
    }

    if (url.includes("/carrito")) {
      return Promise.resolve({
        ok: true,
        json: async () => ({
          id: 1,
          site_id: 1,
          items: [
            {
              id: 10,
              producto_id: 1,
              cantidad: 2,
              producto: product,
            },
          ],
          total: 2000,
        }),
      } as Response);
    }

    return Promise.resolve({
      ok: true,
      json: async () => ({}),
    } as Response);
  }) as any;

  document.body.innerHTML = CART_HTML;

  initTiendaBlocks();

  await vi.runAllTimersAsync();

  document.querySelector<HTMLButtonElement>("[data-tienda-qty-minus]")!.click();

  await vi.runAllTimersAsync();

  expect(consoleSpy).toHaveBeenCalled();
});

it("qty plus handles updateCartItem error", async () => {
  const { initTiendaBlocks } = await import("./tienda");

  loginUser();

  const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

  globalThis.fetch = vi.fn((url: string, options?: RequestInit) => {
    if (options?.method === "PUT") {
      return Promise.reject(new Error("update fail"));
    }

    if (url.includes("/carrito")) {
      return Promise.resolve({
        ok: true,
        json: async () => ({
          id: 1,
          site_id: 1,
          items: [
            {
              id: 10,
              producto_id: 1,
              cantidad: 1,
              producto: product,
            },
          ],
          total: 1000,
        }),
      } as Response);
    }

    return Promise.resolve({
      ok: true,
      json: async () => ({}),
    } as Response);
  }) as any;

  document.body.innerHTML = CART_HTML;

  initTiendaBlocks();

  await vi.runAllTimersAsync();

  document.querySelector<HTMLButtonElement>("[data-tienda-qty-plus]")!.click();

  await vi.runAllTimersAsync();

  expect(consoleSpy).toHaveBeenCalled();
});

it("remove button handles removeCartItem error", async () => {
  const { initTiendaBlocks } = await import("./tienda");

  loginUser();

  const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

  globalThis.fetch = vi.fn((url: string, options?: RequestInit) => {
    if (options?.method === "DELETE") {
      return Promise.reject(new Error("delete fail"));
    }

    if (url.includes("/carrito")) {
      return Promise.resolve({
        ok: true,
        json: async () => ({
          id: 1,
          site_id: 1,
          items: [
            {
              id: 10,
              producto_id: 1,
              cantidad: 1,
              producto: product,
            },
          ],
          total: 1000,
        }),
      } as Response);
    }

    return Promise.resolve({
      ok: true,
      json: async () => ({}),
    } as Response);
  }) as any;

  document.body.innerHTML = CART_HTML;

  initTiendaBlocks();

  await vi.runAllTimersAsync();

  document.querySelector<HTMLButtonElement>("[data-tienda-item-remove]")!.click();

  await vi.runAllTimersAsync();

  expect(consoleSpy).toHaveBeenCalled();
});


it("categories handles fetch error", async () => {
  const { initTiendaBlocks } = await import("./tienda");

  vi.spyOn(console, "error").mockImplementation(() => {});

  globalThis.fetch = vi.fn(() =>
    Promise.reject(new Error("categories fail"))
  ) as any;

  document.body.innerHTML = `
    <section data-tienda="categories" data-sitio-id="1">
      <div data-tienda-empty>VACIO</div>

      <div data-tienda-list>
        <button data-tienda-category-item style="display:none">
          <span data-tienda-category-name></span>
        </button>
      </div>
    </section>
  `;

  initTiendaBlocks();

  await vi.runAllTimersAsync();

  expect(console.error).toHaveBeenCalled();
});

it("cart handles empty carrito items", async () => {
  const { initTiendaBlocks } = await import("./tienda");

  loginUser();

  globalThis.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: async () => ({
        id: 1,
        items: [],
      }),
    } as Response)
  ) as any;

  document.body.innerHTML = CART_HTML;

  initTiendaBlocks();

  await vi.runAllTimersAsync();

  expect(document.body.textContent).toContain("Carrito vacío");
});

it("qty minus updates subtotal and refreshes total", async () => {
  const { initTiendaBlocks } = await import("./tienda");

  loginUser();

  globalThis.fetch = vi.fn((url, opts) => {

    if (opts?.method === "PUT") {
      return Promise.resolve({
        ok: true,
        json: async () => ({}),
      } as Response);
    }

    return Promise.resolve({
      ok: true,
      json: async () => ({
        id: 1,
        items: [{
          id: 10,
          cantidad: 2,
          producto: product,
        }],
      }),
    } as Response);

  }) as any;

  document.body.innerHTML = CART_HTML;

  initTiendaBlocks();

  await vi.runAllTimersAsync();

  document
    .querySelector<HTMLElement>("[data-tienda-qty-minus]")!
    .click();

  await vi.runAllTimersAsync();

  expect(
    document.querySelector("[data-tienda-qty-value]")?.textContent
  ).toBe("1");
});

it("remove item refreshes total when items remain", async () => {
  const { initTiendaBlocks } = await import("./tienda");

  loginUser();

  let call = 0;

  globalThis.fetch = vi.fn((url, opts) => {

    if (opts?.method === "DELETE") {
      return Promise.resolve({
        ok: true,
        json: async () => ({}),
      } as Response);
    }

    call++;

    return Promise.resolve({
      ok: true,
      json: async () => ({
        id: 1,
        items: call === 1
          ? [
              { id: 10, cantidad: 1, producto: product },
              { id: 11, cantidad: 1, producto: product },
            ]
          : [
              { id: 11, cantidad: 1, producto: product },
            ],
      }),
    } as Response);

  }) as any;

  document.body.innerHTML = CART_HTML;

  initTiendaBlocks();

  await vi.runAllTimersAsync();

  document
    .querySelector<HTMLElement>("[data-tienda-item-remove]")!
    .click();

  await vi.runAllTimersAsync();

  expect(
    document.querySelectorAll("[data-tienda-item]").length
  ).toBeGreaterThan(0);
});

it("categories shows empty when template missing", async () => {
  const { initTiendaBlocks } = await import("./tienda");

  globalThis.fetch = vi.fn(() =>
    Promise.resolve({
      ok:true,
      json: async()=>[
        { id:1,nombre:"Blog" }
      ],
    } as Response)
  ) as any;

  document.body.innerHTML = `
    <section data-tienda="categories" data-sitio-id="1">
      <div data-tienda-empty>VACIO</div>
      <div data-tienda-list></div>
    </section>
  `;

  initTiendaBlocks();

  await vi.runAllTimersAsync();

  expect(
    document.body.textContent
  ).toContain("VACIO");
});

it("categories shows empty when list missing", async () => {
  const { initTiendaBlocks } = await import("./tienda");

  globalThis.fetch = vi.fn(() =>
    Promise.resolve({
      ok:true,
      json: async()=>[
        { id:1,nombre:"Blog" }
      ],
    } as Response)
  ) as any;

  document.body.innerHTML = `
    <section data-tienda="categories" data-sitio-id="1">
      <div data-tienda-empty>VACIO</div>

      <button
        data-tienda-item
        style="display:none"
      >
        <span data-tienda-category-name></span>
      </button>

    </section>
  `;

  initTiendaBlocks();

  await vi.runAllTimersAsync();

  expect(
    document.body.textContent
  ).toContain("VACIO");
});

it("categories handles empty categories response", async () => {
  const { initTiendaBlocks } = await import("./tienda");

  globalThis.fetch = vi.fn(() =>
    Promise.resolve({
      ok:true,
      json: async()=>[],
    } as Response)
  ) as any;

  document.body.innerHTML = CATEGORY_HTML;

  initTiendaBlocks();

  await vi.runAllTimersAsync();

  expect(
    document.body.textContent
  ).toContain("VACIO");
});

it("categories without siteId shows empty", async () => {

  document.body.innerHTML = `
  <section data-tienda="categories">

    <div data-tienda-empty>
      VACIO
    </div>

  </section>
  `

  initTiendaBlocks()

  await vi.runAllTimersAsync()

  expect(
    document.body.textContent
  ).toContain("VACIO")
})
it("product detail asks login when adding without user", async () => {
  globalThis.fetch = vi.fn((url: string) => {
    if (url.includes("/productos/1")) {
      return Promise.resolve({
        ok: true,
        json: async () => ({
          success: true,
          data: product,
        }),
      } as Response);
    }

    return Promise.resolve({
      ok: true,
      json: async () => ({}),
    } as Response);
  }) as any;

  document.body.innerHTML = `
    <section
      data-tienda="product-detail"
      data-sitio-id="1"
      data-producto-id="1"
    >
      <div data-tienda-empty style="display:none">No encontrado</div>

      <img data-tienda-product-image />
      <h3 data-tienda-product-name></h3>
      <span data-tienda-product-price></span>
      <span data-tienda-product-stock></span>

      <button data-tienda-qty-minus>-</button>
      <span data-tienda-qty-value>1</span>
      <button data-tienda-qty-plus>+</button>

      <button data-tienda-add-cart>
        Agregar al carrito
      </button>
    </section>
  `;

  initTiendaBlocks();

  await vi.runAllTimersAsync();

  expect(document.body.textContent).toContain("Laptop Gamer");

  document
    .querySelector<HTMLButtonElement>("[data-tienda-add-cart]")!
    .click();

  expect(document.body.textContent).toContain(
    "Debes iniciar sesión para agregar al carrito"
  );
});

it("product detail shows empty when product fetch fails", async () => {
  const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

  globalThis.fetch = vi.fn((url: string) => {
    if (url.includes("/productos/1")) {
      return Promise.resolve({
        ok: false,
        status: 500,
        json: async () => ({}),
      } as Response);
    }

    return Promise.resolve({
      ok: true,
      json: async () => ({}),
    } as Response);
  }) as any;

  document.body.innerHTML = `
    <section
      data-tienda="product-detail"
      data-sitio-id="1"
      data-producto-id="1"
    >
      <div data-tienda-empty style="display:none">No encontrado</div>

      <img data-tienda-product-image />
      <h3 data-tienda-product-name></h3>
      <span data-tienda-product-price></span>
      <button data-tienda-add-cart>Agregar al carrito</button>
    </section>
  `;

  initTiendaBlocks();

  await vi.runAllTimersAsync();

  expect(consoleSpy).toHaveBeenCalled();

  expect(
    document.querySelector<HTMLElement>("[data-tienda-empty]")!.style.display
  ).toBe("block");
});
it("featured product shows empty when no featured product exists", async () => {
  globalThis.fetch = vi.fn((url: string) => {
    if (url.includes("/productos")) {
      return Promise.resolve({
        ok: true,
        json: async () => ({
          success: true,
          data: [],
        }),
      } as Response);
    }

    return Promise.resolve({
      ok: true,
      json: async () => ({}),
    } as Response);
  }) as any;

  document.body.innerHTML = `
    <section data-tienda="featured-product" data-sitio-id="1">
      <div data-tienda-empty style="display:none">VACIO</div>
      <article data-tienda-item>
        <h3 data-tienda-product-name></h3>
      </article>
    </section>
  `;

  initTiendaBlocks();

  await vi.runAllTimersAsync();

  expect(
    document.querySelector<HTMLElement>("[data-tienda-empty]")!.style.display
  ).toBe("block");
});

it("product detail by slug shows empty when product is not found", async () => {
  window.history.pushState({}, "", "/?producto=no-existe");

  globalThis.fetch = vi.fn((url: string) => {
    if (url.includes("/productos")) {
      return Promise.resolve({
        ok: true,
        json: async () => ({
          success: true,
          data: [
            {
              ...product,
              slug: "otro-producto",
            },
          ],
        }),
      } as Response);
    }

    return Promise.resolve({
      ok: true,
      json: async () => ({}),
    } as Response);
  }) as any;

  document.body.innerHTML = `
    <section data-tienda="product-detail" data-sitio-id="1">
      <div data-tienda-empty style="display:none">No encontrado</div>
      <h3 data-tienda-product-name></h3>
    </section>
  `;

  initTiendaBlocks();

  await vi.runAllTimersAsync();

  expect(
    document.querySelector<HTMLElement>("[data-tienda-empty]")!.style.display
  ).toBe("block");

  window.history.pushState({}, "", "/");
});

it("product detail handles addToCart failure with response not ok", async () => {
  loginUser();

  const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

  globalThis.fetch = vi.fn((url: string, options?: RequestInit) => {
    if (url.includes("/productos/1")) {
      return Promise.resolve({
        ok: true,
        json: async () => ({
          success: true,
          data: product,
        }),
      } as Response);
    }

    if (url.includes("/carrito/items") && options?.method === "POST") {
      return Promise.resolve({
        ok: false,
        status: 500,
        json: async () => ({
          detail: "Error al agregar",
        }),
      } as Response);
    }

    return Promise.resolve({
      ok: true,
      json: async () => ({}),
    } as Response);
  }) as any;

  document.body.innerHTML = `
    <section data-tienda="product-detail" data-sitio-id="1" data-producto-id="1">
      <div data-tienda-empty style="display:none">No encontrado</div>
      <img data-tienda-product-image />
      <h3 data-tienda-product-name></h3>
      <span data-tienda-product-price></span>
      <span data-tienda-product-stock></span>
      <button data-tienda-qty-minus>-</button>
      <span data-tienda-qty-value>1</span>
      <button data-tienda-qty-plus>+</button>
      <button data-tienda-add-cart>Agregar al carrito</button>
    </section>
  `;

  initTiendaBlocks();

  await vi.runAllTimersAsync();

  expect(document.body.textContent).toContain("Laptop Gamer");

  const btn = document.querySelector<HTMLButtonElement>("[data-tienda-add-cart]")!;

  btn.click();

  await vi.runAllTimersAsync();

  expect(consoleSpy).toHaveBeenCalled();
  expect(btn.textContent).toContain("Error");
});

it("categories empty response triggers showEmpty with api shape", async () => {
  globalThis.fetch = vi.fn((url: string) => {
    if (url.includes("/categorias")) {
      return Promise.resolve({
        ok: true,
        json: async () => ({
          success: true,
          data: [],
        }),
      } as Response);
    }

    return Promise.resolve({
      ok: true,
      json: async () => ({}),
    } as Response);
  }) as any;

  document.body.innerHTML = `
    <section data-tienda="categories" data-sitio-id="1">
      <div data-tienda-empty style="display:none">VACIO</div>
      <div data-tienda-list>
        <button data-tienda-item style="display:none">
          <span data-tienda-category-name></span>
        </button>
      </div>
    </section>
  `;

  initTiendaBlocks();

  await vi.runAllTimersAsync();

  expect(
    document.querySelector<HTMLElement>("[data-tienda-empty]")!.style.display
  ).toBe("block");
});

it("expired and invalid token show login toast when adding", async () => {
  const expired = btoa(
    JSON.stringify({
      usuario_id: 7,
      exp: Math.floor(Date.now() / 1000) - 100,
    })
  );

  localStorage.setItem("site_token", `h.${expired}.s`);

  document.body.innerHTML = `
    <section data-tienda="featured-product" data-sitio-id="1">
      <article data-tienda-item>
        <h3 data-tienda-product-name></h3>
        <button data-tienda-add-cart>Agregar</button>
      </article>
    </section>
  `;

  initTiendaBlocks();

  await vi.runAllTimersAsync();

  document.querySelector<HTMLButtonElement>("[data-tienda-add-cart]")!.click();

  expect(document.body.textContent).toContain(
    "Debes iniciar sesión para agregar al carrito"
  );

  localStorage.setItem("site_token", "token-invalido");

  document.querySelector<HTMLButtonElement>("[data-tienda-add-cart]")!.click();

  expect(document.body.textContent).toContain(
    "Debes iniciar sesión para agregar al carrito"
  );
});
it("hides compare badge and shows agotado", async()=>{

  globalThis.fetch = vi.fn(async()=>({
    ok:true,
    json:async()=>({
      success:true,
      data:[{
        ...product,
        precio_comparacion:null,
        stock:0,
        imagenes:[]
      }]
    })
  })) as any

  document.body.innerHTML=`
    <section
      data-tienda="products-grid"
      data-sitio-id="1"
    >
      <div data-tienda-list>
        <article data-tienda-item>
          <img data-tienda-product-image/>
          <span data-tienda-product-stock></span>
          <span data-tienda-product-compare></span>
          <span data-tienda-badge-discount></span>
        </article>
      </div>
    </section>
  `

  initTiendaBlocks()

  await vi.runAllTimersAsync()

  expect(
    document.body.textContent
  ).toContain("Agotado")
})

it("featured product handles add cart rejection", async()=>{

  loginUser()

  vi.spyOn(
    console,
    "error"
  ).mockImplementation(()=>{})

  globalThis.fetch = vi.fn((url,opts)=>{

    if(
      String(url).includes("/carrito/items")
      && opts?.method==="POST"
    ){
      return Promise.reject(
        new Error("boom")
      )
    }

    return Promise.resolve({
      ok:true,
      json:async()=>({
        success:true,
        data:[product]
      })
    } as Response)

  }) as any

  document.body.innerHTML=`
    <section
      data-tienda="featured-product"
      data-sitio-id="1"
    >
      <article data-tienda-item>
        <button data-tienda-add-cart>
          Agregar
        </button>
      </article>
    </section>
  `

  initTiendaBlocks()

  await vi.runAllTimersAsync()

  document
    .querySelector(
      "[data-tienda-add-cart]"
    )!
    .dispatchEvent(
      new MouseEvent("click")
    )

  await vi.runAllTimersAsync()

  expect(
    console.error
  ).toHaveBeenCalled()
})


it("uses body site id fallback and handles invalid body site id", async () => {
  document.body.setAttribute("data-sitio-id", "abc");

  document.body.innerHTML = `
    <section data-tienda="products-grid" data-sitio-id="{{SITIO_ID}}">
      <div data-tienda-empty style="display:none">VACIO</div>
      <div data-tienda-list>
        <article data-tienda-item>Producto</article>
      </div>
    </section>
  `;

  initTiendaBlocks();

  await vi.runAllTimersAsync();

  expect(
    document.querySelector<HTMLElement>("[data-tienda-empty]")!.style.display
  ).toBe("block");
});
it("toast disappears after timers finish", async () => {
  document.body.innerHTML = `
    <section data-tienda="featured-product" data-sitio-id="1">
      <article data-tienda-item>
        <button data-tienda-add-cart>Agregar</button>
      </article>
    </section>
  `;

  initTiendaBlocks();

  await vi.runAllTimersAsync();

  document.querySelector<HTMLButtonElement>("[data-tienda-add-cart]")!.click();

  expect(document.querySelector(".tw-toast")).not.toBeNull();

  await vi.advanceTimersByTimeAsync(3000);
  await vi.advanceTimersByTimeAsync(300);

  expect(document.querySelector(".tw-toast")).toBeNull();
});
it("products grid add button asks login when user is missing", async () => {
  document.body.innerHTML = `
    <section data-tienda="products-grid" data-sitio-id="1">
      <div data-tienda-list>
        <article data-tienda-item style="display:none">
          <h3 data-tienda-product-name></h3>
          <button data-tienda-add-cart>Agregar al carrito</button>
        </article>
      </div>
    </section>
  `;

  initTiendaBlocks();

  await vi.runAllTimersAsync();

  document.querySelector<HTMLButtonElement>("[data-tienda-add-cart]")!.click();

  expect(document.body.textContent).toContain(
    "Debes iniciar sesión para agregar al carrito"
  );
});
it("products grid handles add cart rejection and resets button", async () => {
  loginUser();

  const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

  globalThis.fetch = vi.fn((url: string, options?: RequestInit) => {
    if (url.includes("/productos")) {
      return Promise.resolve({
        ok: true,
        json: async () => ({
          success: true,
          data: [product],
        }),
      } as Response);
    }

    if (url.includes("/carrito/items") && options?.method === "POST") {
      return Promise.reject(new Error("add failed"));
    }

    return Promise.resolve({
      ok: true,
      json: async () => ({}),
    } as Response);
  }) as any;

  document.body.innerHTML = `
    <section data-tienda="products-grid" data-sitio-id="1">
      <div data-tienda-list>
        <article data-tienda-item style="display:none">
          <h3 data-tienda-product-name></h3>
          <button data-tienda-add-cart>Agregar al carrito</button>
        </article>
      </div>
    </section>
  `;

  initTiendaBlocks();

  await vi.runAllTimersAsync();

  const btn = document.querySelector<HTMLButtonElement>(
    "[data-tienda-add-cart]"
  )!;

  btn.click();

  await vi.waitFor(() => {
    expect(consoleSpy).toHaveBeenCalled();
    expect(btn.textContent).toContain("Error");
  });

  await vi.advanceTimersByTimeAsync(2000);

  expect(btn.textContent).toContain("Agregar al carrito");
  expect(btn.hasAttribute("disabled")).toBe(false);
});
it("products list without site id shows empty", async () => {
  document.body.innerHTML = `
    <section data-tienda="products-list">
      <div data-tienda-empty style="display:none">VACIO</div>
      <div data-tienda-list>
        <article data-tienda-item>Producto</article>
      </div>
    </section>
  `;

  initTiendaBlocks();

  await vi.runAllTimersAsync();

  expect(
    document.querySelector<HTMLElement>("[data-tienda-empty]")!.style.display
  ).toBe("block");
});

it("products list handles fetch error", async () => {
  vi.spyOn(console, "error").mockImplementation(() => {});

  globalThis.fetch = vi.fn(() =>
    Promise.reject(new Error("products list fail"))
  ) as any;

  document.body.innerHTML = `
    <section data-tienda="products-list" data-sitio-id="1">
      <div data-tienda-empty style="display:none">VACIO</div>
      <div data-tienda-list>
        <article data-tienda-item style="display:none">
          <h3 data-tienda-product-name></h3>
        </article>
      </div>
    </section>
  `;

  initTiendaBlocks();

  await vi.runAllTimersAsync();

  expect(console.error).toHaveBeenCalled();

  expect(
    document.querySelector<HTMLElement>("[data-tienda-empty]")!.style.display
  ).toBe("block");
});
it("featured product without site id shows empty", async () => {
  document.body.innerHTML = `
    <section data-tienda="featured-product">
      <div data-tienda-empty style="display:none">VACIO</div>
      <article data-tienda-item>
        <h3 data-tienda-product-name></h3>
      </article>
    </section>
  `;

  initTiendaBlocks();

  await vi.runAllTimersAsync();

  expect(
    document.querySelector<HTMLElement>("[data-tienda-empty]")!.style.display
  ).toBe("block");
});
it("featured product success resets add button after timer", async () => {
  loginUser();

  document.body.innerHTML = `
    <section data-tienda="featured-product" data-sitio-id="1">
      <article data-tienda-item>
        <h3 data-tienda-product-name></h3>
        <button data-tienda-add-cart>Agregar al carrito</button>
      </article>
    </section>
  `;

  initTiendaBlocks();

  await vi.runAllTimersAsync();

  const btn = document.querySelector<HTMLButtonElement>(
    "[data-tienda-add-cart]"
  )!;

  btn.click();

  await vi.waitFor(() => {
    expect(btn.textContent).toContain("✓ Agregado");
  });

  await vi.advanceTimersByTimeAsync(2000);

  expect(btn.textContent).toContain("Agregar al carrito");
  expect(btn.hasAttribute("disabled")).toBe(false);
});
it("featured product handles fetch error", async () => {
  vi.spyOn(console, "error").mockImplementation(() => {});

  globalThis.fetch = vi.fn(() =>
    Promise.reject(new Error("featured fail"))
  ) as any;

  document.body.innerHTML = `
    <section data-tienda="featured-product" data-sitio-id="1">
      <div data-tienda-empty style="display:none">VACIO</div>
      <article data-tienda-item>
        <h3 data-tienda-product-name></h3>
      </article>
    </section>
  `;

  initTiendaBlocks();

  await vi.runAllTimersAsync();

  expect(console.error).toHaveBeenCalled();

  expect(
    document.querySelector<HTMLElement>("[data-tienda-empty]")!.style.display
  ).toBe("block");
});
it("product detail without site id returns without fetching", async () => {
  const fetchSpy = vi.fn();

  globalThis.fetch = fetchSpy as any;

  document.body.innerHTML = `
    <section data-tienda="product-detail" data-producto-id="1">
      <div data-tienda-empty style="display:none">VACIO</div>
      <h3 data-tienda-product-name></h3>
    </section>
  `;

  initTiendaBlocks();

  await vi.runAllTimersAsync();

  expect(fetchSpy).not.toHaveBeenCalled();
});
it("product detail by slug renders product when found", async () => {
  window.history.pushState({}, "", "/?producto=laptop-gamer");

  globalThis.fetch = vi.fn((url: string) => {
    if (url.includes("/productos")) {
      return Promise.resolve({
        ok: true,
        json: async () => ({
          success: true,
          data: [product],
        }),
      } as Response);
    }

    return Promise.resolve({
      ok: true,
      json: async () => ({}),
    } as Response);
  }) as any;

  document.body.innerHTML = `
    <section data-tienda="product-detail" data-sitio-id="1">
      <div data-tienda-empty style="display:none">No encontrado</div>

      <img data-tienda-product-image />
      <h3 data-tienda-product-name></h3>
      <span data-tienda-product-price></span>
      <span data-tienda-product-stock></span>

      <button data-tienda-add-cart>
        Agregar al carrito
      </button>
    </section>
  `;

  initTiendaBlocks();

  await vi.runAllTimersAsync();

  expect(document.body.textContent).toContain("Laptop Gamer");

  expect(
    document.querySelector<HTMLElement>("[data-tienda-empty]")!.style.display
  ).toBe("none");

  window.history.pushState({}, "", "/");
});


it("checkout succeeds without submit button", async () => {
  loginUser();

  document.body.innerHTML = `
    <section data-tienda="checkout" data-sitio-id="1">
      <form data-tienda-checkout-form>
        <input data-tienda-field-nombre value="Juan" />
        <input data-tienda-field-email value="j@test.com" />
      </form>
      <div data-tienda-checkout-success style="display:none"></div>
      <div data-tienda-checkout-message></div>
    </section>
  `;

  initTiendaBlocks();

  document
    .querySelector<HTMLFormElement>("[data-tienda-checkout-form]")!
    .dispatchEvent(
      new Event("submit", {
        bubbles: true,
        cancelable: true,
      })
    );

  await vi.runAllTimersAsync();

  expect(document.body.textContent).toContain("Pedido confirmado");
});

it("checkout succeeds without success and message elements", async () => {
  loginUser();

  document.body.innerHTML = `
    <section data-tienda="checkout" data-sitio-id="1">
      <form data-tienda-checkout-form>
        <input data-tienda-field-nombre value="Juan" />
        <input data-tienda-field-email value="j@test.com" />
        <button type="submit">Confirmar pedido</button>
      </form>
    </section>
  `;

  initTiendaBlocks();

  document
    .querySelector<HTMLFormElement>("[data-tienda-checkout-form]")!
    .dispatchEvent(
      new Event("submit", {
        bubbles: true,
        cancelable: true,
      })
    );

  await vi.runAllTimersAsync();

  expect(globalThis.fetch).toHaveBeenCalledWith(
    "/api/v1/sitios/1/tienda/checkout",
    expect.objectContaining({
      method: "POST",
    })
  );
});

it("checkout error without error element restores submit button", async () => {
  loginUser();

  globalThis.fetch = vi.fn((url: string) => {
    if (url.includes("/checkout")) {
      return Promise.reject(new Error("checkout fail"));
    }

    return Promise.resolve({
      ok: true,
      json: async () => ({
        success: true,
        data: [product],
      }),
    } as Response);
  }) as any;

  vi.spyOn(console, "error").mockImplementation(() => {});

  document.body.innerHTML = `
    <section data-tienda="checkout" data-sitio-id="1">
      <form data-tienda-checkout-form>
        <input data-tienda-field-nombre value="Juan" />
        <input data-tienda-field-email value="j@test.com" />
        <button type="submit">Confirmar pedido</button>
      </form>
    </section>
  `;

  initTiendaBlocks();

  const btn = document.querySelector<HTMLButtonElement>('button[type="submit"]')!;

  document
    .querySelector<HTMLFormElement>("[data-tienda-checkout-form]")!
    .dispatchEvent(
      new Event("submit", {
        bubbles: true,
        cancelable: true,
      })
    );

  await vi.runAllTimersAsync();

  expect(console.error).toHaveBeenCalled();
  expect(btn.textContent).toBe("Confirmar pedido");
  expect(btn.disabled).toBe(false);
});

it("checkout uses fallback message when thrown value is not Error", async () => {
  loginUser();

  globalThis.fetch = vi.fn((url: string) => {
    if (url.includes("/checkout")) {
      return Promise.reject("boom");
    }

    return Promise.resolve({
      ok: true,
      json: async () => ({
        success: true,
        data: [product],
      }),
    } as Response);
  }) as any;

  vi.spyOn(console, "error").mockImplementation(() => {});

  document.body.innerHTML = `
    <section data-tienda="checkout" data-sitio-id="1">
      <form data-tienda-checkout-form>
        <input data-tienda-field-nombre value="Juan" />
        <input data-tienda-field-email value="j@test.com" />
        <button type="submit">Confirmar pedido</button>
      </form>
      <div data-tienda-checkout-error style="display:none"></div>
    </section>
  `;

  initTiendaBlocks();

  document
    .querySelector<HTMLFormElement>("[data-tienda-checkout-form]")!
    .dispatchEvent(
      new Event("submit", {
        bubbles: true,
        cancelable: true,
      })
    );

  await vi.runAllTimersAsync();

  expect(document.body.textContent).toContain("Error al procesar el pedido");
});




it("categories without name spans still render and filter hidden product items", async () => {
  const { initTiendaBlocks } = await import("./tienda");

  document.body.innerHTML = `
    <section data-tienda="categories" data-sitio-id="1">
      <div data-tienda-empty style="display:none">VACIO</div>
      <div data-tienda-list>
        <button data-tienda-item style="display:none"></button>
      </div>
    </section>

    <section data-tienda="products-grid" data-sitio-id="1">
      <div data-tienda-list>
        <article data-tienda-item style="display:none">Producto oculto</article>
      </div>
    </section>
  `;

  initTiendaBlocks();

  await vi.runAllTimersAsync();

  const buttons = document.querySelectorAll<HTMLButtonElement>(
    '[data-tienda="categories"] [data-tienda-item]'
  );

  expect(buttons.length).toBeGreaterThan(1);

  buttons[1].click();
  buttons[0].click();

  expect(document.body.textContent).toContain("Producto oculto");
});
it("cart with missing item template returns safely", async () => {
  const { initTiendaBlocks } = await import("./tienda");

  loginUser();

  document.body.innerHTML = `
    <section data-tienda="cart" data-sitio-id="1">
      <div data-tienda-empty style="display:none">Carrito vacío</div>
      <div data-tienda-list></div>
      <span data-tienda-cart-total></span>
    </section>
  `;

  initTiendaBlocks();

  await vi.runAllTimersAsync();

  expect(document.body.textContent).toContain("Carrito vacío");
});

it("cart pay button is appended to container when total section is missing", async () => {
  const { initTiendaBlocks } = await import("./tienda");

  loginUser();

  document.body.innerHTML = `
    <section data-tienda="cart" data-sitio-id="1">
      <div data-tienda-empty style="display:none">Carrito vacío</div>
      <div data-tienda-list>
        <div data-tienda-item style="display:none">
          <span data-tienda-product-name></span>
          <span data-tienda-product-price></span>
          <span data-tienda-qty-value></span>
          <span data-tienda-item-subtotal></span>
        </div>
      </div>
    </section>
  `;

  initTiendaBlocks();

  await vi.runAllTimersAsync();

  const pagarBtn = document.querySelector<HTMLButtonElement>("[data-tienda-pagar]");

  expect(pagarBtn).toBeTruthy();
  expect(pagarBtn?.textContent).toBe("Pagar ahora");
});
it("checkout success uses fallback message when backend message is empty", async () => {
  const { initTiendaBlocks } = await import("./tienda");

  loginUser();

  globalThis.fetch = vi.fn(async (url: string) => {
    if (url.includes("/checkout")) {
      return {
        ok: true,
        json: async () => ({
          pedido: { id: 99 },
          mensaje: "",
        }),
      } as Response;
    }

    return {
      ok: true,
      json: async () => ({
        success: true,
        data: [product],
      }),
    } as Response;
  }) as any;

  document.body.innerHTML = `
    <section data-tienda="checkout" data-sitio-id="1">
      <form data-tienda-checkout-form>
        <input data-tienda-field-nombre value="Juan" />
        <input data-tienda-field-email value="j@test.com" />
        <button type="submit">Confirmar pedido</button>
      </form>
      <div data-tienda-checkout-success style="display:none"></div>
      <div data-tienda-checkout-error style="display:none"></div>
      <div data-tienda-checkout-message></div>
    </section>
  `;

  initTiendaBlocks();

  document
    .querySelector<HTMLFormElement>("[data-tienda-checkout-form]")!
    .dispatchEvent(
      new Event("submit", {
        bubbles: true,
        cancelable: true,
      })
    );

  await vi.runAllTimersAsync();

  expect(document.body.textContent).toContain("Pedido confirmado exitosamente");
});

it("checkout profile autofill skips empty optional values", async () => {
  vi.doMock("./perfil", () => ({
    fetchProfile: vi.fn(async () => ({
      nombre: "",
      apellido: "",
      correo: "",
      telefono: null,
      direccion_envio: undefined,
      ciudad: "",
      pais: null,
      codigo_postal: undefined,
    })),
  }));

  loginUser();

  const { initTiendaBlocks } = await import("./tienda");

  document.body.innerHTML = `
    <section data-tienda="checkout" data-sitio-id="1">
      <form data-tienda-checkout-form>
        <input data-tienda-field-nombre value="Original Nombre" />
        <input data-tienda-field-email value="original@test.com" />
        <input data-tienda-field-telefono value="111" />
        <input data-tienda-field-direccion value="Dir original" />
        <input data-tienda-field-ciudad value="Ciudad original" />
        <input data-tienda-field-pais value="Pais original" />
        <input data-tienda-field-codigo-postal value="00000" />
      </form>
    </section>
  `;

  initTiendaBlocks();

  await vi.runAllTimersAsync();

  expect(
    document.querySelector<HTMLInputElement>("[data-tienda-field-email]")!.value
  ).toBe("original@test.com");

  expect(
    document.querySelector<HTMLInputElement>("[data-tienda-field-telefono]")!.value
  ).toBe("111");

  expect(
    document.querySelector<HTMLInputElement>("[data-tienda-field-direccion]")!.value
  ).toBe("Dir original");
});

it("featured product handles add cart error and shows Error text", async () => {
  const { initTiendaBlocks } = await import("./tienda");

  loginUser();

  globalThis.fetch = vi.fn((url: string, options?: RequestInit) => {
    if (options?.method === "POST") {
      return Promise.resolve({
        ok: false,
        json: async () => ({}),
      } as Response);
    }

    return Promise.resolve({
      ok: true,
      json: async () => ({
        success: true,
        data: [product],
      }),
    } as Response);
  }) as any;

  vi.spyOn(console, "error").mockImplementation(() => {});

  document.body.innerHTML = `
    <section data-tienda="featured-product" data-sitio-id="1">
      <div data-tienda-empty style="display:none">Vacío</div>
      <article data-tienda-item>
        <h3 data-tienda-product-name></h3>
        <span data-tienda-product-price></span>
        <button data-tienda-add-cart>Agregar al carrito</button>
      </article>
    </section>
  `;

  initTiendaBlocks();

  await vi.runAllTimersAsync();

  const btn = document.querySelector<HTMLButtonElement>("[data-tienda-add-cart]")!;
  btn.click();

  await vi.runAllTimersAsync();

  expect(btn.textContent).toBe("Error");
  expect(console.error).toHaveBeenCalled();
});


it("product detail without siteId returns without showing empty", async () => {
  const { initTiendaBlocks } = await import("./tienda");

  document.body.innerHTML = `
    <section data-tienda="product-detail" data-producto-id="1">
      <div data-tienda-empty style="display:none">No encontrado</div>
      <h3 data-tienda-product-name></h3>
    </section>
  `;

  initTiendaBlocks();

  await vi.runAllTimersAsync();

  expect(
    document.querySelector<HTMLElement>("[data-tienda-empty]")!.style.display
  ).toBe("none");
});
it("product detail without product id and slug returns safely", async () => {
  const { initTiendaBlocks } = await import("./tienda");

  window.history.pushState({}, "", "/");

  document.body.innerHTML = `
    <section data-tienda="product-detail" data-sitio-id="1">
      <div data-tienda-empty style="display:none">No encontrado</div>
      <h3 data-tienda-product-name></h3>
    </section>
  `;

  initTiendaBlocks();

  await vi.runAllTimersAsync();

  expect(
    document.querySelector<HTMLElement>("[data-tienda-empty]")!.style.display
  ).toBe("none");
});
it("cart item renders safely when optional inner elements are missing", async () => {
  const { initTiendaBlocks } = await import("./tienda");

  loginUser();

  document.body.innerHTML = `
    <section data-tienda="cart" data-sitio-id="1">
      <div data-tienda-empty style="display:none">Carrito vacío</div>
      <div data-tienda-list>
        <div data-tienda-item style="display:none">
          <button data-tienda-qty-minus>-</button>
          <button data-tienda-qty-plus>+</button>
          <button data-tienda-item-remove>Eliminar</button>
        </div>
      </div>
      <span data-tienda-cart-total></span>
    </section>
  `;

  initTiendaBlocks();

  await vi.runAllTimersAsync();

  expect(document.querySelectorAll("[data-tienda-item]").length).toBeGreaterThan(0);
});

it("cart handles empty cloned template safely", async () => {
  const { initTiendaBlocks } = await import("./tienda");

  loginUser();

  document.body.innerHTML = `
    <section data-tienda="cart" data-sitio-id="1">
      <div data-tienda-empty style="display:none">Carrito vacío</div>
      <div data-tienda-list>
        <template data-tienda-item></template>
      </div>
      <span data-tienda-cart-total></span>
    </section>
  `;

  initTiendaBlocks();

  await vi.runAllTimersAsync();

  expect(document.body.textContent).toContain("Carrito vacío");
});

it("qty minus does nothing when quantity remains the same", async () => {
  const { initTiendaBlocks } = await import("./tienda");

  loginUser();

  globalThis.fetch = vi.fn((url: string, options?: RequestInit) => {
    if (options?.method === "PUT") {
      return Promise.resolve({
        ok: true,
        json: async () => ({}),
      } as Response);
    }

    if (url.includes("/carrito")) {
      return Promise.resolve({
        ok: true,
        json: async () => ({
          id: 1,
          site_id: 1,
          items: [
            {
              id: 10,
              producto_id: 1,
              cantidad: 1,
              producto: product,
            },
          ],
          total: 1000,
        }),
      } as Response);
    }

    return Promise.resolve({
      ok: true,
      json: async () => ({}),
    } as Response);
  }) as any;

  document.body.innerHTML = CART_HTML;

  initTiendaBlocks();

  await vi.runAllTimersAsync();

  document.querySelector<HTMLButtonElement>("[data-tienda-qty-minus]")!.click();

  await vi.runAllTimersAsync();

  expect(globalThis.fetch).not.toHaveBeenCalledWith(
    "/api/v1/sitios/1/tienda/carrito/items/10?cantidad=1",
    expect.objectContaining({ method: "PUT" })
  );
});

it("cart pay button asks login when token expires before clicking pay", async () => {
  const { initTiendaBlocks } = await import("./tienda");

  loginUser();

  document.body.innerHTML = CART_HTML;

  initTiendaBlocks();

  await vi.runAllTimersAsync();

  const pagarBtn = document.querySelector<HTMLButtonElement>("[data-tienda-pagar]")!;

  expect(pagarBtn).toBeTruthy();

  const expiredPayload = btoa(
    JSON.stringify({
      sub: "7",
      usuario_id: 7,
      exp: Math.floor(Date.now() / 1000) - 10,
    })
  );

  localStorage.setItem("site_token", `header.${expiredPayload}.signature`);

  pagarBtn.click();

  expect(document.body.textContent).toContain("Debes iniciar sesión para pagar");
});

it("featured product uses container as item when template item is missing", async () => {
  const { initTiendaBlocks } = await import("./tienda");

  document.body.innerHTML = `
    <section data-tienda="featured-product" data-sitio-id="1">
      <div data-tienda-empty style="display:none">Vacío</div>
      <h3 data-tienda-product-name></h3>
      <span data-tienda-product-price></span>
    </section>
  `;

  initTiendaBlocks();

  await vi.runAllTimersAsync();

  expect(document.body.textContent).toContain("Laptop Gamer");
  expect(document.body.textContent).toContain("S/ 1000.00");
});

it("product detail quantity controls work without qty value element", async () => {
  const { initTiendaBlocks } = await import("./tienda");

  loginUser();

  document.body.innerHTML = `
    <section data-tienda="product-detail" data-sitio-id="1" data-producto-id="1">
      <div data-tienda-empty style="display:none">No encontrado</div>
      <h3 data-tienda-product-name></h3>
      <button data-tienda-qty-minus>-</button>
      <button data-tienda-qty-plus>+</button>
      <button data-tienda-add-cart>Agregar al carrito</button>
    </section>
  `;

  initTiendaBlocks();

  await vi.runAllTimersAsync();

  document.querySelector<HTMLButtonElement>("[data-tienda-qty-plus]")!.click();
  document.querySelector<HTMLButtonElement>("[data-tienda-qty-minus]")!.click();
  document.querySelector<HTMLButtonElement>("[data-tienda-add-cart]")!.click();

  await vi.runAllTimersAsync();

  expect(globalThis.fetch).toHaveBeenCalledWith(
    "/api/v1/sitios/1/tienda/carrito/items",
    expect.objectContaining({
      method: "POST",
    })
  );
});
it("categories renders when empty element is missing", async () => {
  const { initTiendaBlocks } = await import("./tienda");

  document.body.innerHTML = `
    <section data-tienda="categories" data-sitio-id="1">
      <div data-tienda-list>
        <button data-tienda-item style="display:none">
          <span data-tienda-category-name></span>
        </button>
      </div>
    </section>
  `;

  initTiendaBlocks();

  await vi.runAllTimersAsync();

  expect(document.body.textContent).toContain("Todas");
  expect(document.body.textContent).toContain("Tecnología");
});


it("category filter keeps visible items when filtering by category", async () => {
  const { initTiendaBlocks } = await import("./tienda");

  document.body.innerHTML = `
    <section data-tienda="categories" data-sitio-id="1">
      <div data-tienda-empty style="display:none">VACIO</div>
      <div data-tienda-list>
        <button data-tienda-item style="display:none">
          <span data-tienda-category-name></span>
        </button>
      </div>
    </section>

    <section data-tienda="products-grid" data-sitio-id="1">
      <div data-tienda-list>
        <article data-tienda-item style="">Producto visible</article>
      </div>
    </section>
  `;

  initTiendaBlocks();

  await vi.runAllTimersAsync();

  const buttons = document.querySelectorAll<HTMLButtonElement>(
    '[data-tienda="categories"] [data-tienda-item]'
  );

  buttons[1].click();

  expect(document.body.textContent).toContain("Producto visible");
});

it("cart summary handles total element without parent section", async () => {
  const { initTiendaBlocks } = await import("./tienda");

  loginUser();

  document.body.innerHTML = `
    <section data-tienda="cart" data-sitio-id="1">
      <div data-tienda-empty style="display:none">Carrito vacío</div>
      <div data-tienda-list>
        <div data-tienda-item style="display:none">
          <span data-tienda-product-name></span>
          <span data-tienda-product-price></span>
          <span data-tienda-qty-value></span>
          <span data-tienda-item-subtotal></span>
        </div>
      </div>
      <span data-tienda-cart-total></span>
    </section>
  `;

  initTiendaBlocks();

  await vi.runAllTimersAsync();

  expect(document.querySelector("[data-tienda-cart-total]")?.textContent).toBe(
    "S/ 2000.00"
  );
});

it("refresh cart total does nothing when total element is missing", async () => {
  const { initTiendaBlocks } = await import("./tienda");

  loginUser();

  document.body.innerHTML = `
    <section data-tienda="cart" data-sitio-id="1">
      <div data-tienda-empty style="display:none">Carrito vacío</div>
      <div data-tienda-list>
        <div data-tienda-item style="display:none">
          <span data-tienda-product-name></span>
          <span data-tienda-product-price></span>
          <button data-tienda-qty-plus>+</button>
          <span data-tienda-qty-value></span>
          <span data-tienda-item-subtotal></span>
        </div>
      </div>
    </section>
  `;

  initTiendaBlocks();

  await vi.runAllTimersAsync();

  document.querySelector<HTMLButtonElement>("[data-tienda-qty-plus]")!.click();

  await vi.runAllTimersAsync();

  expect(document.body.textContent).toContain("Laptop Gamer");
});


it("showEmpty hides checkout link pay button and total section", async () => {
  const { initTiendaBlocks } = await import("./tienda");

  globalThis.fetch = vi.fn(async () => ({
    ok: true,
    json: async () => ({
      success: true,
      data: [],
    }),
  })) as any;

  document.body.innerHTML = `
    <section data-tienda="products-grid" data-sitio-id="1">
      <div data-tienda-empty style="display:none">VACIO</div>
      <div data-tienda-list>
        <article data-tienda-item>Item</article>
      </div>
      <a data-tienda-checkout-link style="display:block">Checkout</a>
      <button data-tienda-pagar style="display:block">Pagar</button>
      <div>
        <div>
          <span data-tienda-cart-total>S/ 10.00</span>
        </div>
      </div>
    </section>
  `;

  initTiendaBlocks();

  await vi.runAllTimersAsync();

  expect(document.querySelector<HTMLElement>("[data-tienda-empty]")!.style.display)
    .toBe("block");

  expect(document.querySelector<HTMLElement>("[data-tienda-checkout-link]")!.style.display)
    .toBe("none");

  expect(document.querySelector<HTMLElement>("[data-tienda-pagar]")!.style.display)
    .toBe("none");

  expect(document.querySelector<HTMLElement>("[data-tienda-cart-total]")!.textContent)
    .toBe("");

  const totalSection = document
    .querySelector<HTMLElement>("[data-tienda-cart-total]")!
    .parentElement!
    .parentElement as HTMLElement;

  expect(totalSection.style.display).toBe("none");
});


it("checkout uses fallback backend error when error response has invalid json", async () => {
  const { initTiendaBlocks } = await import("./tienda");

  loginUser();

  globalThis.fetch = vi.fn(async (url: string) => {
    if (url.includes("/checkout")) {
      return {
        ok: false,
        json: async () => {
          throw new Error("invalid json");
        },
      } as unknown as Response;
    }

    return {
      ok: true,
      json: async () => ({
        success: true,
        data: [product],
      }),
    } as Response;
  }) as any;

  document.body.innerHTML = `
    <section data-tienda="checkout" data-sitio-id="1">
      <form data-tienda-checkout-form>
        <input data-tienda-field-nombre value="Juan" />
        <input data-tienda-field-email value="j@test.com" />
        <button type="submit">Confirmar pedido</button>
      </form>
      <div data-tienda-checkout-error style="display:none"></div>
    </section>
  `;

  initTiendaBlocks();

  document
    .querySelector<HTMLFormElement>("[data-tienda-checkout-form]")!
    .dispatchEvent(
      new Event("submit", {
        bubbles: true,
        cancelable: true,
      })
    );

  await vi.runAllTimersAsync();

  expect(document.body.textContent).toContain("Error al procesar el pedido");
});


it("product item handles missing description and category", async () => {
  const { initTiendaBlocks } = await import("./tienda");

  const productWithoutOptional = {
    ...product,
    descripcion: undefined,
    categoria: null,
  };

  globalThis.fetch = vi.fn(async () => ({
    ok: true,
    json: async () => ({
      success: true,
      data: [productWithoutOptional],
    }),
  })) as any;

  document.body.innerHTML = `
    <section data-tienda="products-grid" data-sitio-id="1">
      <div data-tienda-list>
        <article data-tienda-item style="display:none">
          <h3 data-tienda-product-name></h3>
          <p data-tienda-product-desc>OLD</p>
          <span data-tienda-category-name>OLD-CAT</span>
        </article>
      </div>
    </section>
  `;

  initTiendaBlocks();

  await vi.runAllTimersAsync();

  expect(document.querySelector("[data-tienda-product-desc]")?.textContent).toBe("");
  expect(document.querySelector("[data-tienda-category-name]")?.textContent).toBe("OLD-CAT");
});

it("product collection renders item without add cart button", async () => {
  const { initTiendaBlocks } = await import("./tienda");

  document.body.innerHTML = `
    <section data-tienda="products-grid" data-sitio-id="1">
      <div data-tienda-list>
        <article data-tienda-item style="display:none">
          <h3 data-tienda-product-name></h3>
        </article>
      </div>
    </section>
  `;

  initTiendaBlocks();

  await vi.runAllTimersAsync();

  expect(document.body.textContent).toContain("Laptop Gamer");
});

it("product detail renders safely without add cart button", async () => {
  const { initTiendaBlocks } = await import("./tienda");

  document.body.innerHTML = `
    <section data-tienda="product-detail" data-sitio-id="1" data-producto-id="1">
      <div data-tienda-empty style="display:none">No encontrado</div>
      <h3 data-tienda-product-name></h3>
      <span data-tienda-qty-value>1</span>
    </section>
  `;

  initTiendaBlocks();

  await vi.runAllTimersAsync();

  expect(document.body.textContent).toContain("Laptop Gamer");
});




});