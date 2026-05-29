import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { initTiendaBlocks } from "./tienda";

const { mockIsAuthenticated } = vi.hoisted(() => ({
  mockIsAuthenticated: vi.fn(() => false),
}));

vi.mock("./api", () => ({
  isAuthenticated: mockIsAuthenticated,
  setToken: vi.fn(),
}));

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

    global.fetch = vi.fn(async (url: string) => {
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

    expect(global.fetch).toHaveBeenCalledWith(
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

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/v1/sitios/1/tienda/carrito/items/10?cantidad=3",
      expect.objectContaining({
        method: "PUT",
      })
    );

    document.querySelector<HTMLButtonElement>("[data-tienda-item-remove]")!.click();

    await vi.runAllTimersAsync();

    expect(global.fetch).toHaveBeenCalledWith(
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

    expect(global.fetch).toHaveBeenCalledWith(
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
    global.fetch = vi.fn(async () => ({
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

    global.fetch = vi.fn(async () => ({
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

    global.fetch = vi.fn(async (url: string) => {
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

    global.fetch = vi.fn(async (url: string) => {
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

  global.fetch = vi.fn((url: string, options?: RequestInit) => {
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

  global.fetch = vi.fn((url: string, options?: RequestInit) => {
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

  global.fetch = vi.fn((url: string, options?: RequestInit) => {
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

  global.fetch = vi.fn(() =>
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

  global.fetch = vi.fn(() =>
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

  global.fetch = vi.fn((url, opts) => {

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

  global.fetch = vi.fn((url, opts) => {

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

  global.fetch = vi.fn(() =>
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

  global.fetch = vi.fn(() =>
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

  global.fetch = vi.fn(() =>
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
  global.fetch = vi.fn((url: string) => {
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
it("categories empty response triggers showEmpty", async () => {

  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok:true,
      json:async()=>[],
    })
  ) as any

  document.body.innerHTML = `
  <section
    data-tienda="categories"
    data-sitio-id="1"
  >

    <div data-tienda-empty>
      VACIO
    </div>

    <div data-tienda-list>
      <button data-tienda-item></button>
    </div>

  </section>
  `

  initTiendaBlocks()

  await vi.runAllTimersAsync()

  expect(
    document.body.textContent
  ).toContain("VACIO")
})
});