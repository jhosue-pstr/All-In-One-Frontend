export const BloqueProductoDestacado = {
  id: "tienda-producto-destacado",
  label: "Producto Destacado",
  category: "Tienda",
  attributes: { class: "fa fa-star" },
  content: `<section data-tienda="featured-product" data-sitio-id="{{SITIO_ID}}" style="padding:50px 20px;">
  <div style="max-width:1000px;margin:0 auto;background:linear-gradient(135deg,#0f172a 0%,#1e293b 100%);border-radius:24px;overflow:hidden;position:relative;">
    <span style="position:absolute;top:20px;left:20px;background:#f59e0b;color:#0f172a;font-size:12px;font-weight:800;padding:6px 14px;border-radius:999px;text-transform:uppercase;letter-spacing:1px;z-index:2;">Destacado</span>

    <div data-tienda-item style="display:flex;flex-wrap:wrap;align-items:center;gap:0;">
      <div style="flex:1;min-width:300px;padding:50px 40px;">
        <h2 data-tienda-product-name style="font-size:38px;margin:0 0 12px 0;color:white;line-height:1.1;">Producto destacado</h2>
        <p data-tienda-product-desc style="font-size:16px;color:#94a3b8;line-height:1.7;margin:0 0 20px 0;">Descripción del producto destacado. Ideal para mostrar tu mejor producto o promoción especial.</p>
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:24px;">
          <span data-tienda-product-price style="font-size:32px;font-weight:800;color:white;">S/ 199.90</span>
          <span data-tienda-product-compare style="display:none;font-size:16px;color:#64748b;text-decoration:line-through;">S/ 249.90</span>
        </div>
        <button data-tienda-add-cart style="padding:14px 32px;background:#f59e0b;color:#0f172a;border:none;border-radius:10px;font-size:16px;font-weight:800;cursor:pointer;">Agregar al carrito</button>
      </div>
      <div style="flex:1;min-width:280px;height:350px;overflow:hidden;">
        <img data-tienda-product-image src="https://placehold.co/600x500/f59e0b/0f172a?text=Destacado" alt="Producto destacado" style="width:100%;height:100%;object-fit:cover;display:block;">
      </div>
    </div>

    <div data-tienda-empty style="display:none;text-align:center;padding:40px;color:#94a3b8;">
      No hay producto destacado disponible.
    </div>
  </div>
</section>`,
};
