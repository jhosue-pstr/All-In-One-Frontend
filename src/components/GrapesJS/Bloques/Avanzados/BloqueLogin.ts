export const BloqueLogin = {
  id: 'bloque-login',
  label: 'Formulario de Login',
  attributes: {
    class: 'fa fa-sign-in-alt',
    'data-gjs-type': 'advanced',
    'data-category': 'Avanzados'
  },
  content: `<div class="login-container" style="font-family: sans-serif; max-width: 400px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
  <h3 style="text-align: center; margin-bottom: 20px; color: #333;">Iniciar Sesión</h3>
  <form onsubmit="event.preventDefault(); alert('Login enviado');" style="display: flex; flex-direction: column; gap: 15px;">
    <div>
      <label style="display: block; margin-bottom: 5px; font-weight: 500; color: #555;">Correo Electrónico</label>
      <input type="email" placeholder="tu@email.com" required style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; font-size: 14px;">
    </div>
    <div>
      <label style="display: block; margin-bottom: 5px; font-weight: 500; color: #555;">Contraseña</label>
      <input type="password" placeholder="••••••••" required style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; font-size: 14px;">
    </div>
    <div style="display: flex; justify-content: space-between; align-items: center; font-size: 14px;">
      <label style="display: flex; align-items: center; gap: 5px; cursor: pointer;">
        <input type="checkbox" style="margin: 0;"> Recordarme
      </label>
      <a href="#" style="color: #0066cc; text-decoration: none;">¿Olvidaste tu contraseña?</a>
    </div>
    <button type="submit" style="width: 100%; padding: 12px; background-color: #0066cc; color: white; border: none; border-radius: 4px; font-size: 16px; font-weight: 600; cursor: pointer; transition: background-color 0.2s;" onmouseover="this.style.backgroundColor='#0052a3'" onmouseout="this.style.backgroundColor='#0066cc'">
      Iniciar Sesión
    </button>
  </form>
  <p style="text-align: center; margin-top: 15px; font-size: 14px; color: #666;">
    ¿No tienes cuenta? <a href="#" style="color: #0066cc; text-decoration: none; font-weight: 500;">Regístrate aquí</a>
  </p>
</div>`
}
