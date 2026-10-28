# Constitución de Urban Style

> **Pregunta que responde este archivo:** ¿qué reglas no se negocian nunca?

Estos son los principios que tiene que cumplir **todo** cambio de código o de
documentación. No agregan reglas nuevas: reúnen las más importantes de
[../AGENTS.md](../AGENTS.md) y de los archivos de `docs/`, cada una con una
forma concreta de comprobarla.

Se leen antes de cada spec, plan o tarea. Si algo no cumple un principio, se
frena y se consulta antes de seguir.

Los comandos de “Cómo se verifica” se ejecutan en la terminal de Git Bash,
desde la raíz del repositorio. Una búsqueda que “no devuelve nada” significa
que el principio se cumple.

## P1 · Especificación antes que código

**Principio:** ninguna funcionalidad se programa sin su carpeta en `specs/`
con `spec.md`, `clarificacion.md`, `plan.md` y `tasks.md`, y no se da por
terminada hasta que su `verificacion.md` tiene todos los criterios comprobados.

**Por qué:** sin especificación, la IA inventa colores, datos y estructura. La
spec dice qué se construye y `verificacion.md` demuestra que se cumplió.

**Cómo se verifica:**

- La carpeta tiene los cinco archivos:
  `ls specs/001-catalogo/` muestra `spec.md`, `clarificacion.md`, `plan.md`,
  `tasks.md` y `verificacion.md`.
- La spec llegó antes que el código: la fecha de
  `git log --diff-filter=A --format="%ad" --date=iso -- specs/001-catalogo/spec.md`
  es anterior a la del primer commit que toca los archivos de la funcionalidad
  (por ejemplo, `git log --reverse --format="%ad" --date=iso -- catalogo.html | head -1`).
- No queda ningún criterio sin comprobar:
  `git grep -n "\- \[ \]" -- specs/001-catalogo/verificacion.md` no devuelve nada.

**Detalle:** [04-ARQUITECTURA.md](04-ARQUITECTURA.md) (Proceso del TFI) y
[08-TAREAS.md](08-TAREAS.md).

## P2 · HTML, CSS y JavaScript separados, sin frameworks

**Principio:** el sitio se hace solo con HTML, CSS y JavaScript, cada uno en
su propio archivo, y las únicas bibliotecas son `supabase-js` y Vitest.

**Por qué:** todo el código se tiene que poder explicar en la defensa, línea
por línea, sin una capa de framework en el medio.

**Cómo se verifica:**

- `npm ls --depth=0` muestra solo `vitest`.
- No hay archivos de otros lenguajes ni de frameworks:
  `git ls-files "*.ts" "*.tsx" "*.jsx" "*.vue"` no devuelve nada.
- Ningún HTML tiene estilos ni código adentro:
  `git grep -nE "<style|style=\"|on(click|submit|change|input|load)=" -- "*.html"`
  no devuelve nada, y
  `git grep -nP "<script(?![^>]*\bsrc=)" -- "*.html"` tampoco.
- `supabase-js` se importa en un solo lugar:
  `git grep -l "supabase-js" -- js/` devuelve solo `js/lib/supabase.js`.

**Detalle:** [03-TECNOLOGIAS.md](03-TECNOLOGIAS.md) y
[07-CONVENCIONES.md](07-CONVENCIONES.md).

## P3 · La marca sale de las variables

**Principio:** los colores y las fuentes se usan solo con las variables de
`css/globales.css`, y ningún color se escribe a mano fuera de ese archivo.

Hay dos excepciones:

- Los SVG de `img/marca/`, que llevan los colores del logo adentro.
- Los colores de las prendas, que son datos del catálogo y vienen de la base
  (campo `hex` de la tabla `colores`).

**Por qué:** la paleta tiene cuatro colores y dos tipografías. Si cambia un
color, se edita una sola línea; y nadie suma por error un color fuera de la
marca.

**Cómo se verifica:**

- No hay HEX en el código fuera de `css/globales.css` e `img/`:
  `git grep -nE "#[0-9A-Fa-f]{3,8}\b" -- "*.css" "*.html" "*.js" ":!css/globales.css" ":!img/"`
  no devuelve nada.
- Tampoco hay colores con funciones:
  `git grep -nE "rgba?\(|hsla?\(" -- "*.css" "*.js" ":!css/globales.css"`
  no devuelve nada.
