# 02 · Requerimientos

> **Pregunta que responde este archivo:** ¿qué tiene que hacer el sitio?

Los requerimientos funcionales (RF) describen funciones. Los no funcionales
(RNF) describen cualidades que debe cumplir todo el sitio. El contexto y el
alcance están en [01-CONTEXTO.md](01-CONTEXTO.md).

## Prioridades

| Prioridad | Significado |
| --- | --- |
| Alta | Sin esto el sitio no se puede publicar |
| Media | Importante, pero el sitio funciona sin esto |
| Baja | Se hace si queda tiempo |

## Requerimientos funcionales

### Tienda (parte pública)

| ID | Requerimiento | Prioridad | Criterios de aceptación |
| --- | --- | --- | --- |
| RF01 | Página de inicio con banner, productos destacados y accesos a categorías | Alta | El banner muestra el eslogan y un botón al catálogo.<br>Se ven hasta 8 productos marcados como destacados.<br>Cada categoría activa enlaza al catálogo ya filtrado. |
| RF02 | Catálogo en grilla con foto, nombre, precio y disponibilidad | Alta | Solo aparecen productos activos de categorías activas.<br>Cada tarjeta muestra los cuatro datos y enlaza al detalle.<br>La grilla tiene 2, 3 o 4 columnas según el ancho de pantalla. |
| RF03 | Búsqueda de productos por nombre | Media | Encuentra coincidencias parciales sin distinguir mayúsculas ni tildes.<br>Se puede combinar con los filtros.<br>El texto buscado queda en la dirección de la página. |
| RF04 | Filtros por categoría, talle, color y disponibilidad | Alta | Los cuatro filtros se pueden combinar.<br>Un botón “Limpiar filtros” vuelve a mostrar todo.<br>Los filtros elegidos quedan en la dirección de la página y se pueden compartir. |
| RF05 | Mensaje cuando no hay resultados | Media | Si la búsqueda o los filtros no devuelven productos, se muestra un mensaje con un botón para limpiar los filtros. |
| RF06 | Página de detalle del producto | Alta | Muestra fotos, nombre, descripción, precio, talles, colores y stock.<br>Si el producto no existe o está dado de baja, se muestra la página “No encontrado”. |
| RF07 | Selección de variante (talle y color) | Alta | El stock que se muestra corresponde a la combinación elegida.<br>Las combinaciones sin stock aparecen deshabilitadas.<br>No se puede agregar al carrito sin elegir talle y color. |
| RF08 | Selector de cantidad | Alta | El mínimo es 1.<br>El máximo es el stock de la variante, con un tope de 10 unidades.<br>No acepta letras, decimales ni números negativos. |
| RF09 | Agregar productos al carrito | Alta | Al agregar, el contador del encabezado se actualiza y aparece una confirmación.<br>Si la variante ya estaba, se suma la cantidad sin superar el máximo.<br>El carrito se conserva al recargar la página. |
| RF10 | Ver y modificar el carrito | Alta | Cada ítem muestra foto, nombre, talle, color, precio unitario, cantidad y subtotal.<br>Se puede cambiar la cantidad y quitar ítems.<br>Si está vacío, se muestra un mensaje con un botón al catálogo. |
| RF11 | Cálculo automático de subtotales y total | Alta | Al cambiar una cantidad o quitar un ítem, los importes se actualizan solos.<br>El total es la suma de los subtotales.<br>Los precios se muestran con el formato `$ 0`. |
| RF12 | Validación del pedido en el servidor | Alta | La función `crear_pedido`, que corre en Supabase, vuelve a leer precio y stock de cada variante en la base de datos.<br>Ignora cualquier precio o total enviado por el navegador.<br>Si falta stock, no registra el pedido e informa qué ítems corregir. |
| RF13 | Registro del pedido y envío por WhatsApp | Alta | El pedido se guarda con estado `pendiente` y un código único.<br>El mensaje incluye código, nombre del producto, talle, color, cantidad, precio unitario y total.<br>El botón abre WhatsApp con el mensaje ya escrito. |
| RF14 | Página de contacto | Media | Muestra información del negocio, horarios y enlaces a WhatsApp y redes.<br>Esos datos se leen del archivo de configuración, no están escritos en la página. |
| RF15 | Formulario de consulta | Media | Pide nombre, correo y mensaje, todos obligatorios.<br>Valida en el navegador y en el servidor.<br>Al enviarse, la consulta se guarda y se muestra una confirmación. |

