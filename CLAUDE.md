# Urban Style · Instrucciones para Claude Code

Las reglas del proyecto y sus principios están en estos dos archivos:

@AGENTS.md
@docs/CONSTITUCION.md

## Al empezar y al terminar una sesión

- Al empezar, leé `memory.md`.
- Al terminar, proponé qué agregar a `memory.md`: estado actual, decisiones,
  pendientes y errores de la IA. No lo edites sin aprobación.

## Ciclo de cada funcionalidad (P1)

`/spec` → `/clarificar` → `plan.md` → `tasks.md` → código → `/verificar`

- No se saltea ningún paso.
- No se empieza un paso sin que el autor apruebe el anterior.
- El código se escribe de a una tarea de `tasks.md` por vez.

## Antes de editar un archivo

- Volvé a leerlo completo: el autor lo edita a mano.
- Hacé todos los cambios pedidos en ese archivo, no solo el primero. Al
  terminar, listá cada cambio pedido y confirmá que quedó hecho.

## Commits

- No hagas commits ni push: los hace el autor desde VS Code.
- Al terminar una tarea, proponé el mensaje de commit con el formato de
  `docs/07-CONVENCIONES.md`: `area: verbo en presente + qué cambia`.

## Si algo contradice la constitución

- Frená y avisá antes de seguir: qué principio, en qué archivo y qué opciones hay.
- Si el error es de la IA, proponé registrarlo en `docs/PROMPTS.md`.
