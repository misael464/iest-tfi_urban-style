---
description: Crea specs/<carpeta>/spec.md con criterios de aceptación en EARS
argument-hint: <carpeta, por ejemplo 001-catalogo>
---

Creá la especificación de la funcionalidad `$ARGUMENTS`.

## Antes de escribir

1. Si `$ARGUMENTS` está vacío, preguntá qué carpeta es y frená.
2. Leé `docs/CONSTITUCION.md` y `docs/02-REQUERIMIENTOS.md`, en especial la
   sección "Alcance del Trabajo Final Integrador".
3. Buscá `$ARGUMENTS` en la tabla de esa sección. De ahí salen los
   requerimientos que cubre:

   | Carpeta | Funcionalidad | Requerimientos |
   | --- | --- | --- |
   | `001-catalogo` | 1 · Catálogo, búsqueda y filtros | RF01 a RF05 |
   | `002-detalle-carrito` | 2 · Detalle del producto y carrito | RF06 a RF11 |
   | `003-pedido-whatsapp` | 3 · Pedido por WhatsApp | RF12 y RF13 |

   Si `$ARGUMENTS` no es ninguna de esas tres, avisá y frená.
4. Si un criterio necesita un texto o un detalle de pantalla, tomalo de
   `docs/06-DISENO-UI.md` o de `docs/IDENTIDAD-MARCA.md`. No lo inventes.
5. Si `specs/$ARGUMENTS/spec.md` ya existe, no lo pises: mostrá qué
   cambiarías y esperá la aprobación.

## Reglas

- Solo requerimientos de RF01 a RF13 (P7). Si la carpeta pide otro, avisá y frená.
- Cada criterio de aceptación de 02 se escribe en EARS, uno por línea. Un
  criterio de 02 puede dar más de un CA.
- Numerá los criterios CA01, CA02… y poné entre paréntesis el RF del que salen.
- Usá solo estos patrones:
  - **Siempre:** "El sistema debe…"
  - **Evento:** "Cuando <evento>, el sistema debe…"
  - **Estado:** "Mientras <estado>, el sistema debe…"
  - **No deseado:** "Si <condición no deseada>, entonces el sistema debe…"
  - **Opcional:** "Donde <característica>, el sistema debe…"
- Cada CA tiene que poder comprobarse con código, un test o una prueba manual.
- No inventes datos del negocio: precios, teléfonos, horarios, redes,
  correos ni promociones. Si un criterio los necesita, escribí "PENDIENTE".

## Formato de specs/$ARGUMENTS/spec.md

```markdown
# Spec · <nombre de la funcionalidad>

> **Pregunta que responde este archivo:** ¿qué tiene que hacer esta funcionalidad?

## Objetivo

<Dos o tres frases: qué puede hacer el cliente cuando esto esté terminado.>

## Requerimientos que cubre

| ID | Requerimiento |
| --- | --- |
| RF01 | … |

## Criterios de aceptación

- **CA01 (RF01)** · Cuando <evento>, el sistema debe <respuesta>.
- **CA02 (RF01)** · El sistema debe <respuesta>.

## Fuera de alcance

- <Lo que esta funcionalidad no hace, con el RF o la etapa donde se resuelve.>
```

## Al terminar

Mostrá el archivo y frená. El paso siguiente es `/clarificar $ARGUMENTS`,
y empieza solo cuando el autor apruebe la spec.
