---
name: verificar-criterios
description: Revisa los criterios de aceptación de specs/<carpeta>/spec.md antes de aprobar la spec. Usala después de /spec o /clarificar y antes de escribir plan.md, para encontrar CA que no siguen EARS, no tienen su RF, no se pueden comprobar, son vagos o inventan datos del negocio. No comprueba el código: eso lo hace /verificar.
---

# Verificar criterios

Revisa los criterios de aceptación (CA) de una spec **antes** de aprobarla.
No edita la spec: propone cambios.

## Qué revisar

Necesita la carpeta de la funcionalidad (por ejemplo `001-catalogo`) o la
ruta de un `spec.md`.

- Si no recibe ninguna de las dos, preguntá qué spec revisar y frená.
- Si `specs/<carpeta>/spec.md` no existe, avisá y frená.

## Antes de revisar

Leé:

- `specs/<carpeta>/spec.md`.
- `.claude/commands/spec.md`, que tiene los 5 patrones EARS y el formato de los CA.
- `docs/02-REQUERIMIENTOS.md`, para los RF y sus criterios.
- `AGENTS.md`, sección "Información del negocio".

## Qué se revisa en cada CA

1. **EARS:** usa uno de los 5 patrones de `.claude/commands/spec.md`:
   - "El sistema debe…"
   - "Cuando <evento>, el sistema debe…"
   - "Mientras <estado>, el sistema debe…"
   - "Si <condición no deseada>, entonces el sistema debe…"
   - "Donde <característica>, el sistema debe…"
2. **RF:** tiene su RF entre paréntesis, por ejemplo `CA01 (RF03)`. El RF va de
   RF01 a RF13 y es uno de los que la spec dice que cubre.
3. **Comprobable:** se puede comprobar con código, un test o una prueba
   manual. Si no se puede decir cómo se probaría, es un problema.
4. **Sin palabras vagas:** no dice "rápido", "fácil", "adecuado", "intuitivo"
   ni palabras igual de vagas, salvo que vengan con un número (por ejemplo,
   "en 5 pasos o menos").
5. **Sin datos inventados:** no tiene precios reales, teléfonos, horarios,
   redes, correos ni promociones. Vale "PENDIENTE" y vale un dato de
   demostración marcado como tal.

## Qué devuelve

Una tabla con **solo** los CA que tienen algún problema:

| CA | Problema | Propuesta de texto |
| --- | --- | --- |
| CA04 | No usa EARS y dice "rápido" sin número | Cuando el cliente escribe en el buscador, el sistema debe mostrar los resultados sin recargar la página. |

- Si un CA tiene varios problemas, van en la misma fila.
- La propuesta es el CA completo, ya corregido, listo para copiar.
- Al final, una línea de resumen: "N de M CA tienen problemas".
- Si no hay problemas, decilo en una línea y no armes la tabla.

No cambies `spec.md`. El autor decide qué propuestas aplica.
