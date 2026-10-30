# 04 · Arquitectura

> **Pregunta que responde este archivo:** ¿cómo se organiza el código?

**Importante:** este árbol es la **arquitectura propuesta**. Los archivos
todavía no existen: se crean a medida que se avanza con
[08-TAREAS.md](08-TAREAS.md). Las tecnologías están explicadas en
[03-TECNOLOGIAS.md](03-TECNOLOGIAS.md).

## Árbol de carpetas

Los elementos marcados con **(proceso)** los exige la consigna del TFI: no
forman parte del sitio, documentan cómo se construyó.

```text
iest-tfi_urban-style/
├── index.html                        ← inicio
├── catalogo.html                     ← catálogo con búsqueda y filtros
├── producto.html                     ← detalle de un producto (?slug=...)
├── carrito.html                      ← carrito y envío del pedido
├── contacto.html                     ← información y formulario
├── 404.html                          ← página "No encontrado"
├── admin/                            ← panel de administración
│   ├── ingresar.html                 ← inicio de sesión
│   ├── index.html                    ← resumen del panel
│   ├── productos.html                ← listado de productos
│   ├── producto.html                 ← alta y edición (?id=...)
│   ├── categorias.html
│   ├── talles-colores.html           ← talles, colores y variantes
│   ├── pedidos.html                  ← listado de pedidos
│   ├── pedido.html                   ← detalle y cambio de estado (?id=...)
│   └── consultas.html
├── css/
│   ├── globales.css                  ← variables de marca y estilos base
│   ├── componentes/                  ← un archivo por componente
│   │   ├── encabezado.css
│   │   ├── pie-de-pagina.css
│   │   ├── boton.css
│   │   ├── tarjeta-producto.css
│   │   ├── filtros-catalogo.css
│   │   ├── selector-variante.css
│   │   ├── item-carrito.css
│   │   ├── formulario.css
│   │   └── mensaje.css
│   └── paginas/                      ← lo propio de cada página
│       ├── inicio.css
│       ├── catalogo.css
│       ├── producto.css
│       ├── carrito.css
│       ├── contacto.css
│       └── admin.css
├── js/
│   ├── config/
│   │   ├── sitio.js                  ← WhatsApp, horarios y redes
│   │   └── supabase.js               ← URL del proyecto y clave anon
│   ├── lib/                          ← reglas del negocio y acceso a datos
│   │   ├── supabase.js               ← única conexión: importa supabase-js
│   │   ├── productos.js              ← lecturas del catálogo y búsqueda
│   │   ├── categorias.js
│   │   ├── pedidos.js                ← llama a crear_pedido y confirmar_pedido
│   │   ├── consultas.js
│   │   ├── auth.js                   ← ingreso, cierre y comprobación de sesión
│   │   ├── carrito.js                ← carrito en localStorage      (sin Supabase)
│   │   ├── validaciones.js           ← reglas de los formularios    (sin Supabase)
│   │   ├── whatsapp.js               ← arma el mensaje y el enlace  (sin Supabase)
│   │   └── formato.js                ← formato de precios y fechas  (sin Supabase)
│   ├── componentes/                  ← funciones que arman piezas de la página
│   │   ├── encabezado.js             ← menú del celular y contador del carrito
│   │   ├── tarjetaProducto.js
│   │   ├── grillaProductos.js
│   │   ├── filtrosCatalogo.js
│   │   ├── selectorVariante.js
│   │   ├── selectorCantidad.js
│   │   ├── etiquetaDisponibilidad.js
│   │   ├── itemCarrito.js
│   │   ├── resumenCarrito.js
│   │   ├── mensaje.js
│   │   ├── estadoVacio.js
│   │   └── admin/                    ← piezas del panel
│   └── paginas/                      ← un archivo por página: lo que arranca al cargarla
│       ├── inicio.js
│       ├── catalogo.js
│       ├── producto.js
│       ├── carrito.js
│       ├── contacto.js
│       └── admin/
├── db/                               ← SQL que se ejecuta en Supabase
│   ├── esquema.sql                   ← creación de tablas
│   ├── politicas.sql                 ← RLS de cada tabla
│   ├── funciones.sql                 ← funciones RPC
│   └── datos-demo.sql                ← datos de demostración
├── tests/                            ← tests de Vitest
│   ├── carrito.test.js
│   ├── validaciones.test.js
│   ├── whatsapp.test.js
│   └── formato.test.js
├── img/
│   ├── marca/                        ← logo.svg, logo-oscuro.svg, isotipo.svg
│   ├── productos/                    ← fotos de las prendas
│   └── compartir.jpg                 ← imagen para redes sociales
├── sitemap.xml                       ← mapa del sitio para buscadores
├── robots.txt                        ← qué pueden recorrer los buscadores
├── docs/                             ← estas especificaciones
│   ├── CONSTITUCION.md               ← (proceso) principios que no se negocian
│   ├── PROMPTS.md                    ← (proceso) prompts importantes y errores de la IA
│   └── DECLARACION-IA.md             ← (proceso) declaración de uso de IA
├── specs/                            ← (proceso) una carpeta por funcionalidad
│   ├── 001-catalogo/
│   │   ├── spec.md
│   │   ├── clarificacion.md
│   │   ├── plan.md
│   │   ├── tasks.md
│   │   └── verificacion.md
│   ├── 002-detalle-carrito/          ← mismos cinco archivos
│   └── 003-pedido-whatsapp/          ← mismos cinco archivos
├── .claude/                          ← (proceso) configuración de Claude Code
│   ├── commands/
│   │   ├── spec.md
│   │   ├── clarificar.md
│   │   └── verificar.md
│   └── skills/
│       ├── verificar-criterios/
│       └── revisar-marca/            ← skill propia
├── multimedia/                       ← (proceso) piezas multimedia del TFI
│   ├── imagenes/
│   ├── video/
│   ├── graficos/
│   └── FICHAS-IA.md
├── marca/                            ← originales del logo y paleta
├── AGENTS.md                         ← índice y reglas para la IA
├── CLAUDE.md                         ← (proceso) instrucciones para Claude Code
├── memory.md                         ← (proceso) memoria del proyecto entre sesiones
├── package.json                      ← solo Vitest y el comando npm test
├── .gitignore
└── README.md
```

