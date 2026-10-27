# 04 · Arquitectura

> **Pregunta que responde este archivo:** ¿cómo se organiza el código?

**Importante:** este árbol es la **arquitectura propuesta**. Los archivos
todavía no existen: se crean a medida que se avanza con
[08-TAREAS.md](08-TAREAS.md). Las tecnologías están explicadas en
[03-TECNOLOGIAS.md](03-TECNOLOGIAS.md).

## Árbol de carpetas

```text
urban-style/
├── app/                              ← páginas y rutas (Next.js App Router)
│   ├── layout.js                     ← estructura común: encabezado y pie
│   ├── globals.css                   ← variables de marca y estilos base
│   ├── page.js                       ← inicio
│   ├── not-found.js                  ← página "No encontrado"
│   ├── icon.svg                      ← ícono del sitio (isotipo)
│   ├── sitemap.js                    ← mapa del sitio para buscadores
│   ├── robots.js                     ← qué pueden recorrer los buscadores
│   ├── catalogo/
│   │   ├── page.js                   ← catálogo con búsqueda y filtros
│   │   └── [slug]/page.js            ← detalle de un producto
│   ├── carrito/page.js               ← carrito y envío del pedido
│   ├── contacto/page.js              ← información y formulario
│   ├── admin/
│   │   ├── ingresar/page.js          ← inicio de sesión
│   │   └── (panel)/                  ← grupo de páginas protegidas
│   │       ├── layout.js             ← verifica la sesión en el servidor
│   │       ├── page.js               ← resumen del panel
│   │       ├── productos/            ← listado, alta y edición
│   │       ├── categorias/page.js
│   │       ├── talles-colores/page.js
│   │       ├── pedidos/              ← listado y detalle
│   │       └── consultas/page.js
│   └── api/                          ← rutas de servidor
│       ├── carrito/route.js          ← devuelve precio y stock actuales
│       ├── pedidos/route.js          ← valida y registra el pedido
│       ├── consultas/route.js        ← guarda una consulta de contacto
│       └── admin/
│           ├── sesion/route.js       ← iniciar y cerrar sesión
│           ├── productos/            ← alta, edición y baja lógica
│           ├── categorias/
│           ├── talles/
│           ├── colores/
│           ├── variantes/            ← talle, color y stock
│           ├── pedidos/              ← cambio de estado
│           └── consultas/
├── components/                       ← componentes reutilizables
│   ├── Encabezado.js
│   ├── PieDePagina.js
│   ├── BannerPrincipal.js
│   ├── TarjetaProducto.js
│   ├── GrillaProductos.js
│   ├── BuscadorProductos.js
│   ├── FiltrosCatalogo.js
│   ├── SelectorVariante.js
│   ├── SelectorCantidad.js
│   ├── EtiquetaDisponibilidad.js
│   ├── ItemCarrito.js
│   ├── ResumenCarrito.js
│   ├── FormularioContacto.js
│   ├── Boton.js
│   ├── Mensaje.js
│   ├── EstadoVacio.js
│   └── admin/                        ← componentes del panel
├── context/
│   └── CarritoContext.js             ← estado del carrito en el navegador
├── lib/                              ← reglas del negocio y acceso a datos
│   ├── db.js                         ← única conexión a PostgreSQL
│   ├── productos.js                  ← consultas de productos y variantes
│   ├── categorias.js
│   ├── pedidos.js                    ← validar, registrar y cambiar estado
│   ├── consultas.js
│   ├── auth.js                       ← sesiones y contraseñas
│   ├── validaciones.js               ← reglas de validación compartidas
│   ├── whatsapp.js                   ← arma el mensaje y el enlace
│   └── formato.js                    ← formato de precios y fechas
├── config/
│   └── sitio.js                      ← WhatsApp, horarios y redes
├── db/                               ← scripts de base de datos
│   ├── esquema.sql                   ← creación de tablas
│   ├── datos-demo.sql                ← datos de demostración
│   └── crear-admin.js                ← crea el primer administrador
├── public/                           ← recursos públicos
│   ├── logo.svg
│   ├── logo-oscuro.svg
│   └── img/
│       ├── productos/                ← fotos de las prendas
│       └── compartir.jpg             ← imagen para redes sociales
├── docs/                             ← estas especificaciones
├── AGENTS.md                         ← índice y reglas para la IA
├── .env.example                      ← nombres de las variables de entorno
├── .env.local                        ← valores reales (no se sube)
├── .gitignore
└── package.json
```

## Función de cada parte

