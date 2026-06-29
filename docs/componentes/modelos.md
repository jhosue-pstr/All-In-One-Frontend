# Modelos TypeScript

Los modelos se ubican en:

```text
src/models/
```

Su objetivo es definir interfaces y tipos que representan entidades consumidas por el frontend.

## Modelos identificados

| Modelo | Uso probable |
|---|---|
| `user.ts` | Usuario autenticado o datos de perfil. |
| `roles.ts` | Roles, permisos o estructuras de autorización. |
| `sitio.ts` | Sitios/tenants administrados. |
| `plantilla.ts` | Plantillas reutilizables. |
| `modulo.ts` | Módulos funcionales activables. |
| `blog.ts` | Publicaciones, categorías o estados de Blog. |
| `store.ts` | Productos, categorías, pedidos o tienda. |
| `siteAuth.ts` | Autenticación pública por sitio. |
| `analitica.ts` | Métricas, eventos, visitas o indicadores. |
| `index.ts` | Exportaciones centralizadas. |

## Beneficios

El uso de modelos TypeScript permite:

- reducir errores por estructuras incorrectas;
- mejorar autocompletado en el IDE;
- documentar contratos esperados con la API;
- facilitar refactorizaciones;
- mejorar mantenibilidad del código.

## Consideración de auditoría

Los modelos frontend deben ser coherentes con los esquemas y respuestas del backend. Si una entidad cambia en la API, debe revisarse su modelo TypeScript correspondiente.

## Evidencia sugerida

Para sustentar esta parte en auditoría, se pueden revisar:

- archivos `src/models/*.ts`;
- servicios que consumen cada modelo;
- páginas que renderizan datos de esos modelos;
- pruebas unitarias relacionadas.
