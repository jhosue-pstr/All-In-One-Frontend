export const BloqueCategorias = {
  id: "tienda-categorias",
  label: "Categorías",
  category: "Tienda",
  attributes: { class: "fa fa-tags" },
  content: `<section data-tienda="categories" data-sitio-id="{{SITIO_ID}}" style="padding:30px 20px;background:white;border-radius:16px;">
  <div style="max-width:900px;margin:0 auto;text-align:center;">
    <h3 style="font-size:20px;margin:0 0 18px 0;color:#0f172a;">Categorías</h3>
    <div data-tienda-list style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center;">
      <button data-tienda-item data-categoria-id="" style="padding:10px 22px;background:#f1f5f9;color:#0f172a;border:none;border-radius:999px;font-size:14px;font-weight:600;cursor:pointer;transition:background .2s;">
        <span data-tienda-category-name>Categoría</span>
      </button>
      <button data-tienda-item data-categoria-id="" style="padding:10px 22px;background:#f1f5f9;color:#0f172a;border:none;border-radius:999px;font-size:14px;font-weight:600;cursor:pointer;transition:background .2s;">
        <span data-tienda-category-name>Categoría 2</span>
      </button>
      <button data-tienda-item data-categoria-id="" style="padding:10px 22px;background:#f1f5f9;color:#0f172a;border:none;border-radius:999px;font-size:14px;font-weight:600;cursor:pointer;transition:background .2s;">
        <span data-tienda-category-name>Categoría 3</span>
      </button>
    </div>
    <div data-tienda-empty style="display:none;padding:20px;color:#64748b;">
      No hay categorías disponibles.
    </div>
  </div>
</section>`,
};
