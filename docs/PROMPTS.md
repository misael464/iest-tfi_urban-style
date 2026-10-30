# Prompts y errores de la IA

> **Pregunta que responde este archivo:** ¿qué se le pidió a la IA, en qué se equivocó y en qué ayudó?

Este registro cumple el principio P8 de [CONSTITUCION.md](CONSTITUCION.md):
una persona revisa y aprueba todo lo que genera la IA, y sus errores quedan
anotados con su corrección.

## Cómo se trabajó

- **Herramienta principal:** Claude Code (extensión de VS Code), modelo
  Opus 5.5, plan Pro, en **modo Manual**: cada cambio se muestra antes de
  aplicarse y el autor lo aprueba o lo rechaza.
- **Revisión:** el autor revisó cada propuesta antes de aprobarla, con ayuda
  de un asistente de IA en chat (Claude, en claude.ai) para detectar
  inconsistencias entre archivos.
- **Commits:** los hace siempre el autor desde VS Code, nunca la IA.

## Prompts importantes

Ordenados del más reciente al más antiguo.

| Fecha | Prompt (resumen) | Resultado |
| --- | --- | --- |
| 30/10/2026 | Crear las skills `verificar-criterios` (revisa los CA de una spec antes de aprobarla) y `revisar-marca` (revisa el código contra la identidad), las dos sin editar: solo proponen | Borradores aprobados. La IA sumó una excepción para los elementos deshabilitados (ver acierto 8) |
| 30/10/2026 | Crear `/spec`, `/clarificar` y `/verificar` en `.claude/commands/`, con criterios en EARS y `verificacion.md` con una casilla por CA y su evidencia | Borradores aprobados con un ajuste en `/spec` (ver error 7) |
| 28/10/2026 | Buscar los archivos que decían precios en $ 0, corregirlos y mostrar la línea de `AGENTS.md` para que la cambie el autor | Corrigió 01 y 05; el autor cambió `AGENTS.md` a mano |
| 28/10/2026 | Crear `CLAUDE.md` (menos de 60 líneas, importando `AGENTS.md` y la constitución) y `memory.md`, mostrando primero un borrador | Se corrigieron los precios en $ 0 y la lista de errores antes de aprobar |
| 28/10/2026 | Crear `docs/CONSTITUCION.md`: 6 a 8 principios, cada uno con “Cómo se verifica”, uno sobre uso responsable de la IA; primero la lista para aprobar | 8 principios. Se ajustaron P1, P3 y P6, y el autor cambió la comprobación de P8 |
| 27/10/2026 | Revisar la coherencia de 04, 07 y 08 después del cambio de stack | Encontró 3 problemas en 08-TAREAS.md (ver acierto 7) |
| 27/10/2026 | Cambiar el stack de React y Next.js a HTML, CSS y JS con Supabase en todo `docs/` | Plan aprobado y archivos actualizados; aparecieron los errores 1 a 6 |

### Ejemplo de prompt completo

Pedido usado para crear la constitución (28/10/2026):

```text
Leé AGENTS.md y todos los archivos de docs/ antes de escribir nada.

Creá docs/CONSTITUCION.md: los principios no negociables de Urban Style que
todo cambio de código o documentación tiene que cumplir. Reglas:

- Entre 6 y 8 principios, numerados (P1, P2...).
- Cada principio tiene: el enunciado en una frase, por qué existe, y
  "Cómo se verifica": una comprobación concreta (un comando, una búsqueda
  o una prueba) que diga si se cumple o no. Nada que no se pueda comprobar.
- Tienen que salir de lo que ya dicen los docs, sin inventar reglas nuevas.
- Uno de los principios tiene que ser sobre uso responsable de la IA.
- Al final, una sección "Cómo se cambia esta constitución".

Primero mostrame la lista de principios con una línea cada uno. No escribas
el archivo hasta que yo te lo apruebe.
```

Lo que funcionó de este prompt: pedir primero la lista y aprobarla antes de
que se escriba el archivo, y exigir que cada regla tenga una comprobación.

## Errores de la IA

