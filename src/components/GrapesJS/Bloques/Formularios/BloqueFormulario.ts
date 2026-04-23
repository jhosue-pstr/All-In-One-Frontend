export const BloqueFormulario = {
  id: 'form',
  label: 'Formulario',
  attributes: { class: 'fa fa-edit' },
  content: `<form style="padding: 20px; border: 1px solid #ddd; border-radius: 4px; max-width: 500px;">
    <div style="margin-bottom: 15px;">
      <label for="nombre" style="display: block; margin-bottom: 5px; font-family: sans-serif;">Nombre</label>
      <input type="text" id="nombre" placeholder="Tu nombre" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
    </div>
    <div style="margin-bottom: 15px;">
      <label for="email" style="display: block; margin-bottom: 5px; font-family: sans-serif;">Email</label>
      <input type="email" id="email" placeholder="tu@email.com" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
    </div>
    <div style="margin-bottom: 15px;">
      <label for="mensaje" style="display: block; margin-bottom: 5px; font-family: sans-serif;">Mensaje</label>
      <textarea id="mensaje" placeholder="Tu mensaje" style="width: 100%; height: 100px; padding: 8px; border: 1px solid #ccc; border-radius: 4px; resize: vertical;"></textarea>
    </div>
    <button type="submit" style="background: #3498db; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; font-family: sans-serif;">Enviar</button>
  </form>`,
};