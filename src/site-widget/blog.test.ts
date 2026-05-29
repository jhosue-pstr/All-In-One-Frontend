import { beforeEach, describe, expect, it, vi } from "vitest";
import { initBlogBlocks } from "./blog";

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
    vi.restoreAllMocks()
    document.body.innerHTML = "";
    document.head.innerHTML = "";
    vi.clearAllMocks();

    globalThis.fetch = vi.fn(async (url:string) => {

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


  it('blog uses fallback date when Date formatter fails', async () => {
  vi.spyOn(Intl, 'DateTimeFormat')
    .mockImplementation(() => {
      throw new Error('boom')
    })

  globalThis.fetch = vi.fn().mockResolvedValue({
    ok:true,
    json:()=>Promise.resolve([
      {
        id:1,
        site_id:1,
        category_id:null,
        title:'Post',
        slug:'post',
        content:'contenido',
        excerpt:null,
        featured_image:null,
        status:'published',
        published_at:'2025-01-01',
        meta_title:null,
        meta_description:null,
        created_at:'2025-01-01',
        updated_at:'2025-01-01',
      }
    ])
  })

  document.body.innerHTML=`
  <div data-blog="posts-grid" data-sitio-id="1">
    <div data-blog-list></div>
    <div data-blog-item>
      <span data-blog-date></span>
    </div>
    <div data-blog-empty></div>
  </div>
  `

  initBlogBlocks()

  await vi.waitFor(()=>{
    expect(document.body.textContent)
      .toContain('Publicado recientemente')
  })
})

it('posts grid loads successful fetch response', async () => {
  globalThis.fetch = vi.fn().mockResolvedValue({
    ok:true,
    json:()=>Promise.resolve([])
  })

  document.body.innerHTML=`
  <div data-blog="posts-grid" data-sitio-id="1">
    <div data-blog-list></div>
    <div data-blog-item></div>
    <div data-blog-empty></div>
  </div>
  `

  initBlogBlocks()

  await vi.waitFor(()=>{
    expect(globalThis.fetch)
      .toHaveBeenCalled()
  })
})
it('modal closes with Escape key', async () => {
  globalThis.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve([
      {
        id: 1,
        site_id: 1,
        category_id: null,
        title: 'Post',
        slug: 'post',
        content: 'contenido',
        excerpt: 'desc',
        featured_image: null,
        status: 'published',
        published_at: null,
        meta_title: null,
        meta_description: null,
        created_at: '2025',
        updated_at: '2025',
      },
    ]),
  })

  document.body.innerHTML = `
    <div data-blog="posts-grid" data-sitio-id="1">
      <div data-blog-list></div>

      <div data-blog-item>
        <a data-blog-link href="#"></a>
        <h3 data-blog-title></h3>
        <p data-blog-excerpt></p>
      </div>

      <div data-blog-empty></div>
    </div>
  `

  initBlogBlocks()

  await vi.waitFor(() => {
    expect(
      document.querySelector<HTMLElement>('[data-blog-link]')
    ).toBeTruthy()
  })

  document
    .querySelector<HTMLElement>('[data-blog-link]')!
    .click()

  await vi.waitFor(() => {
    expect(document.body.style.overflow).toBe('hidden')
  })

  document.dispatchEvent(
    new KeyboardEvent('keydown', {
      key: 'Escape',
    })
  )

  expect(document.body.style.overflow).toBe('')
})



it("uses body data-sitio-id when block has template site id", async () => {
  document.body.setAttribute("data-sitio-id", "9")

  globalThis.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve([]),
  })

  document.body.innerHTML += `
    <section data-blog="posts-grid" data-sitio-id="{{SITIO_ID}}">
      <div data-blog-list></div>
      <article data-blog-item></article>
      <div data-blog-empty></div>
    </section>
  `

  initBlogBlocks()

  await vi.waitFor(() => {
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/modules/blog/9/posts")
    )
  })
})