| N.º | Fecha | Archivo | Qué pasó | Cómo se detectó | Corrección |
| --- | --- | --- | --- | --- | --- |
| 1 | 27/10/2026 | 03-TECNOLOGIAS.md | Mantuvo «OpenCode» como herramienta de IA en vez de Claude Code | Al revisar el archivo | Se pidió el cambio: quedó «Claude Code, Opus 5.5, Pro, Modo Manual» |
| 2 | 27/10/2026 | 03-TECNOLOGIAS.md | Se pidieron dos correcciones en el mismo pedido y aplicó solo una | Comparando el pedido con el resultado | Se le volvió a pedir la que faltaba |
| 3 | 27/10/2026 | 03-TECNOLOGIAS.md | Al hacer una corrección, revirtió un cambio que ya estaba aprobado | Releyendo el archivo completo | Se restauró el cambio aprobado |
| 4 | 27/10/2026 | AGENTS.md | Lo editó por partes y dejó la mayoría con el stack anterior (Next.js) | Revisando el archivo entero | Se reescribió completo con el stack nuevo |
| 5 | 27/10/2026 | 09-SEO.md | En el ejemplo de `sitemap.xml` puso un comentario antes de `<?xml`, que tiene que ser la primera línea | Revisando el ejemplo | Se borró la línea del comentario |
| 6 | 27/10/2026 | AGENTS.md | Dejó ediciones pendientes que iban a pisar los cambios hechos a mano | Al ver la propuesta en modo Manual | El autor la rechazó con «No» |
| 7 | 30/10/2026 | .claude/commands/spec.md | El comando buscaba el nombre de la carpeta (`001-catalogo`) en una tabla de 02 que no lo tiene: habría frenado en el primer uso | Revisando el borrador antes de aprobarlo | Se agregó la tabla de equivalencias entre carpetas, funcionalidades y RF |

### Lecciones

- Los errores 2, 3, 4 y 6 tienen la misma causa: la IA edita por partes y
  no tiene en cuenta los cambios hechos a mano. Por eso `CLAUDE.md` le exige
  releer el archivo completo antes de editar y confirmar cada cambio pedido.
- Antes de anotar un error, hay que esperar a que la IA termine. El 28/10
  pareció que no había actualizado una línea de 04-ARQUITECTURA.md, pero el
  cambio todavía no estaba aplicado: no era un error.
- El modo Manual evitó el error 6: sin la aprobación de cada cambio, se
  habría perdido trabajo hecho a mano.

## Aciertos de la IA

La IA también detectó problemas que el autor no había visto.

| N.º | Fecha | Qué detectó | Qué se hizo |
| --- | --- | --- | --- |
| 1 | 28/10/2026 | 01, 05 y AGENTS.md seguían diciendo precios en $ 0, contra la decisión nueva | Se cambiaron a precios de ejemplo marcados como tales |
| 2 | 28/10/2026 | 04 decía que cada comando completa «el archivo del mismo nombre», pero `/clarificar` completa `clarificacion.md` | Se aclaró qué archivo completa cada comando |
| 3 | 28/10/2026 | P1 suponía un formato de casillas en `verificacion.md` que ningún documento definía | Lo definió el comando `/verificar` |
| 4 | 28/10/2026 | La prueba de P4 crea un pedido real en la base | Se hace con datos de demostración y después se cancela |
| 5 | 28/10/2026 | La comprobación de P8 con `git log` muestra el autor del commit, no quién escribió el código | Se reconoce como comprobación débil; la garantía real es el modo Manual |
| 6 | 28/10/2026 | 04 describía `PROMPTS.md` solo como registro de prompts, y 06 tenía un error de tipeo | Se corrigieron los dos |
| 7 | 27/10/2026 | En 08-TAREAS.md, Seguridad dependía de etapas de la segunda etapa, faltaba desactivar el registro público y las pruebas pedían RF01 a RF22 | Se corrigieron las dependencias, la tarea y el rango (RF01 a RF13) |
| 8 | 30/10/2026 | La skill `revisar-marca` habría marcado como error el texto Gris medio de los botones deshabilitados, que 06 pide | Se agregó la excepción de los elementos deshabilitados |

## Buenas prácticas que quedaron

- Pedir primero una lista o un borrador, y escribir el archivo recién después
  de aprobarlo.
- Avisarle a la IA cuando un archivo se editó a mano: «volvé a leerlo antes
  de editar».
- Pedir que cada regla tenga una forma concreta de comprobarse.
- Aprobar cada cambio por separado: siempre «1 · Yes», nunca «2 · Yes, allow
  all edits».
- No editar a mano mientras la IA todavía está trabajando en el mismo archivo.
