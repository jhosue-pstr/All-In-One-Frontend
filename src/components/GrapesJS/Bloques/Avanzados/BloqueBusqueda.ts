export const BloqueBusqueda = {
  id: 'bloque-busqueda',
  label: 'Barra de Búsqueda',
  attributes: {
    class: 'fa fa-search',
    'data-gjs-type': 'advanced',
    'data-category': 'Avanzados'
  },
  content: `<div class="search-container" style="font-family: sans-serif; max-width: 600px; margin: 20px auto;">
  <form onsubmit="event.preventDefault(); const query = this.querySelector('input').value; if(query) alert('Buscando: ' + query);" style="display: flex; gap: 10px; align-items: stretch;">
    <input type="search" placeholder="Buscar..." required style="flex: 1; padding: 12px 16px; border: 2px solid #e0e0e0; border-radius: 6px 0 0 6px; font-size: 16px; outline: none; transition: border-color 0.2s;" onfocus="this.style.borderColor='#0066cc'" onblur="this.style.borderColor='#e0e0e0'">
    <button type="submit" style="padding: 12px 24px; background-color: #0066cc; color: white; border: none; border-radius: 0 6px 6px 0; font-size: 16px; font-weight: 600; cursor: pointer; transition: background-color 0.2s;" onmouseover="this.style.backgroundColor='#0052a3'" onmouseout="this.style.backgroundColor='#0066cc'">
      Buscar
    </button>
  </form>
  <div style="margin-top: 10px; display: flex; gap: 8px; flex-wrap: wrap;">
    <a href="#" style="display: inline-block; padding: 6px 12px; background-color: #f5f5f5; border: 1px solid #ddd; border-radius: 15px; font-size: 13px; color: #555; text-decoration: none; transition: all 0.2s;" onmouseover="this.style.backgroundColor='#e8e8e8'; this.style.borderColor='#ccc'" onmouseout="this.style.backgroundColor='#f5f5f5'; this.style.borderColor='#ddd'">Ejemplo 1</a>
    <a href="#" style="display: inline-block; padding: 6px 12px; background-color: #f5f5f5; border: 1px solid #ddd; border-radius: 15px; font-size: 13px; color: #555; text-decoration: none; transition: all 0.2s;" onmouseover="this.style.backgroundColor='#e8e8e8'; this.style.borderColor='#ccc'" onmouseout="this.style.backgroundColor='#f5f5f5'; this.style.borderColor='#ddd'">Ejemplo 2</a>
    <a href="#" style="display: inline-block; padding: 6px 12px; background-color: #f5f5f5; border: 1px solid #ddd; border-radius: 15px; font-size: 13px; color: #555; text-decoration: none; transition: all 0.2s;" onmouseover="this.style.backgroundColor='#e8e8e8'; this.style.borderColor='#ccc'" onmouseout="this.style.backgroundColor='#f5f5f5'; this.style.borderColor='#ddd'">Ejemplo 3</a>
  </div>
</div>`
}