it("uses fallback limit when data-limit is invalid", async () => {
  globalThis.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve([]),
  })

  document.body.innerHTML = `
    <section data-blog="posts-grid" data-sitio-id="1" data-limit="abc">
      <div data-blog-list></div>
      <article data-blog-item></article>
      <div data-blog-empty></div>
    </section>
  `

  initBlogBlocks()

  await vi.waitFor(() => {
    expect(globalThis.fetch).toHaveBeenCalled()
  })
})


it("uses placeholder image when post image is missing", async () => {
  globalThis.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve([
      {
        ...post,
        featured_image: null,
      },
    ]),
  })

  document.body.innerHTML = `
    <section data-blog="posts-grid" data-sitio-id="1">
      <div data-blog-list></div>
      <article data-blog-item>
        <img data-blog-image />
        <h3 data-blog-title></h3>
      </article>
      <div data-blog-empty></div>
    </section>
  `

  initBlogBlocks()

  await vi.waitFor(() => {
    expect(
      document.querySelector<HTMLImageElement>("[data-blog-image]")!.src
    ).toContain("placehold.co")
  })
})


it("shows empty when posts fetch fails", async () => {
  globalThis.fetch = vi.fn().mockResolvedValue({
    ok: false,
    json: () => Promise.resolve({}),
  })

  document.body.innerHTML = `
    <section data-blog="posts-grid" data-sitio-id="1">
      <div data-blog-list></div>
      <article data-blog-item></article>
      <div data-blog-empty style="display:none">Vacío</div>
    </section>
  `

  initBlogBlocks()

  await vi.waitFor(() => {
    expect(
      document.querySelector<HTMLElement>("[data-blog-empty]")!.style.display
    ).toBe("block")
  })
})


it("fills category text", async () => {
  document.body.innerHTML = `
    <section data-blog="featured-post" data-sitio-id="1">
      <div data-blog-empty></div>

      <article data-blog-item>
        <span data-blog-category></span>
      </article>
    </section>
  `

  initBlogBlocks()

  await vi.waitFor(() => {
    expect(
      document.querySelector(
        "[data-blog-category]"
      )?.textContent
    ).toBe("Blog")
  })
})


it("featured post shows empty when site id missing", () => {
  document.body.removeAttribute("data-sitio-id")

  document.body.innerHTML = `
    <section data-blog="featured-post">
      <div data-blog-empty style="display:none">
        Vacío
      </div>

      <article data-blog-item></article>
    </section>
  `

  initBlogBlocks()

  expect(
    document.querySelector<HTMLElement>(
      "[data-blog-empty]"
    )!.style.display
  ).toBe("block")
})

it("featured post handles empty response", async () => {
  globalThis.fetch = vi.fn().mockResolvedValue({
    ok:true,
    json:()=>Promise.resolve([])
  })

  document.body.innerHTML=`
    <section data-blog="featured-post" data-sitio-id="1">
      <div data-blog-empty style="display:none">
        Vacío
      </div>

      <article data-blog-item></article>
    </section>
  `

  initBlogBlocks()

  await vi.waitFor(()=>{
    expect(
      document.querySelector<HTMLElement>(
        "[data-blog-empty]"
      )!.style.display
    ).toBe("block")
  })
})

it("post detail returns early without slug", async () => {
  window.history.pushState({}, "", "/")

  document.body.innerHTML=`
    <section
      data-blog="post-detail"
      data-sitio-id="1"
    >
      <div data-blog-empty></div>
    </section>
  `

  initBlogBlocks()

  expect(globalThis.fetch)
    .not.toHaveBeenCalled()
})


it("post detail handles fetch error", async () => {
  window.history.pushState(
    {},
    "",
    "/?post=bad"
  )

  globalThis.fetch = vi.fn().mockResolvedValue({
    ok:false,
    json:()=>Promise.resolve({})
  })

  document.body.innerHTML=`
    <section
      data-blog="post-detail"
      data-sitio-id="1"
    >
      <div
        data-blog-empty
        style="display:none"
      >
        Vacío
      </div>
    </section>
  `

  initBlogBlocks()

  await vi.waitFor(()=>{
    expect(
      document.querySelector<HTMLElement>(
        "[data-blog-empty]"
      )!.style.display
    ).toBe("block")
  })
})


