export const BloqueMapaInteractivo = {
  id: "multimedia-mapa-interactivo",
  label: "Mapa Interactivo",
  category: "Multimedia",
  attributes: { class: "fa fa-map-marker" },
  content: `<div style="position:relative;height:400px;border-radius:12px;overflow:hidden;">
    <iframe src="https://www.google.com/maps/embed?pb&q=Peru&z=15" width="100%" height="400" style="border:0;" loading="lazy" allowfullscreen></iframe>
    <div style="position:absolute;bottom:20px;left:20px;background:white;padding:15px 20px;border-radius:8px;box-shadow:0 4px 15px rgba(0,0,0,0.2);">
      <strong style="display:block;margin-bottom:5px;">Nuestra Ubicaci&oacute;n</strong>
      <span style="color:#666;font-size:14px;">Lima, Per&uacute;</span>
    </div>
  </div>`,
};