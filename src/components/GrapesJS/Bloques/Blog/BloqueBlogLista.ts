export const BloqueBlogLista = {
  id: "blog-lista-dinamica",
  label: "Blog Lista",
  category: "Blog",
  attributes: { class: "fa fa-list" },
  content: `<section data-blog="posts-list" data-sitio-id="{{SITIO_ID}}" data-limit="8" style="padding:45px 20px;background:white;border-radius:16px;">
  <div style="max-width:900px;margin:0 auto;">
    <h2 style="font-size:32px;margin:0 0 25px 0;color:#111827;">Últimas publicaciones</h2>

    <div data-blog-list style="display:flex;flex-direction:column;gap:18px;">
      <article data-blog-item style="display:flex;gap:20px;padding:18px;border:1px solid #e5e7eb;border-radius:14px;background:#fff;">
        <img data-blog-image src="https://placehold.co/300x200/e5e7eb/374151?text=Blog" alt="Post" style="width:180px;height:120px;object-fit:cover;border-radius:10px;">
        <div style="flex:1;">
          <span data-blog-date style="font-size:13px;color:#6b7280;">25 mayo 2026</span>
          <h3 data-blog-title style="font-size:22px;margin:6px 0;color:#111827;">Título de publicación</h3>
          <p data-blog-excerpt style="font-size:15px;color:#4b5563;line-height:1.5;margin:0 0 12px 0;">Resumen breve de la publicación para explicar el contenido del artículo.</p>
          <a data-blog-link href="#" style="font-size:14px;color:#2563eb;font-weight:700;text-decoration:none;">Leer publicación →</a>
        </div>
      </article>

      <article data-blog-item style="display:flex;gap:20px;padding:18px;border:1px solid #e5e7eb;border-radius:14px;background:#fff;">
        <img data-blog-image src="https://placehold.co/300x200/dbeafe/1d4ed8?text=Post" alt="Post" style="width:180px;height:120px;object-fit:cover;border-radius:10px;">
        <div style="flex:1;">
          <span data-blog-date style="font-size:13px;color:#6b7280;">Publicado recientemente</span>
          <h3 data-blog-title style="font-size:22px;margin:6px 0;color:#111827;">Otra publicación</h3>
          <p data-blog-excerpt style="font-size:15px;color:#4b5563;line-height:1.5;margin:0 0 12px 0;">Este bloque sirve para mostrar artículos en formato de lista vertical.</p>
          <a data-blog-link href="#" style="font-size:14px;color:#2563eb;font-weight:700;text-decoration:none;">Leer publicación →</a>
        </div>
      </article>
    </div>

    <div data-blog-empty style="display:none;text-align:center;padding:25px;color:#6b7280;">
      No hay publicaciones disponibles.
    </div>
  </div>
</section>`,
};