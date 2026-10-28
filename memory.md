# Memoria del proyecto

> **Pregunta que responde este archivo:** ¿dónde quedamos y qué ya se decidió?

## Estado actual

- La especificación de `docs/` está actualizada al nuevo stack (28/10/2026).
- `docs/CONSTITUCION.md` está creada, con los principios P1 a P8.
- El sitio todavía no está programado.
- Próximo paso: etapa 1 de `docs/08-TAREAS.md` y `/spec` de `specs/001-catalogo/`.

## Decisiones tomadas

| Fecha | Decisión |
| --- | --- |
| 27/10/2026 | Cambio de stack: HTML, CSS y JS sin frameworks, con Supabase (PostgreSQL y Auth), Vitest, GitHub y Vercel |
| 27/10/2026 | Alcance del TFI: RF01 a RF13 |
| 27/10/2026 | Contacto (RF14 y RF15) y panel (RF16 a RF22) pasan a una segunda etapa; mientras tanto se usa el panel web de Supabase |
| 27/10/2026 | El stock se descuenta en `confirmar_pedido`, no al crear el pedido |
| 27/10/2026 | Los productos de demostración lo dicen en su descripción («Producto de demostración») y tienen precios de ejemplo, no $ 0 |
| 28/10/2026 | Se crea la constitución (P1 a P8) |

## Pendientes

- Datos del negocio en `js/config/sitio.js`: WhatsApp, horarios, redes y correo.
- Dominio definitivo: reemplazar `DOMINIO-PENDIENTE` (HTML, `sitemap.xml` y `robots.txt`).
- Nombre de la skill propia (`.claude/skills/SKILL-PROPIA/`).
- Confirmar la última versión estable de `supabase-js` (hoy figura `@2.45.4`).
- Probar el SQL de `db/` en Supabase: todavía no se ejecutó.
- Decidir si se agrega `.vercelignore` para no publicar `docs/`, `specs/` y `memory.md`.
- Crear `docs/PROMPTS.md`, `docs/DECLARACION-IA.md` y `multimedia/FICHAS-IA.md`.
- Definir el formato de `verificacion.md`: P1 supone casillas `- [ ]` / `- [x]`.

## Errores de la IA ya vistos

El detalle de cada uno está en `docs/PROMPTS.md`.

1. Mantuvo OpenCode como herramienta de IA en vez de Claude Code.
2. Aplicó solo una de las dos correcciones pedidas en el mismo pedido.
3. Al corregir un archivo, revirtió un cambio que ya estaba aprobado.
4. Editó AGENTS.md por partes y dejó la mayoría con el stack de Next.js.
5. En el ejemplo de sitemap.xml puso un comentario antes de `<?xml>`.
6. Dejó ediciones pendientes que iban a pisar cambios hechos a mano en
   AGENTS.md; el autor las rechazó.
