export const BloqueRegistroMinimal = {
  id: "auth-registro-minimal",
  label: "Registro Minimal",
  category: "Auth",
  attributes: { class: "fa fa-user-plus" },
  content: `<div data-auth="registro" data-sitio-id="{{SITIO_ID}}" style="padding:40px;max-width:350px;margin:0 auto;">
  <h3 style="margin:0 0 25px 0;font-size:20px;text-align:center;">Registrarse</h3>
  <form>
    <input type="text" name="nombre" placeholder="Nombre completo" style="width:100%;padding:12px 0;border:none;border-bottom:2px solid #ddd;margin-bottom:15px;font-size:15px;box-sizing:border-box;">
    <input type="email" name="correo" placeholder="Email" style="width:100%;padding:12px 0;border:none;border-bottom:2px solid #ddd;margin-bottom:15px;font-size:15px;box-sizing:border-box;">
    <input type="password" name="contrasena" placeholder="Password" style="width:100%;padding:12px 0;border:none;border-bottom:2px solid #ddd;margin-bottom:25px;font-size:15px;box-sizing:border-box;">
    <div class="auth-error" style="color:#e74c3c;font-size:14px;margin-bottom:15px;display:none;"></div>
    <button type="submit" style="width:100%;padding:12px;background:#27ae60;color:white;border:none;font-size:15px;font-weight:500;cursor:pointer;">REGISTRARSE</button>
  </form>
</div>`,
};