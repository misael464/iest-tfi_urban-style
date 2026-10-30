# 08 · Tareas

> **Pregunta que responde este archivo:** ¿en qué orden lo hacemos?

El desarrollo se divide en 12 etapas. Cada tarea indica entre paréntesis el
requerimiento de [02-REQUERIMIENTOS.md](02-REQUERIMIENTOS.md) que cubre.

## Cómo usar este archivo

- Se trabaja **una tarea por vez**, en orden.
- Una casilla se marca con `[x]` recién cuando la tarea está hecha y probada.
- Cuando una tarea pertenece a una funcionalidad con spec, se tilda primero
  en el `tasks.md` de su carpeta de `specs/` y, si corresponde, también acá,
  en el mismo commit (ver [07-CONVENCIONES.md](07-CONVENCIONES.md)).
- Una tarea que agrega o cambia funciones en `carrito.js`, `validaciones.js`,
  `whatsapp.js` o `formato.js` no está terminada hasta que sus tests pasan con
  `npm test`.
- No se empieza una etapa si las etapas de las que depende no están terminadas.
- Una etapa está terminada cuando se cumple su “criterio de terminado”.

## Dependencias entre etapas

| Etapa | Nombre | Depende de |
| --- | --- | --- |
| 1 | Preparación del proyecto | — |
| 2 | Identidad visual | 1 |
| 3 | Configuración de la base de datos | 1 |
| 4 | Catálogo | 2 y 3 |
| 5 | Filtros y detalle de productos | 4 |
| 6 | Carrito | 5 |
| 7 | Validación y envío de pedidos | 6 |
| 8 | Contacto (segunda etapa) | 2 y 3 |
| 9 | Administración (segunda etapa) | 3 y 7 |
| 10 | Seguridad | 7 (y 8 y 9 en la segunda etapa) |
| 11 | Pruebas | 10 |
| 12 | Publicación y revisión final | 11 |

Las etapas 2 y 3 se pueden hacer en paralelo, y la etapa 8 (Contacto) se
puede adelantar en cualquier momento después de ellas.

Las etapas 8 y 9 quedan fuera del TFI y pasan a una segunda etapa (ver “Alcance del Trabajo Final Integrador” en [02-REQUERIMIENTOS.md](02-REQUERIMIENTOS.md)).

## Etapa 1 · Preparación del proyecto

- [x] Crear `package.json` con `"type": "module"` y el comando `"test": "vitest run"`.
- [x] Instalar Vitest como dependencia de desarrollo (`npm install --save-dev vitest@3`).
- [x] Crear `.gitignore` con `node_modules/`.
- [x] Crear cada carpeta de [04-ARQUITECTURA.md](04-ARQUITECTURA.md) cuando le toca su primer archivo.
- [x] Crear `js/config/sitio.js` con los datos del negocio marcados como pendientes.
- [x] Crear `js/config/supabase.js` con la URL y la clave anon marcadas como pendientes.
- [x] Crear un `index.html` mínimo con su `<title>`, su `meta description` y su `<h1>`.
- [x] Escribir un primer test y comprobar que `npm test` pasa.
- [x] Subir el commit a GitHub.

**Criterio de terminado:** `index.html` se abre con el servidor local sin
errores en la consola, `npm test` pasa y el repositorio está en GitHub sin
archivos secretos.

## Etapa 2 · Identidad visual

- [x] Definir nombre, eslogan, paleta, tipografías y tono en [IDENTIDAD-MARCA.md](IDENTIDAD-MARCA.md).
- [x] Diseñar el logo en SVG y PNG, con versiones para fondo claro y oscuro (carpeta `marca/`).
- [ ] Cargar las variables CSS de la marca en `css/globales.css`.
- [ ] Cargar Montserrat Bold (700) e Inter Regular (400) desde Google Fonts con `<link>`, sin otros pesos.
- [ ] Copiar `logo.svg`, `logo-oscuro.svg` e `isotipo.svg` a `img/marca/` y usar el isotipo como ícono del sitio.
- [ ] Escribir el encabezado y el pie en HTML, con `encabezado.css`, `pie-de-pagina.css` y `js/componentes/encabezado.js` para el menú del celular (RNF01, RNF02).
- [ ] Crear `boton.css`, `mensaje.css` y `js/componentes/mensaje.js` (RNF01, RNF02).

**Criterio de terminado:** el encabezado y el pie se ven en todas las páginas
con los colores y las fuentes del manual, en celular y en computadora.

## Etapa 3 · Configuración de la base de datos

