export const BloqueLayoutSidebar = {
  id: 'layout-sidebar-right',
  label: 'Contenido + Lateral',
  attributes: { class: 'fa fa-columns' },
  content: `<div style="display: flex; flex-wrap: wrap; gap: 30px; padding: 20px; min-height: 200px;">
    <div style="flex: 3; min-width: 300px; padding: 20px; background: #ffffff; border: 1px dashed #ccc;">Contenido Principal (75%)</div>
    <div style="flex: 1; min-width: 250px; padding: 20px; background: #f8f9fa; border: 1px dashed #ccc;">Barra Lateral (25%)</div>
  </div>`,
};