it("featured post opens modal on click", async () => {
  document.body.removeAttribute("data-sitio-id")

  globalThis.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve([post]),
  })

  document.body.innerHTML = `
    <section data-blog="featured-post" data-sitio-id="1">
      <div data-blog-empty></div>
      <article data-blog-item>
        <h2 data-blog-title></h2>
      </article>
    </section>
  `

  initBlogBlocks()

  await vi.waitFor(() => {
    expect(document.body.textContent).toContain("Mi primer post")
  })

  document.querySelector<HTMLElement>("[data-blog-item]")!.click()

  expect(document.getElementById("blog-post-modal")).toBeTruthy()
})

it("featured post handles fetch error", async () => {
  document.body.removeAttribute("data-sitio-id")

  vi.spyOn(console, "error").mockImplementation(() => {})

  globalThis.fetch = vi.fn().mockResolvedValue({
    ok: false,
    json: () => Promise.resolve({}),
  })

  document.body.innerHTML = `
    <section data-blog="featured-post" data-sitio-id="1">
      <div data-blog-empty style="display:none">Vacío</div>
      <article data-blog-item></article>
    </section>
  `

  initBlogBlocks()

  await vi.waitFor(() => {
    expect(
      document.querySelector<HTMLElement>("[data-blog-empty]")!.style.display
    ).toBe("block")
  })
})

it("modal closes with close button and backdrop click", async () => {
  document.body.removeAttribute("data-sitio-id")

  globalThis.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve([post]),
  })

  document.body.innerHTML = `
    <section data-blog="posts-grid" data-sitio-id="1">
      <div data-blog-list></div>
      <article data-blog-item>
        <h3 data-blog-title></h3>
      </article>
      <div data-blog-empty></div>
    </section>
  `

  initBlogBlocks()

  await vi.waitFor(() => {
    expect(document.body.textContent).toContain("Mi primer post")
  })

  document.querySelector<HTMLElement>("[data-blog-item]")!.click()

  const modal = document.getElementById("blog-post-modal") as HTMLElement
  expect(modal).toBeTruthy()

  document.querySelector<HTMLElement>("[data-blog-modal-close]")!.click()

  expect(modal.style.display).toBe("none")

  modal.style.display = "flex"
  document.body.style.overflow = "hidden"

  modal.dispatchEvent(
    new MouseEvent("click", {
      bubbles: true,
    })
  )

  expect(modal.style.display).toBe("none")
  expect(document.body.style.overflow).toBe("")
})

it("initializes list and recent posts blocks", async () => {
  globalThis.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve([post]),
  })

  document.body.innerHTML = `
    <section data-blog="posts-list" data-sitio-id="1">
      <div data-blog-list></div>
      <article data-blog-item>
        <h3 data-blog-title></h3>
      </article>
      <div data-blog-empty></div>
    </section>

    <section data-blog="recent-posts" data-sitio-id="1">
      <div data-blog-list></div>
      <article data-blog-item>
        <h3 data-blog-title></h3>
      </article>
      <div data-blog-empty></div>
    </section>
  `

  initBlogBlocks()

  await vi.waitFor(() => {
    expect(globalThis.fetch).toHaveBeenCalledTimes(2)
  })
})

it('uses null for invalid body site id', () => {
  document.body.setAttribute('data-sitio-id','abc')

  document.body.innerHTML=`
    <section data-blog="posts-grid" data-sitio-id="{{SITIO_ID}}">
      <div data-blog-list></div>
      <article data-blog-item></article>
      <div data-blog-empty style="display:none"></div>
    </section>
  `

  initBlogBlocks()

  expect(
    document.querySelector<HTMLElement>(
      '[data-blog-empty]'
    )!.style.display
  ).toBe('block')
})

