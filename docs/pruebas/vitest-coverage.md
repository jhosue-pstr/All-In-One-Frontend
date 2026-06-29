# Vitest y cobertura

El proyecto utiliza **Vitest** para ejecutar pruebas unitarias y de componentes con cobertura.

## Ejecutar pruebas

```bash
npm run test
```

Este comando ejecuta:

```bash
vitest run --coverage
```

## Carpeta de cobertura

Los resultados se generan en:

```text
coverage/
```

Dentro de esta carpeta pueden encontrarse reportes HTML y archivos como:

```text
coverage/lcov.info
coverage/index.html
coverage/lcov-report/index.html
```

## Archivos de prueba

El proyecto utiliza archivos con extensión:

```text
*.test.ts
*.test.tsx
```

Ejemplos:

```text
src/App.test.tsx
src/components/Login/Login.test.tsx
src/pages/Sitios/Sitios.test.tsx
src/services/auth.test.ts
src/site-widget/auth.test.ts
```

## Qué se valida

Las pruebas pueden validar:

- renderizado de componentes;
- comportamiento de formularios;
- servicios de API;
- hooks reutilizables;
- contextos;
- páginas principales;
- widget público;
- utilidades de permisos.

## Uso en SonarQube/SonarCloud

El pipeline utiliza el reporte:

```text
coverage/lcov.info
```

como entrada para análisis de cobertura en SonarQube/SonarCloud.

## Limitación

La cobertura no garantiza ausencia de errores. Solo indica qué partes del código fueron ejecutadas durante las pruebas automatizadas.