- [ ] Crear el proyecto en Supabase.
- [ ] Completar `js/config/supabase.js` con la URL y la clave **anon**. La clave `service_role` no se copia a ningún archivo.
- [ ] Ejecutar `db/esquema.sql` según [05-DATOS.md](05-DATOS.md).
- [ ] Ejecutar `db/politicas.sql` y comprobar que las 10 tablas tienen RLS activado.
- [ ] Ejecutar `db/funciones.sql`.
- [ ] Ejecutar `db/datos-demo.sql` y comprobar los datos de demostración.
- [ ] Crear `js/lib/supabase.js`, con `supabase-js` importado desde jsDelivr con versión fija.
- [ ] Probar una lectura de categorías desde una página.
- [ ] Probar que, con la clave anon, insertar o modificar una fila de cualquier tabla es rechazado.
- [ ] Desactivar el registro público de usuarios en Supabase Auth, aunque el panel quede para la segunda etapa.

**Criterio de terminado:** las 10 tablas existen con RLS activado y datos de
demostración, una página del sitio puede leer la lista de categorías y un
intento de escribir con la clave anon es rechazado.

## Etapa 4 · Catálogo

- [ ] Crear `js/lib/productos.js`, que llama a `buscar_productos`.
- [ ] Crear `formatearPrecio` en `js/lib/formato.js`, con sus tests (RF11).
- [ ] Crear `crearTarjetaProducto`, `crearGrillaProductos` y `crearEtiquetaDisponibilidad` (RF02).
- [ ] Armar `catalogo.html` con la grilla de 2, 3 y 4 columnas (RF02, RNF01).
- [ ] Armar `index.html` con banner, destacados y categorías (RF01).
- [ ] Crear `404.html`.

**Criterio de terminado:** el inicio y el catálogo muestran los productos de
demostración con foto, nombre, precio y disponibilidad.

## Etapa 5 · Filtros y detalle de productos

- [ ] Agregar la búsqueda por nombre, sin distinguir mayúsculas ni tildes (RF03).
- [ ] Agregar los filtros por categoría, talle, color y disponibilidad (RF04).
- [ ] Guardar la búsqueda y los filtros en la dirección de la página (RF04).
- [ ] Mostrar el estado vacío con el botón “Limpiar filtros” (RF05).
- [ ] Armar `producto.html?slug=...` con galería y datos, y el mensaje “No encontrado” si el producto no existe o está dado de baja (RF06).
- [ ] Crear `crearSelectorVariante` con el stock por combinación (RF07).
- [ ] Crear `esCantidadValida` en `js/lib/validaciones.js`, con sus tests (RF08).
- [ ] Crear `crearSelectorCantidad` con sus límites (RF08).

**Criterio de terminado:** se puede llegar a un producto filtrando y buscando,
y el detalle muestra el stock correcto de cada talle y color.

## Etapa 6 · Carrito

- [ ] Crear en `js/lib/carrito.js` las funciones para agregar, cambiar la cantidad, quitar y calcular subtotales y total, con sus tests (RF09, RF10, RF11).
- [ ] Crear `leerCarrito` y `guardarCarrito`, que usan `localStorage` (RF09).
- [ ] Conectar el botón “Agregar al carrito” y el contador del encabezado (RF09).
- [ ] Agregar en `js/lib/productos.js` la lectura de precio y stock actuales de las variantes del carrito.
- [ ] Armar `carrito.html` con `crearItemCarrito` y `crearResumenCarrito` (RF10).
- [ ] Permitir cambiar cantidades y quitar ítems (RF10).
- [ ] Mostrar subtotales y total (RF11).
- [ ] Mostrar el estado de carrito vacío (RF10).

**Criterio de terminado:** el carrito conserva los productos al recargar y los
importes se actualizan solos al cambiar una cantidad.

## Etapa 7 · Validación y envío de pedidos

- [ ] Agregar a `js/lib/validaciones.js` las reglas del nombre y de los ítems del pedido, con sus tests.
- [ ] Probar `crear_pedido` en Supabase: un pedido válido se registra, un precio enviado desde el navegador se ignora y un pedido sin stock se rechaza (RF12).
- [ ] Crear `js/lib/pedidos.js`, que llama a `crear_pedido` (RF13).
- [ ] Crear `js/lib/whatsapp.js`, que arma el mensaje y el enlace con lo que devuelve `crear_pedido`, con sus tests (RF13).
- [ ] Mostrar en el carrito los errores por ítem que devuelve `crear_pedido` (RF12).
- [ ] Abrir WhatsApp con el mensaje y vaciar el carrito (RF13).

**Criterio de terminado:** un pedido válido queda guardado como `pendiente` y
abre WhatsApp con el detalle; un pedido con un precio alterado o sin stock es
rechazado por `crear_pedido`.

## Etapa 8 · Contacto (segunda etapa)

- [ ] Armar `contacto.html` con los datos de `js/config/sitio.js` (RF14).
- [ ] Agregar a `js/lib/validaciones.js` las reglas del formulario, con sus tests (RF15).
- [ ] Crear el formulario de contacto con validación en el navegador y el campo oculto antispam (RF15).
- [ ] Crear `js/lib/consultas.js`, que llama a `crear_consulta` (RF15).
- [ ] Mostrar la confirmación y los mensajes de error (RF15).