it('uses direct numeric site id and numeric limit', async () => {
  globalThis.fetch = vi.fn().mockResolvedValue({
    ok:true,
    json:()=>Promise.resolve([])
  })

  document.body.innerHTML=`
    <section
      data-blog="posts-grid"
      data-sitio-id="15"
      data-limit="3"
    >
      <div data-blog-list></div>
      <article data-blog-item></article>
      <div data-blog-empty></div>
    </section>
  `

  initBlogBlocks()

  await vi.waitFor(()=>{
    expect(globalThis.fetch)
      .toHaveBeenCalled()
  })
})

it('normalizeImage keeps http urls', async () => {
  globalThis.fetch = vi.fn().mockResolvedValue({
    ok:true,
    json:()=>Promise.resolve([
      {
        ...post,
        featured_image:'https://img.com/x.png'
      }
    ])
  })

  document.body.innerHTML=`
    <section data-blog="posts-grid" data-sitio-id="1">
      <div data-blog-list></div>

      <article data-blog-item>
        <img data-blog-image />
      </article>

      <div data-blog-empty></div>
    </section>
  `

  initBlogBlocks()

  await vi.waitFor(()=>{
    expect(
      document.querySelector<HTMLImageElement>(
        '[data-blog-image]'
      )!.src
    ).toContain('https://img.com/x.png')
  })
})

it('uses meta_description when excerpt missing', async () => {
  globalThis.fetch=vi.fn().mockResolvedValue({
    ok:true,
    json:()=>Promise.resolve([
      {
        ...post,
        excerpt:'',
        meta_description:'META DESC'
      }
    ])
  })

  document.body.innerHTML=`
    <section data-blog="posts-grid" data-sitio-id="1">
      <div data-blog-list></div>

      <article data-blog-item>
        <p data-blog-excerpt></p>
      </article>

      <div data-blog-empty></div>
    </section>
  `

  initBlogBlocks()

  await vi.waitFor(()=>{
    expect(
      document.querySelector(
        '[data-blog-excerpt]'
      )?.textContent
    ).toContain('META DESC')
  })
})

it('renderPostCollection returns when list missing', async () => {
  globalThis.fetch=vi.fn().mockResolvedValue({
    ok:true,
    json:()=>Promise.resolve([post])
  })

  document.body.innerHTML=`
    <section data-blog="posts-grid" data-sitio-id="1">
      <article data-blog-item></article>
      <div data-blog-empty></div>
    </section>
  `

  initBlogBlocks()

  await vi.waitFor(()=>{
    expect(globalThis.fetch)
      .toHaveBeenCalled()
  })
})

it('post detail creates meta description tag', async () => {
  document.head.innerHTML=''

  window.history.pushState(
    {},
    '',
    '/?post=post'
  )

  globalThis.fetch=vi.fn().mockResolvedValue({
    ok:true,
    json:()=>Promise.resolve({
      ...post,
      meta_title:null,
      meta_description:'SEO DESC'
    })
  })

  document.body.innerHTML=`
    <section
      data-blog="post-detail"
      data-sitio-id="1"
    >
      <div data-blog-empty></div>
    </section>
  `

  initBlogBlocks()

  await vi.waitFor(()=>{
    expect(
      document.querySelector(
        'meta[name="description"]'
      )
    ).toBeTruthy()
  })
})


it('modal escape does nothing when hidden', () => {
  const modal=document.createElement('div')
  modal.id='blog-post-modal'
  modal.style.display='none'

  document.body.appendChild(modal)

  document.dispatchEvent(
    new KeyboardEvent('keydown',{
      key:'Escape'
    })
  )

  expect(modal.style.display)
    .toBe('none')
})


