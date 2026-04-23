export const BloqueTabs = {
  id: 'bloque-tabs',
  label: 'Pestañas (Tabs)',
  attributes: {
    class: 'fa fa-folder-open',
    'data-gjs-type': 'advanced',
    'data-category': 'Avanzados'
  },
  content: `<div class="tabs-container" style="font-family: sans-serif; max-width: 700px; margin: 20px auto;">
  <div class="tabs-header" style="display: flex; border-bottom: 2px solid #e0e0e0; margin-bottom: 0;">
    <button class="tab-button active" style="flex: 1; padding: 14px 20px; background: none; border: none; border-bottom: 3px solid #0066cc; bottom: -2px; position: relative; font-size: 15px; font-weight: 600; color: #0066cc; cursor: pointer; transition: all 0.2s;" onclick="switchTab(0)">Información</button>
    <button class="tab-button" style="flex: 1; padding: 14px 20px; background: none; border: none; border-bottom: 3px solid transparent; bottom: -2px; position: relative; font-size: 15px; font-weight: 500; color: #666; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.color='#0066cc'" onmouseout="this.style.color='#666'" onclick="switchTab(1)">Especificaciones</button>
    <button class="tab-button" style="flex: 1; padding: 14px 20px; background: none; border: none; border-bottom: 3px solid transparent; bottom: -2px; position: relative; font-size: 15px; font-weight: 500; color: #666; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.color='#0066cc'" onmouseout="this.style.color='#666'" onclick="switchTab(2)">Reseñas</button>
  </div>
  <div class="tabs-body">
    <div class="tab-panel active" style="padding: 20px; line-height: 1.7; color: #444; animation: fadeIn 0.3s ease;">
      <h4 style="margin-top: 0; color: #333;">Descripción del Producto</h4>
      <p>Este es un producto de alta calidad diseñado para ofrecer el mejor rendimiento. Fabricado con materiales premium y respaldado por nuestra garantía de satisfacción.</p>
      <ul style="margin-top: 10px; padding-left: 20px;">
        <li>Diseño ergonómico y moderno</li>
        <li>Compatible con múltiples dispositivos</li>
        <li>Fácil instalación y configuración</li>
      </ul>
    </div>
    <div class="tab-panel" style="padding: 20px; line-height: 1.7; color: #444; display: none;">
      <h4 style="margin-top: 0; color: #333;">Características Técnicas</h4>
      <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
        <tr style="border-bottom: 1px solid #eee;">
          <td style="padding: 8px 0; font-weight: 600; width: 40%;">Dimensiones</td>
          <td style="padding: 8px 0;">20 x 15 x 5 cm</td>
        </tr>
        <tr style="border-bottom: 1px solid #eee;">
          <td style="padding: 8px 0; font-weight: 600;">Peso</td>
          <td style="padding: 8px 0;">350g</td>
        </tr>
        <tr style="border-bottom: 1px solid #eee;">
          <td style="padding: 8px 0; font-weight: 600;">Material</td>
          <td style="padding: 8px 0;">Aluminio y plástico ABS</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: 600;">Garantía</td>
          <td style="padding: 8px 0;">2 años</td>
        </tr>
      </table>
    </div>
    <div class="tab-panel" style="padding: 20px; line-height: 1.7; color: #444; display: none;">
      <h4 style="margin-top: 0; color: #333;">Opiniones de Clientes</h4>
      <div style="margin-top: 15px; padding: 15px; background: #f8f9fa; border-radius: 6px; border-left: 4px solid #28a745;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <strong style="color: #333;">María García</strong>
          <span style="color: #ffc107;">★★★★★</span>
        </div>
        <p style="margin: 0; font-size: 14px; color: #666;">"Excelente producto, superó mis expectativas. Muy recomendado."</p>
      </div>
      <div style="margin-top: 15px; padding: 15px; background: #f8f9fa; border-radius: 6px; border-left: 4px solid #ffc107;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <strong style="color: #333;">Carlos López</strong>
          <span style="color: #ffc107;">★★★★☆</span>
        </div>
        <p style="margin: 0; font-size: 14px; color: #666;">"Buen producto, la calidad es aceptable por el precio."</p>
      </div>
    </div>
  </div>
</div>

<style>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>

<script>
function switchTab(index) {
  const container = document.currentScript.previousElementSibling;
  const buttons = container.querySelectorAll('.tab-button');
  const panels = container.querySelectorAll('.tab-panel');

  buttons.forEach((btn, i) => {
    if (i === index) {
      btn.classList.add('active');
      btn.style.borderBottomColor = '#0066cc';
      btn.style.color = '#0066cc';
      btn.style.fontWeight = '600';
    } else {
      btn.classList.remove('active');
      btn.style.borderBottomColor = 'transparent';
      btn.style.color = '#666';
      btn.style.fontWeight = '500';
    }
  });

  panels.forEach((panel, i) => {
    if (i === index) {
      panel.style.display = 'block';
      panel.style.animation = 'fadeIn 0.3s ease';
    } else {
      panel.style.display = 'none';
    }
  });
}
</script>`
}
