export const BloqueSidebarDerecho = {
  id: "layout-sidebar-der",
  label: "Sidebar Derecho",
  category: "Layout",
  attributes: { class: "fa fa fa-solid fa-align-right" },
  content: `<div style="display:flex;padding:20px;gap:20px;">
  <main style="flex:1;padding:20px;background:#f8f9fa;border-radius:8px;">
    Contenido principal
  </main>
  <aside style="width:250px;flex-shrink:0;padding:20px;background:#f8f9fa;border-radius:8px;">
    <strong>Men&uacute;</strong>
    <ul style="margin:15px 0 0 0;padding-left:20px;font-size:14px;">
      <li>Enlace 1</li>
      <li>Enlace 2</li>
      <li>Enlace 3</li>
    </ul>
  </aside>
</div>`,
};