it('modal uses empty excerpt and content fallback', async () => {
  globalThis.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve([
      {
        ...post,
        excerpt: null,
        meta_description: null,
        content: '',
      },
    ]),
  })

  document.body.innerHTML = `
    <section data-blog="featured-post" data-sitio-id="1">
      <div data-blog-empty></div>

      <article data-blog-item>
        <h3 data-blog-title></h3>
      </article>
    </section>
  `

  initBlogBlocks()

  await vi.waitFor(() => {
    expect(document.body.textContent).toContain('Mi primer post')
  })

  document
    .querySelector<HTMLElement>('[data-blog-item]')!
    .click()

  await vi.waitFor(() => {
    expect(
      document.querySelector('[data-blog-modal-content]')
    ).toBeTruthy()
  })

  expect(
    document.querySelector<HTMLElement>(
      '[data-blog-modal-content]'
    )!.innerHTML
  ).toBe('')
})

it("uses content fallback when excerpt and meta_description are missing", async () => {
  globalThis.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve([
      {
        ...post,
        excerpt: null,
        meta_description: null,
        content: "<p>Texto largo del contenido</p>",
      },
    ]),
  })

  document.body.innerHTML = `
    <section data-blog="posts-grid" data-sitio-id="1">
      <div data-blog-list></div>
      <article data-blog-item>
        <p data-blog-excerpt></p>
      </article>
      <div data-blog-empty></div>
    </section>
  `

  initBlogBlocks()

  await vi.waitFor(() => {
    expect(
      document.querySelector("[data-blog-excerpt]")?.textContent
    ).toContain("Texto largo del contenido")
  })
})

it("keeps existing meta description tag in post detail", async () => {
  window.history.pushState({}, "", "/?post=mi-primer-post")

  document.head.innerHTML = `
    <meta name="description" content="old">
  `

  globalThis.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({
      ...post,
      meta_title: "",
      meta_description: "",
      excerpt: "Nueva descripcion",
    }),
  })

  document.body.innerHTML = `
    <section data-blog="post-detail" data-sitio-id="1">
      <div data-blog-empty></div>
      <h1 data-blog-title></h1>
    </section>
  `

  initBlogBlocks()

  await vi.waitFor(() => {
    expect(
      document.querySelector('meta[name="description"]')?.getAttribute("content")
    ).toBe("Nueva descripcion")
  })
})

it("reuses existing modal and fills minimal fields", async () => {
  globalThis.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve([post]),
  })

  document.body.innerHTML = `
    <div id="blog-post-modal" style="display:none">
      <h2 data-blog-modal-title></h2>
      <div data-blog-modal-content></div>
    </div>

    <section data-blog="featured-post" data-sitio-id="1">
      <article data-blog-item>
        <h3 data-blog-title></h3>
      </article>
    </section>
  `

  initBlogBlocks()

  await vi.waitFor(() => {
    expect(document.body.textContent).toContain("Mi primer post")
  })

  document.querySelector<HTMLElement>("[data-blog-item]")!.click()

  expect(
    document.querySelector("[data-blog-modal-title]")?.textContent
  ).toBe("Mi primer post")

  expect(
    document.querySelector<HTMLElement>("#blog-post-modal")!.style.display
  ).toBe("flex")
})

it("shows empty when direct site id is invalid", () => {
  document.body.removeAttribute("data-sitio-id")

  document.body.innerHTML = `
    <section data-blog="posts-grid" data-sitio-id="abc">
      <div data-blog-list></div>
      <article data-blog-item></article>
      <div data-blog-empty style="display:none"></div>
    </section>
  `

  initBlogBlocks()

  expect(
    document.querySelector<HTMLElement>("[data-blog-empty]")!.style.display
  ).toBe("block")
})

it("uses recent date fallback when date is null", async () => {
  globalThis.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve([
      {
        ...post,
        published_at: null,
        created_at: null,
      },
    ]),
  })

  document.body.innerHTML = `
    <section data-blog="posts-grid" data-sitio-id="1">
      <div data-blog-list></div>
      <article data-blog-item>
        <span data-blog-date></span>
      </article>
      <div data-blog-empty></div>
    </section>
  `

  initBlogBlocks()

  await vi.waitFor(() => {
    expect(
      document.querySelector("[data-blog-date]")?.textContent
    ).toBe("Publicado recientemente")
  })
})