## Función de cada parte

### Sitio

| Carpeta o archivo | Qué contiene | Regla |
| --- | --- | --- |
| Archivos `.html` | La estructura de cada página, con su `<title>`, su `meta description` y su `<h1>` | No llevan estilos ni código: solo `<link>` a su CSS y `<script type="module">` a su JS |
| `admin/` | Páginas del panel | Su JS comprueba la sesión al cargar; los datos los protege la RLS |
| `css/globales.css` | Variables de [IDENTIDAD-MARCA.md](IDENTIDAD-MARCA.md) y estilos base | Es el único archivo con valores HEX |
| `css/componentes/` y `css/paginas/` | Estilos de cada pieza y de cada página | Usan solo variables para colores y fuentes |
| `js/config/` | Datos públicos del negocio y del proyecto de Supabase | Los valores sin definir se marcan como pendientes. Nunca la clave `service_role` |
| `js/lib/supabase.js` | La conexión a Supabase | Es el **único** archivo que importa `supabase-js` |
| `js/lib/` | Acceso a datos y reglas del negocio | `carrito.js`, `validaciones.js`, `whatsapp.js` y `formato.js` no importan Supabase, para que Vitest los pruebe sin conexión |
| `js/componentes/` | Funciones que reciben datos y devuelven elementos del DOM | Arman los elementos con `createElement` y `textContent`, nunca con `innerHTML` |
| `js/paginas/` | El punto de partida de cada página | Lee los parámetros de la dirección, pide datos a `js/lib/` y usa los componentes |
| `db/` | Todo el SQL del proyecto | `esquema.sql` coincide siempre con [05-DATOS.md](05-DATOS.md) |
| `tests/` | Un archivo de tests por cada módulo de `js/lib/` sin Supabase | Se ejecutan con `npm test` antes de cada commit que toque `js/` |
| `img/` | Imágenes que se sirven tal cual | Las fotos se guardan optimizadas (ver [09-SEO.md](09-SEO.md)) |

### Proceso del TFI

