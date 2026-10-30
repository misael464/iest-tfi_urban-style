---
description: Resuelve lo ambiguo de specs/<carpeta>/spec.md y crea clarificacion.md
argument-hint: <carpeta, por ejemplo 001-catalogo>
---

Clarificá la especificación de `$ARGUMENTS`.

## Antes de preguntar

1. Si `$ARGUMENTS` está vacío o `specs/$ARGUMENTS/spec.md` no existe, avisá
   y frená: primero va `/spec $ARGUMENTS`.
2. Leé `specs/$ARGUMENTS/spec.md` y `docs/CONSTITUCION.md`.
3. Buscá en la spec lo que es ambiguo, lo que falta o lo que no se puede
   comprobar: un número sin definir, un texto de pantalla sin escribir, un
   caso de error sin respuesta, dos criterios que se contradicen.
4. Antes de preguntar algo, revisá si ya lo responde algún archivo de `docs/`.
   Si lo responde, no lo preguntes: anotalo como resuelto con su fuente.

## Preguntas

- Como máximo 5, de las más importantes a las menos.
- De a una: hacé la pregunta, esperá la respuesta y recién después seguí.
- Cada pregunta tiene de 2 a 4 opciones. Una lleva "(recomendada)" y una
  línea con el motivo.
- Si no hay nada ambiguo, decilo y no inventes preguntas.

## Con las respuestas

1. Creá `specs/$ARGUMENTS/clarificacion.md` con este formato:

```markdown
# Clarificación · <nombre de la funcionalidad>

> **Pregunta que responde este archivo:** ¿qué dudas tenía la spec y cómo se resolvieron?

| N.º | Pregunta | Respuesta | Qué cambió en la spec |
| --- | --- | --- | --- |
| 1 | … | … | CA03 reescrito; CA07 nuevo |
```

   Si no hubo preguntas, la tabla lleva una fila que lo dice.
2. Actualizá `specs/$ARGUMENTS/spec.md` con lo que cambió.
   - Los CA existentes mantienen su número.
   - Uno nuevo toma el número siguiente.
   - Uno que se elimina queda tachado (`~~CA04~~`), con el motivo al lado.
3. Mostrá los dos archivos y frená. El paso siguiente es `plan.md`, y
   empieza solo cuando el autor apruebe.
