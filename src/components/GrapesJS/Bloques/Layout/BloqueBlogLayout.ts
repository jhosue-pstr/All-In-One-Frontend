export const BloqueBlogLayout = {
  id: "layout-blog",
  label: "Blog Layout",
  category: "Layout",
  attributes: { class: "fa fa-blog" },
  content: `<div style="display:flex;padding:20px;gap:30px;">
  <main style="flex:2;display:flex;flex-direction:column;gap:20px;">
    <article style="padding:20px;background:#f8f9fa;border-radius:8px;">
      <img src="https://placehold.co/600x300/667eea/ffffff?text=Post" style="width:100%;height:200px;object-fit:cover;border-radius:8px;margin-bottom:15px;">
      <h3 style="margin:0 0 10px 0;">T&iacute;tulo del art&iacute;culo</h3>
      <p style="margin:0;color:#666;font-size:14px;">Resumen...</p>
    </article>
    <article style="padding:20px;background:#f8f9fa;border-radius:8px;">
      <img src="https://placehold.co/600x300/764ba2/ffffff?text=Post" style="width:100%;height:200px;object-fit:cover;border-radius:8px;margin-bottom:15px;">
      <h3 style="margin:0 0 10px 0;">Otro art&iacute;culo</h3>
      <p style="margin:0;color:#666;font-size:14px;">Resumen...</p>
    </article>
  </main>
  <aside style="width:300px;flex-shrink:0;">
    <div style="padding:20px;background:#f8f9fa;border-radius:8px;margin-bottom:15px;">
      <strong style="display:block;margin-bottom:10px;">Categor&iacute;as</strong>
      <ul style="margin:0;padding-left:20px;font-size:14px;">
        <li>Categor&iacute;a 1</li>
        <li>Categor&iacute;a 2</li>
      </ul>
    </div>
    <div style="padding:20px;background:#f8f9fa;border-radius:8px;">
      <strong style="display:block;margin-bottom:10px;">Recientes</strong>
      <ul style="margin:0;padding-left:20px;font-size:14px;">
        <li>Post 1</li>
        <li>Post 2</li>
      </ul>
    </div>
  </aside>
</div>`,
};