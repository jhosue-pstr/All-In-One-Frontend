export const BloqueSplitScreen = {
  id: "layout-split",
  label: "Split Screen",
  category: "Layout",
  attributes: { class: "fa fa-columns" },
  content: `<div style="display:flex;min-height:400px;">
  <div style="flex:1;display:flex;align-items:center;justify-content:center;background:#667eea;color:white;padding:40px;">
    <div style="text-align:center;">
      <h2 style="margin:0 0 15px 0;font-size:28px;">Lado Izquierdo</h2>
      <p style="margin:0;font-size:16px;opacity:0.9;">Imagen o contenido</p>
    </div>
  </div>
  <div style="flex:1;display:flex;align-items:center;justify-content:center;background:#f8f9fa;padding:40px;">
    <div style="text-align:center;">
      <h2 style="margin:0 0 15px 0;font-size:28px;color:#333;">Lado Derecho</h2>
      <p style="margin:0;color:#666;font-size:16px;">Texto o formulario</p>
    </div>
  </div>
</div>`,
};