export const BloqueProductosGrid = {
  id: "tienda-productos-grid",
  label: "Productos Grid",
  category: "Tienda",
  attributes: { class: "fa fa-store" },
  content: `<section data-tienda="products-grid" data-sitio-id="{{SITIO_ID}}" data-limit="6" style="padding:50px 20px;background:#f8fafc;border-radius:16px;">
  <div style="max-width:1100px;margin:0 auto;">
    <div style="text-align:center;margin-bottom:35px;">
      <h2 style="font-size:34px;margin:0 0 10px 0;color:#0f172a;">Nuestros productos</h2>
      <p style="font-size:16px;color:#64748b;margin:0;">Descubre nuestra selección de productos.</p>
    </div>

    <div data-tienda-list style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:24px;">
      <article data-tienda-item style="background:white;border-radius:14px;overflow:hidden;box-shadow:0 10px 25px rgba(15,23,42,.08);position:relative;">
        <span data-tienda-badge-discount style="display:none;position:absolute;top:12px;left:12px;background:#ef4444;color:white;font-size:11px;font-weight:700;padding:4px 10px;border-radius:999px;z-index:1;">-20%</span>
        <img data-tienda-product-image src="https://placehold.co/700x420/e2e8f0/334155?text=Producto" alt="Producto" style="width:100%;height:190px;object-fit:cover;">
        <div style="padding:20px;">
          <h3 data-tienda-product-name style="font-size:18px;margin:0 0 6px 0;color:#0f172a;">Producto</h3>
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;">
            <span data-tienda-product-price style="font-size:22px;font-weight:800;color:#0f172a;">S/ 99.90</span>
            <span data-tienda-product-compare style="display:none;font-size:14px;color:#94a3b8;text-decoration:line-through;">S/ 129.90</span>
          </div>
          <button data-tienda-add-cart style="width:100%;padding:10px;background:#0f172a;color:white;border:none;border-radius:8px;font-size:14px;font-weight:700;cursor:pointer;">Agregar al carrito</button>
        </div>
      </article>

      <article data-tienda-item style="background:white;border-radius:14px;overflow:hidden;box-shadow:0 10px 25px rgba(15,23,42,.08);position:relative;">
        <span data-tienda-badge-discount style="display:none;position:absolute;top:12px;left:12px;background:#ef4444;color:white;font-size:11px;font-weight:700;padding:4px 10px;border-radius:999px;z-index:1;">-15%</span>
        <img data-tienda-product-image src="https://placehold.co/700x420/dbeafe/1e40af?text=Producto" alt="Producto" style="width:100%;height:190px;object-fit:cover;">
        <div style="padding:20px;">
          <h3 data-tienda-product-name style="font-size:18px;margin:0 0 6px 0;color:#0f172a;">Producto 2</h3>
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;">
            <span data-tienda-product-price style="font-size:22px;font-weight:800;color:#0f172a;">S/ 59.90</span>
            <span data-tienda-product-compare style="display:none;font-size:14px;color:#94a3b8;text-decoration:line-through;">S/ 69.90</span>
          </div>
          <button data-tienda-add-cart style="width:100%;padding:10px;background:#0f172a;color:white;border:none;border-radius:8px;font-size:14px;font-weight:700;cursor:pointer;">Agregar al carrito</button>
        </div>
      </article>

      <article data-tienda-item style="background:white;border-radius:14px;overflow:hidden;box-shadow:0 10px 25px rgba(15,23,42,.08);position:relative;">
        <span data-tienda-badge-discount style="display:none;position:absolute;top:12px;left:12px;background:#ef4444;color:white;font-size:11px;font-weight:700;padding:4px 10px;border-radius:999px;z-index:1;">-30%</span>
        <img data-tienda-product-image src="https://placehold.co/700x420/fef3c7/92400e?text=Producto" alt="Producto" style="width:100%;height:190px;object-fit:cover;">
        <div style="padding:20px;">
          <h3 data-tienda-product-name style="font-size:18px;margin:0 0 6px 0;color:#0f172a;">Producto 3</h3>
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;">
            <span data-tienda-product-price style="font-size:22px;font-weight:800;color:#0f172a;">S/ 149.90</span>
            <span data-tienda-product-compare style="display:none;font-size:14px;color:#94a3b8;text-decoration:line-through;">S/ 199.90</span>
          </div>
          <button data-tienda-add-cart style="width:100%;padding:10px;background:#0f172a;color:white;border:none;border-radius:8px;font-size:14px;font-weight:700;cursor:pointer;">Agregar al carrito</button>
        </div>
      </article>
    </div>

    <div data-tienda-empty style="display:none;text-align:center;padding:30px;color:#64748b;">
      No hay productos disponibles todavía.
    </div>
  </div>
</section>`,
};