- Las fuentes salen de las variables:
  `git grep -n "font-family" -- "*.css" ":!css/globales.css" | grep -v "var(--fuente"`
  no devuelve nada.

**Detalle:** [IDENTIDAD-MARCA.md](IDENTIDAD-MARCA.md) y
[06-DISENO-UI.md](06-DISENO-UI.md).

## P4 · Supabase protege los datos

**Principio:** en el navegador va solo la clave anon, todas las tablas tienen
RLS, el total y el stock del pedido los calcula `crear_pedido` con los precios
de la base, y el texto nunca se inserta como HTML.

**Por qué:** el código del navegador se puede leer y modificar. Lo único que
protege los datos es lo que corre en Supabase.

**Cómo se verifica:**

- Todas las tablas tienen RLS. En el editor SQL de Supabase,
  `SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND NOT rowsecurity;`
  no devuelve filas.
- La clave `service_role` no está en el código ni en el historial:
  `git grep -n "service_role" -- ":!docs" ":!AGENTS.md"` y
  `git log -p -S "service_role" -- ":!docs" ":!AGENTS.md"` no devuelven nada.
- Un visitante no puede modificar datos. Con la clave anon,
  `supabase.from("productos").update({ precio: 1 }).eq("id", 1).select()`
  devuelve una lista vacía y el precio no cambia.
- El navegador no decide el total. Con la clave anon,
  `supabase.rpc("crear_pedido", { p_nombre_cliente: "Prueba Demo", p_items: [{ varianteId: 1, cantidad: 1, precio: 999 }] })`
  devuelve el total calculado con el precio de la base, no 999. Con una
  cantidad mayor que el stock, devuelve `ok: false`.
- No se inserta HTML ni se muestran errores internos:
  `git grep -nE "innerHTML|outerHTML|insertAdjacentHTML|document\.write|error\.message" -- js/`
  no devuelve nada.

**Detalle:** [10-SEGURIDAD.md](10-SEGURIDAD.md) y [05-DATOS.md](05-DATOS.md).

## P5 · Accesible y medible

**Principio:** el sitio se usa con teclado y desde 360 px de ancho, con
contraste AA, y Lighthouse da 80 o más en Rendimiento, Accesibilidad, Buenas
prácticas y SEO.

**Por qué:** la mayoría del público compra desde el celular, y una tienda que
no se puede usar con teclado o lector de pantalla deja gente afuera.

**Cómo se verifica:**

- Lighthouse de Chrome (DevTools), en modo celular, sobre el inicio y el
  catálogo publicados: las cuatro categorías dan 80 o más, y las auditorías de
  contraste y de texto alternativo pasan.
- A 360 px de ancho, en la consola del navegador,
  `document.documentElement.scrollWidth <= 360` devuelve `true` en cada página.
- Un pedido completo, desde el catálogo hasta “Enviar pedido por WhatsApp”, se
  puede hacer solo con `Tab`, `Enter` y la barra espaciadora, con el foco
  siempre visible.
- Todas las páginas declaran el idioma: `git grep -L 'lang="es"' -- "*.html"`
  no devuelve nada.

**Detalle:** [06-DISENO-UI.md](06-DISENO-UI.md) (Accesibilidad),
[02-REQUERIMIENTOS.md](02-REQUERIMIENTOS.md) (RNF01, RNF02 y RNF03) y
[09-SEO.md](09-SEO.md).

## P6 · La lógica pura tiene tests

**Principio:** `carrito.js`, `validaciones.js`, `whatsapp.js` y `formato.js`
tienen tests de Vitest, no importan Supabase ni tocan el DOM, y `npm test`
pasa antes de cada commit que toque `js/`.

**Por qué:** son las funciones que calculan importes, validan datos y arman el
pedido. Si fallan, se vende mal; con tests, un error vuelve a aparecer con
aviso y no en silencio.

**Cómo se verifica:**

- Existe un test por módulo:
  `ls tests/carrito.test.js tests/validaciones.test.js tests/whatsapp.test.js tests/formato.test.js`
  no da error.
- Los módulos no dependen de Supabase ni del DOM:
  `git grep -nE "supabase|document\." -- js/lib/carrito.js js/lib/validaciones.js js/lib/whatsapp.js js/lib/formato.js`
  no devuelve nada.
