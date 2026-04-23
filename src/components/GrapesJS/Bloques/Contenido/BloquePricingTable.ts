export const BloquePricingTable = {
  id: 'pricing',
  label: 'Tabla de Precios',
  attributes: { class: 'fa fa-tags' },
  content: `<div style="display:flex; gap:20px; font-family:sans-serif;">
    <div style="border:1px solid #ddd; padding:20px; border-radius:8px; flex:1;">
      <h3>Básico</h3><p>$10/mes</p><button>Comprar</button>
    </div>
    <div style="border:1px solid #ddd; padding:20px; border-radius:8px; flex:1;">
      <h3>Premium</h3><p>$20/mes</p><button>Comprar</button>
    </div>
  </div>`,
};