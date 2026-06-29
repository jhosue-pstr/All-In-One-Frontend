# Configuración

El frontend se configura principalmente mediante variables de entorno y archivos de configuración de Vite, TypeScript, ESLint y Playwright.

## Variable principal

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

## Archivos de configuración

| Archivo | Propósito |
|---|---|
| `vite.config.ts` | Configuración principal de Vite. |
| `vite.widget.config.ts` | Build específico del widget público. |
| `tsconfig.json` | Configuración base de TypeScript. |
| `tsconfig.app.json` | Configuración TypeScript para la app. |
| `tsconfig.node.json` | Configuración TypeScript para herramientas Node. |
| `eslint.config.js` | Reglas de linting. |
| `playwright.config.ts` | Configuración de pruebas E2E. |
| `Dockerfile` | Construcción de imagen del frontend. |
| `Jenkinsfile` | Pipeline de integración continua. |

## Build principal

```bash
npm run build
```

## Build del widget

```bash
npm run build:widget
```

## Configuración para entorno local

Para desarrollo local, la API normalmente apunta a:

```text
http://localhost:8000/api
```

## Configuración para entorno de prueba

En Jenkins o Docker, puede apuntar a:

```text
http://backend:8000/api
```

## Recomendación

No subir archivos con secretos reales. Las variables sensibles deben gestionarse mediante configuración de entorno o credenciales del pipeline.
