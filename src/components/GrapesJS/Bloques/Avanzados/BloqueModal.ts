export const BloqueModal = {
  id: 'bloque-modal',
  label: 'Modal / Ventana Emergente',
  attributes: {
    class: 'fa fa-window-restore',
    'data-gjs-type': 'advanced',
    'data-category': 'Avanzados'
  },
  content: `<div class="modal-wrapper" style="font-family: sans-serif; position: relative; min-height: 200px;">
  <button onclick="openModal()" style="padding: 12px 24px; background-color: #0066cc; color: white; border: none; border-radius: 6px; font-size: 16px; font-weight: 600; cursor: pointer; transition: background-color 0.2s;" onmouseover="this.style.background='#0052a3'" onmouseout="this.style.background='#0066cc'">
    Abrir Modal
  </button>

  <div id="myModal" class="modal-overlay" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; align-items: center; justify-content: center; animation: fadeIn 0.2s ease;">
    <div class="modal-content" style="background: white; max-width: 500px; width: 90%; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); overflow: hidden; animation: slideUp 0.3s ease;">
      <div style="background: linear-gradient(135deg, #0066cc 0%, #0052a3 100%); padding: 20px; color: white; display: flex; justify-content: space-between; align-items: center;">
        <h3 style="margin: 0; font-size: 20px; font-weight: 600;">Título del Modal</h3>
        <button onclick="closeModal()" style="background: none; border: none; color: white; font-size: 28px; cursor: pointer; line-height: 1; padding: 0; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border-radius: 50%; transition: background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.2)'" onmouseout="this.style.background='none'">×</button>
      </div>
      <div style="padding: 24px; line-height: 1.6; color: #444;">
        <p style="margin-top: 0;">Este es el contenido del modal. Puedes incluir texto, formularios, imágenes o cualquier otro elemento aquí.</p>
        <div style="margin-top: 20px; display: flex; gap: 10px; justify-content: flex-end;">
          <button onclick="closeModal()" style="padding: 10px 20px; border: 1px solid #ddd; background: white; border-radius: 6px; cursor: pointer; font-size: 14px; transition: all 0.2s;" onmouseover="this.style.background='#f8f9fa'; this.style.borderColor='#ccc'" onmouseout="this.style.background='white'; this.style.borderColor='#ddd'">Cancelar</button>
          <button onclick="closeModal(); alert('Acción confirmada');" style="padding: 10px 20px; background-color: #0066cc; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; transition: background 0.2s;" onmouseover="this.style.background='#0052a3'" onmouseout="this.style.background='#0066cc'">Confirmar</button>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
</style>

<script>
function openModal() {
  const modal = document.getElementById('myModal');
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  const modal = document.getElementById('myModal');
  modal.style.display = 'none';
  document.body.style.overflow = 'auto';
}
// Close on background click
document.currentScript.previousElementSibling.querySelector('.modal-overlay').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});
</script>`
}