### Administración (parte protegida)

| ID | Requerimiento | Prioridad | Criterios de aceptación |
| --- | --- | --- | --- |
| RF16 | Inicio y cierre de sesión de administradores | Media | Sin sesión, cualquier página del panel redirige a `/admin/ingresar.html`.<br>Los intentos de ingreso fallidos se limitan con el control de intentos de Supabase Auth.<br>“Cerrar sesión” invalida la sesión en el servidor. |
| RF17 | Alta, modificación y baja lógica de productos | Media | Se pueden crear y editar nombre, descripción, categoría, precio, fotos y “destacado”.<br>Dar de baja oculta el producto del catálogo sin borrarlo.<br>Un producto dado de baja se puede reactivar. |
| RF18 | Gestión de categorías | Media | Se pueden crear, renombrar, ordenar y activar o desactivar.<br>Una categoría desactivada no aparece en la tienda. |
| RF19 | Gestión de talles, colores y variantes | Media | Se pueden crear talles y colores.<br>A cada producto se le agregan variantes de talle y color.<br>No se puede repetir la misma combinación en un producto. |
| RF20 | Actualización de precios y stock | Media | El precio no puede ser negativo.<br>El stock es un número entero mayor o igual a 0.<br>Los cambios se ven en la tienda al recargar. |
| RF21 | Consulta de pedidos y cambio de estado | Media | Lista los pedidos con código, fecha, nombre, total y estado.<br>Los estados son `pendiente`, `confirmado`, `entregado` y `cancelado`.<br>Al confirmar se descuenta el stock; si no alcanza, el pedido no se confirma. |
| RF22 | Lectura de consultas de contacto | Baja | Lista las consultas recibidas.<br>Cada una se puede marcar como respondida. |

## Historia de usuario principal

> Como cliente, quiero elegir el talle y el color de una prenda y mandar el
> pedido por WhatsApp, para comprar sin crear una cuenta ni escribir la lista
> a mano.

Se cumple cuando funcionan RF07, RF09, RF10, RF11, RF12 y RF13.

## Requerimientos no funcionales

| ID | Categoría | Requerimiento | Cómo se verifica |
| --- | --- | --- | --- |
| RNF01 | Diseño responsive | El sitio se usa bien desde 360 px de ancho hasta pantallas de escritorio, sin desplazamiento horizontal. | Prueba en celular, tableta y computadora con las herramientas del navegador. |
| RNF02 | Accesibilidad | Contraste AA de WCAG 2.2, navegación completa con teclado, foco visible, etiquetas en todos los campos y texto alternativo en las imágenes. | Recorrido con teclado y auditoría de accesibilidad de Lighthouse. |
| RNF03 | Rendimiento y calidad | La página de inicio y el catálogo obtienen 80 puntos o más en Lighthouse para celulares en Rendimiento, Accesibilidad, Buenas prácticas y SEO. Las imágenes se sirven optimizadas. | Auditoría de Lighthouse sobre el sitio publicado. |
| RNF04 | Usabilidad | Un cliente nuevo puede armar y enviar un pedido en 5 pasos o menos desde el catálogo. Los mensajes de error dicen qué pasó y cómo resolverlo. | Prueba con una persona que no conozca el sitio. |
| RNF05 | Mantenibilidad | El código respeta [07-CONVENCIONES.md](07-CONVENCIONES.md) y la estructura de [04-ARQUITECTURA.md](04-ARQUITECTURA.md). Los colores y fuentes salen de variables CSS. | Revisión del código antes de cada fusión. |
| RNF06 | Seguridad | Se cumple todo lo indicado en [10-SEGURIDAD.md](10-SEGURIDAD.md): RLS en todas las tablas, solo la clave anon en el navegador, total y stock validados por `crear_pedido` y secretos fuera del repositorio. | Lista de control de seguridad antes de publicar. |
| RNF07 | Compatibilidad | Funciona en las dos últimas versiones de Chrome, Firefox, Edge y Safari, en computadora y en celular. | Prueba manual en cada navegador. |
| RNF08 | Idioma | Toda la interfaz está en español, con el tono definido en [IDENTIDAD-MARCA.md](IDENTIDAD-MARCA.md). | Revisión de textos. |

