export const BloqueContacto = {
  id: "seccion-contacto",
  label: "Contacto",
  category: "Seccion",
  attributes: { class: "fa fa-envelope" },
  content: `<section style="padding:60px 20px;background:#f8f9fa;">
  <h2 style="text-align:center;margin:0 0 40px 0;font-size:32px;">Cont&aacute;ctanos</h2>
  <form style="max-width:500px;margin:0 auto;display:flex;flex-direction:column;gap:15px;">
    <input type="text" placeholder="Tu nombre" style="padding:14px;border:1px solid #ddd;border-radius:8px;font-size:15px;">
    <input type="email" placeholder="Tu email" style="padding:14px;border:1px solid #ddd;border-radius:8px;font-size:15px;">
    <input type="tel" placeholder="Tu tel&eacute;fono" style="padding:14px;border:1px solid #ddd;border-radius:8px;font-size:15px;">
    <textarea placeholder="Tu mensaje" rows="5" style="padding:14px;border:1px solid #ddd;border-radius:8px;font-size:15px;resize:vertical;"></textarea>
    <button type="submit" style="padding:14px;background:#667eea;color:white;border:none;border-radius:8px;font-size:16px;font-weight:600;cursor:pointer;">Enviar Mensaje</button>
  </form>
  <div style="text-align:center;margin-top:40px;color:#666;font-size:15px;">
    <p style="margin:5px 0;">&#128205; Direcci&oacute;n, Lima</p>
    <p style="margin:5px 0;">&#128222; +51 999 999 999</p>
    <p style="margin:5px 0;">&#128231; email@tuempresa.com</p>
  </div>
</section>`,
};