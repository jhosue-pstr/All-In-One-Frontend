# All-InOne Frontend

Bienvenido a la documentación técnica del **frontend de All-InOne**, plataforma SaaS multitenant desarrollada por **ModularSoft - Grupo 4**.

Esta documentación describe la estructura, arquitectura, instalación, consumo de API, rutas, componentes, seguridad, pruebas, calidad y despliegue de prueba del frontend.

!!! info "Contexto del repositorio"
    El frontend se encuentra en un repositorio independiente del backend. Por ello, esta documentación se enfoca en la aplicación React/Vite y en su integración con la API backend mediante variables de entorno.

## Propósito

El propósito de esta documentación es servir como evidencia técnica para:

- explicar cómo se organiza el frontend;
- facilitar la instalación local;
- describir las rutas y módulos visuales;
- documentar el consumo de API;
- sustentar las pruebas unitarias, cobertura y E2E;
- registrar consideraciones de seguridad frontend;
- diferenciar el despliegue académico/de prueba de una puesta en producción formal.

## Tecnologías principales

| Tecnología | Uso dentro del frontend |
|---|---|
| React | Construcción de interfaces y componentes. |
| TypeScript | Tipado estático del frontend. |
| Vite | Servidor de desarrollo y empaquetado. |
| React Router DOM | Definición de rutas y navegación. |
| GrapesJS | Constructor visual de páginas. |
| Bootstrap | Apoyo visual y estilos base. |
| Recharts | Visualización de métricas y analítica. |
| Vitest | Pruebas unitarias y de componentes. |
| Playwright | Pruebas End-to-End. |
| ESLint | Revisión estática de estilo y calidad. |
| Jenkins | Integración continua y ejecución de pipeline. |

## Estructura general

```text
FRONTEND/
├─ coverage/
├─ e2e/
├─ public/
├─ src/
├─ Dockerfile
├─ Jenkinsfile
├─ package.json
├─ playwright.config.ts
├─ vite.config.ts
└─ vite.widget.config.ts
```

## Relación con el backend

El frontend no contiene la lógica de negocio principal ni la persistencia de datos. Su responsabilidad es presentar la interfaz, consumir la API backend y aplicar controles de navegación, sesión y permisos desde el lado del cliente.

La URL base de la API se configura mediante:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

## Alcance académico

El frontend cuenta con evidencias de desarrollo, pruebas y despliegue técnico en entorno académico/de prueba. Esto no representa una implementación productiva formal en una empresa real.
