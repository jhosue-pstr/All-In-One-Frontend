export const BloqueAccordion = {
  id: 'bloque-accordion',
  label: 'Acordeón (FAQ)',
  attributes: {
    class: 'fa fa-list-ul',
    'data-gjs-type': 'advanced',
    'data-category': 'Avanzados'
  },
  content: `<div class="accordion-container" style="font-family: sans-serif; max-width: 700px; margin: 20px auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
  <div class="accordion-item" style="border-bottom: 1px solid #e0e0e0;">
    <button class="accordion-header" style="width: 100%; padding: 16px 20px; background: #f8f9fa; border: none; text-align: left; font-size: 16px; font-weight: 600; color: #333; cursor: pointer; display: flex; justify-content: space-between; align-items: center; transition: background 0.2s;" onmouseover="this.style.background='#e9ecef'" onmouseout="this.style.background='#f8f9fa'">
      ¿Cómo puedo resetear mi contraseña?
      <span style="font-size: 18px;">+</span>
    </button>
    <div class="accordion-content" style="padding: 0 20px; max-height: 0; overflow: hidden; transition: max-height 0.3s ease-out, padding 0.3s ease; background: white;">
      <p style="margin: 0; padding: 16px 0; color: #555; line-height: 1.6;">Para resetear tu contraseña, haz clic en "¿Olvidaste tu contraseña?" en la página de login y sigue las instrucciones que te enviaremos a tu correo electrónico. El enlace será válido por 24 horas.</p>
    </div>
  </div>
  <div class="accordion-item" style="border-bottom: 1px solid #e0e0e0;">
    <button class="accordion-header" style="width: 100%; padding: 16px 20px; background: #f8f9fa; border: none; text-align: left; font-size: 16px; font-weight: 600; color: #333; cursor: pointer; display: flex; justify-content: space-between; align-items: center; transition: background 0.2s;" onmouseover="this.style.background='#e9ecef'" onmouseout="this.style.background='#f8f9fa'">
      ¿Cuáles son los métodos de pago aceptados?
      <span style="font-size: 18px;">+</span>
    </button>
    <div class="accordion-content" style="padding: 0 20px; max-height: 0; overflow: hidden; transition: max-height 0.3s ease-out, padding 0.3s ease; background: white;">
      <p style="margin: 0; padding: 16px 0; color: #555; line-height: 1.6;">Aceptamos tarjetas de crédito/débito (Visa, Mastercard, American Express), PayPal, transferencia bancaria y efectivo en puntos de pago autorizados.</p>
    </div>
  </div>
  <div class="accordion-item" style="border-bottom: none;">
    <button class="accordion-header" style="width: 100%; padding: 16px 20px; background: #f8f9fa; border: none; text-align: left; font-size: 16px; font-weight: 600; color: #333; cursor: pointer; display: flex; justify-content: space-between; align-items: center; transition: background 0.2s;" onmouseover="this.style.background='#e9ecef'" onmouseout="this.style.background='#f8f9fa'">
      ¿Cómo contacto al soporte al cliente?
      <span style="font-size: 18px;">+</span>
    </button>
    <div class="accordion-content" style="padding: 0 20px; max-height: 0; overflow: hidden; transition: max-height 0.3s ease-out, padding 0.3s ease; background: white;">
      <p style="margin: 0; padding: 16px 0; color: #555; line-height: 1.6;">Puedes contactarnos por email a soporte@ejemplo.com, por teléfono al +1 800 123 4567 (L-V 9am-6pm), o mediante nuestro chat en vivo disponible 24/7.</p>
    </div>
  </div>
</div>

<script>
(function() {
  document.currentScript.previousElementSibling.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', function() {
      const content = this.nextElementSibling;
      const isOpen = content.style.maxHeight && content.style.maxHeight !== '0px';

      // Close all others
      document.currentScript.previousElementSibling.querySelectorAll('.accordion-content').forEach(c => {
        c.style.maxHeight = '0';
        c.style.padding = '0 20px';
      });
      document.currentScript.previousElementSibling.querySelectorAll('.accordion-header span').forEach(s => s.textContent = '+');

      // Toggle current
      if (!isOpen) {
        content.style.maxHeight = content.scrollHeight + 'px';
        content.style.padding = '0 20px 16px 20px';
        this.querySelector('span').textContent = '−';
      }
    });
  });
})();
</script>`
}
