# Rutas y layouts

El frontend utiliza **React Router DOM** para organizar las rutas públicas y protegidas del sistema.

## Rutas públicas

Las rutas públicas se muestran cuando el usuario no se encuentra autenticado.

| Ruta | Componente | Descripción |
|---|---|---|
| `/` | `AuthLayout` | Muestra login o registro según el estado de la pantalla. |

## Rutas protegidas

Las rutas protegidas se agrupan dentro de `AuthenticatedLayout` y utilizan `ProtectedRoute` para validar permisos.

| Ruta | Permiso | Pantalla |
|---|---|---|
| `/inicio` | `inicio.ver` | Panel inicial. |
| `/sitios` | `sitios.ver` | Gestión de sitios/tenants. |
| `/plantillas` | `plantillas.ver` | Gestión de plantillas. |
| `/modulos` | `modulos.ver` | Activación y consulta de módulos. |
| `/configuraciones` | `configuraciones.ver` | Configuración general. |
| `/blog` | `blog.ver` | Gestión de publicaciones. |
| `/tienda` | `tienda.ver` | Gestión de productos, categorías y pedidos. |
| `/analitica` | `analitica.ver` | Métricas y analítica. |
| `/roles` | `roles.ver` | Administración de roles y permisos. |
| `/sitio/:id/editar` | `sitios.editar` | Editor visual de sitio. |
| `/plantillas/:id/editar` | `plantillas.editar` | Editor visual de plantilla. |

## Layout autenticado

El layout autenticado cumple estas funciones:

- valida la sesión del usuario mediante `authService.me()`;
- carga la información del usuario autenticado;
- muestra el `Sidebar` en pantallas administrativas;
- oculta el layout normal cuando se accede al editor visual;
- envuelve las rutas con `PermisosProvider` y `SiteProvider`.

## Layout del editor

Cuando la ruta corresponde a edición de sitio o plantilla, el sistema detecta rutas como:

```text
/sitio/:id/editar
/plantillas/:id/editar
```

En esas rutas, el frontend no muestra el `Sidebar` administrativo, permitiendo que el editor visual tenga mayor espacio de trabajo.

## Redirecciones

Si el usuario está autenticado y entra a `/`, se redirige a:

```text
/inicio
```

Si una ruta no existe, el frontend redirige a:

```text
/
```
