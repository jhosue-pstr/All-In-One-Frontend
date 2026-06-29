# Roles y permisos

El frontend trabaja con un enfoque de permisos para controlar navegación, opciones visibles y acceso a pantallas administrativas.

## Permisos usados en rutas

| Permiso | Ruta asociada |
|---|---|
| `inicio.ver` | `/inicio` |
| `sitios.ver` | `/sitios` |
| `plantillas.ver` | `/plantillas` |
| `modulos.ver` | `/modulos` |
| `configuraciones.ver` | `/configuraciones` |
| `blog.ver` | `/blog` |
| `tienda.ver` | `/tienda` |
| `analitica.ver` | `/analitica` |
| `roles.ver` | `/roles` |
| `sitios.editar` | `/sitio/:id/editar` |
| `plantillas.editar` | `/plantillas/:id/editar` |

## Roles esperados del sistema

Los roles pueden incluir:

- `super_admin`;
- `admin`;
- `editor_sitios`;
- `gestor_contenido`;
- `gestor_tienda`;
- `auditor`;
- `user` como rol mínimo o de compatibilidad.

## Uso en frontend

El frontend usa permisos para:

- proteger rutas;
- mostrar u ocultar opciones del menú;
- limitar acciones visuales;
- mejorar la experiencia según el rol.

## Uso en backend

El backend debe usar los mismos roles y permisos para:

- autorizar endpoints;
- validar operaciones críticas;
- evitar accesos cruzados;
- garantizar aislamiento de datos por tenant.

## Criterio de auditoría

La auditoría debe verificar que los permisos utilizados en frontend coincidan con los permisos reales definidos y validados en backend.
