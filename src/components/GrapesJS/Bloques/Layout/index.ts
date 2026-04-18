export { Bloque3Columnas } from './Bloque3Columnas';
export { Bloque4Columnas } from './Bloque4Columnas';
export { Bloque2Columnas } from './Bloque2Columnas';
export { BloqueCaja } from './BloqueCaja';
export { BloqueCard } from './BloqueCard';
export { BloqueLayoutSidebar } from './BloqueLayoutSidebar';

export const bloquesLayout = [
  import('./Bloque3Columnas').then(m => m.Bloque3Columnas),
  import('./Bloque4Columnas').then(m => m.Bloque4Columnas),
  import('./Bloque2Columnas').then(m => m.Bloque2Columnas),
  import('./BloqueCaja').then(m => m.BloqueCaja),
  import('./BloqueCard').then(m => m.BloqueCard),
  import('./BloqueLayoutSidebar').then(m => m.BloqueLayoutSidebar),
];