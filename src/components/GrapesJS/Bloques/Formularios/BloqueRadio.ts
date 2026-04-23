export const BloqueRadio = {
  id: 'radio',
  label: 'Botones de Opción',
  attributes: { class: 'fa fa-circle-o' },
  content: `<div style="margin: 5px 0;">
    <div style="display: flex; align-items: center; margin-bottom: 5px;">
      <input type="radio" name="radio1" id="radio1" value="opcion1" style="margin-right: 8px;">
      <label for="radio1" style="font-family: sans-serif; cursor: pointer;">Opción 1</label>
    </div>
    <div style="display: flex; align-items: center; margin-bottom: 5px;">
      <input type="radio" name="radio1" id="radio2" value="opcion2" style="margin-right: 8px;">
      <label for="radio2" style="font-family: sans-serif; cursor: pointer;">Opción 2</label>
    </div>
    <div style="display: flex; align-items: center;">
      <input type="radio" name="radio1" id="radio3" value="opcion3" style="margin-right: 8px;">
      <label for="radio3" style="font-family: sans-serif; cursor: pointer;">Opción 3</label>
    </div>
  </div>`,
};