# Despliegue de prueba

El frontend cuenta con evidencias de despliegue técnico y validación en entorno académico/de prueba.

## Formas de ejecución

| Modalidad | Comando / herramienta | Uso |
|---|---|---|
| Desarrollo local | `npm run dev` | Levantar la aplicación en Vite. |
| Build local | `npm run build` | Generar distribución estática. |
| Preview | `npm run preview` | Validar la build generada. |
| Docker | `Dockerfile` | Construir imagen del frontend. |
| Jenkins | `Jenkinsfile` | Automatizar build, pruebas y análisis. |

## Diferencia entre prueba y producción

| Entorno de prueba | Producción formal |
|---|---|
| Validación académica o técnica. | Puesta en operación real para una empresa. |
| Puede usar datos de prueba. | Usa datos y usuarios reales. |
| Puede cambiar con frecuencia. | Requiere control formal de cambios. |
| No necesariamente tiene aprobación empresarial. | Requiere aprobación, responsables y acta de despliegue. |

## Estado del proyecto

El frontend puede estar desplegado técnicamente, pero esto no debe interpretarse como implementación productiva formal.

!!! info "Para auditoría SDLC"
    Esta documentación debe indicar que el despliegue corresponde a un entorno académico/de prueba, no a una puesta en producción oficial afiliada a una empresa real.

## Evidencias sugeridas

- URL del entorno de prueba, si existe.
- Capturas de pantalla.
- Logs de Jenkins.
- Build generado.
- Resultado de pruebas E2E.
- Reporte de cobertura.
- Reporte de SonarQube/SonarCloud.
