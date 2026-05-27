export const BloqueProductoDetalle = {
  id: "tienda-producto-detalle",
  label: "Producto Detalle",
  category: "Tienda",
  attributes: { class: "fa fa-eye" },
  content: `<section data-tienda="product-detail" data-sitio-id="{{SITIO_ID}}" data-producto-id="" style="padding:50px 20px;background:white;border-radius:16px;">
  <div data-tienda-item style="max-width:1000px;margin:0 auto;display:flex;flex-wrap:wrap;gap:40px;">
    <div style="flex:1;min-width:300px;">
      <img data-tienda-product-image src="https://placehold.co/600x600/e2e8f0/334155?text=Producto" alt="Producto" style="width:100%;border-radius:20px;display:block;">
    </div>
    <div style="flex:1;min-width:300px;">
      <span data-tienda-category-name style="display:inline-block;font-size:13px;color:#2563eb;font-weight:700;margin-bottom:10px;">Categoría</span>
      <h1 data-tienda-product-name style="font-size:32px;margin:0 0 12px 0;color:#0f172a;">Nombre del producto</h1>
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
        <span data-tienda-product-price style="font-size:28px;font-weight:800;color:#0f172a;">S/ 99.90</span>
        <span data-tienda-product-compare style="display:none;font-size:16px;color:#94a3b8;text-decoration:line-through;">S/ 129.90</span>
      </div>
      <p data-tienda-product-desc style="font-size:16px;color:#475569;line-height:1.7;margin:0 0 20px 0;">Descripción completa del producto. Aquí se muestran los detalles, características y especificaciones del producto seleccionado.</p>
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
        <span style="font-size:14px;color:#64748b;">Stock:</span>
        <span data-tienda-product-stock style="font-size:14px;font-weight:700;color:#16a34a;">Disponible</span>
      </div>
      <div style="display:flex;align-items:center;gap:12px;margin:24px 0;">
        <div style="display:flex;align-items:center;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;">
          <button data-tienda-qty-minus style="width:40px;height:40px;border:none;background:#f8fafc;font-size:18px;cursor:pointer;color:#0f172a;font-weight:700;">−</button>
          <span data-tienda-qty-value style="width:44px;text-align:center;font-size:16px;font-weight:700;color:#0f172a;">1</span>
          <button data-tienda-qty-plus style="width:40px;height:40px;border:none;background:#f8fafc;font-size:18px;cursor:pointer;color:#0f172a;font-weight:700;">+</button>
        </div>
        <button data-tienda-add-cart style="padding:12px 28px;background:#0f172a;color:white;border:none;border-radius:10px;font-size:15px;font-weight:700;cursor:pointer;">Agregar al carrito</button>
      </div>
    </div>
  </div>

  <div data-tienda-empty style="display:none;text-align:center;padding:40px;color:#64748b;">
    Producto no encontrado.
  </div>
</section>`,
};
