export { BloqueSeccion } from './BloqueSeccion';
export { BloqueTexto } from './BloqueTexto';
export { BloqueImagen } from './BloqueImagen';

export { Bloque3Columnas, Bloque4Columnas, Bloque2Columnas, BloqueCaja, BloqueCard, BloqueLayoutSidebar } from './Layout';

export { BloqueHeading, BloqueParagraph, BloqueLink, BloqueLista, BloqueIcono, BloqueSpacer, BloqueQuote, BloqueBadge, BloqueBoton, BloqueDivider } from './Contenido';

export { BloqueMap, BloqueVideo, BloqueGallery } from './Multimedia';

export { BloqueHero, BloqueNavbar, BloqueFooter } from './Secciones';

export const allBlocks = [
  import('./BloqueSeccion').then(m => m.BloqueSeccion),
  import('./BloqueTexto').then(m => m.BloqueTexto),
  import('./BloqueImagen').then(m => m.BloqueImagen),
  import('./Layout/Bloque3Columnas').then(m => m.Bloque3Columnas),
  import('./Layout/Bloque4Columnas').then(m => m.Bloque4Columnas),
  import('./Layout/Bloque2Columnas').then(m => m.Bloque2Columnas),
  import('./Layout/BloqueCaja').then(m => m.BloqueCaja),
  import('./Layout/BloqueCard').then(m => m.BloqueCard),
  import('./Layout/BloqueLayoutSidebar').then(m => m.BloqueLayoutSidebar),
  import('./Contenido/BloqueHeading').then(m => m.BloqueHeading),
  import('./Contenido/BloqueParagraph').then(m => m.BloqueParagraph),
  import('./Contenido/BloqueLink').then(m => m.BloqueLink),
  import('./Contenido/BloqueLista').then(m => m.BloqueLista),
  import('./Contenido/BloqueIcono').then(m => m.BloqueIcono),
  import('./Contenido/BloqueSpacer').then(m => m.BloqueSpacer),
  import('./Contenido/BloqueQuote').then(m => m.BloqueQuote),
  import('./Contenido/BloqueBadge').then(m => m.BloqueBadge),
  import('./Contenido/BloqueBoton').then(m => m.BloqueBoton),
  import('./Contenido/BloqueDivider').then(m => m.BloqueDivider),
  import('./Multimedia/BloqueMap').then(m => m.BloqueMap),
  import('./Multimedia/BloqueVideo').then(m => m.BloqueVideo),
  import('./Multimedia/BloqueGallery').then(m => m.BloqueGallery),
  import('./Secciones/BloqueHero').then(m => m.BloqueHero),
  import('./Secciones/BloqueNavbar').then(m => m.BloqueNavbar),
  import('./Secciones/BloqueFooter').then(m => m.BloqueFooter),
];

