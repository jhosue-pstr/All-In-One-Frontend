export const BloqueLoginCard = {
  id: "auth-login-card",
  label: "Login Card",
  category: "Auth",
  attributes: { class: "fa fa-sign-in" },
  content: `<div style="min-height:500px;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#667eea,#764ba2);padding:40px;">
  <div style="width:100%;max-width:380px;padding:40px;background:white;border-radius:16px;box-shadow:0 10px 40px rgba(0,0,0,0.2);">
    <h2 style="margin:0 0 10px 0;text-align:center;font-size:28px;color:#1a1a2e;">Bienvenido</h2>
    <p style="margin:0 0 30px 0;text-align:center;color:#666;font-size:15px;">Ingresa a tu cuenta</p>
    <div style="margin-bottom:18px;">
      <input type="email" placeholder="Email" style="width:100%;padding:14px;border:1px solid #e0e0e0;border-radius:8px;font-size:15px;box-sizing:border-box;">
    </div>
    <div style="margin-bottom:20px;">
      <input type="password" placeholder="Contrase&ntilde;a" style="width:100%;padding:14px;border:1px solid #e0e0e0;border-radius:8px;font-size:15px;box-sizing:border-box;">
    </div>
    <button style="width:100%;padding:15px;background:#667eea;color:white;border:none;border-radius:8px;font-size:17px;font-weight:600;cursor:pointer;margin-bottom:15px;">Iniciar Sesi&oacute;n</button>
    <p style="text-align:center;margin:0;font-size:14px;color:#666;">&iquest;No tienes cuenta? <a href="#" style="color:#667eea;text-decoration:none;font-weight:600;">Reg&iacute;strate</a></p>
  </div>
</div>`,
};