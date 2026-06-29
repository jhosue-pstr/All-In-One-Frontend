# Playwright E2E

El frontend utiliza **Playwright** para validar flujos completos desde la interfaz de usuario.

## Ejecutar pruebas E2E

```bash
npm run test:e2e
```

## Abrir interfaz de Playwright

```bash
npm run test:e2e:ui
```

## Configuración

La configuración principal se encuentra en:

```text
playwright.config.ts
```

Las pruebas se ubican en:

```text
e2e/
```

## Variables utilizadas en CI

El pipeline de Jenkins puede utilizar variables como:

```text
BASE_URL
API_URL
TEST_USER_EMAIL
TEST_USER_PASSWORD
CI
```

## Flujo E2E en Jenkins

De forma general, el pipeline:

1. levanta el frontend en modo desarrollo dentro de Docker;
2. verifica que el frontend esté disponible;
3. crea o asegura un usuario de prueba;
4. promueve el usuario a `super_admin` en el backend de prueba;
5. valida login contra el backend;
6. ejecuta Playwright contra el frontend levantado;
7. archiva reportes de pruebas.

## Reportes generados

Playwright puede generar:

```text
playwright-report/
test-results/
```

## Alcance académico

Estas pruebas se ejecutan sobre un entorno académico/de prueba. No representan pruebas de aceptación en una empresa real ni certificación productiva.
