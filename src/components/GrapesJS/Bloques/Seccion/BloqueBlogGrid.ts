export const BloqueBlogGrid = {
  id: "seccion-blog-grid",
  label: "Blog Grid",
  category: "Seccion",
  attributes: { class: "fa fa-newspaper-o" },
  content: `<section style="padding:60px 20px;">
  <h2 style="text-align:center;margin:0 0 40px 0;font-size:32px;">&Uacute;ltimas Noticias</h2>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:25px;max-width:900px;margin:0 auto;">
    <article style="border-radius:12px;overflow:hidden;box-shadow:0 4px 15px rgba(0,0,0,0.08);">
      <img src="https://placehold.co/300x200/667eea/ffffff?text=Post+1" style="width:100%;height:180px;object-fit:cover;">
      <div style="padding:20px;">
        <h3 style="margin:0 0 10px 0;font-size:18px;">T&iacute;tulo del Art&iacute;culo</h3>
        <p style="margin:0 0 15px 0;color:#666;font-size:14px;">Resumen del art&iacute;culo...</p>
        <a href="#" style="color:#667eea;text-decoration:none;font-size:14px;">Leer m&aacute;s &rarr;</a>
      </div>
    </article>
    <article style="border-radius:12px;overflow:hidden;box-shadow:0 4px 15px rgba(0,0,0,0.08);">
      <img src="https://placehold.co/300x200/764ba2/ffffff?text=Post+2" style="width:100%;height:180px;object-fit:cover;">
      <div style="padding:20px;">
        <h3 style="margin:0 0 10px 0;font-size:18px;">Otro Art&iacute;culo</h3>
        <p style="margin:0 0 15px 0;color:#666;font-size:14px;">Resumen del art&iacute;culo...</p>
        <a href="#" style="color:#667eea;text-decoration:none;font-size:14px;">Leer m&aacute;s &rarr;</a>
      </div>
    </article>
    <article style="border-radius:12px;overflow:hidden;box-shadow:0 4px 15px rgba(0,0,0,0.08);">
      <img src="https://placehold.co/300x200/00b894/ffffff?text=Post+3" style="width:100%;height:180px;object-fit:cover;">
      <div style="padding:20px;">
        <h3 style="margin:0 0 10px 0;font-size:18px;">Tercer Art&iacute;culo</h3>
        <p style="margin:0 0 15px 0;color:#666;font-size:14px;">Resumen del art&iacute;culo...</p>
        <a href="#" style="color:#667eea;text-decoration:none;font-size:14px;">Leer m&aacute;s &rarr;</a>
      </div>
    </article>
  </div>
</section>`,
};