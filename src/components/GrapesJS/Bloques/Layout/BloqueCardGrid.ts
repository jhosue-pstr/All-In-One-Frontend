export const BloqueCardGrid = {
  id: "layout-card-grid",
  label: "Card Grid",
  category: "Layout",
  attributes: { class: "fa fa-th" },
  content: `<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px;padding:20px;">
  <div style="background:white;border-radius:12px;overflow:hidden;box-shadow:0 4px 15px rgba(0,0,0,0.1);">
    <img src="https://placehold.co/300x180/667eea/ffffff?text=1" style="width:100%;height:150px;object-fit:cover;">
    <div style="padding:20px;">
      <h4 style="margin:0 0 10px 0;font-size:16px;">T&iacute;tulo</h4>
      <p style="margin:0;color:#666;font-size:13px;">Descripci&oacute;n</p>
    </div>
  </div>
  <div style="background:white;border-radius:12px;overflow:hidden;box-shadow:0 4px 15px rgba(0,0,0,0.1);">
    <img src="https://placehold.co/300x180/764ba2/ffffff?text=2" style="width:100%;height:150px;object-fit:cover;">
    <div style="padding:20px;">
      <h4 style="margin:0 0 10px 0;font-size:16px;">T&iacute;tulo</h4>
      <p style="margin:0;color:#666;font-size:13px;">Descripci&oacute;n</p>
    </div>
  </div>
  <div style="background:white;border-radius:12px;overflow:hidden;box-shadow:0 4px 15px rgba(0,0,0,0.1);">
    <img src="https://placehold.co/300x180/00b894/ffffff?text=3" style="width:100%;height:150px;object-fit:cover;">
    <div style="padding:20px;">
      <h4 style="margin:0 0 10px 0;font-size:16px;">T&iacute;tulo</h4>
      <p style="margin:0;color:#666;font-size:13px;">Descripci&oacute;n</p>
    </div>
  </div>
</div>`,
};