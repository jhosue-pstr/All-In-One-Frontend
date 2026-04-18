export { PanelSuperiorConfig, PanelSuperiorButtons } from './PanelSuperior';
export { PanelDispositivosConfig, PanelDispositivosButtons, dispositivosDefaults } from './PanelDispositivos';
export { PanelConmutadorConfig, PanelConmutadorButtons } from './PanelConmutador';

export const panelesDefaults = [
  { id: 'panel-superior', el: '.panel__superior' },
  { id: 'panel-dispositivos', el: '.panel__dispositivos' },
  { id: 'panel-conmutador', el: '.panel__conmutador' },
  { id: 'layers', el: '.panel__capas', resizable: { maxDim: 350, minDim: 200, cl: true, keyWidth: 'flex-basis' } },
  { id: 'styles', el: '.panel__estilos', resizable: { maxDim: 350, minDim: 200, cl: true, keyWidth: 'flex-basis' } },
  { id: 'traits', el: '.panel__traits', resizable: { maxDim: 350, minDim: 200, cl: true, keyWidth: 'flex-basis' } },
];