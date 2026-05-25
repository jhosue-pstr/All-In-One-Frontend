export const BloqueBlogGrid = {
  id: "blog-grid-dinamico",
  label: "Blog Grid",
  category: "Blog",
  attributes: { class: "fa fa-table-cells-large" },
  content: `<section data-blog="posts-grid" data-sitio-id="{{SITIO_ID}}" data-limit="6" style="padding:50px 20px;background:#f8fafc;border-radius:16px;">
  <div style="max-width:1100px;margin:0 auto;">
    <div style="text-align:center;margin-bottom:35px;">
      <h2 style="font-size:34px;margin:0 0 10px 0;color:#0f172a;">Artículos recientes</h2>
      <p style="font-size:16px;color:#64748b;margin:0;">Contenido actualizado desde el blog del sitio.</p>
    </div>

    <div data-blog-list style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:24px;">
      <article data-blog-item style="background:white;border-radius:14px;overflow:hidden;box-shadow:0 10px 25px rgba(15,23,42,.08);">
        <img data-blog-image src="https://placehold.co/700x420/e2e8f0/334155?text=Blog" alt="Imagen del post" style="width:100%;height:190px;object-fit:cover;">
        <div style="padding:22px;">
          <span data-blog-category style="display:inline-block;font-size:12px;color:#2563eb;font-weight:700;margin-bottom:10px;">Categoría</span>
          <h3 data-blog-title style="font-size:22px;margin:0 0 10px 0;color:#0f172a;">Título del artículo</h3>
          <p data-blog-excerpt style="font-size:15px;color:#64748b;line-height:1.6;margin:0 0 18px 0;">Resumen breve del artículo para mostrar una vista previa del contenido.</p>
          <a data-blog-link href="#" style="color:#2563eb;font-weight:700;text-decoration:none;">Leer más →</a>
        </div>
      </article>

      <article data-blog-item style="background:white;border-radius:14px;overflow:hidden;box-shadow:0 10px 25px rgba(15,23,42,.08);">
        <img data-blog-image src="https://placehold.co/700x420/dbeafe/1e40af?text=Post" alt="Imagen del post" style="width:100%;height:190px;object-fit:cover;">
        <div style="padding:22px;">
          <span data-blog-category style="display:inline-block;font-size:12px;color:#2563eb;font-weight:700;margin-bottom:10px;">Noticias</span>
          <h3 data-blog-title style="font-size:22px;margin:0 0 10px 0;color:#0f172a;">Segundo artículo</h3>
          <p data-blog-excerpt style="font-size:15px;color:#64748b;line-height:1.6;margin:0 0 18px 0;">Este es un ejemplo visual que luego será reemplazado por datos reales.</p>
          <a data-blog-link href="#" style="color:#2563eb;font-weight:700;text-decoration:none;">Leer más →</a>
        </div>
      </article>

      <article data-blog-item style="background:white;border-radius:14px;overflow:hidden;box-shadow:0 10px 25px rgba(15,23,42,.08);">
        <img data-blog-image src="https://placehold.co/700x420/fef3c7/92400e?text=Articulo" alt="Imagen del post" style="width:100%;height:190px;object-fit:cover;">
        <div style="padding:22px;">
          <span data-blog-category style="display:inline-block;font-size:12px;color:#2563eb;font-weight:700;margin-bottom:10px;">Actualidad</span>
          <h3 data-blog-title style="font-size:22px;margin:0 0 10px 0;color:#0f172a;">Tercer artículo</h3>
          <p data-blog-excerpt style="font-size:15px;color:#64748b;line-height:1.6;margin:0 0 18px 0;">Vista previa para representar cómo se verán los posts publicados.</p>
          <a data-blog-link href="#" style="color:#2563eb;font-weight:700;text-decoration:none;">Leer más →</a>
        </div>
      </article>
    </div>

    <div data-blog-empty style="display:none;text-align:center;padding:30px;color:#64748b;">
      No hay artículos publicados todavía.
    </div>
  </div>
</section>`,
};