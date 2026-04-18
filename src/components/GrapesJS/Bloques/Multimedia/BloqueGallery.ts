export const BloqueGallery = {
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
};