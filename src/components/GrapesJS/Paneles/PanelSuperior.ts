export const PanelSuperiorButtons = [
  {
    id: 'visibility',
    active: true,
    className: 'btn-toggle-borders',
    label: '<i class="fa fa-eye"></i>',
    title: 'Ver Bordes',
    command: 'sw-visibility',
  },
  {
    id: 'undo',
    className: 'btn-undo',
    label: '<i class="fa fa-undo"></i>',
    title: 'Deshacer',
    command: 'undo',
  },
  {
    id: 'redo',
    className: 'btn-redo',
    label: '<i class="fa fa-repeat"></i>',
    title: 'Rehacer',
    command: 'redo',
  },
  {
    id: 'save',
    className: 'btn-save',
    label: '<i class="fa fa-save"></i>',
    title: 'Guardar',
    command: 'save-db',
  },
  {
    id: 'export',
    className: 'btn-open-export',
    label: '<i class="fa fa-code"></i>',
    title: 'Ver Código',
    command: 'edit-code',
  },
];

export const PanelSuperiorConfig = {
  id: 'panel-basic-actions',
  el: '.panel__basic-actions',
  buttons: PanelSuperiorButtons,
};