- Antes del commit: si `git diff --cached --name-only` muestra archivos de
  `js/`, `npm test` termina sin tests fallidos.

**Detalle:** [07-CONVENCIONES.md](07-CONVENCIONES.md) (Tests).

## P7 · El TFI es RF01 a RF13

**Principio:** durante el TFI solo se programan los requerimientos RF01 a
RF13; contacto, panel y funciones futuras no se programan hasta que cambie el
alcance en [02-REQUERIMIENTOS.md](02-REQUERIMIENTOS.md).

**Por qué:** el plazo es corto. Es mejor entregar la tienda completa, probada y
publicada que muchas funciones a medias.

**Cómo se verifica:**

- Cada requerimiento del TFI está en alguna spec:
  `for rf in RF01 RF02 RF03 RF04 RF05 RF06 RF07 RF08 RF09 RF10 RF11 RF12 RF13; do git grep -q "$rf" -- specs/ || echo "Falta $rf"; done`
  no imprime nada.
- Ninguna spec toma requerimientos de la segunda etapa:
  `git grep -nE "RF1[4-9]|RF2[0-2]" -- specs/` no devuelve nada.
- No hay archivos de la segunda etapa:
  `git ls-files contacto.html admin/ js/lib/consultas.js js/lib/auth.js` no
  devuelve nada.

**Detalle:** [02-REQUERIMIENTOS.md](02-REQUERIMIENTOS.md) (Alcance del Trabajo
Final Integrador) y [01-CONTEXTO.md](01-CONTEXTO.md).

## P8 · Uso responsable de la IA

**Principio:** una persona revisa y aprueba todo lo que genera la IA, los
errores de la IA se registran en `docs/PROMPTS.md`, la IA no inventa datos del
negocio y toda imagen o video generado con IA se identifica como tal.

**Por qué:** el autor responde por cada línea en la defensa. Un dato comercial
inventado engaña al cliente, y una pieza generada con IA que no se identifica
engaña a quien la mira.

**Cómo se verifica:**

- Claude Code está en modo Manual: cada cambio se aprueba antes de aplicarse.
- Los commits los hace el autor:
  `git log --format="%an <%ae>" | sort -u` muestra solo al autor del proyecto.
- `docs/PROMPTS.md` tiene registrados los errores de la IA, cada uno con su
  corrección.
- Los datos del negocio siguen pendientes hasta que el negocio los defina:
  `git grep -n "PENDIENTE" -- js/config/sitio.js` muestra cada dato sin
  definir. Mientras no haya catálogo real, cada producto de demostración lo
  dice en su descripción: en el editor SQL de Supabase,
  `SELECT nombre FROM productos WHERE descripcion NOT ILIKE '%demostración%';`
  no devuelve filas, y sus precios son de ejemplo.
- Cada imagen o video de `multimedia/` generado con IA tiene su ficha en
  `multimedia/FICHAS-IA.md` y muestra la leyenda «Generado con IA».

**Detalle:** [../AGENTS.md](../AGENTS.md) (Información del negocio),
[03-TECNOLOGIAS.md](03-TECNOLOGIAS.md) (Inteligencia artificial) y
[04-ARQUITECTURA.md](04-ARQUITECTURA.md) (Proceso del TFI).

## Cómo se cambia esta constitución

Un principio no se cambia en medio de una tarea ni por cuenta de la IA. Para
cambiarlo:

1. Se escribe la justificación: qué principio cambia, por qué y qué archivos
   de `docs/` se ven afectados.
2. Se anota en el historial de abajo, con la fecha.
3. Se hace un commit propio, que solo toca este archivo, en el área `docs`.
   Por ejemplo: `docs: cambia P5 de la constitucion`.
4. Después, en otros commits, se actualizan los archivos de `docs/` y el
   código que dependen del cambio.

Se comprueba con `git log --format="%h %s" -- docs/CONSTITUCION.md`: todos los
mensajes empiezan con `docs:`, y `git show --stat` de cada uno muestra solo
este archivo.

## Historial de cambios

| Fecha | Cambio | Motivo |
| --- | --- | --- |
| 28/10/2026 | Creación de la constitución con los principios P1 a P8 | Reunir las reglas no negociables del proyecto, cada una con una comprobación concreta |
