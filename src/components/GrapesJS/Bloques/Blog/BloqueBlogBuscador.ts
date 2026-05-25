export const BloqueBlogBuscador = {
  id: "blog-buscador",
  label: "Buscador Blog",
  category: "Blog",
  attributes: { class: "fa fa-magnifying-glass" },
  content: `<section data-blog="search" data-sitio-id="{{SITIO_ID}}" style="padding:28px;background:white;border:1px solid #e5e7eb;border-radius:16px;">
  <h3 style="font-size:24px;margin:0 0 16px 0;color:#111827;">Buscar en el blog</h3>

  <form data-blog-search-form style="display:flex;gap:10px;">
    <input data-blog-search-input type="search" placeholder="Buscar artículos..." style="flex:1;padding:13px 14px;border:1px solid #d1d5db;border-radius:10px;font-size:15px;outline:none;">
    <button type="submit" style="padding:13px 20px;background:#2563eb;color:white;border:none;border-radius:10px;font-weight:700;cursor:pointer;">Buscar</button>
  </form>

  <p data-blog-search-help style="font-size:13px;color:#6b7280;margin:12px 0 0 0;">Escribe una palabra clave para filtrar publicaciones.</p>
</section>`,
};