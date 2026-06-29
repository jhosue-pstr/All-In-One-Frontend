# Jenkins y calidad

El frontend cuenta con un `Jenkinsfile` para automatizar actividades de integración continua y calidad.

## Etapas principales del pipeline

| Etapa | Propósito |
|---|---|
| Clean Workspace | Limpia archivos temporales del workspace. |
| Checkout | Descarga el repositorio. |
| Setup Node | Instala dependencias con npm. |
| Lint & Build | Ejecuta build del frontend. |
| Run Tests | Ejecuta pruebas con cobertura. |
| SonarQube Analysis | Envía análisis de calidad a SonarQube/SonarCloud. |
| Build Docker Image | Construye imagen Docker del frontend. |
| Run E2E Tests | Ejecuta pruebas End-to-End con Playwright. |

## Imagen base Node

El pipeline utiliza una imagen Node en Docker:

```text
node:20-alpine
```

## Análisis estático

El análisis de calidad utiliza un proyecto identificado como:

```text
All-In-One-Frontend
```

y analiza principalmente:

```text
src/
```

## Exclusiones de análisis

El pipeline excluye carpetas y archivos como:

- `node_modules/`;
- `dist/`;
- `public/`;
- archivos de prueba;
- modelos;
- assets;
- tipos;
- constantes.

## Evidencias generadas

El pipeline puede generar o archivar:

- reporte de cobertura;
- reportes Playwright;
- resultados JUnit;
- análisis Sonar;
- imagen Docker;
- logs del pipeline.

## Consideración importante

El pipeline evidencia integración continua técnica, pero no equivale a un proceso formal de despliegue productivo en una empresa real.
