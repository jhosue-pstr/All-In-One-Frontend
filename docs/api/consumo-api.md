# Consumo de API

El frontend consume la API del backend mediante servicios ubicados en:

```text
src/services/
```

La función base para realizar solicitudes se encuentra en:

```text
src/services/api.ts
```

## URL base de la API

La URL se obtiene desde la configuración:

```text
src/config/index.ts
```

La variable principal es:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

Si la variable no se define, se usa por defecto:

```text
http://localhost:8000/api
```

## Normalización de la URL

El frontend valida que la URL termine en `/api`. Si la variable no incluye ese segmento, lo agrega automáticamente.

Ejemplo:

| Valor definido | URL final |
|---|---|
| `http://localhost:8000` | `http://localhost:8000/api` |
| `http://localhost:8000/api` | `http://localhost:8000/api` |

## Servicio `fetchApi`

La función `fetchApi<T>()` centraliza las solicitudes al backend.

Responsabilidades principales:

- unir `API_URL` con el endpoint solicitado;
- agregar `Content-Type: application/json` cuando no se envía `FormData`;
- agregar token JWT si existe en `localStorage`;
- manejar errores `401`, `403` y otros;
- limpiar sesión si el token expiró;
- devolver respuesta JSON tipada.

## Manejo de FormData

Cuando el cuerpo de la solicitud es `FormData`, no se define manualmente `Content-Type`, permitiendo que el navegador agregue el `boundary` correspondiente.

Esto es importante para operaciones como:

- carga de imágenes;
- carga de miniaturas;
- carga de archivos asociados a contenido o productos.

## Manejo de respuestas sin contenido

Si el backend responde con:

```text
204 No Content
```

el frontend retorna un objeto vacío tipado.

## Recomendación

Toda nueva comunicación con el backend debería realizarse a través de servicios dentro de `src/services/`, evitando llamadas `fetch` dispersas en páginas o componentes.
