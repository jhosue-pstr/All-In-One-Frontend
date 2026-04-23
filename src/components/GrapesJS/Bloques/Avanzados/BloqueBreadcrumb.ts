export const BloqueBreadcrumb = {
  id: 'bloque-breadcrumb',
  label: 'Breadcrumb (Ruta de Navegación)',
  attributes: {
    class: 'fa fa-compass',
    'data-gjs-type': 'advanced',
    'data-category': 'Avanzados'
  },
  content: `<nav class="breadcrumb-container" style="font-family: sans-serif; max-width: 800px; margin: 20px auto; padding: 12px 20px; background: #f8f9fa; border-radius: 6px; border: 1px solid #e9ecef;">
  <ol style="display: flex; flex-wrap: wrap; list-style: none; margin: 0; padding: 0; gap: 8px; font-size: 14px; align-items: center;">
    <li><a href="#" style="color: #0066cc; text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='#0052a3'" onmouseout="this.style.color='#0066cc'">Inicio</a></li>
    <li style="color: #999;">›</li>
    <li><a href="#" style="color: #0066cc; text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='#0052a3'" onmouseout="this.style.color='#0066cc'">Productos</a></li>
    <li style="color: #999;">›</li>
    <li><a href="#" style="color: #0066cc; text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='#0052a3'" onmouseout="this.style.color='#0066cc'">Electrónica</a></li>
    <li style="color: #999;">›</li>
    <li style="color: #333; font-weight: 500;">Smartphones</li>
  </ol>
</nav>

<style>
.breadcrumb-container a:hover {
  text-decoration: underline;
}
</style>`
}
