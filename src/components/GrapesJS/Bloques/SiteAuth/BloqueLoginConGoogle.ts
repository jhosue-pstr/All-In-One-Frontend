export const BloqueLoginGoogle = {
  id: "auth-login-google",
  label: "Login Google",
  category: "Auth",
  attributes: { class: " fa fa-brands fa-google" },
  content: `<div style="padding:30px;background:#fff;border-radius:12px;max-width:380px;text-align:center;">
  <h2 style="margin:0 0 25px 0;font-size:24px;">Iniciar Sesi&oacute;n</h2>
  <button style="width:100%;padding:14px;background:#fff;border:2px solid #ddd;border-radius:8px;font-size:16px;font-weight:500;cursor:pointer;margin-bottom:15px;display:flex;align-items:center;justify-content:center;gap:10px;">
    <i class="fa fa-google" style="color:#EA4335;"></i> Continuar con Google
  </button>
  <div style="position:relative;margin:20px 0;">
    <hr style="border:none;border-top:1px solid #e0e0e0;">
    <span style="position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:#fff;padding:0 15px;color:#999;font-size:14px;">o</span>
  </div>
  <div style="margin-bottom:15px;">
    <input type="email" placeholder="Email" style="width:100%;padding:12px;border:1px solid #ddd;border-radius:6px;font-size:15px;box-sizing:border-box;">
  </div>
  <div style="margin-bottom:20px;">
    <input type="password" placeholder="Contrase&ntilde;a" style="width:100%;padding:12px;border:1px solid #ddd;border-radius:6px;font-size:15px;box-sizing:border-box;">
  </div>
  <button style="width:100%;padding:14px;background:#667eea;color:white;border:none;border-radius:6px;font-size:16px;font-weight:600;cursor:pointer;">Entrar</button>
</div>`,
};