it("search hides item when query does not match", () => {
  document.body.innerHTML = `
    <section data-blog="search">
      <form data-blog-search-form>
        <input data-blog-search-input value="zzzzz" />
      </form>
    </section>

    <section data-blog="posts-grid">
      <article data-blog-item>
        <h3 data-blog-title>Mi primer post</h3>
        <p data-blog-excerpt>Resumen corto</p>
      </article>
    </section>
  `

  initBlogBlocks()

  document
    .querySelector<HTMLFormElement>("[data-blog-search-form]")!
    .dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }))

  expect(
    document.querySelector<HTMLElement>("[data-blog-item]")!.style.display
  ).toBe("none")
})

it("featured post uses container itself when data-blog-item is missing", async () => {
  globalThis.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve([post]),
  })

  document.body.innerHTML = `
    <section data-blog="featured-post" data-sitio-id="1">
      <h2 data-blog-title></h2>
    </section>
  `

  initBlogBlocks()

  await vi.waitFor(() => {
    expect(document.body.textContent).toContain("Mi primer post")
  })
})

it("search shows all items when query is empty", () => {
  document.body.innerHTML = `
    <section data-blog="search">
      <form data-blog-search-form>
        <input data-blog-search-input value="   " />
      </form>
    </section>

    <section data-blog="posts-grid">
      <article data-blog-item style="display:none">
        <h3 data-blog-title>Mi primer post</h3>
        <p data-blog-excerpt>Resumen corto</p>
      </article>
    </section>
  `

  initBlogBlocks()

  document
    .querySelector<HTMLFormElement>("[data-blog-search-form]")!
    .dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }))

  expect(
    document.querySelector<HTMLElement>("[data-blog-item]")!.style.display
  ).toBe("")
})

it("modal fills only title when optional modal fields are missing", async () => {
  globalThis.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve([post]),
  })

  document.body.innerHTML = `
    <div id="blog-post-modal" style="display:none">
      <h2 data-blog-modal-title></h2>
    </div>

    <section data-blog="featured-post" data-sitio-id="1">
      <article data-blog-item>
        <h3 data-blog-title></h3>
      </article>
    </section>
  `

  initBlogBlocks()

  await vi.waitFor(() => {
    expect(document.body.textContent).toContain("Mi primer post")
  })

  document.querySelector<HTMLElement>("[data-blog-item]")!.click()

  expect(
    document.querySelector("[data-blog-modal-title]")?.textContent
  ).toBe("Mi primer post")
})

it("search matches using excerpt text", () => {
  document.body.innerHTML = `
    <section data-blog="search">
      <form data-blog-search-form>
        <input
          data-blog-search-input
          value="especial"
        />
      </form>
    </section>

    <section data-blog="posts-grid">
      <article
        data-blog-item
        style="display:none"
      >
        <h3 data-blog-title>
          Otro titulo
        </h3>

        <p data-blog-excerpt>
          Texto especial aqui
        </p>
      </article>
    </section>
  `

  initBlogBlocks()

  document
    .querySelector<HTMLFormElement>(
      "[data-blog-search-form]"
    )!
    .dispatchEvent(
      new Event("submit", {
        bubbles:true,
        cancelable:true
      })
    )

  expect(
    document.querySelector<HTMLElement>(
      "[data-blog-item]"
    )!.style.display
  ).toBe("")
})
it("modal fills date field", async () => {
  globalThis.fetch = vi.fn().mockResolvedValue({
    ok:true,
    json:()=>Promise.resolve([
      {
        ...post,
        published_at:"2025-01-01"
      }
    ])
  })

  document.body.innerHTML = `
    <div id="blog-post-modal">
      <span data-blog-modal-date></span>
    </div>

    <section
      data-blog="featured-post"
      data-sitio-id="1"
    >
      <article data-blog-item>
        <h3 data-blog-title></h3>
      </article>
    </section>
  `

  initBlogBlocks()

  await vi.waitFor(()=>{
    expect(
      document.body.textContent
    ).toContain("Mi primer post")
  })

  document
    .querySelector<HTMLElement>(
      "[data-blog-item]"
    )!
    .click()

  expect(
    document.querySelector(
      "[data-blog-modal-date]"
    )?.textContent
  ).toBeTruthy()
})

