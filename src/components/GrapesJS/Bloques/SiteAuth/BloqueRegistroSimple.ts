export const BloqueRegistroSimple = {
  id: "auth-registro-simple",
  label: "Registro Simple",
  category: "Auth",
  attributes: { class: "fa fa-user-plus" },
  content: `<div data-auth="registro" data-sitio-id="{{SITIO_ID}}" style="padding:30px;background:#fff;border-radius:12px;max-width:450px;">
  <h2 style="margin:0 0 25px 0;text-align:center;font-size:24px;">Crear Cuenta</h2>
  <form>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:15px;margin-bottom:15px;">
      <div>
        <label style="display:block;margin-bottom:5px;font-size:14px;color:#555;">Nombre</label>
        <input type="text" name="nombre" placeholder="Juan" style="width:100%;padding:12px;border:1px solid #ddd;border-radius:6px;font-size:15px;box-sizing:border-box;">
      </div>
      <div>
        <label style="display:block;margin-bottom:5px;font-size:14px;color:#555;">Apellido</label>
        <input type="text" name="apellido" placeholder="P&eacute;rez" style="width:100%;padding:12px;border:1px solid #ddd;border-radius:6px;font-size:15px;box-sizing:border-box;">
      </div>
    </div>
    <div style="margin-bottom:15px;">
      <label style="display:block;margin-bottom:5px;font-size:14px;color:#555;">Email</label>
      <input type="email" name="correo" placeholder="tu@email.com" style="width:100%;padding:12px;border:1px solid #ddd;border-radius:6px;font-size:15px;box-sizing:border-box;">
    </div>
    <div style="margin-bottom:20px;">
      <label style="display:block;margin-bottom:5px;font-size:14px;color:#555;">Contrase&ntilde;a</label>
      <input type="password" name="contrasena" placeholder="********" style="width:100%;padding:12px;border:1px solid #ddd;border-radius:6px;font-size:15px;box-sizing:border-box;">
    </div>
    <div class="auth-error" style="color:#e74c3c;font-size:14px;margin-bottom:15px;display:none;"></div>
    <button type="submit" style="width:100%;padding:14px;background:#27ae60;color:white;border:none;border-radius:6px;font-size:16px;font-weight:600;cursor:pointer;">Crear Cuenta</button>
  </form>
</div>`,
};