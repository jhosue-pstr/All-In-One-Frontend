type BlogPost = {
  id: number;
  site_id: number;
  category_id: number | null;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  featured_image: string | null;
  status: "draft" | "published" | "scheduled" | "archived";
  published_at: string | null;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
};

const API_BASE = "/api";

function getSiteId(element: Element): number | null {
  const value = (element as HTMLElement).dataset.sitioId;

  if (!value || value === "{{SITIO_ID}}") {
    const bodySiteId = document.body.dataset.sitioId;
    if (!bodySiteId) return null;

    const parsedBodyId = Number(bodySiteId);
    return Number.isNaN(parsedBodyId) ? null : parsedBodyId;
  }

  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

function getLimit(element: Element, fallback: number): number {
  const value = (element as HTMLElement).dataset.limit;
  if (!value) return fallback;

  const parsed = Number(value);
  return Number.isNaN(parsed) ? fallback : parsed;
}

function formatDate(value: string | null): string {
  if (!value) return "Publicado recientemente";

  try {
    return new Intl.DateTimeFormat("es-PE", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return "Publicado recientemente";
  }
}

function normalizeImage(url: string | null): string {
  if (!url) {
    return "https://placehold.co/700x420/e2e8f0/334155?text=Blog";
  }

  if (url.startsWith("http")) return url;

  return url;
}

function getPostUrl(post: BlogPost): string {
  const currentPath = globalThis.location.pathname.replace(/\/$/, "");
  return `${currentPath}?post=${encodeURIComponent(post.slug)}`;
}

async function fetchPosts(siteId: number): Promise<BlogPost[]> {
  const response = await fetch(
    `${API_BASE}/modules/blog/${siteId}/posts?only_published=true`
  );

  if (!response.ok) {
    throw new Error("No se pudieron cargar los posts del blog");
  }

  return response.json();
}

async function fetchPostBySlug(siteId: number, slug: string): Promise<BlogPost> {
  const response = await fetch(
    `${API_BASE}/modules/blog/${siteId}/posts/${encodeURIComponent(slug)}`
  );

  if (!response.ok) {
    throw new Error("No se pudo cargar el post");
  }

  return response.json();
}

function showEmpty(container: Element): void {
  const list = container.querySelector<HTMLElement>("[data-blog-list]");
  const item = container.querySelector<HTMLElement>("[data-blog-item]");
  const empty = container.querySelector<HTMLElement>("[data-blog-empty]");

  if (list) list.innerHTML = "";
  if (item) item.style.display = "none";
  if (empty) empty.style.display = "block";
}
function stripHtml(html: string): string {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent || "";
}
function fillPostItem(item: HTMLElement, post: BlogPost): void {
  const image = item.querySelector<HTMLImageElement>("[data-blog-image]");
  const title = item.querySelector<HTMLElement>("[data-blog-title]");
  const excerpt = item.querySelector<HTMLElement>("[data-blog-excerpt]");
  const content = item.querySelector<HTMLElement>("[data-blog-content]");
  const date = item.querySelector<HTMLElement>("[data-blog-date]");
  const link = item.querySelector<HTMLAnchorElement>("[data-blog-link]");
  const category = item.querySelector<HTMLElement>("[data-blog-category]");

  if (image) {
    image.src = normalizeImage(post.featured_image);
    image.alt = post.title;
  }

  if (title) title.textContent = post.title;

  if (excerpt) {
    excerpt.textContent =
      post.excerpt ||
      post.meta_description ||
      `${stripHtml(post.content).slice(0, 150)}...`
  }

  if (content) {
    content.innerHTML = post.content;
  }

  if (date) {
    date.textContent = formatDate(post.published_at || post.created_at);
  }

  if (link) {
    link.href = getPostUrl(post);
  }

  if (category) {
    category.textContent = "Blog";
  }
}

function renderPostCollection(container: Element, posts: BlogPost[]): void {
  const list = container.querySelector<HTMLElement>("[data-blog-list]");
  const template = container.querySelector<HTMLElement>("[data-blog-item]");
  const empty = container.querySelector<HTMLElement>("[data-blog-empty]");

  if (!list || !template) return;

  if (!posts.length) {
    showEmpty(container);
    return;
  }

  if (empty) empty.style.display = "none";

  const clonedTemplate = template.cloneNode(true) as HTMLElement;
  list.innerHTML = "";

    posts.forEach((post) => {
    const item = clonedTemplate.cloneNode(true) as HTMLElement;
    item.style.display = "";
    item.style.cursor = "pointer";

    fillPostItem(item, post);

    item.addEventListener("click", (event) => {
        event.preventDefault();
        openBlogModal(post);
    });

    list.appendChild(item);
    });
}

async function initPostsBlock(container: Element, fallbackLimit: number): Promise<void> {
  const siteId = getSiteId(container);
  if (!siteId) {
    showEmpty(container);
    return;
  }

  try {
    const limit = getLimit(container, fallbackLimit);
    const posts = await fetchPosts(siteId);
    renderPostCollection(container, posts.slice(0, limit));
  } catch (error) {
    console.error("[Blog Widget]", error);
    showEmpty(container);
  }
}

async function initFeaturedPost(container: Element): Promise<void> {
  const siteId = getSiteId(container);
  if (!siteId) {
    showEmpty(container);
    return;
  }

  try {
    const posts = await fetchPosts(siteId);
    const post = posts[0];

    if (!post) {
      showEmpty(container);
      return;
    }

    const item = container.querySelector<HTMLElement>("[data-blog-item]") || container as HTMLElement;
    fillPostItem(item, post);

    item.style.cursor = "pointer";
    item.addEventListener("click", (event) => {
    event.preventDefault();
    openBlogModal(post);
    });

    const empty = container.querySelector<HTMLElement>("[data-blog-empty]");
    if (empty) empty.style.display = "none";
  } catch (error) {
    console.error("[Blog Widget]", error);
    showEmpty(container);
  }
}

async function initPostDetail(container: Element): Promise<void> {
  const siteId = getSiteId(container);
  const params = new URLSearchParams(globalThis.location.search);
  const slug = params.get("post");

  if (!siteId || !slug) {
    return;
  }

  try {
    const post = await fetchPostBySlug(siteId, slug);
    fillPostItem(container as HTMLElement, post);

    if (post.meta_title) {
      document.title = post.meta_title;
    }

    const description = post.meta_description || post.excerpt;
    if (description) {
      let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');

      if (!meta) {
        meta = document.createElement("meta");
        meta.name = "description";
        document.head.appendChild(meta);
      }

      meta.content = description;
    }

    const empty = container.querySelector<HTMLElement>("[data-blog-empty]");
    if (empty) empty.style.display = "none";
  } catch (error) {
    console.error("[Blog Widget]", error);
    showEmpty(container);
  }
}

function initSearchBlock(container: Element): void {
  const form = container.querySelector<HTMLFormElement>("[data-blog-search-form]");
  const input = container.querySelector<HTMLInputElement>("[data-blog-search-input]");

  if (!form || !input) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const query = input.value.trim().toLowerCase();

    const allPostBlocks = document.querySelectorAll<HTMLElement>(
      '[data-blog="posts-grid"], [data-blog="posts-list"], [data-blog="recent-posts"]'
    );

    allPostBlocks.forEach((block) => {
      const items = block.querySelectorAll<HTMLElement>("[data-blog-item]");

      items.forEach((item) => {
        const title = item.querySelector("[data-blog-title]")?.textContent?.toLowerCase() || "";
        const excerpt = item.querySelector("[data-blog-excerpt]")?.textContent?.toLowerCase() || "";

        const matches = !query || title.includes(query) || excerpt.includes(query);
        item.style.display = matches ? "" : "none";
      });
    });
  });
}