it("modal formats date when modal date element exists", async () => {
  globalThis.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve([post]),
  })

  document.body.innerHTML = `
    <section data-blog="featured-post" data-sitio-id="1">
      <article data-blog-item>
        <h3 data-blog-title></h3>
      </article>
    </section>
  `

  initBlogBlocks()

  await vi.waitFor(() => {
    expect(document.body.textContent).toContain("Mi primer post")
  })

  document.querySelector<HTMLElement>("[data-blog-item]")!.click()

  await vi.waitFor(() => {
    expect(
      document.querySelector<HTMLElement>("[data-blog-modal-date]")!.textContent
    ).not.toBe("")
  })
})

 it("search block returns when form is missing", () => {
  document.body.innerHTML = `
    <section data-blog="search">
      <input data-blog-search-input value="test" />
    </section>
  `

  expect(() => initBlogBlocks()).not.toThrow()
})
it("search block returns when input is missing", () => {
  document.body.innerHTML = `
    <section data-blog="search">
      <form data-blog-search-form></form>
    </section>
  `

  expect(() => initBlogBlocks()).not.toThrow()
})

it("search handles items without title and excerpt", () => {
  document.body.innerHTML = `
    <section data-blog="search">
      <form data-blog-search-form>
        <input data-blog-search-input value="algo" />
      </form>
    </section>

    <section data-blog="posts-grid">
      <article data-blog-item></article>
    </section>
  `

  initBlogBlocks()

  document
    .querySelector<HTMLFormElement>("[data-blog-search-form]")!
    .dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }))

  expect(
    document.querySelector<HTMLElement>("[data-blog-item]")!.style.display
  ).toBe("none")
})

it("post detail works without empty element", async () => {
  window.history.pushState({}, "", "/?post=mi-primer-post")

  globalThis.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(post),
  })

  document.body.innerHTML = `
    <section data-blog="post-detail" data-sitio-id="1">
      <h1 data-blog-title></h1>
    </section>
  `

  initBlogBlocks()

  await vi.waitFor(() => {
    expect(document.body.textContent).toContain("Mi primer post")
  })
})
it("modal opens without date element", async () => {
  document.body.innerHTML = `
    <div id="blog-post-modal" style="display:none">
      <h2 data-blog-modal-title></h2>
    </div>

    <section data-blog="featured-post" data-sitio-id="1">
      <article data-blog-item>
        <h3 data-blog-title></h3>
      </article>
    </section>
  `

  globalThis.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve([post]),
  })

  initBlogBlocks()

  await vi.waitFor(() => {
    expect(document.body.textContent).toContain("Mi primer post")
  })

  document.querySelector<HTMLElement>("[data-blog-item]")!.click()

  expect(
    document.querySelector<HTMLElement>("#blog-post-modal")!.style.display
  ).toBe("flex")
})

it("modal uses created_at when published_at is null", async () => {
  globalThis.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () =>
      Promise.resolve([
        {
          ...post,
          published_at: null,
          created_at: "2025-01-01T00:00:00Z",
        },
      ]),
  })

  document.body.innerHTML = `
    <section data-blog="featured-post" data-sitio-id="1">
      <article data-blog-item>
        <h3 data-blog-title></h3>
      </article>
    </section>
  `

  initBlogBlocks()

  await vi.waitFor(() => {
    expect(document.body.textContent).toContain("Mi primer post")
  })

  document
    .querySelector<HTMLElement>("[data-blog-item]")!
    .click()

  await vi.waitFor(() => {
    expect(
      document.querySelector<HTMLElement>("[data-blog-modal-date]")!
        .textContent
    ).not.toBe("")
  })
})
});