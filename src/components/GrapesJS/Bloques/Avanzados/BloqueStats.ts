export const BloqueStats = {
  id: 'bloque-stats',
  label: 'Estadísticas / Cards',
  attributes: {
    class: 'fa fa-chart-bar',
    'data-gjs-type': 'advanced',
    'data-category': 'Avanzados'
  },
  content: `<div class="stats-container" style="font-family: sans-serif; max-width: 900px; margin: 20px auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
  <!-- Card 1 -->
  <div class="stat-card" style="background: white; padding: 24px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); border-left: 4px solid #0066cc; transition: transform 0.2s, box-shadow 0.2s;" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 6px 16px rgba(0,0,0,0.12)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.08)'">
    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
      <div>
        <p style="margin: 0; font-size: 13px; color: #666; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Usuarios Activos</p>
        <h3 style="margin: 8px 0 0 0; font-size: 32px; font-weight: 700; color: #333;">12,847</h3>
      </div>
      <div style="font-size: 24px; color: #0066cc;">👥</div>
    </div>
    <div style="display: flex; align-items: center; gap: 6px; font-size: 13px;">
      <span style="color: #28a745;">▲ 12%</span>
      <span style="color: #999;">vs mes anterior</span>
    </div>
  </div>

  <!-- Card 2 -->
  <div class="stat-card" style="background: white; padding: 24px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); border-left: 4px solid #28a745; transition: transform 0.2s, box-shadow 0.2s;" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 6px 16px rgba(0,0,0,0.12)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.08)'">
    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
      <div>
        <p style="margin: 0; font-size: 13px; color: #666; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Ventas Hoy</p>
        <h3 style="margin: 8px 0 0 0; font-size: 32px; font-weight: 700; color: #333;">$8,432</h3>
      </div>
      <div style="font-size: 24px; color: #28a745;">💰</div>
    </div>
    <div style="display: flex; align-items: center; gap: 6px; font-size: 13px;">
      <span style="color: #28a745;">▲ 8.5%</span>
      <span style="color: #999;">vs ayer</span>
    </div>
  </div>

  <!-- Card 3 -->
  <div class="stat-card" style="background: white; padding: 24px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); border-left: 4px solid #ffc107; transition: transform 0.2s, box-shadow 0.2s;" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 6px 16px rgba(0,0,0,0.12)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.08)'">
    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
      <div>
        <p style="margin: 0; font-size: 13px; color: #666; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Pedidos Pendientes</p>
        <h3 style="margin: 8px 0 0 0; font-size: 32px; font-weight: 700; color: #333;">45</h3>
      </div>
      <div style="font-size: 24px; color: #ffc107;">📦</div>
    </div>
    <div style="display: flex; align-items: center; gap: 6px; font-size: 13px;">
      <span style="color: #dc3545;">▼ 3%</span>
      <span style="color: #999;">vs ayer</span>
    </div>
  </div>

  <!-- Card 4 -->
  <div class="stat-card" style="background: white; padding: 24px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); border-left: 4px solid #dc3545; transition: transform 0.2s, box-shadow 0.2s;" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 6px 16px rgba(0,0,0,0.12)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.08)'">
    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
      <div>
        <p style="margin: 0; font-size: 13px; color: #666; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Tasa de Conversión</p>
        <h3 style="margin: 8px 0 0 0; font-size: 32px; font-weight: 700; color: #333;">3.24%</h3>
      </div>
      <div style="font-size: 24px; color: #dc3545;">📈</div>
    </div>
    <div style="display: flex; align-items: center; gap: 6px; font-size: 13px;">
      <span style="color: #28a745;">▲ 0.8%</span>
      <span style="color: #999;">vs mes anterior</span>
    </div>
  </div>
</div>`
}