export const bloquesDefaults = [
  {
    id: 'section',
    label: '<b>Sección Vacía</b>',
    attributes: { class: 'fa fa-square-o' },
    content: `<section style="padding: 50px 20px; min-height: 100px;"></section>`,
  },
  {
    id: 'text',
    label: 'Texto',
    attributes: { class: 'fa fa-font' },
    content: '<div data-gjs-type="text" style="padding: 10px;">Inserta tu texto aquí...</div>',
  },
  {
    id: 'image',
    label: 'Imagen',
    attributes: { class: 'fa fa-picture-o' },
    select: true,
    content: { type: 'image' },
    activate: true,
  },
  {
    id: '3-columns',
    label: '3 Columnas',
    attributes: { class: 'fa fa-columns' },
    content: `<div style="display: flex; flex-wrap: wrap; gap: 20px; padding: 20px; min-height: 150px;">
      <div style="flex: 1; min-width: 250px; padding: 15px; background: #f8f9fa; border: 1px dashed #ccc;">Columna 1</div>
      <div style="flex: 1; min-width: 250px; padding: 15px; background: #f8f9fa; border: 1px dashed #ccc;">Columna 2</div>
      <div style="flex: 1; min-width: 250px; padding: 15px; background: #f8f9fa; border: 1px dashed #ccc;">Columna 3</div>
    </div>`,
  },
  {
    id: '4-columns',
    label: '4 Columnas',
    attributes: { class: 'fa fa-th-large' },
    content: `<div style="display: flex; flex-wrap: wrap; gap: 15px; padding: 20px; min-height: 150px;">
      <div style="flex: 1; min-width: 200px; padding: 15px; background: #f8f9fa; border: 1px dashed #ccc;">Col. 1</div>
      <div style="flex: 1; min-width: 200px; padding: 15px; background: #f8f9fa; border: 1px dashed #ccc;">Col. 2</div>
      <div style="flex: 1; min-width: 200px; padding: 15px; background: #f8f9fa; border: 1px dashed #ccc;">Col. 3</div>
      <div style="flex: 1; min-width: 200px; padding: 15px; background: #f8f9fa; border: 1px dashed #ccc;">Col. 4</div>
    </div>`,
  },
  {
    id: 'columns',
    label: '2 Columnas',
    attributes: { class: 'fa fa-columns' },
    content: `<div style="display: flex; flex-wrap: wrap; gap: 20px; padding: 20px;">
      <div style="flex: 1; min-width: 300px; padding: 20px; background: #f8f9fa;">Columna Izquierda</div>
      <div style="flex: 1; min-width: 300px; padding: 20px; background: #f8f9fa;">Columna Derecha</div>
    </div>`,
  },
  {
    id: 'box',
    label: 'Caja Libre (Div)',
    attributes: { class: 'fa fa-square-o' },
    content: `<div style="min-height: 100px; padding: 20px; border: 1px dashed #ccc; background-color: #f8f9fa; width: 100%; display: block;"></div>`,
  },
  {
    id: 'card',
    label: 'Tarjeta (Card)',
    attributes: { class: 'fa fa-id-card-o' },
    content: `<div style="border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; background: white; max-width: 300px; margin: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); display: inline-block;">
      <img src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=300&q=80" style="width: 100%; height: 200px; object-fit: cover;" alt="Card image"/>
      <div style="padding: 20px;">
        <h3 style="margin-top: 0; color: #333; font-family: sans-serif;">Título de Tarjeta</h3>
        <p style="color: #666; font-size: 14px; line-height: 1.5; font-family: sans-serif;">Una caja con imagen, texto y botón, ideal para listar servicios, artículos de blog o productos.</p>
        <a href="#" style="display: inline-block; padding: 8px 15px; background: #3498db; color: white; text-decoration: none; border-radius: 4px; font-size: 14px; font-family: sans-serif;">Leer más</a>
      </div>
    </div>`,
  },
  {
    id: 'layout-sidebar-right',
    label: 'Contenido + Lateral',
    attributes: { class: 'fa fa-columns' },
    content: `<div style="display: flex; flex-wrap: wrap; gap: 30px; padding: 20px; min-height: 200px;">
      <div style="flex: 3; min-width: 300px; padding: 20px; background: #ffffff; border: 1px dashed #ccc;">Contenido Principal (75%)</div>
      <div style="flex: 1; min-width: 250px; padding: 20px; background: #f8f9fa; border: 1px dashed #ccc;">Barra Lateral (25%)</div>
    </div>`,
  },
  {
    id: 'heading',
    label: 'Título (H2)',
    attributes: { class: 'fa fa-header' },
    content: `<h2 style="font-family: sans-serif; color: #333; margin-top: 0; margin-bottom: 15px;">Escribe tu título aquí</h2>`,
  },
  {
    id: 'paragraph',
    label: 'Párrafo',
    attributes: { class: 'fa fa-align-left' },
    content: `<p style="font-family: sans-serif; color: #666; line-height: 1.6; margin-top: 0; margin-bottom: 15px;">Este es un bloque de párrafo. Puedes usarlo para escribir descripciones largas, artículos o cualquier texto informativo.</p>`,
  },
  {
    id: 'link',
    label: 'Enlace (Link)',
    attributes: { class: 'fa fa-link' },
    content: `<a href="#" style="color: #3498db; text-decoration: none; font-family: sans-serif; font-weight: bold;">Texto del enlace</a>`,
  },
  {
    id: 'list',
    label: 'Lista de Puntos',
    attributes: { class: 'fa fa-list-ul' },
    content: `<ul style="font-family: sans-serif; color: #555; line-height: 1.8; margin-left: 20px;">
      <li>Primer elemento de la lista</li>
      <li>Segundo elemento importante</li>
      <li>Tercer punto a destacar</li>
    </ul>`,
  },
  {
    id: 'icon',
    label: 'Ícono Libre',
    attributes: { class: 'fa fa-star' },
    content: `<i class="fa fa-star" style="font-size: 32px; color: #f1c40f; display: inline-block; padding: 10px;"></i>`,
  },
  {
    id: 'spacer',
    label: 'Espaciador',
    attributes: { class: 'fa fa-arrows-v' },
    content: `<div style="height: 50px; width: 100%; display: block; clear: both;"></div>`,
  },
  {
    id: 'quote',
    label: 'Cita (Blockquote)',
    attributes: { class: 'fa fa-quote-right' },
    content: `<blockquote style="border-left: 5px solid #3498db; margin: 20px 0; padding: 15px 20px; font-style: italic; color: #555; font-size: 1.2em; font-family: sans-serif; background: #f8f9fa;">"El diseño no es solo lo que se ve y se siente. El diseño es cómo funciona."</blockquote>`,
  },
  {
    id: 'badge',
    label: 'Etiqueta (Badge)',
    attributes: { class: 'fa fa-tag' },
    content: `<span style="display: inline-block; padding: 5px 12px; background-color: #e74c3c; color: white; border-radius: 20px; font-size: 12px; font-weight: bold; font-family: sans-serif;">NUEVO</span>`,
  },
  {
    id: 'button',
    label: 'Botón Simple',
    attributes: { class: 'fa fa-square' },
    content: '<a href="#" style="display: inline-block; padding: 12px 24px; background: #000; color: #fff; text-decoration: none; border-radius: 4px; text-align: center;">Haz clic aquí</a>',
  },
  {
    id: 'divider',
    label: 'Separador',
    attributes: { class: 'fa fa-minus' },
    content: '<hr style="margin: 40px 0; border: none; border-top: 1px solid #e2e8f0;">',
  },
  {
    id: 'map',
    label: 'Google Maps',
    attributes: { class: 'fa fa-map-marker' },
    content: `<div style="padding: 10px; width: 100%;">
      <iframe width="100%" height="350" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://maps.google.com/maps?q=Juliaca,Peru&t=&z=13&ie=UTF8&iwloc=&output=embed" style="border-radius: 8px; border: 1px solid #ddd;"></iframe>
    </div>`,
  },
  {
    id: 'video',
    label: 'Video YouTube',
    attributes: { class: 'fa fa-youtube-play' },
    content: `<div style="padding: 10px; width: 100%; display: flex; justify-content: center;">
      <iframe width="560" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);"></iframe>
    </div>`,
  },
  {
    id: 'image-gallery',
    label: 'Galería de Proyectos',
    attributes: { class: 'fa fa-th' },
    content: `
      <section style="padding: 60px 20px; text-align: center; font-family: sans-serif;">
        <h2 style="font-size: 2.5em; color: #333; margin-bottom: 40px;">Nuestros Trabajos</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; max-width: 1200px; margin: 0 auto;">
          <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80" style="width: 100%; height: 250px; object-fit: cover; border-radius: 8px;" alt="Proyecto 1"/>
          <img src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=400&q=80" style="width: 100%; height: 250px; object-fit: cover; border-radius: 8px;" alt="Proyecto 2"/>
          <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&q=80" style="width: 100%; height: 250px; object-fit: cover; border-radius: 8px;" alt="Proyecto 3"/>
          <img src="https://images.unsplash.com/photo-1556761175-5973dc0f32d7?auto=format&fit=crop&w=400&q=80" style="width: 100%; height: 250px; object-fit: cover; border-radius: 8px;" alt="Proyecto 4"/>
        </div>
      </section>`,
  },
  {
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
  },
  {
    id: 'navbar',
    label: 'Navegación Simple',
    attributes: { class: 'fa fa-bars' },
    content: `<nav style="display: flex; justify-content: space-between; align-items: center; padding: 20px 50px; background: #ffffff; box-shadow: 0 2px 5px rgba(0,0,0,0.1); font-family: sans-serif;">
      <div style="font-weight: bold; font-size: 24px; color: #333;">Mi Empresa</div>
      <div style="display: flex; gap: 30px;">
        <a href="#" style="color: #666; text-decoration: none; font-weight: 500;">Inicio</a>
        <a href="#" style="color: #666; text-decoration: none; font-weight: 500;">Servicios</a>
        <a href="#" style="color: #666; text-decoration: none; font-weight: 500;">Contacto</a>
      </div>
    </nav>`,
  },
  {
    id: 'footer',
    label: 'Pie de Página',
    attributes: { class: 'fa fa-long-arrow-down' },
    content: `<footer style="padding: 60px 20px 20px 20px; background: #1e293b; color: #94a3b8; font-family: sans-serif;">
      <div style="max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 40px; margin-bottom: 40px;">
        <div>
          <h3 style="color: white; margin-bottom: 20px; font-size: 1.5em;">Mi Empresa</h3>
          <p style="line-height: 1.6;">Innovando y ofreciendo los mejores servicios desde el primer día.</p>
        </div>
        <div>
          <h4 style="color: white; margin-bottom: 20px;">Enlaces Rápidos</h4>
          <ul style="list-style: none; padding: 0; line-height: 2;">
            <li><a href="#" style="color: #94a3b8; text-decoration: none;">Inicio</a></li>
            <li><a href="#" style="color: #94a3b8; text-decoration: none;">Sobre Nosotros</a></li>
            <li><a href="#" style="color: #94a3b8; text-decoration: none;">Términos de Servicio</a></li>
          </ul>
        </div>
        <div>
          <h4 style="color: white; margin-bottom: 20px;">Contacto</h4>
          <p>📍 Calle Principal 123, Ciudad</p>
          <p>📞 +51 987 654 321</p>
          <p>✉️ hola@miempresa.com</p>
        </div>
      </div>
      <div style="text-align: center; padding-top: 20px; border-top: 1px solid #334155;">
        <p>&copy; 2026 Mi Empresa. Todos los derechos reservados.</p>
      </div>
    </footer>`,
  },
];