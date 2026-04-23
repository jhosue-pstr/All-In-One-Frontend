export { BloqueSeccion } from './BloqueSeccion';
export { BloqueTexto } from './BloqueTexto';
export { BloqueImagen } from './BloqueImagen';

export { Bloque3Columnas, Bloque4Columnas, Bloque2Columnas, BloqueCaja, BloqueCard, BloqueLayoutSidebar } from './Layout';

export { 
  BloqueHeading, BloqueParagraph, BloqueLink, BloqueLista, BloqueIcono, BloqueSpacer, 
  BloqueQuote, BloqueBadge, BloqueBoton, BloqueDivider, BloqueTestimonio, BloqueFAQ, 
  BloqueTimeline, BloquePricingTable, BloqueCTA, BloqueFeatureGrid, BloqueTestimonialCarousel, 
  BloqueNewsletter, BloqueCounter 
} from './Contenido';

export { 
  BloqueMap, BloqueVideo, BloqueGallery, BloqueAudio, BloqueCarruselImagenes, 
  BloqueBackgroundVideo, BloqueImagenOverlay, BloqueLightboxGallery, BloqueLottie, 
  BloqueImagenComparativa 
} from './Multimedia';

export { BloqueHero, BloqueNavbar, BloqueFooter } from './Secciones';

export { 
  BloqueInputTexto, BloqueInputEmail, BloqueInputPassword, BloqueTextarea, 
  BloqueSelect, BloqueCheckbox, BloqueRadio, BloqueFormulario, BloqueFecha 
} from './Formularios';