| Carpeta o archivo | Qué contiene | Regla |
| --- | --- | --- |
| `CLAUDE.md` | Instrucciones que Claude Code lee al empezar cada sesión | Remite a [../AGENTS.md](../AGENTS.md); no repite ni contradice sus reglas |
| `memory.md` | Memoria del proyecto: decisiones tomadas y contexto que conviene recordar entre sesiones | Se actualiza al cerrar cada sesión de trabajo |
| `docs/CONSTITUCION.md` | Principios del proyecto que no se negocian | Se lee antes de cada spec, plan o tarea |
| `docs/PROMPTS.md` | Registro de los prompts importantes y de los errores de la IA con su corrección | Se agrega cada prompt importante con su fecha y su resultado, y cada error de la IA con cómo se corrigió |
| `docs/DECLARACION-IA.md` | Declaración de qué se hizo con IA y qué no | Se mantiene al día hasta la entrega |
| `specs/NNN-nombre/` | Una carpeta por funcionalidad, numerada en orden | Siempre tiene los cinco archivos de abajo |
| `spec.md` | Qué tiene que hacer la funcionalidad y sus criterios de aceptación | Se escribe antes que el código |
| `clarificacion.md` | Preguntas sobre lo que la spec no deja claro y sus respuestas | Se cierra antes de escribir el plan |
| `plan.md` | Cómo se va a construir: archivos, datos y decisiones | Respeta esta arquitectura y la constitución |
| `tasks.md` | Lista de tareas chicas, en orden | Se marcan con `[x]` al terminarlas y probarlas |
| `verificacion.md` | Comprobación de cada criterio de aceptación, con su resultado | Se completa antes de dar la funcionalidad por terminada |
| `.claude/commands/` | Comandos de Claude Code: `/spec`, `/clarificar` y `/verificar` | `/spec` completa `spec.md`, `/clarificar` completa `clarificacion.md` y `/verificar` completa `verificacion.md`, dentro de la carpeta de la funcionalidad en `specs/` |
| `.claude/skills/` | Skills de Claude Code: `verificar-criterios` y `revisar-marca` (skill propia) | Cada skill tiene su carpeta con su `SKILL.md` |
| `multimedia/` | Imágenes, video y gráficos del TFI | Cada pieza generada con IA tiene su ficha en `FICHAS-IA.md` y lleva la leyenda «Generado con IA» |

## Capas

```text
HTML  →  js/paginas/  →  js/componentes/  →  js/lib/  →  Supabase (RLS y RPC)  →  PostgreSQL
```

- El **HTML** tiene la estructura fija de la página: encabezado, pie, títulos
  y los contenedores vacíos que el JS completa.
- **`js/paginas/`** arranca la página, lee los filtros de la dirección y
  coordina el resto.
- **`js/componentes/`** arma las piezas repetidas (tarjetas, ítems, mensajes).
- **`js/lib/`** contiene las reglas del negocio y las llamadas a Supabase.
- **Supabase** decide qué se puede leer y escribir (RLS) y ejecuta las
  operaciones delicadas (RPC). Es la capa que realmente protege los datos.

## Encabezado y pie de página

El encabezado y el pie se escriben **en cada archivo HTML**, no se generan con
JavaScript. Así los enlaces de navegación existen aunque el JS falle, y los
buscadores los leen. `js/componentes/encabezado.js` solo agrega el
comportamiento: abrir el menú en el celular, marcar la página actual y
mostrar el contador del carrito.

## Rutas de los archivos

- Las hojas de estilo, los scripts y las imágenes se enlazan con rutas desde
  la raíz (`/css/globales.css`, `/js/paginas/inicio.js`), para que funcionen
  igual desde `admin/`.
- El sitio se abre con un servidor local (ver [03-TECNOLOGIAS.md](03-TECNOLOGIAS.md)),
  no con doble clic.
- Vercel muestra `404.html` cuando una dirección no existe.

## Recorrido de una compra

Qué pasa desde que el cliente toca “Agregar al carrito” hasta que el pedido
queda registrado:

1. **Detalle del producto.** En `producto.html?slug=...`, el cliente elige
   talle, color y cantidad y toca “Agregar al carrito”.
2. **Carrito en el navegador.** `js/lib/carrito.js` guarda en `localStorage`
   solo el identificador de la variante y la cantidad. No guarda precios.
3. **Página del carrito.** `js/lib/productos.js` lee de Supabase nombre,
   talle, color, precio y stock actuales de esas variantes. La RLS solo
   devuelve variantes activas de productos activos. Con eso se muestran los
   subtotales y el total, como referencia para el cliente.
