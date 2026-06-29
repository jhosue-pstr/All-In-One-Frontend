# Visión general del frontend

El frontend de All-InOne es una aplicación desarrollada con **React**, **TypeScript** y **Vite**. Su función principal es proporcionar una interfaz administrativa para gestionar sitios, plantillas, módulos, contenido, tienda, usuarios, roles y analítica.

## Responsabilidades principales

| Responsabilidad | Descripción |
|---|---|
| Interfaz administrativa | Presenta las pantallas internas para usuarios autenticados. |
| Autenticación | Permite iniciar sesión, registrarse y validar la sesión mediante token. |
| Navegación protegida | Restringe rutas según permisos del usuario. |
| Gestión visual | Integra el editor visual con GrapesJS. |
| Consumo de API | Centraliza llamadas al backend mediante servicios TypeScript. |
| Gestión de estado contextual | Usa contextos para permisos y sitio seleccionado. |
| Pruebas | Incluye pruebas unitarias/componentes y pruebas E2E. |
| Widget público | Genera un script independiente para funcionalidades públicas de sitios. |

## Vista de alto nivel

```text
Usuario
  │
  ▼
React + Vite Frontend
  │
  ├─ Rutas públicas
  │   ├─ Login
  │   └─ Registro
  │
  ├─ Rutas protegidas
  │   ├─ Inicio
  │   ├─ Sitios
  │   ├─ Plantillas
  │   ├─ Módulos
  │   ├─ Blog
  │   ├─ Tienda
  │   ├─ Analítica
  │   ├─ Roles
  │   └─ WebEditor
  │
  ├─ Contextos
  │   ├─ PermisosContext
  │   └─ SiteContext
  │
  ├─ Servicios
  │   ├─ auth
  │   ├─ sitio
  │   ├─ plantilla
  │   ├─ modulo
  │   ├─ blog
  │   ├─ store
  │   └─ analitica
  │
  ▼
Backend FastAPI / API REST
```

## Principio de separación

El frontend no accede directamente a la base de datos. Toda operación se realiza mediante la API del backend.

Esto permite separar:

- interfaz de usuario;
- lógica de presentación;
- validación de permisos visuales;
- consumo de servicios;
- lógica de negocio ubicada en backend.

## Arquitectura frontend

El frontend está organizado por:

- `components/`: componentes reutilizables.
- `pages/`: pantallas principales del sistema.
- `services/`: comunicación con la API.
- `models/`: interfaces y tipos TypeScript.
- `context/`: estados compartidos.
- `hooks/`: lógica reutilizable.
- `site-widget/`: script público para sitios generados.
- `utils/`: utilidades de apoyo.
