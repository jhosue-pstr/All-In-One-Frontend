import { beforeEach, describe, expect, it, vi } from "vitest";

const post = {
  id: 1,
  site_id: 1,
  category_id: null,
  title: "Mi primer post",
  slug: "mi-primer-post",
  content: "<p>Contenido completo</p>",
  excerpt: "Resumen corto",
  featured_image: "/blog.png",
  status: "published" as const,
  published_at: "2026-01-01T00:00:00Z",
  meta_title: "SEO Blog",
  meta_description: "SEO Description",
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z",
};

describe("site-widget blog", () => {

  beforeEach(() => {
    document.body.innerHTML = "";
    document.head.innerHTML = "";
    vi.clearAllMocks();

    global.fetch = vi.fn(async (url:string) => {

      if (url.includes("/posts/mi-primer-post")) {
        return {
          ok:true,
          json: async () => post
        } as Response;
      }

      if (url.includes("/posts")) {
        return {
          ok:true,
          json: async () => [post]
        } as Response;
      }

      return {
        ok:false,
        json: async () => ({})
      } as Response;

    }) as any;
  });

  it("renders posts grid", async () => {

    const { initBlogBlocks } = await import("./blog");

    document.body.innerHTML = `
      <section data-blog="posts-grid" data-sitio-id="1">

        <div data-blog-empty style="display:none">
          Vacío
        </div>

        <div data-blog-list>

          <article data-blog-item style="display:none">
            <img data-blog-image />
            <h3 data-blog-title></h3>
            <p data-blog-excerpt></p>
            <span data-blog-date></span>
            <a data-blog-link></a>
          </article>

        </div>

      </section>
    `;

    initBlogBlocks();

    await vi.waitFor(() => {
      expect(document.body.textContent).toContain("Mi primer post");
    });

    expect(document.body.textContent).toContain("Resumen corto");
  });

  it("shows empty when site id missing", async () => {

    const { initBlogBlocks } = await import("./blog");

    document.body.innerHTML = `
      <section data-blog="posts-grid">

        <div data-blog-empty style="display:none">
          Vacío
        </div>

        <div data-blog-list>
          <article data-blog-item></article>
        </div>

      </section>
    `;

    initBlogBlocks();

    expect(
      document.querySelector<HTMLElement>("[data-blog-empty]")!.style.display
    ).toBe("block");
  });

  it("renders featured post", async () => {

    const { initBlogBlocks } = await import("./blog");

    document.body.innerHTML = `
      <section data-blog="featured-post" data-sitio-id="1">

        <div data-blog-empty style="display:none"></div>

        <article data-blog-item>
          <img data-blog-image />
          <h2 data-blog-title></h2>
          <p data-blog-excerpt></p>
        </article>

      </section>
    `;

    initBlogBlocks();

    await vi.waitFor(() => {
      expect(document.body.textContent).toContain("Mi primer post");
    });
  });

  it("renders post detail and updates seo metadata", async () => {

    window.history.pushState(
      {},
      "",
      "/?post=mi-primer-post"
    );

    const { initBlogBlocks } = await import("./blog");

    document.body.innerHTML = `
      <section data-blog="post-detail" data-sitio-id="1">

        <div data-blog-empty style="display:none"></div>

        <img data-blog-image />
        <h2 data-blog-title></h2>
        <div data-blog-content></div>

      </section>
    `;

    initBlogBlocks();

    await vi.waitFor(() => {
      expect(document.body.textContent).toContain("Mi primer post");
    });

    expect(document.title).toBe("SEO Blog");

    expect(
      document.querySelector(
        'meta[name="description"]'
      )?.getAttribute("content")
    ).toBe("SEO Description");
  });

  it("search filters posts", async () => {

    const { initBlogBlocks } = await import("./blog");

    document.body.innerHTML = `
      <section data-blog="search">

        <form data-blog-search-form>
          <input
            data-blog-search-input
            value="primer"
          />
        </form>

      </section>

      <section data-blog="posts-grid">

        <article data-blog-item>

          <h3 data-blog-title>
            Mi primer post
          </h3>

          <p data-blog-excerpt>
            Resumen corto
          </p>

        </article>

      </section>
    `;

    initBlogBlocks();

    document
      .querySelector("form")!
      .dispatchEvent(
        new Event(
          "submit",
          {
            bubbles:true,
            cancelable:true
          }
        )
      );

    expect(
      document.querySelector<HTMLElement>(
        "[data-blog-item]"
      )!.style.display
    ).toBe("");
  });

  it("opens modal when clicking post", async () => {

    const { initBlogBlocks } = await import("./blog");

    document.body.innerHTML = `
      <section data-blog="posts-grid" data-sitio-id="1">

        <div data-blog-list>

          <article data-blog-item style="display:none">
            <h3 data-blog-title></h3>
          </article>

        </div>

      </section>
    `;

    initBlogBlocks();

    await vi.waitFor(() => {
      expect(document.body.textContent).toContain("Mi primer post");
    });

    document
      .querySelector<HTMLElement>(
        "[data-blog-item]"
      )!
      .click();

    expect(
      document.getElementById(
        "blog-post-modal"
      )
    ).toBeTruthy();
  });

});