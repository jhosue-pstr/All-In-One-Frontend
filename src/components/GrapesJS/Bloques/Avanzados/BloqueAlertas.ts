export const BloqueAlertas = {
  id: 'bloque-alertas',
  label: 'Alertas y Notificaciones',
  attributes: {
    class: 'fa fa-bell',
    'data-gjs-type': 'advanced',
    'data-category': 'Avanzados'
  },
  content: `<div class="alerts-container" style="font-family: sans-serif; max-width: 600px; margin: 20px auto; display: flex; flex-direction: column; gap: 12px;">
  <!-- Success Alert -->
  <div class="alert alert-success" style="display: flex; align-items: center; gap: 12px; padding: 14px 18px; background: #d4edda; border: 1px solid #c3e6cb; border-left: 4px solid #28a745; border-radius: 6px; color: #155724; animation: slideInRight 0.3s ease;">
    <span style="font-size: 20px;">✓</span>
    <div style="flex: 1;">
      <strong style="display: block; font-size: 14px; margin-bottom: 2px;">Éxito</strong>
      <span style="font-size: 13px;">La operación se completó correctamente.</span>
    </div>
    <button onclick="this.parentElement.style.display='none'" style="background: none; border: none; color: #155724; font-size: 18px; cursor: pointer; padding: 0; line-height: 1;">×</button>
  </div>

  <!-- Error Alert -->
  <div class="alert alert-error" style="display: flex; align-items: center; gap: 12px; padding: 14px 18px; background: #f8d7da; border: 1px solid #f5c6cb; border-left: 4px solid #dc3545; border-radius: 6px; color: #721c24; animation: slideInRight 0.3s ease;">
    <span style="font-size: 20px;">⚠</span>
    <div style="flex: 1;">
      <strong style="display: block; font-size: 14px; margin-bottom: 2px;">Error</strong>
      <span style="font-size: 13px;">Ha ocurrido un error. Por favor, inténtalo de nuevo.</span>
    </div>
    <button onclick="this.parentElement.style.display='none'" style="background: none; border: none; color: #721c24; font-size: 18px; cursor: pointer; padding: 0; line-height: 1;">×</button>
  </div>

  <!-- Warning Alert -->
  <div class="alert alert-warning" style="display: flex; align-items: center; gap: 12px; padding: 14px 18px; background: #fff3cd; border: 1px solid #ffeaa7; border-left: 4px solid #ffc107; border-radius: 6px; color: #856404; animation: slideInRight 0.3s ease;">
    <span style="font-size: 20px;">!</span>
    <div style="flex: 1;">
      <strong style="display: block; font-size: 14px; margin-bottom: 2px;">Atención</strong>
      <span style="font-size: 13px;">Tu sesión expirará en 5 minutos.</span>
    </div>
    <button onclick="this.parentElement.style.display='none'" style="background: none; border: none; color: #856404; font-size: 18px; cursor: pointer; padding: 0; line-height: 1;">×</button>
  </div>

  <!-- Info Alert -->
  <div class="alert alert-info" style="display: flex; align-items: center; gap: 12px; padding: 14px 18px; background: #d1ecf1; border: 1px solid #bee5eb; border-left: 4px solid #17a2b8; border-radius: 6px; color: #0c5460; animation: slideInRight 0.3s ease;">
    <span style="font-size: 20px;">ℹ</span>
    <div style="flex: 1;">
      <strong style="display: block; font-size: 14px; margin-bottom: 2px;">Información</strong>
      <span style="font-size: 13px;">Nueva versión disponible. <a href="#" style="color: #0c5460; text-decoration: underline;">Actualizar ahora</a></span>
    </div>
    <button onclick="this.parentElement.style.display='none'" style="background: none; border: none; color: #0c5460; font-size: 18px; cursor: pointer; padding: 0; line-height: 1;">×</button>
  </div>
</div>

<style>
@keyframes slideInRight {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}
</style>`
}