function createBlogModal(): HTMLElement {
  let modal = document.getElementById("blog-post-modal");

  if (modal) return modal;

  modal = document.createElement("div");
  modal.id = "blog-post-modal";
  modal.style.cssText = `
    position: fixed;
    inset: 0;
    z-index: 99999;
    background: rgba(15, 23, 42, 0.78);
    display: none;
    align-items: center;
    justify-content: center;
    padding: 24px;
  `;

  modal.innerHTML = `
    <div data-blog-modal-card style="
      width: min(960px, 100%);
      max-height: 90vh;
      overflow: auto;
      background: white;
      border-radius: 22px;
      box-shadow: 0 25px 80px rgba(0,0,0,.35);
      position: relative;
    ">
      <button data-blog-modal-close style="
        position:absolute;
        top:14px;
        right:14px;
        width:42px;
        height:42px;
        border:none;
        border-radius:999px;
        background:rgba(15,23,42,.85);
        color:white;
        font-size:26px;
        cursor:pointer;
        z-index:2;
      ">×</button>

      <img data-blog-modal-image src="" alt="" style="
        width:100%;
        height:420px;
        object-fit:cover;
        display:block;
      ">

      <div style="padding:30px;">
        <span data-blog-modal-category style="
          display:inline-block;
          color:#2563eb;
          font-size:14px;
          font-weight:800;
          margin-bottom:12px;
        ">Blog</span>

        <h2 data-blog-modal-title style="
          margin:0 0 10px;
          color:#0f172a;
          font-size:36px;
          line-height:1.15;
        "></h2>

        <p data-blog-modal-date style="
          margin:0 0 20px;
          color:#64748b;
          font-size:14px;
        "></p>

        <p data-blog-modal-excerpt style="
          margin:0 0 24px;
          color:#475569;
          font-size:17px;
          line-height:1.7;
          font-weight:600;
        "></p>

        <div data-blog-modal-content style="
          color:#334155;
          font-size:17px;
          line-height:1.8;
        "></div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const closeButton = modal.querySelector("[data-blog-modal-close]");
  closeButton?.addEventListener("click", () => {
    modal.style.display = "none";
    document.body.style.overflow = "";
  });

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
      document.body.style.overflow = "";
    }
  });

  document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && modal.style.display !== "none") {
        modal.style.display = "none";
      document.body.style.overflow = "";
    }
  });

  return modal;
}

function openBlogModal(post: BlogPost): void {
  const modal = createBlogModal();

  const image = modal.querySelector<HTMLImageElement>("[data-blog-modal-image]");
  const title = modal.querySelector<HTMLElement>("[data-blog-modal-title]");
  const date = modal.querySelector<HTMLElement>("[data-blog-modal-date]");
  const excerpt = modal.querySelector<HTMLElement>("[data-blog-modal-excerpt]");
  const content = modal.querySelector<HTMLElement>("[data-blog-modal-content]");

  if (image) {
    image.src = normalizeImage(post.featured_image);
    image.alt = post.title;
  }

  if (title) title.textContent = post.title;
  if (date) date.textContent = formatDate(post.published_at || post.created_at);

  if (excerpt) {
    excerpt.textContent =
      post.excerpt ||
      post.meta_description ||
      "";
  }

  if (content) {
    content.innerHTML = post.content || "";
  }

  modal.style.display = "flex";
  document.body.style.overflow = "hidden";
}

export function initBlogBlocks(): void {
  const gridBlocks = document.querySelectorAll('[data-blog="posts-grid"]');
  gridBlocks.forEach((block) => {
    initPostsBlock(block, 6);
  });

  const listBlocks = document.querySelectorAll('[data-blog="posts-list"]');
  listBlocks.forEach((block) => {
    initPostsBlock(block, 8);
  });

  const recentBlocks = document.querySelectorAll('[data-blog="recent-posts"]');
  recentBlocks.forEach((block) => {
    initPostsBlock(block, 5);
  });

  const featuredBlocks = document.querySelectorAll('[data-blog="featured-post"]');
  featuredBlocks.forEach((block) => {
    initFeaturedPost(block);
  });

  const detailBlocks = document.querySelectorAll('[data-blog="post-detail"]');
  detailBlocks.forEach((block) => {
    initPostDetail(block);
  });

  const searchBlocks = document.querySelectorAll('[data-blog="search"]');
  searchBlocks.forEach((block) => {
    initSearchBlock(block);
  });
}