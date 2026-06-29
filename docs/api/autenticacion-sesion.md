# Autenticación y sesión

El frontend gestiona la sesión administrativa utilizando tokens almacenados en `localStorage`.

## Flujo general

```text
Usuario inicia sesión
  ↓
Frontend envía credenciales al backend
  ↓
Backend devuelve token
  ↓
Frontend almacena token en localStorage
  ↓
Las siguientes solicitudes incluyen Authorization: Bearer <token>
```

## Validación inicial

Al iniciar la aplicación, `App.tsx` verifica si existe un token:

- si existe, consulta `authService.me()`;
- si la consulta es correcta, considera al usuario autenticado;
- si falla, elimina la sesión y redirige al login.

## Cierre de sesión por expiración

Cuando una solicitud responde `401`, el frontend:

1. muestra mensaje de sesión expirada;
2. elimina el token de `localStorage`;
3. redirige al usuario a `/`.

## Autenticación pública del sitio

Además de la sesión administrativa, el proyecto incluye autenticación pública por sitio mediante el módulo `site-widget`.

En ese caso, se utiliza un token distinto, asociado a usuarios públicos del sitio:

```text
site_token
```

## Diferencia entre sesiones

| Tipo de sesión | Uso | Token |
|---|---|---|
| Administrativa | Panel interno de All-InOne. | `token` |
| Pública por sitio | Interacción de visitantes registrados en sitios generados. | `site_token` |

## Consideración de seguridad

El frontend mejora la experiencia de usuario al controlar sesión y redirección, pero la validación definitiva debe realizarse en el backend.
