# Guía de contribución

Esta guía resume criterios mínimos para mantener ordenado el frontend.

## Crear una nueva página

1. Crear carpeta dentro de `src/pages/`.
2. Crear archivo principal `.tsx`.
3. Crear archivo de estilos `.css` si corresponde.
4. Crear prueba `.test.tsx` si aplica.
5. Agregar servicio en `src/services/` si consume API.
6. Agregar modelo en `src/models/` si usa una nueva entidad.
7. Registrar ruta en `App.tsx` si será parte de la navegación.
8. Validar permiso requerido con `ProtectedRoute`.

## Crear un nuevo servicio

1. Crear archivo en `src/services/`.
2. Usar `fetchApi` como base.
3. Tipar respuestas con modelos TypeScript.
4. Manejar errores de forma consistente.
5. Crear pruebas asociadas cuando sea posible.

## Crear un nuevo componente

1. Crear carpeta en `src/components/`.
2. Separar componente, estilos y prueba.
3. Evitar duplicar lógica de páginas.
4. Documentar props si el componente crece.

## Reglas recomendadas

- No realizar llamadas directas a la API desde componentes si puede usarse un servicio.
- No almacenar secretos en el frontend.
- No depender solo del frontend para controles de seguridad.
- Mantener modelos TypeScript actualizados con el backend.
- Ejecutar pruebas antes de subir cambios.
- Ejecutar build antes de integrar cambios importantes.

## Comandos útiles

```bash
npm run dev
npm run build
npm run test
npm run test:e2e
npm run build:widget
```
