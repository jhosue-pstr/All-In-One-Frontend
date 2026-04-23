export const BloquePaginacion = {
  id: 'bloque-paginacion',
  label: 'Paginación',
  attributes: {
    class: 'fa fa-ellipsis-h',
    'data-gjs-type': 'advanced',
    'data-category': 'Avanzados'
  },
  content: `<div class="pagination-container" style="font-family: sans-serif; max-width: 600px; margin: 30px auto; display: flex; justify-content: center; align-items: center; gap: 5px;">
  <button style="padding: 8px 14px; border: 1px solid #ddd; background: white; border-radius: 4px; cursor: pointer; font-size: 14px; color: #333; transition: all 0.2s;" onmouseover="this.style.background='#f8f9fa'; this.style.borderColor='#ccc'" onmouseout="this.style.background='white'; this.style.borderColor='#ddd'">‹</button>

  <button style="padding: 8px 14px; border: 1px solid #ddd; background: white; border-radius: 4px; cursor: pointer; font-size: 14px; color: #333; transition: all 0.2s;" onmouseover="this.style.background='#f8f9fa'; this.style.borderColor='#ccc'" onmouseout="this.style.background='white'; this.style.borderColor='#ddd'">1</button>

  <button style="padding: 8px 14px; border: 1px solid #ddd; background: white; border-radius: 4px; cursor: pointer; font-size: 14px; color: #333; transition: all 0.2s;" onmouseover="this.style.background='#f8f9fa'; this.style.borderColor='#ccc'" onmouseout="this.style.background='white'; this.style.borderColor='#ddd'">2</button>

  <button style="padding: 8px 14px; border: 1px solid #ddd; background: white; border-radius: 4px; cursor: pointer; font-size: 14px; color: #333; transition: all 0.2s;" onmouseover="this.style.background='#f8f9fa'; this.style.borderColor='#ccc'" onmouseout="this.style.background='white'; this.style.borderColor='#ddd'">3</button>

  <span style="color: #999; padding: 0 4px;">...</span>

  <button style="padding: 8px 14px; border: 1px solid #ddd; background: white; border-radius: 4px; cursor: pointer; font-size: 14px; color: #333; transition: all 0.2s;" onmouseover="this.style.background='#f8f9fa'; this.style.borderColor='#ccc'" onmouseout="this.style.background='white'; this.style.borderColor='#ddd'">10</button>

  <button style="padding: 8px 14px; border: 1px solid #ddd; background: white; border-radius: 4px; cursor: pointer; font-size: 14px; color: #333; transition: all 0.2s;" onmouseover="this.style.background='#f8f9fa'; this.style.borderColor='#ccc'" onmouseout="this.style.background='white'; this.style.borderColor='#ddd'">›</button>
</div>

<div class="pagination-info" style="text-align: center; margin-top: 10px; font-size: 13px; color: #666;">
  Mostrando <strong>1-10</strong> de <strong>124</strong> resultados
</div>`
}
