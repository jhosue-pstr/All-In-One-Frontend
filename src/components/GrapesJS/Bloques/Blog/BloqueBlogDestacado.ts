export const BloqueBlogDestacado = {
  id: "blog-post-destacado",
  label: "Post Destacado",
  category: "Blog",
  attributes: { class: "fa fa-star" },
  content: `<section data-blog="featured-post" data-sitio-id="{{SITIO_ID}}" style="padding:50px 20px;background:#0f172a;color:white;border-radius:18px;">
  <div data-blog-item style="max-width:1100px;margin:0 auto;display:grid;grid-template-columns:1.1fr .9fr;gap:35px;align-items:center;">
    <div>
      <span data-blog-category style="display:inline-block;padding:7px 14px;background:#2563eb;border-radius:999px;font-size:13px;font-weight:700;margin-bottom:18px;">Destacado</span>
      <h2 data-blog-title style="font-size:42px;line-height:1.1;margin:0 0 16px 0;">Artículo destacado del blog</h2>
      <p data-blog-excerpt style="font-size:17px;line-height:1.7;color:#cbd5e1;margin:0 0 24px 0;">
        Este bloque muestra una publicación principal del blog, ideal para destacar el contenido más importante.
      </p>
      <a data-blog-link href="#" style="display:inline-block;padding:13px 22px;background:white;color:#0f172a;border-radius:10px;text-decoration:none;font-weight:700;">Leer artículo</a>
    </div>
    <img data-blog-image src="https://placehold.co/800x520/334155/ffffff?text=Post+Destacado" alt="Post destacado" style="width:100%;height:360px;object-fit:cover;border-radius:16px;">
  </div>

  <div data-blog-empty style="display:none;text-align:center;padding:30px;color:#cbd5e1;">
    No hay artículo destacado disponible.
  </div>
</section>`,
};