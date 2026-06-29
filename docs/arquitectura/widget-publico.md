# Widget público

El frontend incluye un módulo especial llamado `site-widget`, compilado de manera independiente mediante `vite.widget.config.ts`.

## Ubicación

```text
src/site-widget/
```

## Propósito

El widget público inicializa funcionalidades dinámicas dentro de los sitios generados por All-InOne.

## Funcionalidades observadas

| Archivo | Función principal |
|---|---|
| `index.ts` | Inicializa login, registro, logout, perfil, Blog, Tienda y Analítica. |
| `auth.ts` | Gestiona autenticación pública del sitio. |
| `perfil.ts` | Carga datos del usuario público autenticado. |
| `blog.ts` | Inicializa bloques dinámicos del Blog. |
| `tienda.ts` | Inicializa bloques dinámicos de Tienda. |
| `analitica.ts` | Inicializa eventos o métricas de analítica. |
| `api.ts` | Comunicación con la API desde el widget. |
| `shared.ts` | Funciones o elementos compartidos. |

## Construcción del widget

El widget se compila con:

```bash
npm run build:widget
```

Este comando usa:

```text
vite.widget.config.ts
```

## Salida esperada

La configuración genera un archivo tipo:

```text
site-widget.js
```

## Diferencia con la aplicación administrativa

| Aplicación administrativa | Widget público |
|---|---|
| Es una SPA React completa. | Es un script embebible. |
| Usa rutas internas y layout administrativo. | Inicializa bloques en páginas públicas. |
| Gestiona sitios, módulos, roles y contenido. | Permite interacción de usuarios públicos. |
| Requiere sesión administrativa. | Puede usar sesión pública por sitio. |

## Consideraciones de seguridad

El widget utiliza `localStorage` para manejar token público de sitio. Por ello, el backend debe validar siempre el token, el sitio asociado y los permisos reales.