4. **Confirmación.** El cliente escribe su nombre y toca “Enviar pedido por
   WhatsApp”. `js/lib/pedidos.js` llama a la función `crear_pedido` con el
   nombre y la lista de variantes con sus cantidades. **No envía precios ni
   totales.**
5. **Validación en Supabase.** La función `crear_pedido`, que se ejecuta en el
   servidor de Supabase:
   1. valida el nombre, la cantidad de ítems y cada cantidad;
   2. busca cada variante en la base de datos;
   3. comprueba que el producto esté activo y que el stock alcance;
   4. calcula subtotales y total con los precios de la base.
6. **Si algo falla.** La función no registra nada y devuelve qué ítems hay que
   corregir. El carrito muestra el aviso junto a cada producto.
7. **Registro.** Si todo es válido, la función guarda el pedido y sus detalles
   en una sola operación, con estado `pendiente` y un código como `US-000001`.
8. **WhatsApp.** `js/lib/whatsapp.js` arma el texto con lo que devolvió la
   función (código, ítems, precios y total), **no** con lo que calculó el
   navegador. El navegador abre WhatsApp con el mensaje ya escrito y vacía el
   carrito.
9. **Confirmación del negocio.** El administrador ve el pedido en el panel.
   Cuando acuerda la venta con el cliente, lo marca como `confirmado` con la
   función `confirmar_pedido`, y recién ahí se descuenta el stock.

```text
Navegador                               Supabase                          PostgreSQL
    │  rpc("crear_pedido",                  │                                 │
    │      { nombre, items[] })  ─────────► │  validar datos                  │
    │                                       │  leer variantes ──────────────► │
    │                                       │ ◄────────────── precio y stock  │
    │                                       │  comprobar stock                │
    │                                       │  calcular total                 │
    │                                       │  guardar pedido ──────────────► │
    │ ◄──── { codigo, items, total }        │                                 │
    │  armar mensaje y abrir WhatsApp       │                                 │
```

### Por qué el stock se descuenta al confirmar

El sitio no cobra: cualquier visitante puede armar un pedido y no enviarlo
nunca. Si el stock se descontara al crear el pedido, esos pedidos sin
confirmar bloquearían prendas disponibles. Por eso el pedido nace `pendiente`
y el stock se descuenta cuando el administrador lo confirma.

## Decisiones de arquitectura

| Decisión | Motivo |
| --- | --- |
| En lugar de `src/` y `public/` se usan los `.html` en la raíz, `css/`, `js/` e `img/` | Es un sitio estático sin compilación: Vercel publica la raíz tal cual, sin un paso que copie `src/` a otra carpeta |
| Cada página es un archivo `.html` en la raíz y el detalle usa `producto.html?slug=...` | Funciona igual en local y en Vercel, sin configuración de rutas |
| HTML, CSS y JS siempre en archivos separados | Cada archivo tiene una sola responsabilidad y se puede explicar por separado |
| El catálogo se arma en el navegador y los filtros viajan en la dirección de la página | La página se puede compartir con los filtros puestos |
| El encabezado y el pie se escriben en cada HTML | Los enlaces funcionan sin JS y los buscadores los leen |
| El carrito vive en el navegador | No hay cuentas de clientes; evita guardar datos de más |
| El total y el stock los valida la función `crear_pedido` | El navegador se puede manipular; la función corre en Supabase con los precios de la base |
| El panel se protege con RLS, no con la página | Un archivo HTML se puede abrir igual. El JS redirige si no hay sesión, pero sin sesión de administrador la base no devuelve ni modifica nada |
| Una sola conexión en `js/lib/supabase.js` | Un único lugar para revisar cómo se accede a la base |
| Las funciones con tests no importan Supabase | Vitest las prueba sin conexión y sin internet |
| Las imágenes se guardan en `img/productos/` | Evita sumar un servicio de almacenamiento en el primer lanzamiento |

## Limitación conocida

El detalle del producto (`producto.html`) se arma con JavaScript a partir del
`slug`. Los buscadores leen el título, la descripción y el `<h1>` generales
escritos en el HTML; el nombre, la descripción y las fotos de cada prenda
dependen de que el buscador ejecute el JavaScript. Además, si el producto no
existe, la página muestra el mensaje de “No encontrado” pero el servidor
responde igual con el código 200. Se acepta para este trabajo; el detalle está
en [09-SEO.md](09-SEO.md).
