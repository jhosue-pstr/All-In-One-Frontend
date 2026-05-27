export const BloqueCarrito = {
  id: "tienda-carrito",
  label: "Carrito",
  category: "Tienda",
  attributes: { class: "fa fa-shopping-cart" },
  content: `<section data-tienda="cart" data-sitio-id="{{SITIO_ID}}" style="padding:50px 20px;background:#f8fafc;border-radius:16px;">
  <div style="max-width:900px;margin:0 auto;">
    <h2 style="font-size:28px;margin:0 0 24px 0;color:#0f172a;">Carrito de compras</h2>

    <div data-tienda-list>
      <div data-tienda-item data-tienda-item-id="" style="display:flex;align-items:center;gap:16px;padding:16px;background:white;border-radius:12px;margin-bottom:12px;box-shadow:0 2px 8px rgba(15,23,42,.06);">
        <img data-tienda-product-image src="https://placehold.co/80x80/e2e8f0/334155?text=P" alt="" style="width:64px;height:64px;object-fit:cover;border-radius:10px;flex-shrink:0;">
        <div style="flex:1;min-width:0;">
          <h4 data-tienda-product-name style="font-size:15px;margin:0 0 4px 0;color:#0f172a;">Producto</h4>
          <span data-tienda-product-price style="font-size:14px;font-weight:700;color:#0f172a;">S/ 99.90</span>
        </div>
        <div style="display:flex;align-items:center;gap:6px;">
          <button data-tienda-qty-minus style="width:32px;height:32px;border:1px solid #e2e8f0;border-radius:6px;background:white;font-size:16px;cursor:pointer;color:#0f172a;">−</button>
          <span data-tienda-qty-value style="width:32px;text-align:center;font-size:14px;font-weight:700;color:#0f172a;">1</span>
          <button data-tienda-qty-plus style="width:32px;height:32px;border:1px solid #e2e8f0;border-radius:6px;background:white;font-size:16px;cursor:pointer;color:#0f172a;">+</button>
        </div>
        <span data-tienda-item-subtotal style="font-size:15px;font-weight:800;color:#0f172a;min-width:80px;text-align:right;">S/ 99.90</span>
        <button data-tienda-item-remove style="width:36px;height:36px;border:none;border-radius:8px;background:#fef2f2;color:#ef4444;font-size:18px;cursor:pointer;flex-shrink:0;">×</button>
      </div>

      <div data-tienda-item data-tienda-item-id="" style="display:flex;align-items:center;gap:16px;padding:16px;background:white;border-radius:12px;margin-bottom:12px;box-shadow:0 2px 8px rgba(15,23,42,.06);">
        <img data-tienda-product-image src="https://placehold.co/80x80/dbeafe/1e40af?text=P" alt="" style="width:64px;height:64px;object-fit:cover;border-radius:10px;flex-shrink:0;">
        <div style="flex:1;min-width:0;">
          <h4 data-tienda-product-name style="font-size:15px;margin:0 0 4px 0;color:#0f172a;">Producto 2</h4>
          <span data-tienda-product-price style="font-size:14px;font-weight:700;color:#0f172a;">S/ 59.90</span>
        </div>
        <div style="display:flex;align-items:center;gap:6px;">
          <button data-tienda-qty-minus style="width:32px;height:32px;border:1px solid #e2e8f0;border-radius:6px;background:white;font-size:16px;cursor:pointer;color:#0f172a;">−</button>
          <span data-tienda-qty-value style="width:32px;text-align:center;font-size:14px;font-weight:700;color:#0f172a;">2</span>
          <button data-tienda-qty-plus style="width:32px;height:32px;border:1px solid #e2e8f0;border-radius:6px;background:white;font-size:16px;cursor:pointer;color:#0f172a;">+</button>
        </div>
        <span data-tienda-item-subtotal style="font-size:15px;font-weight:800;color:#0f172a;min-width:80px;text-align:right;">S/ 119.80</span>
        <button data-tienda-item-remove style="width:36px;height:36px;border:none;border-radius:8px;background:#fef2f2;color:#ef4444;font-size:18px;cursor:pointer;flex-shrink:0;">×</button>
      </div>
    </div>

    <div style="text-align:right;padding:20px 0;border-top:2px solid #e2e8f0;margin-top:16px;">
      <div style="font-size:18px;color:#64748b;margin-bottom:8px;">
        Total: <span data-tienda-cart-total style="font-size:28px;font-weight:800;color:#0f172a;margin-left:12px;">S/ 219.70</span>
      </div>
      <a data-tienda-checkout-link href="#checkout" style="display:inline-block;padding:14px 36px;background:#0f172a;color:white;border:none;border-radius:10px;font-size:16px;font-weight:700;cursor:pointer;text-decoration:none;">Proceder al pago</a>
    </div>

    <div data-tienda-empty style="display:none;text-align:center;padding:40px;color:#64748b;">
      Tu carrito está vacío.
    </div>
  </div>
</section>`,
};