| Carpeta o archivo | Qué contiene | Regla |
| --- | --- | --- |
| `app/` | Una carpeta por dirección del sitio. `page.js` es la pantalla y `layout.js` lo que la rodea | Las páginas no escriben SQL: llaman a funciones de `lib/` |
| `app/api/` | Rutas de servidor que reciben datos del navegador | Toda ruta valida lo que recibe antes de usarlo |
| `app/admin/(panel)/` | Páginas del panel. Los paréntesis agrupan páginas sin cambiar la dirección | El `layout.js` del grupo comprueba la sesión en cada carga |
| `components/` | Piezas de interfaz que se repiten | Un componente por archivo, con su archivo `.module.css` |
| `context/` | Estado compartido del carrito | Solo guarda identificador de variante y cantidad |
| `lib/` | Acceso a datos y reglas del negocio | Los archivos que usan la base o las sesiones corren solo en el servidor. `validaciones.js` y `formato.js` no tienen secretos y se comparten con el navegador |
| `lib/db.js` | La conexión a la base | Es el **único** archivo que lee `DATABASE_URL` |
| `config/sitio.js` | Datos del negocio que no son secretos | Los valores sin definir se marcan como pendientes |
| `db/` | Scripts SQL y de preparación | El esquema coincide siempre con [05-DATOS.md](05-DATOS.md) |
| `public/` | Imágenes y archivos que se sirven tal cual | Las fotos se guardan optimizadas (ver [09-SEO.md](09-SEO.md)) |

## Capas

```text
Componentes (navegador)  →  Páginas y rutas de API (servidor)  →  lib/  →  PostgreSQL
```

- Los **componentes** muestran datos y capturan acciones del usuario.
- Las **páginas** y las **rutas de API** reciben la solicitud, comprueban
  permisos y validan los datos.
- Las funciones de **`lib/`** contienen las reglas del negocio y las consultas SQL.
- Solo `lib/db.js` se conecta a la base de datos.

## Recorrido de una compra

Qué pasa desde que el cliente toca “Agregar al carrito” hasta que el pedido
queda registrado:

1. **Detalle del producto.** El cliente elige talle, color y cantidad y toca
   “Agregar al carrito”.
2. **Carrito en el navegador.** `CarritoContext` guarda en `localStorage` solo
   el identificador de la variante y la cantidad. No guarda precios.
3. **Página del carrito.** El navegador envía esos identificadores a
   `POST /api/carrito`. El servidor responde con nombre, talle, color, precio y
   stock actuales, y con eso se muestran los subtotales y el total.
4. **Confirmación.** El cliente escribe su nombre y toca “Enviar pedido por
   WhatsApp”. El navegador envía a `POST /api/pedidos` el nombre y la lista de
   variantes con sus cantidades. **No envía precios ni totales.**
5. **Validación en el servidor.** `lib/pedidos.js`:
   1. valida el formato de los datos con `lib/validaciones.js`;
   2. busca cada variante en la base de datos;
   3. comprueba que el producto esté activo y que el stock alcance;
   4. calcula subtotales y total con los precios de la base.
6. **Si algo falla.** El servidor no registra nada y responde qué ítems hay que
   corregir. El carrito muestra el aviso junto a cada producto.
7. **Registro.** Si todo es válido, el pedido y sus detalles se guardan dentro
   de una transacción, con estado `pendiente` y un código como `US-000001`.
8. **WhatsApp.** `lib/whatsapp.js` arma el texto del pedido y el servidor
   devuelve el enlace. El navegador abre WhatsApp con el mensaje ya escrito y
   vacía el carrito.
9. **Confirmación del negocio.** El administrador ve el pedido en el panel.
   Cuando acuerda la venta con el cliente lo marca como `confirmado` y recién
   ahí se descuenta el stock.

```text
Navegador                         Servidor (Next.js)                PostgreSQL
    │  POST /api/pedidos               │                                │
    │  { nombre, items[] }  ─────────► │  validar formato               │
    │                                  │  leer variantes ─────────────► │
    │                                  │ ◄───────────── precio y stock  │
    │                                  │  comprobar stock               │
    │                                  │  calcular total                │
    │                                  │  guardar pedido ─────────────► │
    │ ◄───── { codigo, total, enlace } │                                │
    │  abrir WhatsApp                  │                                │
```

### Por qué el stock se descuenta al confirmar

El sitio no cobra: cualquier visitante puede armar un pedido y no enviarlo
nunca. Si el stock se descontara al crear el pedido, esos pedidos sin
confirmar bloquearían prendas disponibles. Por eso el pedido nace `pendiente`
y el stock se descuenta cuando el administrador lo confirma.

## Decisiones de arquitectura

| Decisión | Motivo |
| --- | --- |
| El catálogo se arma en el servidor y los filtros viajan en la dirección de la página | La página se puede compartir y los buscadores la leen completa |
| El carrito vive en el navegador | No hay cuentas de clientes; evita guardar datos de más |
| La sesión se comprueba en el `layout.js` del panel **y** en cada ruta de `api/admin/` | Ocultar un enlace no protege nada: cada operación verifica el permiso |
| Una sola conexión en `lib/db.js` | Un único lugar para revisar cómo se accede a la base |
| Las imágenes se guardan en `public/img/productos/` | Evita sumar un servicio de almacenamiento en el primer lanzamiento |
