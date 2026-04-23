export const BloqueRegistro = {
  id: 'bloque-registro',
  label: 'Formulario de Registro',
  attributes: {
    class: 'fa fa-user-plus',
    'data-gjs-type': 'advanced',
    'data-category': 'Avanzados'
  },
  content: `<div class="register-container" style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 25px; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
  <h3 style="text-align: center; margin-bottom: 20px; color: #333;">Crear Cuenta</h3>
  <form onsubmit="event.preventDefault(); alert('Registro enviado');" style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
    <div>
      <label style="display: block; margin-bottom: 5px; font-weight: 500; color: #555;">Nombre</label>
      <input type="text" placeholder="Juan" required style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; font-size: 14px;">
    </div>
    <div>
      <label style="display: block; margin-bottom: 5px; font-weight: 500; color: #555;">Apellido</label>
      <input type="text" placeholder="Pérez" required style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; font-size: 14px;">
    </div>
    <div style="grid-column: span 2;">
      <label style="display: block; margin-bottom: 5px; font-weight: 500; color: #555;">Correo Electrónico</label>
      <input type="email" placeholder="tu@email.com" required style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; font-size: 14px;">
    </div>
    <div>
      <label style="display: block; margin-bottom: 5px; font-weight: 500; color: #555;">Contraseña</label>
      <input type="password" placeholder="Mínimo 8 caracteres" required minlength="8" style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; font-size: 14px;">
    </div>
    <div>
      <label style="display: block; margin-bottom: 5px; font-weight: 500; color: #555;">Confirmar Contraseña</label>
      <input type="password" placeholder="Repite tu contraseña" required style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; font-size: 14px;">
    </div>
    <div style="grid-column: span 2; display: flex; align-items: center; gap: 10px; margin-top: 5px;">
      <input type="checkbox" id="terms" required style="margin: 0;">
      <label for="terms" style="font-size: 14px; color: #555; cursor: pointer;">Acepto los <a href="#" style="color: #0066cc; text-decoration: none;">términos y condiciones</a></label>
    </div>
    <div style="grid-column: span 2; margin-top: 10px;">
      <button type="submit" style="width: 100%; padding: 12px; background-color: #28a745; color: white; border: none; border-radius: 4px; font-size: 16px; font-weight: 600; cursor: pointer; transition: background-color 0.2s;" onmouseover="this.style.backgroundColor='#218838'" onmouseout="this.style.backgroundColor='#28a745'">
        Crear Cuenta
      </button>
    </div>
  </form>
  <p style="text-align: center; margin-top: 20px; font-size: 14px; color: #666;">
    ¿Ya tienes cuenta? <a href="#" style="color: #0066cc; text-decoration: none; font-weight: 500;">Inicia sesión</a>
  </p>
</div>`
}
