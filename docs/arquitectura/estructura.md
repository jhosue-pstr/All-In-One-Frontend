# Estructura del repositorio

La estructura base del repositorio frontend es la siguiente:

```text
FRONTEND/
├─ coverage/
├─ e2e/
├─ public/
├─ src/
├─ .gitignore
├─ Dockerfile
├─ Jenkinsfile
├─ README.md
├─ eslint.config.js
├─ index.html
├─ package-lock.json
├─ package.json
├─ playwright.config.ts
├─ tsconfig.app.json
├─ tsconfig.json
├─ tsconfig.node.json
├─ vite.config.ts
└─ vite.widget.config.ts
```

## Carpetas principales

| Carpeta | Descripción |
|---|---|
| `coverage/` | Reportes de cobertura generados por Vitest. No representa código fuente funcional. |
| `e2e/` | Pruebas End-to-End ejecutadas con Playwright. |
| `public/` | Archivos públicos servidos por Vite. |
| `src/` | Código fuente principal del frontend. |

## Archivos principales

| Archivo | Uso |
|---|---|
| `package.json` | Scripts, dependencias y configuración base del proyecto Node/Vite. |
| `vite.config.ts` | Configuración principal de Vite para la aplicación frontend. |
| `vite.widget.config.ts` | Configuración específica para compilar el widget público. |
| `playwright.config.ts` | Configuración de pruebas E2E con Playwright. |
| `eslint.config.js` | Reglas de análisis estático con ESLint. |
| `Dockerfile` | Construcción de imagen Docker del frontend. |
| `Jenkinsfile` | Pipeline de integración continua. |
| `tsconfig*.json` | Configuración de TypeScript. |

## Estructura de `src/`

```text
src/
├─ assets/
├─ components/
├─ config/
├─ context/
├─ hooks/
├─ models/
├─ pages/
├─ services/
├─ site-widget/
├─ test/
├─ utils/
├─ App.tsx
└─ main.tsx
```

## Convención observada

El proyecto sigue una organización por responsabilidad:

- las páginas contienen pantallas completas;
- los componentes se reutilizan dentro de páginas;
- los servicios consumen endpoints del backend;
- los modelos tipan las entidades;
- los contextos comparten información transversal;
- el widget público se compila de forma separada.
