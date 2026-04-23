export const BloquePricing = {
  id: 'bloque-pricing',
  label: 'Tabla de Precios',
  attributes: {
    class: 'fa fa-dollar-sign',
    'data-gjs-type': 'advanced',
    'data-category': 'Avanzados'
  },
  content: `<div class="pricing-container" style="font-family: sans-serif; max-width: 900px; margin: 20px auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; align-items: start;">
  <!-- Basic Plan -->
  <div class="pricing-card" style="background: white; border-radius: 12px; padding: 30px 25px; border: 1px solid #e9ecef; text-align: center; position: relative; transition: transform 0.2s, box-shadow 0.2s;" onmouseover="this.style.transform='scale(1.03)'; this.style.boxShadow='0 8px 25px rgba(0,0,0,0.12)'; this.style.borderColor='#0066cc'" onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='none'; this.style.borderColor='#e9ecef'">
    <h3 style="margin: 0 0 10px 0; color: #333; font-size: 20px; font-weight: 600;">Básico</h3>
    <p style="margin: 0 0 20px 0; color: #666; font-size: 14px;">Para individuos</p>
    <div style="font-size: 42px; font-weight: 700; color: #0066cc; margin-bottom: 5px;">$9<span style="font-size: 16px; font-weight: 400; color: #999;">/mes</span></div>
    <ul style="list-style: none; padding: 0; margin: 25px 0; text-align: left;">
      <li style="padding: 8px 0; border-bottom: 1px solid #f0f0f0; color: #555; font-size: 14px;">✓ 5GB almacenamiento</li>
      <li style="padding: 8px 0; border-bottom: 1px solid #f0f0f0; color: #555; font-size: 14px;">✓ Soporte por email</li>
      <li style="padding: 8px 0; border-bottom: 1px solid #f0f0f0; color: #555; font-size: 14px;">✓ 1 usuario</li>
      <li style="padding: 8px 0; border-bottom: 1px solid #f0f0f0; color: #555; font-size: 14px;">✓ Análisis básico</li>
    </ul>
    <button style="width: 100%; padding: 12px; background: white; color: #0066cc; border: 2px solid #0066cc; border-radius: 6px; font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background='#0066cc'; this.style.color='white'" onmouseout="this.style.background='white'; this.style.color='#0066cc'">Elegir Plan</button>
  </div>

  <!-- Pro Plan (Featured) -->
  <div class="pricing-card" style="background: white; border-radius: 12px; padding: 30px 25px; border: 2px solid #0066cc; text-align: center; position: relative; transform: scale(1.05); box-shadow: 0 8px 25px rgba(0,102,204,0.2); transition: transform 0.2s, box-shadow 0.2s;" onmouseover="this.style.transform='scale(1.08)'; this.style.boxShadow='0 12px 30px rgba(0,102,204,0.25)'" onmouseout="this.style.transform='scale(1.05)'; this.style.boxShadow='0 8px 25px rgba(0,102,204,0.2)'">
    <div style="position: absolute; top: -12px; left: 50%; transform: translateX(-50%); background: #ffc107; color: #333; padding: 4px 16px; border-radius: 12px; font-size: 12px; font-weight: 600; text-transform: uppercase;">Popular</div>
    <h3 style="margin: 0 0 10px 0; color: #333; font-size: 20px; font-weight: 600;">Profesional</h3>
    <p style="margin: 0 0 20px 0; color: #666; font-size: 14px;">Para equipos pequeños</p>
    <div style="font-size: 42px; font-weight: 700; color: #0066cc; margin-bottom: 5px;">$29<span style="font-size: 16px; font-weight: 400; color: #999;">/mes</span></div>
    <ul style="list-style: none; padding: 0; margin: 25px 0; text-align: left;">
      <li style="padding: 8px 0; border-bottom: 1px solid #f0f0f0; color: #555; font-size: 14px;">✓ 50GB almacenamiento</li>
      <li style="padding: 8px 0; border-bottom: 1px solid #f0f0f0; color: #555; font-size: 14px;">✓ Soporte prioritario</li>
      <li style="padding: 8px 0; border-bottom: 1px solid #f0f0f0; color: #555; font-size: 14px;">✓ 5 usuarios</li>
      <li style="padding: 8px 0; border-bottom: 1px solid #f0f0f0; color: #555; font-size: 14px;">✓ Análisis avanzado</li>
      <li style="padding: 8px 0; border-bottom: 1px solid #f0f0f0; color: #555; font-size: 14px;">✓ API access</li>
    </ul>
    <button style="width: 100%; padding: 12px; background: #0066cc; color: white; border: none; border-radius: 6px; font-size: 15px; font-weight: 600; cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background='#0052a3'" onmouseout="this.style.background='#0066cc'">Elegir Plan</button>
  </div>

  <!-- Enterprise Plan -->
  <div class="pricing-card" style="background: white; border-radius: 12px; padding: 30px 25px; border: 1px solid #e9ecef; text-align: center; position: relative; transition: transform 0.2s, box-shadow 0.2s;" onmouseover="this.style.transform='scale(1.03)'; this.style.boxShadow='0 8px 25px rgba(0,0,0,0.12)'; this.style.borderColor='#6f42c1'" onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='none'; this.style.borderColor='#e9ecef'">
    <h3 style="margin: 0 0 10px 0; color: #333; font-size: 20px; font-weight: 600;">Empresa</h3>
    <p style="margin: 0 0 20px 0; color: #666; font-size: 14px;">Para organizaciones</p>
    <div style="font-size: 42px; font-weight: 700; color: #6f42c1; margin-bottom: 5px;">$99<span style="font-size: 16px; font-weight: 400; color: #999;">/mes</span></div>
    <ul style="list-style: none; padding: 0; margin: 25px 0; text-align: left;">
      <li style="padding: 8px 0; border-bottom: 1px solid #f0f0f0; color: #555; font-size: 14px;">✓ Almacenamiento ilimitado</li>
      <li style="padding: 8px 0; border-bottom: 1px solid #f0f0f0; color: #555; font-size: 14px;">✓ Soporte 24/7</li>
      <li style="padding: 8px 0; border-bottom: 1px solid #f0f0f0; color: #555; font-size: 14px;">✓ Usuarios ilimitados</li>
      <li style="padding: 8px 0; border-bottom: 1px solid #f0f0f0; color: #555; font-size: 14px;">✓ Analítica completa</li>
      <li style="padding: 8px 0; border-bottom: 1px solid #f0f0f0; color: #555; font-size: 14px;">✓ API ilimitada</li>
      <li style="padding: 8px 0; color: #555; font-size: 14px;">✓ Personalización</li>
    </ul>
    <button style="width: 100%; padding: 12px; background: #6f42c1; color: white; border: none; border-radius: 6px; font-size: 15px; font-weight: 600; cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background='#5a32a3'" onmouseout="this.style.background='#6f42c1'">Elegir Plan</button>
  </div>
</div>`
}
