export const BloqueCheckout = {
  id: "tienda-checkout",
  label: "Checkout",
  category: "Tienda",
  attributes: { class: "fa fa-credit-card" },
  content: `<section data-tienda="checkout" data-sitio-id="{{SITIO_ID}}" style="padding:50px 20px;background:white;border-radius:16px;">
  <div style="max-width:700px;margin:0 auto;">
    <h2 style="font-size:28px;margin:0 0 24px 0;color:#0f172a;">Finalizar compra</h2>

    <form data-tienda-checkout-form>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px;">
        <div style="grid-column:1/-1;">
          <label style="display:block;font-size:14px;font-weight:700;color:#0f172a;margin-bottom:6px;">Nombre completo</label>
          <input data-tienda-field-nombre type="text" required style="width:100%;padding:12px 16px;border:1px solid #e2e8f0;border-radius:10px;font-size:15px;outline:none;box-sizing:border-box;">
        </div>
        <div>
          <label style="display:block;font-size:14px;font-weight:700;color:#0f172a;margin-bottom:6px;">Email</label>
          <input data-tienda-field-email type="email" required style="width:100%;padding:12px 16px;border:1px solid #e2e8f0;border-radius:10px;font-size:15px;outline:none;box-sizing:border-box;">
        </div>
        <div>
          <label style="display:block;font-size:14px;font-weight:700;color:#0f172a;margin-bottom:6px;">Teléfono</label>
          <input data-tienda-field-telefono type="tel" style="width:100%;padding:12px 16px;border:1px solid #e2e8f0;border-radius:10px;font-size:15px;outline:none;box-sizing:border-box;">
        </div>
        <div style="grid-column:1/-1;">
          <label style="display:block;font-size:14px;font-weight:700;color:#0f172a;margin-bottom:6px;">Dirección de envío</label>
          <input data-tienda-field-direccion type="text" style="width:100%;padding:12px 16px;border:1px solid #e2e8f0;border-radius:10px;font-size:15px;outline:none;box-sizing:border-box;">
        </div>
        <div>
          <label style="display:block;font-size:14px;font-weight:700;color:#0f172a;margin-bottom:6px;">Ciudad</label>
          <input data-tienda-field-ciudad type="text" style="width:100%;padding:12px 16px;border:1px solid #e2e8f0;border-radius:10px;font-size:15px;outline:none;box-sizing:border-box;">
        </div>
        <div>
          <label style="display:block;font-size:14px;font-weight:700;color:#0f172a;margin-bottom:6px;">País</label>
          <input data-tienda-field-pais type="text" style="width:100%;padding:12px 16px;border:1px solid #e2e8f0;border-radius:10px;font-size:15px;outline:none;box-sizing:border-box;">
        </div>
        <div>
          <label style="display:block;font-size:14px;font-weight:700;color:#0f172a;margin-bottom:6px;">Código postal</label>
          <input data-tienda-field-codigo-postal type="text" style="width:100%;padding:12px 16px;border:1px solid #e2e8f0;border-radius:10px;font-size:15px;outline:none;box-sizing:border-box;">
        </div>
        <div>
          <label style="display:block;font-size:14px;font-weight:700;color:#0f172a;margin-bottom:6px;">Método de pago</label>
          <select data-tienda-field-metodo-pago style="width:100%;padding:12px 16px;border:1px solid #e2e8f0;border-radius:10px;font-size:15px;outline:none;background:white;box-sizing:border-box;">
            <option value="efectivo">Efectivo</option>
            <option value="tarjeta">Tarjeta de crédito/débito</option>
            <option value="transferencia">Transferencia bancaria</option>
            <option value="yape">Yape / Plin</option>
          </select>
        </div>
        <div style="grid-column:1/-1;">
          <label style="display:block;font-size:14px;font-weight:700;color:#0f172a;margin-bottom:6px;">Notas del pedido</label>
          <textarea data-tienda-field-notas rows="3" style="width:100%;padding:12px 16px;border:1px solid #e2e8f0;border-radius:10px;font-size:15px;outline:none;resize:vertical;box-sizing:border-box;font-family:inherit;"></textarea>
        </div>
      </div>

      <button type="submit" style="width:100%;padding:16px;background:#0f172a;color:white;border:none;border-radius:12px;font-size:17px;font-weight:800;cursor:pointer;">Confirmar pedido</button>
    </form>

    <div data-tienda-checkout-success style="display:none;text-align:center;padding:40px;background:#f0fdf4;border-radius:16px;margin-top:20px;">
      <div style="font-size:48px;margin-bottom:12px;">✓</div>
      <h3 style="font-size:22px;color:#16a34a;margin:0 0 8px 0;">Pedido confirmado</h3>
      <p data-tienda-checkout-message style="color:#166534;margin:0;">Tu pedido ha sido procesado exitosamente.</p>
    </div>

    <div data-tienda-checkout-error style="display:none;text-align:center;padding:20px;background:#fef2f2;border-radius:12px;margin-top:12px;color:#ef4444;font-size:14px;">
      Error al procesar el pedido. Intenta nuevamente.
    </div>
  </div>
</section>`,
};
