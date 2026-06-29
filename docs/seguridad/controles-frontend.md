# Controles frontend

El frontend incorpora controles de seguridad orientados a mejorar la experiencia de usuario y reducir accesos indebidos desde la interfaz.

## Controles principales

| Control | Descripción |
|---|---|
| Token JWT en solicitudes | El frontend agrega `Authorization: Bearer <token>` cuando existe sesión. |
| Rutas protegidas | Las pantallas administrativas se protegen mediante `ProtectedRoute`. |
| Validación de sesión | Se consulta `authService.me()` para validar sesión activa. |
| Redirección por sesión expirada | Ante `401`, se elimina token y se redirige al login. |
| Mensajes por falta de permisos | Ante `403`, se informa al usuario que no tiene autorización. |
| Menú según permisos | El panel puede mostrar opciones según permisos disponibles. |
| Separación de token administrativo y público | Se diferencia entre `token` y `site_token`. |

## Limitación del control frontend

El frontend no debe ser considerado la única capa de seguridad.

!!! danger "Regla clave"
    Todo control frontend debe ser respaldado por validaciones en backend. El usuario puede manipular el navegador, modificar localStorage o intentar llamar endpoints directamente.

## Riesgos asociados

| Riesgo | Mitigación esperada |
|---|---|
| Manipulación de token en navegador | Validación JWT en backend. |
| Acceso directo a endpoint | Validación de permisos en backend. |
| Visualización de rutas ocultas | ProtectedRoute + autorización backend. |
| Acceso cruzado entre tenants | Validación de tenant/sitio en backend. |
| Error de permisos en menú | Pruebas de roles y permisos. |

## Evidencia de auditoría

Se pueden revisar:

- `src/services/api.ts`;
- `src/components/ProtectedRoute/ProtectedRoute.tsx`;
- `src/context/PermisosContext.tsx`;
- `src/components/Sidebar/Sidebar.tsx`;
- `src/App.tsx`;
- pruebas relacionadas con permisos y rutas.