**Criterio de terminado:** una consulta válida queda guardada en la base y una
consulta con datos inválidos muestra el error junto al campo; enviada a mano
a Supabase, `crear_consulta` también la rechaza.

## Etapa 9 · Administración (segunda etapa)

Fuera del alcance del TFI (ver “Alcance del Trabajo Final Integrador” en [02-REQUERIMIENTOS.md](02-REQUERIMIENTOS.md)). Mientras tanto, los productos, el stock y los pedidos se gestionan desde el panel web de Supabase. El registro público de usuarios ya se desactiva en la Etapa 3.

- [ ] Revisar la configuración de límite de intentos de ingreso de Supabase Auth (RF16).
- [ ] Crear el primer administrador: usuario en Supabase Auth y fila en `administradores` (ver [10-SEGURIDAD.md](10-SEGURIDAD.md)).
- [ ] Crear `js/lib/auth.js`: ingresar, cerrar sesión y comprobar que el usuario es administrador (RF16).
- [ ] Armar `admin/ingresar.html` (RF16).
- [ ] Hacer que cada página de `admin/` compruebe la sesión al cargar y redirija a `admin/ingresar.html` si no hay (RF16).
- [ ] Comprobar que, sin sesión de administrador, Supabase no devuelve pedidos, consultas ni productos inactivos (RF16).
- [ ] Alta, edición y baja lógica de productos (RF17).
- [ ] Gestión de categorías (RF18).
- [ ] Gestión de talles, colores y variantes (RF19).
- [ ] Edición de precios y stock (RF20).
- [ ] Listado de pedidos y cambio de estado con `confirmar_pedido`, `entregar_pedido` y `cancelar_pedido` (RF21).
- [ ] Listado de consultas y marca de respondida (RF22).

**Criterio de terminado:** sin sesión de administrador no se puede ver ni
modificar nada del panel, tampoco llamando a Supabase directamente con la
clave anon; con sesión se puede cargar un producto completo y confirmar un
pedido.

## Etapa 10 · Seguridad

- [ ] Recorrer la lista de control de [10-SEGURIDAD.md](10-SEGURIDAD.md).
- [ ] Verificar que las 10 tablas tienen RLS activado y que la clave anon no puede escribir en ninguna.
- [ ] Verificar que la clave `service_role` no aparece en el código, en el repositorio ni en su historial.
- [ ] Verificar que no se usan `innerHTML`, `outerHTML`, `insertAdjacentHTML` ni `document.write`.
- [ ] Verificar que `crear_pedido` calcula el total con los precios de la base e ignora los que manda el navegador.
- [ ] Probar el límite de intentos fallidos de inicio de sesión (segunda etapa, cuando exista el panel).
- [ ] Verificar que los mensajes de error no muestran datos internos.

**Criterio de terminado:** todas las casillas de la lista de control de
seguridad están marcadas (RNF06).

## Etapa 11 · Pruebas

- [ ] Ejecutar `npm test` y comprobar que todos los tests pasan.
- [ ] Recorrer una compra completa en celular y en computadora (RNF01, RNF04).
- [ ] Probar cada criterio de aceptación de RF01 a RF13 (alcance del TFI).
- [ ] Navegar todo el sitio usando solo el teclado (RNF02).
- [ ] Ejecutar Lighthouse en inicio y catálogo (RNF02, RNF03).
- [ ] Probar en Chrome, Firefox, Edge y Safari (RNF07).
- [ ] Revisar ortografía y tono de todos los textos (RNF08).
- [ ] Corregir los errores encontrados y repetir las pruebas.

**Criterio de terminado:** todos los tests pasan, todos los criterios de
aceptación se cumplen y no quedan errores conocidos sin anotar.

## Etapa 12 · Publicación y revisión final

- [ ] Completar los datos pendientes de [01-CONTEXTO.md](01-CONTEXTO.md).
- [ ] Importar el repositorio en Vercel, sin framework ni comando de compilación.
- [ ] Cargar la dirección del sitio publicado en la configuración de Supabase Auth.
- [ ] Verificar el sitio publicado con HTTPS.
- [ ] Revisar el `<title>`, la `meta description` y el `<h1>` de cada HTML, `sitemap.xml`, `robots.txt` y la imagen para redes de [09-SEO.md](09-SEO.md).
- [ ] Reemplazar los datos de demostración por los productos reales.
- [ ] Hacer una copia de seguridad de la base de datos.
- [ ] Revisar que la documentación coincida con el sitio publicado.

**Criterio de terminado:** el sitio está publicado, funciona con datos reales
y las especificaciones describen lo que efectivamente se construyó.

## Estado actual

| Etapa | Estado |
| --- | --- |
| Especificación (esta carpeta) | Terminada |
| 1 · Preparación del proyecto | Terminada (30/10/2026) |
| 2 · Identidad visual | En curso: marca y logo definidos; falta aplicarlos al sitio |
| Resto de las etapas | Sin empezar |
