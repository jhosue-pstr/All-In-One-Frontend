# Permisos y rutas protegidas

El frontend controla el acceso visual mediante rutas protegidas y permisos declarados.

## Componente principal

```text
src/components/ProtectedRoute/ProtectedRoute.tsx
```

## Rutas protegidas principales

| Ruta | Permiso requerido |
|---|---|
| `/inicio` | `inicio.ver` |
| `/sitios` | `sitios.ver` |
| `/plantillas` | `plantillas.ver` |
| `/modulos` | `modulos.ver` |
| `/configuraciones` | `configuraciones.ver` |
| `/blog` | `blog.ver` |
| `/tienda` | `tienda.ver` |
| `/analitica` | `analitica.ver` |
| `/roles` | `roles.ver` |
| `/sitio/:id/editar` | `sitios.editar` |
| `/plantillas/:id/editar` | `plantillas.editar` |

## Relación con roles

Los roles del sistema determinan qué permisos puede tener un usuario. El frontend utiliza esos permisos para mostrar u ocultar pantallas y bloquear navegación.

## Control frontend vs backend

| Control | Responsable | Alcance |
|---|---|---|
| Rutas protegidas | Frontend | Evita navegación visual no autorizada. |
| Menú dinámico | Frontend | Muestra opciones según permisos. |
| Validación de token | Backend | Verifica sesión real. |
| Validación de permisos | Backend | Autoriza operaciones críticas. |

!!! danger "Punto clave"
    Ocultar una ruta o botón en frontend no garantiza seguridad por sí solo. Los endpoints del backend deben validar siempre roles, permisos y tenant.

## Evidencia de auditoría

Para verificar este control se pueden revisar:

- `App.tsx`;
- `ProtectedRoute.tsx`;
- `PermisosContext.tsx`;
- `Sidebar.tsx`;
- servicios de roles y permisos;
- pruebas asociadas.
