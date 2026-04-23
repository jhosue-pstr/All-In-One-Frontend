export const BloqueImagenOverlay = {
  id: 'img-overlay',
  label: 'Imagen con Texto',
  attributes: { class: 'fa fa-image' },
  content: `<div style="position:relative; display:inline-block;">
    <img src="https://via.placeholder.com/600x300" style="width:100%; border-radius:8px;">
    <div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); color:white; font-size:24px; background:rgba(0,0,0,0.5); padding:10px;">Texto Overlay</div>
  </div>`,
};