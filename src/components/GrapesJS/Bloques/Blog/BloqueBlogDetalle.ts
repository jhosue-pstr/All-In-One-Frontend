export const BloqueBlogDetalle = {
  id: "blog-detalle-post",
  label: "Detalle Post",
  category: "Blog",
  attributes: { class: "fa fa-file-lines" },
  content: `<article data-blog="post-detail" data-sitio-id="{{SITIO_ID}}" style="max-width:900px;margin:0 auto;padding:45px 24px;background:white;border-radius:16px;">
  <header style="margin-bottom:28px;text-align:center;">
    <span data-blog-category style="display:inline-block;color:#2563eb;font-size:14px;font-weight:700;margin-bottom:12px;">Categoría</span>
    <h1 data-blog-title style="font-size:44px;line-height:1.1;margin:0 0 14px 0;color:#111827;">Título completo del artículo</h1>
    <p data-blog-date style="font-size:14px;color:#6b7280;margin:0;">Publicado recientemente</p>
  </header>

  <img data-blog-image src="https://placehold.co/1000x520/e5e7eb/374151?text=Imagen+del+Articulo" alt="Imagen del artículo" style="width:100%;height:420px;object-fit:cover;border-radius:16px;margin-bottom:30px;">

  <div data-blog-content style="font-size:18px;line-height:1.8;color:#374151;">
    <p>Este es el contenido del artículo. Cuando el sitio esté publicado, este bloque podrá ser reemplazado por el contenido real del post seleccionado.</p>
    <p>Usa este bloque para páginas de detalle, donde se muestra un artículo completo del blog.</p>
  </div>

  <div data-blog-empty style="display:none;text-align:center;padding:30px;color:#6b7280;">
    No se encontró el artículo solicitado.
  </div>
</article>`,
};