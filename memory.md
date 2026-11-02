# Memoria del proyecto

> **Pregunta que responde este archivo:** ¿dónde quedamos y qué ya se decidió?

## Estado actual

- La especificación de `docs/` está actualizada al nuevo stack (28/10/2026).
- `docs/CONSTITUCION.md` está creada, con los principios P1 a P8.
- Las etapas 1, 2 y 3 están terminadas (02/11/2026).
- La funcionalidad 001 (catálogo, búsqueda y filtros) está terminada: 28 de 28 CA verificados en `specs/001-catalogo/verificacion.md` (02/11/2026).
- Próximo paso: `/spec 002-detalle-carrito`.

## Decisiones tomadas

| Fecha | Decisión |
| --- | --- |
| 27/10/2026 | Cambio de stack: HTML, CSS y JS sin frameworks, con Supabase (PostgreSQL y Auth), Vitest, GitHub y Vercel |
| 27/10/2026 | Alcance del TFI: RF01 a RF13 |
| 27/10/2026 | Contacto (RF14 y RF15) y panel (RF16 a RF22) pasan a una segunda etapa; mientras tanto se usa el panel web de Supabase |
| 27/10/2026 | El stock se descuenta en `confirmar_pedido`, no al crear el pedido |
| 27/10/2026 | Los productos de demostración lo dicen en su descripción («Producto de demostración») y tienen precios de ejemplo, no $ 0 |
| 28/10/2026 | Se crea la constitución (P1 a P8) |
| 30/10/2026 | Se crean /spec, /clarificar y /verificar; verificacion.md usa una casilla por CA con su evidencia |
| 30/10/2026 | Se crean las skills verificar-criterios y revisar-marca (skill propia) |
| 30/10/2026 | Se usa Vitest 3 porque el entorno tiene Node 20.13 |
| 31/10/2026 | La docente extendió el plazo del TFI al martes 3 de noviembre de 2026 |

## Pendientes

- Datos del negocio en `js/config/sitio.js`: WhatsApp, horarios, redes y correo.
- Dominio definitivo: reemplazar `DOMINIO-PENDIENTE` (HTML, `sitemap.xml` y `robots.txt`).
- Confirmar la última versión estable de `supabase-js` (hoy figura `@2.45.4`).
- Decidir si se agrega `.vercelignore` para no publicar `docs/`, `specs/` y `memory.md`.
- Crear `docs/DECLARACION-IA.md` y `multimedia/FICHAS-IA.md`.
- Probar en el navegador los botones y los mensajes cuando se usen en la Etapa 4 (revisar también cómo se ve el ✓).
- En la spec 003: `crear_pedido` dice “Solo quedan 1 unidades” con stock 1; corregir el singular en 05 y en `db/funciones.sql`.

## Errores de la IA ya vistos

El detalle de cada uno está en `docs/PROMPTS.md`.

1. Mantuvo OpenCode como herramienta de IA en vez de Claude Code.
2. Aplicó solo una de las dos correcciones pedidas en el mismo pedido.
3. Al corregir un archivo, revirtió un cambio que ya estaba aprobado.
4. Editó AGENTS.md por partes y dejó la mayoría con el stack de Next.js.
5. En el ejemplo de sitemap.xml puso un comentario antes de `<?xml>`.
6. Dejó ediciones pendientes que iban a pisar cambios hechos a mano en
   AGENTS.md; el autor las rechazó.
7. En /spec buscaba el nombre de la carpeta en una tabla de 02 que no lo
   tiene; se agregó la tabla de equivalencias.
8. Escribió pruebas del navegador en tono afirmativo y se leyeron como ya
   comprobadas; ahora las marca como "Prueba pendiente (la hacés vos)".
9. Guardó carrito.js incompleto y con un import a un archivo inexistente;
   lo detectó y lo corrigió ella misma.
10. Ocultó bloques con `hidden` sin ver que un `display` en el CSS lo anula;
    falló el carrito vacío. Se agregó `[hidden] { display: none !important; }`.