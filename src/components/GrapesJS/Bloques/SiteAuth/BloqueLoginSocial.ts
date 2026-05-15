export const BloqueLoginSocial = {
  id: "auth-login-social",
  label: "Login Social",
  category: "Auth",
  attributes: { class: "fa fa-users" },
  content: `<div data-auth="login" data-sitio-id="{{SITIO_ID}}" style="padding:30px;background:#fff;border-radius:12px;max-width:380px;text-align:center;">
  <h2 style="margin:0 0 25px 0;font-size:24px;">Iniciar Sesi&oacute;n</h2>
  <div style="display:flex;gap:12px;margin-bottom:20px;">
    <button style="flex:1;padding:12px;background:#fff;border:2px solid #ddd;border-radius:8px;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;">
      <i class="fa fa-google" style="color:#EA4335;"></i> Google
    </button>
    <button style="flex:1;padding:12px;background:#fff;border:2px solid #ddd;border-radius:8px;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;">
      <i class="fa fa-facebook" style="color:#1877F2;"></i> Facebook
    </button>
    <button style="flex:1;padding:12px;background:#fff;border:2px solid #ddd;border-radius:8px;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;">
      <i class="fa fa-apple" style="color:#333;"></i> Apple
    </button>
  </div>
  <div style="position:relative;margin:20px 0;">
    <hr style="border:none;border-top:1px solid #e0e0e0;">
    <span style="position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:#fff;padding:0 15px;color:#999;font-size:14px;">o</span>
  </div>
  <form>
    <div style="margin-bottom:15px;">
      <input type="email" name="correo" placeholder="Email" style="width:100%;padding:12px;border:1px solid #ddd;border-radius:6px;font-size:15px;box-sizing:border-box;">
    </div>
    <div style="margin-bottom:20px;">
      <input type="password" name="contrasena" placeholder="Contrase&ntilde;a" style="width:100%;padding:12px;border:1px solid #ddd;border-radius:6px;font-size:15px;box-sizing:border-box;">
    </div>
    <div class="auth-error" style="color:#e74c3c;font-size:14px;margin-bottom:15px;display:none;"></div>
    <button type="submit" style="width:100%;padding:14px;background:#667eea;color:white;border:none;border-radius:6px;font-size:16px;font-weight:600;cursor:pointer;">Entrar</button>
  </form>
</div>`,
};