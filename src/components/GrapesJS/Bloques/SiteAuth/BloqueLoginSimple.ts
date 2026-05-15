export const BloqueLoginSimple = {
  id: "auth-login-simple",
  label: "Login Simple",
  category: "Auth",
  attributes: { class: "fa fa-sign-in" },
  content: `<div data-auth="login" data-sitio-id="{{SITIO_ID}}" style="padding:30px;background:#fff;border-radius:12px;max-width:400px;">
  <h2 style="margin:0 0 25px 0;text-align:center;font-size:24px;">Iniciar Sesi&oacute;n</h2>
  <form>
    <div style="margin-bottom:15px;">
      <label style="display:block;margin-bottom:5px;font-size:14px;color:#555;">Email</label>
      <input type="email" name="correo" placeholder="tu@email.com" style="width:100%;padding:12px;border:1px solid #ddd;border-radius:6px;font-size:15px;box-sizing:border-box;">
    </div>
    <div style="margin-bottom:20px;">
      <label style="display:block;margin-bottom:5px;font-size:14px;color:#555;">Contrase&ntilde;a</label>
      <input type="password" name="contrasena" placeholder="********" style="width:100%;padding:12px;border:1px solid #ddd;border-radius:6px;font-size:15px;box-sizing:border-box;">
    </div>
    <div class="auth-error" style="color:#e74c3c;font-size:14px;margin-bottom:15px;display:none;"></div>
    <button type="submit" style="width:100%;padding:14px;background:#667eea;color:white;border:none;border-radius:6px;font-size:16px;font-weight:600;cursor:pointer;">Entrar</button>
  </form>
  <div style="text-align:center;margin-top:15px;">
    <a href="#" style="color:#667eea;font-size:14px;text-decoration:none;">&iquest;Olvidaste tu contrase&ntilde;a?</a>
  </div>
</div>`,
};