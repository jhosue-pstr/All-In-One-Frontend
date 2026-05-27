export const BloqueProductoLista = {
  id: "tienda-productos-lista",
  label: "Productos Lista",
  category: "Tienda",
  attributes: { class: "fa fa-list" },
  content: `<section data-tienda="products-list" data-sitio-id="{{SITIO_ID}}" data-limit="8" style="padding:50px 20px;background:white;border-radius:16px;">
  <div style="max-width:900px;margin:0 auto;">
    <div style="text-align:center;margin-bottom:35px;">
      <h2 style="font-size:34px;margin:0 0 10px 0;color:#0f172a;">Productos</h2>
      <p style="font-size:16px;color:#64748b;margin:0;">Explora nuestro catálogo completo.</p>
    </div>

    <div data-tienda-list>
      <article data-tienda-item style="display:flex;gap:20px;padding:20px 0;border-bottom:1px solid #e2e8f0;">
        <img data-tienda-product-image src="https://placehold.co/140x140/e2e8f0/334155?text=P" alt="Producto" style="width:120px;height:120px;object-fit:cover;border-radius:12px;flex-shrink:0;">
        <div style="flex:1;display:flex;flex-direction:column;justify-content:center;">
          <h3 data-tienda-product-name style="font-size:18px;margin:0 0 4px 0;color:#0f172a;">Producto</h3>
          <p data-tienda-product-desc style="font-size:14px;color:#64748b;margin:0 0 8px 0;">Descripción breve del producto.</p>
          <span data-tienda-product-price style="font-size:20px;font-weight:800;color:#0f172a;">S/ 99.90</span>
          <span data-tienda-product-compare style="display:none;font-size:13px;color:#94a3b8;text-decoration:line-through;">S/ 129.90</span>
        </div>
        <div style="display:flex;flex-direction:column;justify-content:center;gap:8px;">
          <button data-tienda-add-cart style="padding:8px 18px;background:#0f172a;color:white;border:none;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;white-space:nowrap;">Agregar</button>
        </div>
      </article>

      <article data-tienda-item style="display:flex;gap:20px;padding:20px 0;border-bottom:1px solid #e2e8f0;">
        <img data-tienda-product-image src="https://placehold.co/140x140/dbeafe/1e40af?text=P" alt="Producto" style="width:120px;height:120px;object-fit:cover;border-radius:12px;flex-shrink:0;">
        <div style="flex:1;display:flex;flex-direction:column;justify-content:center;">
          <h3 data-tienda-product-name style="font-size:18px;margin:0 0 4px 0;color:#0f172a;">Producto 2</h3>
          <p data-tienda-product-desc style="font-size:14px;color:#64748b;margin:0 0 8px 0;">Descripción breve del segundo producto.</p>
          <span data-tienda-product-price style="font-size:20px;font-weight:800;color:#0f172a;">S/ 59.90</span>
          <span data-tienda-product-compare style="display:none;font-size:13px;color:#94a3b8;text-decoration:line-through;">S/ 69.90</span>
        </div>
        <div style="display:flex;flex-direction:column;justify-content:center;gap:8px;">
          <button data-tienda-add-cart style="padding:8px 18px;background:#0f172a;color:white;border:none;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;white-space:nowrap;">Agregar</button>
        </div>
      </article>

      <article data-tienda-item style="display:flex;gap:20px;padding:20px 0;border-bottom:1px solid #e2e8f0;">
        <img data-tienda-product-image src="https://placehold.co/140x140/fef3c7/92400e?text=P" alt="Producto" style="width:120px;height:120px;object-fit:cover;border-radius:12px;flex-shrink:0;">
        <div style="flex:1;display:flex;flex-direction:column;justify-content:center;">
          <h3 data-tienda-product-name style="font-size:18px;margin:0 0 4px 0;color:#0f172a;">Producto 3</h3>
          <p data-tienda-product-desc style="font-size:14px;color:#64748b;margin:0 0 8px 0;">Descripción breve del tercer producto.</p>
          <span data-tienda-product-price style="font-size:20px;font-weight:800;color:#0f172a;">S/ 149.90</span>
          <span data-tienda-product-compare style="display:none;font-size:13px;color:#94a3b8;text-decoration:line-through;">S/ 199.90</span>
        </div>
        <div style="display:flex;flex-direction:column;justify-content:center;gap:8px;">
          <button data-tienda-add-cart style="padding:8px 18px;background:#0f172a;color:white;border:none;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;white-space:nowrap;">Agregar</button>
        </div>
      </article>
    </div>

    <div data-tienda-empty style="display:none;text-align:center;padding:30px;color:#64748b;">
      No hay productos disponibles todavía.
    </div>
  </div>
</section>`,
};
