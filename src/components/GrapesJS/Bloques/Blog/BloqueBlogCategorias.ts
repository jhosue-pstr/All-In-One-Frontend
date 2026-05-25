export const BloqueBlogCategorias = {
  id: "blog-categorias",
  label: "Categorías Blog",
  category: "Blog",
  attributes: { class: "fa fa-tags" },
  content: `<aside data-blog="categories" data-sitio-id="{{SITIO_ID}}" style="padding:28px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:16px;">
  <h3 style="font-size:24px;margin:0 0 18px 0;color:#0f172a;">Categorías</h3>

  <div data-blog-categories-list style="display:flex;flex-wrap:wrap;gap:10px;">
    <a data-blog-category-item href="#" style="display:inline-block;padding:9px 14px;background:white;color:#334155;border:1px solid #cbd5e1;border-radius:999px;text-decoration:none;font-size:14px;font-weight:600;">Noticias</a>
    <a data-blog-category-item href="#" style="display:inline-block;padding:9px 14px;background:white;color:#334155;border:1px solid #cbd5e1;border-radius:999px;text-decoration:none;font-size:14px;font-weight:600;">Tutoriales</a>
    <a data-blog-category-item href="#" style="display:inline-block;padding:9px 14px;background:white;color:#334155;border:1px solid #cbd5e1;border-radius:999px;text-decoration:none;font-size:14px;font-weight:600;">Eventos</a>
  </div>

  <div data-blog-empty style="display:none;color:#64748b;font-size:14px;">
    No hay categorías disponibles.
  </div>
</aside>`,
};