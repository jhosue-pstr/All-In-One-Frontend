# Páginas principales

Las páginas principales del frontend se ubican en:

```text
src/pages/
```

Cada página representa una sección funcional del panel administrativo.

## Relación de páginas

| Página | Archivo principal | Descripción |
|---|---|---|
| Inicio | `pages/Inicio/Inicio.tsx` | Vista inicial del panel administrativo. |
| Sitios | `pages/Sitios/Sitios.tsx` | Gestión de sitios/tenants. |
| Plantillas | `pages/Plantillas/Plantillas.tsx` | Administración de plantillas reutilizables. |
| Módulos | `pages/Modulos/Modulos.tsx` | Consulta y activación de módulos funcionales. |
| Configuraciones | `pages/Configuraciones/Configuraciones.tsx` | Configuraciones generales del sistema. |
| Blog | `pages/Blog/Blog.tsx` | Gestión de publicaciones y contenido. |
| Tienda | `pages/Tienda/Tienda.tsx` | Gestión de productos, categorías y pedidos. |
| Analítica | `pages/Analitica/Analitica.tsx` | Visualización de métricas y eventos. |
| Roles | `pages/Roles/RolesPage.tsx` | Administración de roles y permisos. |
| WebEditor | `pages/WebEditor/WebEditor.tsx` | Editor visual de sitios y plantillas. |
| No Autorizado | `pages/NoAutorizado/NoAutorizado.tsx` | Pantalla de acceso denegado. |

## Patrón de archivos

Varias páginas mantienen una estructura similar:

```text
NombrePagina/
├─ NombrePagina.tsx
├─ NombrePagina.css
└─ NombrePagina.test.tsx
```

Este patrón permite asociar:

- componente de la página;
- estilos propios;
- pruebas unitarias o de componente.

## Criterio de auditoría

Para la auditoría SDLC, las páginas permiten verificar trazabilidad entre:

- requisitos funcionales;
- módulos documentados;
- rutas protegidas;
- servicios de API;
- pruebas relacionadas;
- permisos requeridos.
