export const BloqueHero = {
  id: 'hero',
  label: 'Hero (Doble clic para imagen)',
  attributes: { class: 'fa fa-star' },
  content: `<header style="position: relative; overflow: hidden; padding: 120px 20px; text-align: center; color: white; font-family: sans-serif; min-height: 400px; display: flex; align-items: center; justify-content: center;">
    <img src="https://images.unsplash.com/photo-1556761175-5973dc0f32d7?auto=format&fit=crop&w=1200&q=80" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; z-index: 0;" alt="hero bg" />
    <div style="position: absolute; top:0; left:0; width:100%; height:100%; background: rgba(0,0,0,0.6); z-index: 1; pointer-events: none;"></div>
    <div style="position: relative; z-index: 2; max-width: 800px; margin: 0 auto;">
      <h1 style="font-size: 3.5em; margin-bottom: 20px; font-weight: bold;">Tu Negocio al Siguiente Nivel</h1>
      <p style="font-size: 1.2em; margin-bottom: 30px; line-height: 1.6;">Ofrecemos las mejores soluciones para que alcances tus metas rápidamente y sin complicaciones.</p>
      <a href="#" style="padding: 15px 30px; background: #3498db; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 1.1em; display: inline-block;">Empieza Hoy</a>
    </div>
  </header>`,
};