## Alcance del Trabajo Final Integrador

El TFI tiene plazo hasta el 30 de octubre de 2026. Para entregar un producto
completo, probado y publicado, el primer lanzamiento se limita a la tienda.

| Funcionalidad SDD | Requerimientos | Carpeta |
| --- | --- | --- |
| 1 · Catálogo, búsqueda y filtros | RF01 a RF05 | `specs/001-catalogo/` |
| 2 · Detalle del producto y carrito | RF06 a RF11 | `specs/002-detalle-carrito/` |
| 3 · Pedido por WhatsApp | RF12 y RF13 | `specs/003-pedido-whatsapp/` |

**Quedan para una segunda etapa:** el contacto (RF14 y RF15) y el panel de
administración (RF16 a RF22).

**Por qué el panel puede esperar:** mientras no exista, los productos, las
variantes, los precios y el stock se cargan, y el estado de los pedidos se
cambia, desde el panel web de Supabase, al que solo entra el dueño de la
cuenta con su usuario y contraseña. La seguridad no depende del panel propio:
las políticas RLS y las funciones de [05-DATOS.md](05-DATOS.md) ya impiden que
un visitante modifique o lea datos privados. Por eso los requerimientos del
panel pasan de prioridad Alta a Media: el sitio se puede publicar sin ellos.

## Funciones obligatorias y futuras

| Función | Situación |
| --- | --- |
| Catálogo, búsqueda, filtros y detalle (RF01 a RF08) | Obligatoria en el primer lanzamiento (TFI) |
| Carrito y pedido por WhatsApp (RF09 a RF13) | Obligatoria en el primer lanzamiento (TFI) |
| Contacto (RF14 y RF15) | Segunda etapa |
| Administración protegida (RF16 a RF22) | Segunda etapa; mientras tanto, panel web de Supabase |
| Pagos online | Futura |
| Seguimiento automático de envíos | Futura |
| Cuentas de clientes y registro público | Futura |
| Aplicación móvil independiente | Futura |
| Integración con empresas de transporte | Futura |
| Programa de puntos o fidelización | Futura |
| Subida de fotos desde el panel | Futura |

Las funciones futuras **no están implementadas** y no deben programarse sin
actualizar antes este archivo y [01-CONTEXTO.md](01-CONTEXTO.md).

## Historial de cambios

| Fecha | Cambio | Motivo |
| --- | --- | --- |
| 27/10/2026 | Cambio de stack: HTML, CSS y JavaScript con Supabase en lugar de React, Next.js y PostgreSQL en Neon (ver [03-TECNOLOGIAS.md](03-TECNOLOGIAS.md)) | Poder explicar todo el código en la defensa; Supabase mantiene el modelo de datos en PostgreSQL |
| 27/10/2026 | RF16: el bloqueo de 15 minutos tras 5 intentos se reemplaza por el límite de intentos de Supabase Auth | Supabase Auth ya limita los intentos de ingreso; un control propio sería frágil y difícil de mantener |
| 27/10/2026 | RF12: la validación del pedido la hace la función `crear_pedido` en Supabase | Sin servidor propio, la función de la base cumple el rol del servidor |
| 27/10/2026 | Alcance del TFI: RF01 a RF13. Contacto (RF14 y RF15) y panel (RF16 a RF22) pasan a una segunda etapa; RF16, RF17, RF19, RF20 y RF21 bajan de prioridad Alta a Media | Plazo de entrega; el panel web de Supabase cubre la gestión mientras tanto |
| 27/10/2026 | RNF03: la meta de Lighthouse pasa a 80 puntos o más en las cuatro categorías | Es el requisito de la consigna del TFI |
