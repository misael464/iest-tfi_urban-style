---
name: revisar-marca
description: Revisa archivos de css/, js/ y los .html contra la identidad de Urban Style (docs/IDENTIDAD-MARCA.md y docs/06-DISENO-UI.md). Usala después de escribir o cambiar estilos, componentes o textos de la interfaz, y antes de dar una tarea por terminada, para encontrar colores o fuentes fuera de las variables, pesos no permitidos, contrastes prohibidos, avisos con rojo o verde, botones chicos o textos fuera del tono.
---

# Revisar marca

Revisa archivos del sitio contra la identidad de la marca. No edita: propone
correcciones.

## Qué revisar

Necesita uno o más archivos, o una carpeta, de `css/`, `js/` o los `.html`.

- Si no recibe qué revisar, preguntá y frená.
- Si un archivo no existe, avisá y seguí con los demás.

## Antes de revisar

Leé:

- `docs/IDENTIDAD-MARCA.md`, sobre todo colores, reglas de contraste,
  tipografías y tono.
- `docs/06-DISENO-UI.md`, sobre todo botones, mensajes y accesibilidad.
- `docs/CONSTITUCION.md`, P3.

## Reglas que se revisan

| N.º | Regla | Qué se busca |
| --- | --- | --- |
| 1 | Colores y fuentes solo con variables (P3) | HEX, `rgb()`, `hsl()` o nombres de colores (`red`, `white`…) fuera de `css/globales.css`; `font-family` sin `var(--fuente-…)` |
| 2 | Solo pesos 400 y 700 | `font-weight` con otro valor (`500`, `600`, `bold`, `lighter`…) en lugar de `var(--peso-…)`, 400 o 700 |
| 3 | Beige nunca como texto sobre Marfil | `color: var(--color-acento)` en un elemento con fondo Marfil o sin fondo propio (hereda el Marfil del `body`) |
| 4 | Gris medio solo en texto de 24 px o más | `color: var(--color-secundario)` en un texto de menos de 24 px, o sin tamaño propio (hereda 16 px) |
| 5 | Avisos sin rojo ni verde, con ícono y texto | Colores rojos o verdes en mensajes; un aviso que se distingue solo por el color; un aviso sin ícono o sin `role="status"` / `role="alert"` |
| 6 | Botones de 44 px de alto mínimo | Botones y áreas táctiles sin `min-height: 44px` o con menos |
| 7 | Tono de la marca | Textos de la interfaz (en los `.html` y en los textos de `js/`) que no hablan de vos ("ingrese", "haga clic"), frases largas, mayúsculas sostenidas o signos repetidos, y errores que no empiezan con "Error:" o no dicen qué hacer |

Excepciones de P3, que **no** son problemas:

- Los SVG de `img/marca/`, que llevan los colores del logo adentro.
- Los colores de las prendas, que vienen del campo `hex` de la base. Asignar
  ese dato desde el JS está bien; escribir un HEX a mano, no.
- Los elementos deshabilitados, que según 06 usan Gris medio en texto y borde.

Si una regla depende de cómo se ve la página (por ejemplo, el fondo real de
un elemento), marcala como "Revisar en el navegador" en lugar de darla por
buena o por mala.

## Qué devuelve

Una tabla con **solo** los problemas encontrados, ordenados por archivo:

| Archivo y línea | Regla | Problema | Corrección |
| --- | --- | --- | --- |
| `css/componentes/mensaje.css:12` | 5 · Avisos sin rojo ni verde | El error usa `#C0392B` | Fondo Marfil, borde izquierdo de 6 px con `var(--color-principal)` e ícono de exclamación |

- La corrección dice exactamente qué cambiar, con el valor o el texto nuevo.
- Al final, una línea de resumen: "N problemas en M archivos".
- Si no hay problemas, decilo en una línea y no armes la tabla.

No cambies ningún archivo. El autor decide qué correcciones aplica.
