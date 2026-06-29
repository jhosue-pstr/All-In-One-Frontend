# Editor visual GrapesJS

El frontend integra **GrapesJS** para permitir la edición visual de sitios y plantillas.

## Ubicación principal

Los archivos relacionados se encuentran en:

```text
src/components/GrapesJS/
src/pages/WebEditor/
```

## Rutas relacionadas

| Ruta | Uso |
|---|---|
| `/sitio/:id/editar` | Editar visualmente un sitio. |
| `/plantillas/:id/editar` | Editar visualmente una plantilla. |

## Propósito del editor

El editor visual permite:

- diseñar páginas sin programar;
- modificar estructura visual;
- trabajar con bloques predefinidos;
- guardar configuraciones visuales;
- reutilizar diseños mediante plantillas;
- integrar bloques asociados a funcionalidades públicas.

## Relación con backend

El frontend presenta la interfaz visual, pero la persistencia de la configuración se realiza mediante servicios hacia la API backend.

De forma general, el flujo es:

```text
Usuario edita página
  ↓
GrapesJS genera estructura/configuración visual
  ↓
Frontend prepara datos
  ↓
Servicio frontend envía datos al backend
  ↓
Backend almacena configuración asociada al sitio o plantilla
```

## Consideraciones de auditoría

Para la auditoría SDLC, el editor visual es un componente crítico porque combina:

- interfaz avanzada;
- persistencia de configuración;
- integración con plantillas;
- relación con sitios/tenants;
- posible impacto en seguridad y experiencia de usuario.

## Riesgos técnicos asociados

| Riesgo | Control recomendado |
|---|---|
| Pérdida de cambios visuales | Validar persistencia y mensajes de confirmación. |
| Configuración incompleta | Verificar formato de datos enviado al backend. |
| Renderizado incorrecto | Probar preview y carga posterior de páginas. |
| Acceso indebido | Validar permiso `sitios.editar` o `plantillas.editar`. |
