# Componentes reutilizables

Los componentes reutilizables se ubican en:

```text
src/components/
```

Estos componentes apoyan las páginas principales y permiten evitar duplicidad de lógica visual.

## Componentes identificados

| Componente | Descripción |
|---|---|
| `AuthForm` | Formulario base relacionado con autenticación. |
| `CardPlantilla` | Tarjeta visual para mostrar plantillas. |
| `CardSitio` | Tarjeta visual para mostrar sitios. |
| `GrapesJS` | Integración del editor visual. |
| `Login` | Formulario de inicio de sesión. |
| `ModalDialog` | Modal reutilizable para confirmaciones o mensajes. |
| `ProtectedRoute` | Control de acceso a rutas según permiso. |
| `Register` | Formulario de registro. |
| `Sidebar` | Menú lateral del panel administrativo. |
| `ToggleSwitch` | Interruptor visual reutilizable. |

## Componente crítico: ProtectedRoute

`ProtectedRoute` es importante porque permite restringir el acceso visual a rutas protegidas.

Su finalidad es:

- recibir un permiso requerido;
- validar si el usuario cuenta con dicho permiso;
- mostrar la pantalla solicitada si tiene acceso;
- evitar o redirigir si no tiene autorización.

!!! warning "Control complementario"
    `ProtectedRoute` protege la navegación del frontend, pero no sustituye la autorización del backend. Todo endpoint debe validar permisos en el servidor.

## Componente crítico: Sidebar

El `Sidebar` ayuda a presentar el menú administrativo de acuerdo con el usuario autenticado y sus permisos disponibles.

Puede relacionarse con:

- Inicio;
- Sitios;
- Plantillas;
- Módulos;
- Configuraciones;
- Blog;
- Tienda;
- Analítica;
- Roles.

## Buenas prácticas observadas

- Componentes separados por carpeta.
- Archivos de prueba asociados en varios componentes.
- Separación entre páginas y componentes reutilizables.
- Uso de TypeScript para mayor mantenibilidad.
