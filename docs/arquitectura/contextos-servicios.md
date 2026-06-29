# Contextos y servicios

El frontend separa la gestión de estado transversal y el consumo de API mediante contextos y servicios.

## Contextos principales

| Contexto | Responsabilidad |
|---|---|
| `PermisosContext` | Mantener y consultar permisos disponibles para el usuario autenticado. |
| `SiteContext` | Gestionar información relacionada con el sitio o tenant seleccionado. |

## Servicios principales

Los servicios se ubican en:

```text
src/services/
```

| Servicio | Responsabilidad esperada |
|---|---|
| `api.ts` | Función base para consumir endpoints con token y manejo de errores. |
| `auth.ts` | Login, registro, cierre de sesión y consulta del usuario actual. |
| `sitio.ts` | Operaciones relacionadas con sitios/tenants. |
| `plantilla.ts` | Gestión de plantillas. |
| `modulo.ts` | Consulta o gestión de módulos. |
| `sitioModulo.ts` | Relación entre sitios y módulos activados. |
| `blog.ts` | Publicaciones, categorías e imágenes de Blog. |
| `store.ts` | Tienda, productos, categorías, carrito o pedidos. |
| `roles.ts` | Roles y permisos. |
| `siteAuth.ts` | Autenticación pública por sitio. |
| `analitica.ts` | Métricas, visitas, eventos o indicadores. |

## Servicio base de API

El archivo `src/services/api.ts` centraliza:

- obtención del token desde `localStorage`;
- envío del header `Authorization: Bearer <token>`;
- detección de `FormData`;
- manejo de errores HTTP;
- redirección al login cuando la sesión expira;
- retorno de JSON cuando la respuesta es correcta.

## Manejo de errores

El frontend muestra mensajes al usuario cuando:

- no tiene permisos (`403`);
- la sesión expiró o no está autenticado (`401`);
- ocurre un error general de la API.

!!! warning "Consideración técnica"
    El manejo de errores del frontend mejora la experiencia de usuario, pero no reemplaza las validaciones de seguridad del backend. El backend siempre debe validar autenticación, autorización y permisos.
