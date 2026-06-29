# Instalación local

Esta sección describe cómo ejecutar el frontend de All-InOne en un entorno local de desarrollo.

## Requisitos previos

Antes de iniciar, se recomienda contar con:

- Git instalado.
- Node.js instalado.
- npm instalado.
- Backend de All-InOne disponible localmente o en un entorno de prueba.
- Archivo de configuración de variables de entorno, si corresponde.

## Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO_FRONTEND>
cd <CARPETA_DEL_REPOSITORIO_FRONTEND>
```

## Instalar dependencias

```bash
npm install
```

Este comando instala las dependencias declaradas en `package.json` y genera o actualiza `node_modules`.

## Configurar la URL del backend

El frontend consume la API mediante la variable:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

Si no se define la variable, el frontend utiliza por defecto:

```text
http://localhost:8000/api
```

!!! warning "Importante"
    La variable debe apuntar al backend disponible. Si el backend no está activo o la URL es incorrecta, las pantallas que consumen API pueden fallar.

## Ejecutar en modo desarrollo

```bash
npm run dev
```

Por defecto, Vite levanta el servidor en:

```text
http://localhost:5173
```

## Construir para distribución

```bash
npm run build
```

Este comando ejecuta:

```bash
tsc -b && vite build
```

Por ello, valida TypeScript y luego genera la versión empaquetada.

## Previsualizar build

```bash
npm run preview
```

## Ejecutar pruebas unitarias con cobertura

```bash
npm run test
```

Este comando ejecuta Vitest con cobertura.

## Ejecutar pruebas E2E

```bash
npm run test:e2e
```

También puede abrirse la interfaz de Playwright con:

```bash
npm run test:e2e:ui
```

## Construir widget público

El proyecto incluye una configuración adicional para construir el widget público del sitio:

```bash
npm run build:widget
```

Este comando utiliza:

```text
vite.widget.config.ts
```

El resultado esperado es un archivo tipo `site-widget.js`, utilizado para inicializar bloques dinámicos en sitios generados.
