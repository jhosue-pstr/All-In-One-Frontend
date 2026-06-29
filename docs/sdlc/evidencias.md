# Evidencias para auditoría SDLC

La documentación del frontend contribuye a sustentar la auditoría del Ciclo de Vida del Desarrollo de Software de All-InOne.

## Evidencias principales del frontend

| Evidencia | Ubicación |
|---|---|
| Código fuente principal | `src/` |
| Componentes reutilizables | `src/components/` |
| Páginas del sistema | `src/pages/` |
| Servicios de API | `src/services/` |
| Modelos TypeScript | `src/models/` |
| Contextos | `src/context/` |
| Hooks | `src/hooks/` |
| Widget público | `src/site-widget/` |
| Pruebas unitarias/componentes | `*.test.ts`, `*.test.tsx` |
| Pruebas E2E | `e2e/` |
| Cobertura | `coverage/` |
| Configuración Playwright | `playwright.config.ts` |
| Configuración Vite | `vite.config.ts` |
| Configuración widget | `vite.widget.config.ts` |
| Pipeline CI | `Jenkinsfile` |
| Docker | `Dockerfile` |

## Relación con criterios SDLC

| Criterio | Evidencia frontend |
|---|---|
| Requisitos | Páginas, rutas, servicios y componentes asociados a módulos. |
| Diseño | Organización por páginas, componentes, servicios, contextos y modelos. |
| Construcción | Código React/TypeScript, Vite, GrapesJS y widget público. |
| Pruebas | Vitest, Testing Library, Playwright y cobertura. |
| Seguridad | ProtectedRoute, permisos, sesión y manejo de token. |
| Calidad | ESLint, build TypeScript, SonarQube/SonarCloud y Jenkins. |
| Implementación | Evidencias de despliegue técnico de prueba, no producción formal. |

## Trazabilidad sugerida

Para cada módulo funcional, se puede relacionar:

```text
Requisito / Historia de usuario
  ↓
Ruta frontend
  ↓
Página React
  ↓
Servicio API
  ↓
Modelo TypeScript
  ↓
Prueba unitaria o E2E
  ↓
Evidencia de ejecución
```

## Módulos visibles en frontend

- Inicio.
- Sitios.
- Plantillas.
- Módulos.
- Configuraciones.
- Blog.
- Tienda.
- Auth Público mediante widget.
- Analítica.
- Roles y permisos.
- WebEditor / GrapesJS.
