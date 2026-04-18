export const dispositivosDefaults = [
  { name: 'Desktop', width: '' },
  { name: 'Mobile', width: '320px', widthMedia: '480px' },
  { name: 'Tablet', width: '768px', widthMedia: '992px' },
];

export const PanelDispositivosButtons = [
  { id: 'device-desktop', label: '<i class="fa fa-desktop"></i>', title: 'PC', command: 'set-device-desktop', active: true, togglable: false },
  { id: 'device-tablet', label: '<i class="fa fa-tablet"></i>', title: 'Tablet', command: 'set-device-tablet', togglable: false },
  { id: 'device-mobile', label: '<i class="fa fa-mobile"></i>', title: 'Móvil', command: 'set-device-mobile', togglable: false },
];

export const PanelDispositivosConfig = {
  id: 'panel-devices',
  el: '.panel__devices',
  buttons: PanelDispositivosButtons,
};