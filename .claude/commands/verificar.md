---
description: Comprueba cada criterio de specs/<carpeta>/spec.md y crea verificacion.md
argument-hint: <carpeta, por ejemplo 001-catalogo>
---

Verificá la funcionalidad `$ARGUMENTS`.

## Antes de verificar

1. Si `$ARGUMENTS` está vacío o `specs/$ARGUMENTS/spec.md` no existe, avisá
   y frená.
2. Leé `specs/$ARGUMENTS/spec.md`, `specs/$ARGUMENTS/tasks.md` y
   `docs/CONSTITUCION.md`.
3. Si `tasks.md` tiene tareas sin marcar, avisá cuáles antes de seguir.
4. Ejecutá `npm test` y guardá el resultado.

## Cómo se verifica cada criterio

- Revisá cada CA, en orden, contra el código y los tests.
- Un CA se marca `[x]` **solo con evidencia**. Vale como evidencia:
  - **Código:** archivo y línea donde se cumple.
  - **Test:** archivo y nombre del test, y que pasó en el `npm test` de recién.
  - **Prueba manual:** el paso a paso que hizo el autor y lo que vio. La IA
    no puede hacer una prueba manual: pedile al autor que la haga y anotá su
    resultado.
- Si no hay evidencia, o la evidencia muestra que no se cumple, el CA queda
  `[ ]` y debajo se escribe qué falta.
- No cambies código ni tests mientras verificás. Si algo falla, anotalo.

## Formato de specs/$ARGUMENTS/verificacion.md

```markdown
# Verificación · <nombre de la funcionalidad>

> **Pregunta que responde este archivo:** ¿se cumple cada criterio de la spec?

Fecha: <DD/MM/AAAA> · `npm test`: <N tests, todos pasan / N fallan>

- [x] CA01 · <criterio, tal como está en spec.md>
  - Evidencia: `js/lib/carrito.js:42`; test "suma la cantidad si la variante ya estaba" en `tests/carrito.test.js`.
- [ ] CA02 · <criterio>
  - Falta: <qué no se cumple o qué prueba falta hacer>.
```

Las casillas tienen que ser exactamente `- [x]` o `- [ ]`, para que funcione
la comprobación de P1: `git grep -n "\- \[ \]" -- specs/$ARGUMENTS/verificacion.md`.

## Al terminar

Mostrá el resumen: cuántos CA se cumplen y cuáles no. Si quedó alguno `[ ]`,
la funcionalidad no está terminada (P1).
