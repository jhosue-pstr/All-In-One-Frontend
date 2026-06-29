# Estrategia de pruebas

El frontend cuenta con una estrategia de pruebas orientada a validar componentes, páginas, servicios, rutas y flujos principales de usuario.

## Tipos de pruebas

| Tipo de prueba | Herramienta | Propósito |
|---|---|---|
| Pruebas unitarias | Vitest | Validar funciones, servicios y lógica aislada. |
| Pruebas de componentes | Testing Library + Vitest | Validar renderizado e interacción de componentes React. |
| Cobertura | Vitest coverage | Medir cobertura de archivos evaluados. |
| Pruebas E2E | Playwright | Validar flujos completos desde la interfaz. |
| Linting | ESLint | Revisar calidad estática y reglas de código. |
| Build | TypeScript + Vite | Validar compilación y empaquetado. |
| CI | Jenkins | Automatizar instalación, build, pruebas y análisis. |

## Scripts disponibles

Los scripts se encuentran en `package.json`:

```json
{
  "dev": "vite",
  "build": "tsc -b && vite build",
  "lint": "eslint .",
  "preview": "vite preview",
  "test": "vitest run --coverage",
  "test:e2e": "playwright test",
  "test:e2e:ui": "playwright test --ui",
  "build:widget": "vite build --config vite.widget.config.ts"
}
```

## Flujos críticos a probar

- Login administrativo.
- Registro de usuario.
- Validación de sesión.
- Rutas protegidas.
- Gestión de sitios.
- Gestión de plantillas.
- Activación o visualización de módulos.
- Blog.
- Tienda.
- Analítica.
- Roles y permisos.
- Editor visual GrapesJS.
- Widget público.

## Criterio de auditoría

Las pruebas ayudan a sustentar que el frontend no solo compila, sino que también valida comportamientos esperados de la interfaz y su integración con la API.
