export const PanelConmutadorButtons = [
  { id: 'show-blocks', label: 'Bloques', command: 'show-blocks', active: true, togglable: false },
  { id: 'show-layers', label: 'Capas', command: 'show-layers', togglable: false },
  { id: 'show-styles', label: 'Estilos', command: 'show-styles', togglable: false },
  { id: 'show-traits', label: 'Atributos', command: 'show-traits', togglable: false },
  { id: 'show-pages', label: 'Páginas', command: 'show-pages', togglable: false },
];

export const PanelConmutadorConfig = {
  id: 'panel-switcher',
  el: '.panel__switcher',
  buttons: PanelConmutadorButtons,
};