export { 
  BloqueLogin, BloqueRegistro, BloqueBusqueda, BloqueCarousel, BloqueAccordion, 
  BloqueAlertas, BloqueBreadcrumb, BloqueCountdown, BloqueDropdown, BloqueModal, 
  BloquePaginacion, BloquePricing, BloqueProgress, BloqueRating, BloqueSpinner, 
  BloqueStats, BloqueTabs, BloqueTags 
} from './Avanzados';

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
  import('./Contenido/BloqueTestimonio').then(m => m.BloqueTestimonio),
  import('./Contenido/BloqueFAQ').then(m => m.BloqueFAQ),
  import('./Contenido/BloqueTimeline').then(m => m.BloqueTimeline),
  import('./Contenido/BloquePricingTable').then(m => m.BloquePricingTable),
  import('./Contenido/BloqueCTA').then(m => m.BloqueCTA),
  import('./Contenido/BloqueFeatureGrid').then(m => m.BloqueFeatureGrid),
  import('./Contenido/BloqueTestimonialCarousel').then(m => m.BloqueTestimonialCarousel),
  import('./Contenido/BloqueNewsletter').then(m => m.BloqueNewsletter),
  import('./Contenido/BloqueCounter').then(m => m.BloqueCounter),
  import('./Multimedia/BloqueMap').then(m => m.BloqueMap),
  import('./Multimedia/BloqueVideo').then(m => m.BloqueVideo),
  import('./Multimedia/BloqueGallery').then(m => m.BloqueGallery),
  import('./Multimedia/BloqueAudio').then(m => m.BloqueAudio),
  import('./Multimedia/BloqueCarruselImagenes').then(m => m.BloqueCarruselImagenes),
  import('./Multimedia/BloqueBackgroundVideo').then(m => m.BloqueBackgroundVideo),
  import('./Multimedia/BloqueImagenOverlay').then(m => m.BloqueImagenOverlay),
  import('./Multimedia/BloqueLightboxGallery').then(m => m.BloqueLightboxGallery),
  import('./Multimedia/BloqueLottie').then(m => m.BloqueLottie),
  import('./Multimedia/BloqueImagenComparativa').then(m => m.BloqueImagenComparativa),
  import('./Secciones/BloqueHero').then(m => m.BloqueHero),
  import('./Secciones/BloqueNavbar').then(m => m.BloqueNavbar),
  import('./Secciones/BloqueFooter').then(m => m.BloqueFooter),
  import('./Formularios/BloqueInputTexto').then(m => m.BloqueInputTexto),
  import('./Formularios/BloqueInputEmail').then(m => m.BloqueInputEmail),
  import('./Formularios/BloqueInputPassword').then(m => m.BloqueInputPassword),
  import('./Formularios/BloqueTextarea').then(m => m.BloqueTextarea),
  import('./Formularios/BloqueSelect').then(m => m.BloqueSelect),
  import('./Formularios/BloqueCheckbox').then(m => m.BloqueCheckbox),
  import('./Formularios/BloqueRadio').then(m => m.BloqueRadio),
  import('./Formularios/BloqueFormulario').then(m => m.BloqueFormulario),
  import('./Formularios/BloqueFecha').then(m => m.BloqueFecha),
  import('./Avanzados/BloqueLogin').then(m => m.BloqueLogin),
  import('./Avanzados/BloqueRegistro').then(m => m.BloqueRegistro),
  import('./Avanzados/BloqueBusqueda').then(m => m.BloqueBusqueda),
  import('./Avanzados/BloqueAccordion').then(m => m.BloqueAccordion),
  import('./Avanzados/BloqueAlertas').then(m => m.BloqueAlertas),
  import('./Avanzados/BloqueBreadcrumb').then(m => m.BloqueBreadcrumb),
  import('./Avanzados/BloqueCountdown').then(m => m.BloqueCountdown),
  import('./Avanzados/BloqueDropdown').then(m => m.BloqueDropdown),
  import('./Avanzados/BloqueModal').then(m => m.BloqueModal),
  import('./Avanzados/BloquePaginacion').then(m => m.BloquePaginacion),
  import('./Avanzados/BloquePricing').then(m => m.BloquePricing),
  import('./Avanzados/BloqueProgress').then(m => m.BloqueProgress),
  import('./Avanzados/BloqueRating').then(m => m.BloqueRating),
  import('./Avanzados/BloqueSpinner').then(m => m.BloqueSpinner),
  import('./Avanzados/BloqueStats').then(m => m.BloqueStats),
  import('./Avanzados/BloqueTabs').then(m => m.BloqueTabs),
  import('./Avanzados/BloqueTags').then(m => m.BloqueTags),
  import('./Avanzados/BloqueCarousel').then(m => m.BloqueCarousel),
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
  {
    id: 'testimonio',
    label: 'Testimonio',
    attributes: { class: 'fa fa-user-circle' },
    content: `<div style="border:1px solid #ddd; padding:20px; border-radius:8px; text-align:center; max-width: 500px; margin: 20px auto;">
      <img src="https://via.placeholder.com/80" style="border-radius:50%; margin-bottom:10px;">
      <p style="font-style:italic; font-size: 16px;">"Excelente servicio y atención personalizada."</p>
      <strong>- Cliente Satisfecho</strong>
    </div>`,
  },
  {
    id: 'faq',
    label: 'Preguntas Frecuentes',
    attributes: { class: 'fa fa-question-circle' },
    content: `<div style="font-family:sans-serif; max-width: 700px; margin: 20px auto;">
      <details style="margin-bottom: 10px; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
        <summary style="font-weight: 600; cursor: pointer;">¿Cuál es el horario de atención?</summary>
        <p style="margin-top: 10px;">De lunes a viernes de 9am a 6pm.</p>
      </details>
      <details style="margin-bottom: 10px; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
        <summary style="font-weight: 600; cursor: pointer;">¿Hacen envíos internacionales?</summary>
        <p style="margin-top: 10px;">Sí, a varios países de Latinoamérica.</p>
      </details>
    </div>`,
  },
  {
    id: 'timeline',
    label: 'Línea de Tiempo',
    attributes: { class: 'fa fa-clock-o' },
    content: `<ul style="list-style:none; padding:0; font-family:sans-serif; max-width: 500px; margin: 20px auto;">
      <li style="padding: 10px 0; border-left: 2px solid #3498db; padding-left: 20px; margin-left: 10px;"><strong>2020:</strong> Inicio del proyecto</li>
      <li style="padding: 10px 0; border-left: 2px solid #3498db; padding-left: 20px; margin-left: 10px;"><strong>2021:</strong> Expansión regional</li>
      <li style="padding: 10px 0; border-left: 2px solid #3498db; padding-left: 20px; margin-left: 10px;"><strong>2022:</strong> Lanzamiento internacional</li>
    </ul>`,
  },
  {
    id: 'pricing',
    label: 'Tabla de Precios',
    attributes: { class: 'fa fa-tags' },
    content: `<div style="display:flex; gap:20px; font-family:sans-serif; max-width: 800px; margin: 20px auto;">
      <div style="border:1px solid #ddd; padding:20px; border-radius:8px; flex:1; text-align:center;">
        <h3>Básico</h3><p>$10/mes</p><button style="padding: 8px 16px; background:#3498db; color:white; border:none; border-radius:4px; cursor:pointer;">Comprar</button>
      </div>
      <div style="border:1px solid #3498db; padding:20px; border-radius:8px; flex:1; text-align:center; background:#f8f9fa;">
        <h3>Premium</h3><p>$20/mes</p><button style="padding: 8px 16px; background:#3498db; color:white; border:none; border-radius:4px; cursor:pointer;">Comprar</button>
      </div>
    </div>`,
  },
  {
    id: 'cta',
    label: 'Call to Action',
    attributes: { class: 'fa fa-bullhorn' },
    content: `<div style="background:#3498db; color:white; padding:40px 20px; text-align:center; border-radius:8px; max-width: 800px; margin: 20px auto;">
      <h2 style="margin-top: 0;">¡Empieza hoy mismo!</h2>
      <p style="margin-bottom: 20px;">No esperes más para comenzar a grow.</p>
      <button style="background:white; color:#3498db; padding:12px 24px; border:none; border-radius:4px; font-weight:bold; cursor:pointer;">Registrarse Gratis</button>
    </div>`,
  },
  {
    id: 'features',
    label: 'Características',
    attributes: { class: 'fa fa-th' },
    content: `<div style="display:grid; grid-template-columns:repeat(3,1fr); gap:20px; padding:20px; max-width: 900px; margin: 20px auto; font-family:sans-serif;">
      <div style="text-align:center; padding: 20px;"><i class="fa fa-cog" style="font-size: 32px; color:#3498db; margin-bottom: 10px;"></i><p><strong>Fácil de usar</strong></p><p style="color:#666;">Interfaz intuitiva</p></div>
      <div style="text-align:center; padding: 20px;"><i class="fa fa-lock" style="font-size: 32px; color:#3498db; margin-bottom: 10px;"></i><p><strong>Seguro</strong></p><p style="color:#666;">Tus datos protegidos</p></div>
      <div style="text-align:center; padding: 20px;"><i class="fa fa-mobile" style="font-size: 32px; color:#3498db; margin-bottom: 10px;"></i><p><strong>Responsive</strong></p><p style="color:#666;">Funciona en móviles</p></div>
    </div>`,
  },
  {
    id: 'testimonial-carousel',
    label: 'Carrusel de Testimonios',
    attributes: { class: 'fa fa-comments' },
    content: `<div style="overflow:hidden; width:100%; border:1px solid #ddd; padding:20px; text-align:center; font-family:sans-serif;">
      <p style="font-size: 18px; font-style: italic;">"Me encantó el servicio, muy recomendado!"</p>
      <p style="font-weight:bold;">- Ana</p>
    </div>`,
  },
  {
    id: 'newsletter',
    label: 'Suscripción Newsletter',
    attributes: { class: 'fa fa-envelope-open' },
    content: `<form style="text-align:center; font-family:sans-serif; padding: 30px 20px; background:#f8f9fa; max-width: 600px; margin: 20px auto; border-radius: 8px;">
      <h3 style="margin-top: 0;">Suscríbete a nuestro Newsletter</h3>
      <p style="margin-bottom: 20px;">Recibe las últimas noticias y ofertas.</p>
      <input type="email" placeholder="Tu correo electrónico" style="padding:10px; width:70%; margin-bottom:10px; border:1px solid #ddd; border-radius: 4px;">
      <button style="background:#27ae60; color:white; padding:10px 20px; border:none; border-radius:4px; cursor:pointer;">Suscribirse</button>
    </form>`,
  },
  {
    id: 'counter',
    label: 'Contador',
    attributes: { class: 'fa fa-sort-numeric-asc' },
    content: `<div style="display:flex; gap:40px; text-align:center; justify-content:center; padding: 40px; font-family:sans-serif;">
      <div><h2 style="font-size: 48px; margin: 0; color:#3498db;">100+</h2><p style="margin:0; color:#666;">Clientes</p></div>
      <div><h2 style="font-size: 48px; margin: 0; color:#3498db;">50</h2><p style="margin:0; color:#666;">Proyectos</p></div>
      <div><h2 style="font-size: 48px; margin: 0; color:#3498db;">10</h2><p style="margin:0; color:#666;">Años</p></div>
    </div>`,
  },
  {
    id: 'audio',
    label: 'Reproductor de Audio',
    attributes: { class: 'fa fa-music' },
    content: `<audio controls style="width:100%; max-width: 500px; display: block; margin: 20px auto;">
      <source src="https://www.w3schools.com/html/horse.mp3" type="audio/mpeg">
      Tu navegador no soporta audio.
    </audio>`,
  },
  {
    id: 'carousel',
    label: 'Carrusel de Imágenes',
    attributes: { class: 'fa fa-picture-o' },
    content: `<div style="display:flex; overflow-x:auto; gap:10px; padding: 20px;">
      <img src="https://via.placeholder.com/300x200" style="border-radius:8px;">
      <img src="https://via.placeholder.com/300x200" style="border-radius:8px;">
      <img src="https://via.placeholder.com/300x200" style="border-radius:8px;">
    </div>`,
  },
  {
    id: 'bg-video',
    label: 'Video de Fondo',
    attributes: { class: 'fa fa-film' },
    content: `<video autoplay muted loop style="width:100%; max-height: 400px;">
      <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4">
    </video>`,
  },
  {
    id: 'img-overlay',
    label: 'Imagen con Texto',
    attributes: { class: 'fa fa-image' },
    content: `<div style="position:relative; display:inline-block; max-width: 600px;">
      <img src="https://via.placeholder.com/600x300" style="width:100%; border-radius:8px;">
      <div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); color:white; font-size:24px; background:rgba(0,0,0,0.5); padding:10px 20px; border-radius:4px;">Texto Overlay</div>
    </div>`,
  },
  {
    id: 'lightbox',
    label: 'Galería Lightbox',
    attributes: { class: 'fa fa-camera' },
    content: `<div style="display:flex; gap:10px; padding: 20px; justify-content:center;">
      <img src="https://via.placeholder.com/200" style="cursor:pointer; border-radius:4px;">
      <img src="https://via.placeholder.com/200" style="cursor:pointer; border-radius:4px;">
      <img src="https://via.placeholder.com/200" style="cursor:pointer; border-radius:4px;">
    </div>`,
  },
  {
    id: 'lottie',
    label: 'Animación Lottie',
    attributes: { class: 'fa fa-play-circle' },
    content: `<div style="display:flex; justify-content:center; padding: 20px;">
      <lottie-player src="https://assets2.lottiefiles.com/packages/lf20_tfb3estd.json" background="transparent" speed="1" style="width:300px; height:300px;" loop autoplay></lottie-player>
    </div>`,
  },
  {
    id: 'img-compare',
    label: 'Imagen Comparativa',
    attributes: { class: 'fa fa-exchange' },
    content: `<div style="display:flex; gap:10px; padding: 20px; justify-content:center;">
      <div style="text-align:center;"><img src="https://via.placeholder.com/250x200" style="border-radius:8px;"><p style="margin:5px 0;">Antes</p></div>
      <div style="text-align:center;"><img src="https://via.placeholder.com/250x200" style="border-radius:8px;"><p style="margin:5px 0;">Después</p></div>
    </div>`,
  },
  {
    id: 'input-text',
    label: 'Input Texto',
    attributes: { class: 'fa fa-font' },
    content: `<input type="text" placeholder="Escribe aquí..." style="width: 100%; max-width: 400px; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-family: sans-serif; display: block; margin: 10px;">`,
    activable: true,
  },
  {
    id: 'input-email',
    label: 'Input Email',
    attributes: { class: 'fa fa-envelope' },
    content: `<input type="email" placeholder="ejemplo@dominio.com" style="width: 100%; max-width: 400px; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-family: sans-serif; display: block; margin: 10px;">`,
  },
  {
    id: 'input-password',
    label: 'Input Password',
    attributes: { class: 'fa fa-lock' },
    content: `<input type="password" placeholder="Contraseña" style="width: 100%; max-width: 400px; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-family: sans-serif; display: block; margin: 10px;">`,
  },
  {
    id: 'textarea',
    label: 'Área de Texto',
    attributes: { class: 'fa fa-align-justify' },
    content: `<textarea placeholder="Escribe aquí..." style="width: 100%; max-width: 400px; height: 100px; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-family: sans-serif; resize: vertical; display: block; margin: 10px;"></textarea>`,
  },
  {
    id: 'select',
    label: 'Selector',
    attributes: { class: 'fa fa-list-ul' },
    content: `<select style="width: 100%; max-width: 400px; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-family: sans-serif; display: block; margin: 10px;">
      <option value="">Seleccione una opción</option>
      <option value="opcion1">Opción 1</option>
      <option value="opcion2">Opción 2</option>
      <option value="opcion3">Opción 3</option>
    </select>`,
  },
  {
    id: 'checkbox',
    label: 'Casilla de Verificación',
    attributes: { class: 'fa fa-check-square-o' },
    content: `<div style="display: flex; align-items: center; margin: 10px 0;">
      <input type="checkbox" id="checkbox1" style="margin-right: 8px;">
      <label for="checkbox1" style="font-family: sans-serif; cursor: pointer;">Acepto los términos y condiciones</label>
    </div>`,
  },
  {
    id: 'radio',
    label: 'Botones de Opción',
    attributes: { class: 'fa fa-circle-o' },
    content: `<div style="margin: 10px 0; font-family: sans-serif;">
      <label><input type="radio" name="opciones" style="margin-right: 5px;"> Opción 1</label><br>
      <label><input type="radio" name="opciones" style="margin-right: 5px;"> Opción 2</label><br>
      <label><input type="radio" name="opciones" style="margin-right: 5px;"> Opción 3</label>
    </div>`,
  },
  {
    id: 'form',
    label: 'Formulario',
    attributes: { class: 'fa fa-edit' },
    content: `<form style="padding: 20px; border: 1px solid #ddd; border-radius: 4px; max-width: 500px; font-family: sans-serif;">
      <div style="margin-bottom: 15px;">
        <label for="nombre" style="display: block; margin-bottom: 5px; font-weight: 500;">Nombre</label>
        <input type="text" id="nombre" placeholder="Tu nombre" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;">
      </div>
      <div style="margin-bottom: 15px;">
        <label for="email" style="display: block; margin-bottom: 5px; font-weight: 500;">Email</label>
        <input type="email" id="email" placeholder="tu@email.com" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;">
      </div>
      <div style="margin-bottom: 15px;">
        <label for="mensaje" style="display: block; margin-bottom: 5px; font-weight: 500;">Mensaje</label>
        <textarea id="mensaje" placeholder="Tu mensaje" style="width: 100%; height: 80px; padding: 8px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; resize: vertical;"></textarea>
      </div>
      <button type="submit" style="background: #3498db; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;">Enviar</button>
    </form>`,
  },
  {
    id: 'input-date',
    label: 'Fecha',
    attributes: { class: 'fa fa-calendar' },
    content: `<input type="date" style="width: 100%; max-width: 400px; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-family: sans-serif; display: block; margin: 10px;">`,
  },
  {
    id: 'bloque-login',
    label: 'Formulario de Login',
    attributes: { class: 'fa fa-sign-in-alt' },
    content: `<div style="font-family: sans-serif; max-width: 400px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      <h3 style="text-align: center; margin-bottom: 20px; color: #333;">Iniciar Sesión</h3>
      <form style="display: flex; flex-direction: column; gap: 15px;">
        <div>
          <label style="display: block; margin-bottom: 5px; font-weight: 500; color: #555;">Correo</label>
          <input type="email" placeholder="tu@email.com" required style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;">
        </div>
        <div>
          <label style="display: block; margin-bottom: 5px; font-weight: 500; color: #555;">Contraseña</label>
          <input type="password" placeholder="••••••••" required style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;">
        </div>
        <button type="submit" style="width: 100%; padding: 12px; background-color: #0066cc; color: white; border: none; border-radius: 4px; font-size: 16px; font-weight: 600; cursor: pointer;">Iniciar Sesión</button>
      </form>
    </div>`,
  },
  {
    id: 'bloque-registro',
    label: 'Formulario de Registro',
    attributes: { class: 'fa fa-user-plus' },
    content: `<div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 25px; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      <h3 style="text-align: center; margin-bottom: 20px; color: #333;">Crear Cuenta</h3>
      <form style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
        <div>
          <label style="display: block; margin-bottom: 5px; font-weight: 500; color: #555;">Nombre</label>
          <input type="text" placeholder="Juan" required style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;">
        </div>
        <div>
          <label style="display: block; margin-bottom: 5px; font-weight: 500; color: #555;">Apellido</label>
          <input type="text" placeholder="Pérez" required style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;">
        </div>
        <div style="grid-column: span 2;">
          <label style="display: block; margin-bottom: 5px; font-weight: 500; color: #555;">Email</label>
          <input type="email" placeholder="tu@email.com" required style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;">
        </div>
        <div>
          <label style="display: block; margin-bottom: 5px; font-weight: 500; color: #555;">Contraseña</label>
          <input type="password" placeholder="••••••••" required style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;">
        </div>
        <div>
          <label style="display: block; margin-bottom: 5px; font-weight: 500; color: #555;">Confirmar</label>
          <input type="password" placeholder="••••••••" required style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;">
        </div>
        <div style="grid-column: span 2;">
          <button type="submit" style="width: 100%; padding: 12px; background-color: #28a745; color: white; border: none; border-radius: 4px; font-size: 16px; font-weight: 600; cursor: pointer;">Crear Cuenta</button>
        </div>
      </form>
    </div>`,
  },
  {
    id: 'bloque-busqueda',
    label: 'Barra de Búsqueda',
    attributes: { class: 'fa fa-search' },
    content: `<div style="font-family: sans-serif; max-width: 600px; margin: 20px auto;">
      <form style="display: flex; gap: 10px; align-items: stretch;">
        <input type="search" placeholder="Buscar..." required style="flex: 1; padding: 12px 16px; border: 2px solid #e0e0e0; border-radius: 6px 0 0 6px; font-size: 16px; outline: none;">
        <button type="submit" style="padding: 12px 24px; background-color: #0066cc; color: white; border: none; border-radius: 0 6px 6px 0; font-size: 16px; font-weight: 600; cursor: pointer;">Buscar</button>
      </form>
    </div>`,
  },
  {
    id: 'bloque-accordion',
    label: 'Acordeón (FAQ)',
    attributes: { class: 'fa fa-list-ul' },
    content: `<div style="font-family: sans-serif; max-width: 700px; margin: 20px auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
      <details style="border-bottom: 1px solid #e0e0e0; padding: 16px 20px;">
        <summary style="font-weight: 600; cursor: pointer; outline: none;">¿Cómo puedo resetear mi contraseña?</summary>
        <p style="margin: 10px 0 0 0; color: #555; line-height: 1.6;">Haz clic en "¿Olvidaste tu contraseña?" y sigue las instrucciones.</p>
      </details>
      <details style="border-bottom: 1px solid #e0e0e0; padding: 16px 20px;">
        <summary style="font-weight: 600; cursor: pointer;">¿Cuáles son los métodos de pago?</summary>
        <p style="margin: 10px 0 0 0; color: #555; line-height: 1.6;">Aceptamos tarjetas, PayPal y transferencia.</p>
      </details>
      <details style="padding: 16px 20px;">
        <summary style="font-weight: 600; cursor: pointer;">¿Cómo contacto al soporte?</summary>
        <p style="margin: 10px 0 0 0; color: #555; line-height: 1.6;">Por email o chat en vivo disponibles 24/7.</p>
      </details>
    </div>`,
  },
  {
    id: 'bloque-alertas',
    label: 'Alertas y Notificaciones',
    attributes: { class: 'fa fa-bell' },
    content: `<div style="font-family: sans-serif; max-width: 600px; margin: 20px auto; display: flex; flex-direction: column; gap: 12px;">
      <div style="display: flex; align-items: center; gap: 12px; padding: 14px 18px; background: #d4edda; border: 1px solid #c3e6cb; border-left: 4px solid #28a745; border-radius: 6px; color: #155724;">
        <span style="font-size: 20px;">✓</span>
        <div><strong>Éxito</strong><span style="margin-left: 8px; font-size: 13px;">Operación completada.</span></div>
      </div>
      <div style="display: flex; align-items: center; gap: 12px; padding: 14px 18px; background: #f8d7da; border: 1px solid #f5c6cb; border-left: 4px solid #dc3545; border-radius: 6px; color: #721c24;">
        <span style="font-size: 20px;">⚠</span>
        <div><strong>Error</strong><span style="margin-left: 8px; font-size: 13px;">Ha ocurrido un error.</span></div>
      </div>
      <div style="display: flex; align-items: center; gap: 12px; padding: 14px 18px; background: #fff3cd; border: 1px solid #ffeaa7; border-left: 4px solid #ffc107; border-radius: 6px; color: #856404;">
        <span style="font-size: 20px;">!</span>
        <div><strong>Atención</strong><span style="margin-left: 8px; font-size: 13px;">Tu sesión expirará pronto.</span></div>
      </div>
    </div>`,
  },
  {
    id: 'bloque-breadcrumb',
    label: 'Breadcrumb',
    attributes: { class: 'fa fa-compass' },
    content: `<nav style="font-family: sans-serif; max-width: 800px; margin: 20px auto; padding: 12px 20px; background: #f8f9fa; border-radius: 6px;">
      <ol style="display: flex; flex-wrap: wrap; list-style: none; margin: 0; padding: 0; gap: 8px; font-size: 14px; align-items: center;">
        <li><a href="#" style="color: #0066cc; text-decoration: none;">Inicio</a></li>
        <li style="color: #999;">›</li>
        <li><a href="#" style="color: #0066cc; text-decoration: none;">Productos</a></li>
        <li style="color: #999;">›</li>
        <li style="color: #333; font-weight: 500;">Detalle</li>
      </ol>
    </nav>`,
  },
  {
    id: 'bloque-countdown',
    label: 'Cuenta Regresiva',
    attributes: { class: 'fa fa-clock' },
    content: `<div style="font-family: sans-serif; max-width: 600px; margin: 20px auto; text-align: center; padding: 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; color: white;">
      <h3 style="margin: 0 0 20px 0;">Oferta por tiempo limitado</h3>
      <div style="display: flex; justify-content: center; gap: 20px;">
        <div><div style="font-size: 42px; font-weight: 700;">02</div><div style="font-size: 12px; text-transform: uppercase;">Días</div></div>
        <div style="font-size: 36px; opacity: 0.7;">:</div>
        <div><div style="font-size: 42px; font-weight: 700;">15</div><div style="font-size: 12px; text-transform: uppercase;">Horas</div></div>
        <div style="font-size: 36px; opacity: 0.7;">:</div>
        <div><div style="font-size: 42px; font-weight: 700;">42</div><div style="font-size: 12px; text-transform: uppercase;">Min</div></div>
        <div style="font-size: 36px; opacity: 0.7;">:</div>
        <div><div style="font-size: 42px; font-weight: 700;">09</div><div style="font-size: 12px; text-transform: uppercase;">Seg</div></div>
      </div>
    </div>`,
  },
  {
    id: 'bloque-dropdown',
    label: 'Menú Desplegable',
    attributes: { class: 'fa fa-chevron-down' },
    content: `<div style="font-family: sans-serif; max-width: 300px; margin: 20px auto; position: relative;">
      <button style="width: 100%; padding: 12px 16px; background: white; border: 1px solid #ddd; border-radius: 6px; font-size: 15px; font-weight: 500; display: flex; justify-content: space-between; align-items: center; cursor: pointer;">
        Opciones <span>▼</span>
      </button>
    </div>`,
  },
  {
    id: 'bloque-modal',
    label: 'Modal / Ventana',
    attributes: { class: 'fa fa-window-restore' },
    content: `<div style="font-family: sans-serif; text-align: center; padding: 40px;">
      <button style="padding: 12px 24px; background-color: #0066cc; color: white; border: none; border-radius: 6px; font-size: 16px; font-weight: 600; cursor: pointer;">Abrir Modal</button>
    </div>`,
  },
  {
    id: 'bloque-paginacion',
    label: 'Paginación',
    attributes: { class: 'fa fa-ellipsis-h' },
    content: `<div style="font-family: sans-serif; max-width: 600px; margin: 30px auto; display: flex; justify-content: center; align-items: center; gap: 5px;">
      <button style="padding: 8px 14px; border: 1px solid #ddd; background: white; border-radius: 4px; cursor: pointer;">‹</button>
      <button style="padding: 8px 14px; border: 1px solid #ddd; background: white; border-radius: 4px; cursor: pointer;">1</button>
      <button style="padding: 8px 14px; border: 1px solid #ddd; background: white; border-radius: 4px; cursor: pointer;">2</button>
      <button style="padding: 8px 14px; border: 1px solid #ddd; background: white; border-radius: 4px; cursor: pointer;">3</button>
      <span style="color: #999; padding: 0 4px;">...</span>
      <button style="padding: 8px 14px; border: 1px solid #ddd; background: white; border-radius: 4px; cursor: pointer;">10</button>
      <button style="padding: 8px 14px; border: 1px solid #ddd; background: white; border-radius: 4px; cursor: pointer;">›</button>
    </div>`,
  },
  {
    id: 'bloque-pricing',
    label: 'Tabla de Precios',
    attributes: { class: 'fa fa-dollar-sign' },
    content: `<div style="font-family: sans-serif; max-width: 900px; margin: 20px auto; display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">
      <div style="background: white; border-radius: 12px; padding: 30px; border: 1px solid #e9ecef; text-align: center;">
        <h3 style="margin: 0 0 10px 0;">Básico</h3>
        <div style="font-size: 36px; font-weight: 700; color: #0066cc;">$9<span style="font-size: 14px;">/mes</span></div>
        <ul style="list-style: none; padding: 0; text-align: left; margin: 20px 0;">
          <li style="padding: 8px 0;">✓ 5GB</li>
          <li style="padding: 8px 0;">✓ Soporte</li>
        </ul>
        <button style="width: 100%; padding: 10px; background: white; color: #0066cc; border: 2px solid #0066cc; border-radius: 6px; cursor: pointer;">Elegir</button>
      </div>
      <div style="background: white; border-radius: 12px; padding: 30px; border: 2px solid #0066cc; text-align: center; transform: scale(1.05); box-shadow: 0 8px 25px rgba(0,102,204,0.2);">
        <div style="background: #ffc107; color: #333; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; display: inline-block; margin-bottom: 10px;">Popular</div>
        <h3 style="margin: 10px 0 10px 0;">Profesional</h3>
        <div style="font-size: 36px; font-weight: 700; color: #0066cc;">$29<span style="font-size: 14px;">/mes</span></div>
        <ul style="list-style: none; padding: 0; text-align: left; margin: 20px 0;">
          <li style="padding: 8px 0;">✓ 50GB</li>
          <li style="padding: 8px 0;">✓ Soporte 24/7</li>
        </ul>
        <button style="width: 100%; padding: 10px; background: #0066cc; color: white; border: none; border-radius: 6px; cursor: pointer;">Elegir</button>
      </div>
      <div style="background: white; border-radius: 12px; padding: 30px; border: 1px solid #e9ecef; text-align: center;">
        <h3 style="margin: 0 0 10px 0;">Empresa</h3>
        <div style="font-size: 36px; font-weight: 700; color: #6f42c1;">$99<span style="font-size: 14px;">/mes</span></div>
        <ul style="list-style: none; padding: 0; text-align: left; margin: 20px 0;">
          <li style="padding: 8px 0;">✓ Ilimitado</li>
          <li style="padding: 8px 0;">✓ Todo</li>
        </ul>
        <button style="width: 100%; padding: 10px; background: #6f42c1; color: white; border: none; border-radius: 6px; cursor: pointer;">Elegir</button>
      </div>
    </div>`,
  },
  {
    id: 'bloque-progress',
    label: 'Barra de Progreso',
    attributes: { class: 'fa fa-tasks' },
    content: `<div style="font-family: sans-serif; max-width: 600px; margin: 20px auto; display: flex; flex-direction: column; gap: 15px;">
      <div>
        <div style="display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 6px;"><span>Carga</span><span>75%</span></div>
        <div style="height: 12px; background: #e9ecef; border-radius: 6px; overflow: hidden;">
          <div style="height: 100%; width: 75%; background: linear-gradient(90deg, #28a745, #20c997); border-radius: 6px;"></div>
        </div>
      </div>
      <div>
        <div style="display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 6px;"><span>Proceso</span><span>45%</span></div>
        <div style="height: 12px; background: #e9ecef; border-radius: 6px; overflow: hidden;">
          <div style="height: 100%; width: 45%; background: linear-gradient(90deg, #ffc107, #ff9800); border-radius: 6px;"></div>
        </div>
      </div>
      <div>
        <div style="display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 6px;"><span>Total</span><span>90%</span></div>
        <div style="height: 12px; background: #e9ecef; border-radius: 6px; overflow: hidden;">
          <div style="height: 100%; width: 90%; background: linear-gradient(90deg, #007bff, #0056b3); border-radius: 6px;"></div>
        </div>
      </div>
    </div>`,
  },
  {
    id: 'bloque-rating',
    label: 'Calificación',
    attributes: { class: 'fa fa-star' },
    content: `<div style="font-family: sans-serif; max-width: 400px; margin: 20px auto; padding: 20px; background: #f8f9fa; border-radius: 8px; text-align: center;">
      <h4 style="margin: 0 0 15px 0;">Califica este producto</h4>
      <div style="font-size: 32px; color: #ffc107;">
        <span>★</span><span>★</span><span>★</span><span>★</span><span style="color:#ddd">★</span>
      </div>
      <p style="margin: 10px 0 0 0; font-size: 14px; color: #666;">4 de 5 estrellas</p>
    </div>`,
  },
  {
    id: 'bloque-spinner',
    label: 'Spinner / Cargando',
    attributes: { class: 'fa fa-spinner fa-spin' },
    content: `<div style="font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px; gap: 15px;">
      <div style="width: 50px; height: 50px; border: 4px solid #e9ecef; border-top: 4px solid #0066cc; border-radius: 50%; animation: spin 1s linear infinite;"></div>
      <p style="margin: 0; font-size: 14px; color: #666;">Cargando...</p>
    </div>
    <style>@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}</style>`,
  },
  {
    id: 'bloque-stats',
    label: 'Estadísticas',
    attributes: { class: 'fa fa-chart-bar' },
    content: `<div style="font-family: sans-serif; max-width: 900px; margin: 20px auto; display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px;">
      <div style="background: white; padding: 24px; border-radius: 12px; border-left: 4px solid #0066cc;">
        <p style="margin: 0; font-size: 13px; color: #666;">Usuarios</p>
        <h3 style="margin: 8px 0 0 0; font-size: 28px;">12,847</h3>
      </div>
      <div style="background: white; padding: 24px; border-radius: 12px; border-left: 4px solid #28a745;">
        <p style="margin: 0; font-size: 13px; color: #666;">Ventas</p>
        <h3 style="margin: 8px 0 0 0; font-size: 28px;">$8,432</h3>
      </div>
      <div style="background: white; padding: 24px; border-radius: 12px; border-left: 4px solid #ffc107;">
        <p style="margin: 0; font-size: 13px; color: #666;">Pedidos</p>
        <h3 style="margin: 8px 0 0 0; font-size: 28px;">45</h3>
      </div>
      <div style="background: white; padding: 24px; border-radius: 12px; border-left: 4px solid #dc3545;">
        <p style="margin: 0; font-size: 13px; color: #666;">Conversión</p>
        <h3 style="margin: 8px 0 0 0; font-size: 28px;">3.24%</h3>
      </div>
    </div>`,
  },
  {
    id: 'bloque-tabs',
    label: 'Pestañas (Tabs)',
    attributes: { class: 'fa fa-folder-open' },
    content: `<div style="font-family: sans-serif; max-width: 700px; margin: 20px auto;">
      <div style="display: flex; border-bottom: 2px solid #e0e0e0;">
        <button style="flex: 1; padding: 14px 20px; background: none; border: none; border-bottom: 3px solid #0066cc; font-size: 15px; font-weight: 600; color: #0066cc; cursor: pointer;">Información</button>
        <button style="flex: 1; padding: 14px 20px; background: none; border: none; border-bottom: 3px solid transparent; font-size: 15px; color: #666; cursor: pointer;">Especificaciones</button>
        <button style="flex: 1; padding: 14px 20px; background: none; border: none; border-bottom: 3px solid transparent; font-size: 15px; color: #666; cursor: pointer;">Reseñas</button>
      </div>
      <div style="padding: 20px;">
        <h4 style="margin-top: 0;">Descripción del Producto</h4>
        <p>Producto de alta calidad diseñado para ofrecer el mejor rendimiento.</p>
      </div>
    </div>`,
  },
  {
    id: 'bloque-tags',
    label: 'Etiquetas / Tags',
    attributes: { class: 'fa fa-tags' },
    content: `<div style="font-family: sans-serif; max-width: 600px; margin: 20px auto; padding: 20px;">
      <div style="display: flex; flex-wrap: wrap; gap: 8px;">
        <span style="padding: 6px 14px; background: #e3f2fd; color: #0066cc; border-radius: 15px; font-size: 13px;">React</span>
        <span style="padding: 6px 14px; background: #f3e5f5; color: #9c27b0; border-radius: 15px; font-size: 13px;">Vue.js</span>
        <span style="padding: 6px 14px; background: #e8f5e9; color: #4caf50; border-radius: 15px; font-size: 13px;">Angular</span>
        <span style="padding: 6px 14px; background: #fff3e0; color: #ff9800; border-radius: 15px; font-size: 13px;">Node.js</span>
        <span style="padding: 6px 14px; background: #fce4ec; color: #e91e63; border-radius: 15px; font-size: 13px;">Python</span>
      </div>
    </div>`,
  },
  {
    id: 'bloque-carousel',
    label: 'Carrusel de Imágenes',
    attributes: { class: 'fa fa-images' },
    content: `<div style="font-family: sans-serif; max-width: 800px; margin: 0 auto; position: relative; overflow: hidden; border-radius: 8px;">
      <div style="display: flex; width: 300%;">
        <div style="min-width: 33.333%; height: 300px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 24px;">Slide 1</div>
        <div style="min-width: 33.333%; height: 300px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 24px;">Slide 2</div>
        <div style="min-width: 33.333%; height: 300px; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 24px;">Slide 3</div>
      </div>
    </div>`,
  },
];