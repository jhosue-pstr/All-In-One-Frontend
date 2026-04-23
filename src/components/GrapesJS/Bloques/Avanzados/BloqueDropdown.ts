export const BloqueDropdown = {
  id: 'bloque-dropdown',
  label: 'Menú Desplegable (Dropdown)',
  attributes: {
    class: 'fa fa-chevron-down',
    'data-gjs-type': 'advanced',
    'data-category': 'Avanzados'
  },
  content: `<div class="dropdown-container" style="font-family: sans-serif; max-width: 300px; margin: 20px auto; position: relative; display: inline-block;">
  <button onclick="toggleDropdown()" style="width: 100%; padding: 12px 16px; background: white; border: 1px solid #ddd; border-radius: 6px; font-size: 15px; font-weight: 500; color: #333; cursor: pointer; display: flex; justify-content: space-between; align-items: center; transition: all 0.2s;" onmouseover="this.style.borderColor='#0066cc'; this.style.boxShadow='0 0 0 3px rgba(0,102,204,0.1)'" onmouseout="this.style.borderColor='#ddd'; this.style.boxShadow='none'">
    Opciones disponibles
    <span style="font-size: 12px; transition: transform 0.3s;" id="dropdown-arrow">▼</span>
  </button>

  <div id="dropdown-menu" style="display: none; position: absolute; top: 100%; left: 0; right: 0; margin-top: 4px; background: white; border: 1px solid #ddd; border-radius: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 100; overflow: hidden; animation: dropIn 0.2s ease;">
    <div style="padding: 8px 16px; font-size: 12px; color: #999; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Categorías</div>
    <a href="#" style="display: block; padding: 10px 16px; color: #333; text-decoration: none; font-size: 14px; transition: background 0.2s;" onmouseover="this.style.background='#f8f9fa'; this.style.color='#0066cc'" onmouseout="this.style.background='white'; this.style.color='#333'">📱 Electrónica</a>
    <a href="#" style="display: block; padding: 10px 16px; color: #333; text-decoration: none; font-size: 14px; transition: background 0.2s;" onmouseover="this.style.background='#f8f9fa'; this.style.color='#0066cc'" onmouseout="this.style.background='white'; this.style.color='#333'">👕 Ropa y Moda</a>
    <a href="#" style="display: block; padding: 10px 16px; color: #333; text-decoration: none; font-size: 14px; transition: background 0.2s;" onmouseover="this.style.background='#f8f9fa'; this.style.color='#0066cc'" onmouseout="this.style.background='white'; this.style.color='#333'">🏠 Hogar y Jardín</a>
    <div style="border-top: 1px solid #eee; margin: 4px 0;"></div>
    <a href="#" style="display: block; padding: 10px 16px; color: #dc3545; text-decoration: none; font-size: 14px; transition: background 0.2s;" onmouseover="this.style.background='#fff5f5'" onmouseout="this.style.background='white'">🚫 Cerrar sesión</a>
  </div>
</div>

<style>
@keyframes dropIn {
  from { transform: translateY(-10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
</style>

<script>
let dropdownOpen = false;
function toggleDropdown() {
  const menu = document.getElementById('dropdown-menu');
  const arrow = document.getElementById('dropdown-arrow');
  dropdownOpen = !dropdownOpen;
  if (dropdownOpen) {
    menu.style.display = 'block';
    arrow.style.transform = 'rotate(180deg)';
  } else {
    menu.style.display = 'none';
    arrow.style.transform = 'rotate(0deg)';
  }
}

// Close when clicking outside
document.addEventListener('click', function(e) {
  if (!e.target.closest('.dropdown-container')) {
    const menu = document.getElementById('dropdown-menu');
    const arrow = document.getElementById('dropdown-arrow');
    if (menu) menu.style.display = 'none';
    if (arrow) arrow.style.transform = 'rotate(0deg)';
    dropdownOpen = false;
  }
});
</script>`
}
