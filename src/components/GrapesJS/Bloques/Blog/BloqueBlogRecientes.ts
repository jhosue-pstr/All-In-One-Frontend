export const BloqueBlogRecientes = {
  id: "blog-posts-recientes",
  label: "Posts Recientes",
  category: "Blog",
  attributes: { class: "fa fa-clock" },
  content: `<aside data-blog="recent-posts" data-sitio-id="{{SITIO_ID}}" data-limit="5" style="padding:28px;background:#fff;border:1px solid #e5e7eb;border-radius:16px;">
  <h3 style="font-size:24px;margin:0 0 18px 0;color:#111827;">Posts recientes</h3>

  <div data-blog-list style="display:flex;flex-direction:column;gap:14px;">
    <a data-blog-item data-blog-link href="#" style="display:block;text-decoration:none;padding-bottom:14px;border-bottom:1px solid #e5e7eb;">
      <h4 data-blog-title style="font-size:16px;color:#111827;margin:0 0 6px 0;">Título del post reciente</h4>
      <span data-blog-date style="font-size:13px;color:#6b7280;">Publicado recientemente</span>
    </a>

    <a data-blog-item data-blog-link href="#" style="display:block;text-decoration:none;padding-bottom:14px;border-bottom:1px solid #e5e7eb;">
      <h4 data-blog-title style="font-size:16px;color:#111827;margin:0 0 6px 0;">Otro artículo reciente</h4>
      <span data-blog-date style="font-size:13px;color:#6b7280;">Hace unos días</span>
    </a>
  </div>

  <div data-blog-empty style="display:none;color:#6b7280;font-size:14px;">
    No hay posts recientes.
  </div>
</aside>`,
};