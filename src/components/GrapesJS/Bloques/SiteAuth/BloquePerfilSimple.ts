export const BloquePerfilSimple = {
  id: "auth-perfil-simple",
  label: "Perfil Simple",
  category: "Auth",
  attributes: { class: "fa fa-user" },
  content: `<div style="padding:25px;background:#fff;border-radius:12px;max-width:350px;">
  <div style="display:flex;align-items:center;gap:15px;margin-bottom:20px;">
    <img src="https://placehold.co/80x80/667eea/ffffff?text=JD" style="width:70px;height:70px;border-radius:50%;">
    <div>
      <h3 style="margin:0 0 5px 0;font-size:18px;">Juan Doe</h3>
      <p style="margin:0;color:#666;font-size:14px;">juan@email.com</p>
    </div>
  </div>
  <div style="display:flex;gap:10px;">
    <button style="flex:1;padding:10px;background:#667eea;color:white;border:none;border-radius:6px;font-size:14px;font-weight:500;cursor:pointer;">Editar Perfil</button>
    <button style="padding:10px;background:#fff;border:1px solid #e0e0e0;border-radius:6px;font-size:14px;cursor:pointer;">Salir</button>
  </div>
</div>`,
};