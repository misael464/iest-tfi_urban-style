# 01 · Contexto

> **Pregunta que responde este archivo:** ¿por qué existe Urban Style y para quién es?

## Problema

Quien quiere comprar ropa urbana por internet suele encontrarse con dos
situaciones incómodas:

- **Tiendas que venden solo por redes sociales.** Las prendas están repartidas
  en publicaciones, no se sabe qué talles y colores quedan, y hay que preguntar
  el precio y la disponibilidad por mensaje, uno por uno.
- **Tiendas online complicadas.** Piden crear una cuenta y completar muchos
  pasos antes de poder hacer un pedido.

Del lado del negocio, responder siempre las mismas preguntas (“¿tenés en M?”,
“¿cuánto sale?”) lleva tiempo, y sin un registro ordenado es fácil ofrecer una
prenda que ya no está en stock.

## Objetivo general

Especificar y construir una tienda online responsive para Urban Style que
permita explorar el catálogo, elegir talle y color, armar un carrito y enviar
el pedido por WhatsApp, y que le dé al negocio un panel protegido para
administrar productos, stock y pedidos.

## Objetivos específicos

1. Mostrar el catálogo con foto, nombre, precio y disponibilidad de cada prenda.
2. Permitir buscar por nombre y filtrar por categoría, talle, color y disponibilidad.
3. Mostrar el stock real de cada combinación de talle y color.
4. Armar el pedido en un carrito que calcule subtotales y total.
5. Validar en el servidor los precios, las cantidades y el stock antes de registrar el pedido.
6. Generar el mensaje del pedido y abrir WhatsApp con el texto ya escrito.
7. Recibir consultas mediante un formulario de contacto validado.
8. Administrar productos, categorías, talles, colores, precios, stock y pedidos desde un panel con inicio de sesión.
9. Aplicar la identidad visual de [IDENTIDAD-MARCA.md](IDENTIDAD-MARCA.md) en todas las pantallas.

## Público destinatario

| Perfil | Qué busca | Cómo lo ayuda el sitio |
| --- | --- | --- |
| Jóvenes que compran desde el celular | Ver rápido qué hay, en qué talle y a qué precio | Catálogo con filtros y disponibilidad a la vista |
| Adultos que buscan ropa cómoda para todos los días | Prendas combinables y una compra sin complicaciones | Pedido por WhatsApp, sin crear una cuenta |
| Administrador de la tienda | Mantener el catálogo y el stock al día | Panel protegido para cargar productos y revisar pedidos |

## Productos y servicios

### Productos

| Categoría | Ejemplos | Estado en el catálogo |
| --- | --- | --- |
| Remeras | Básicas, oversize, estampadas | Activa |
| Buzos | Canguro, con cierre, cuello redondo | Activa |
| Pantalones | Cargo, jogger, jean | Activa |
| Camperas | Rompeviento, puffer, de jean | Activa |
| Zapatillas | Urbanas | Opcional: se carga desactivada y se activa desde el panel si se decide venderlas |

Cada producto se ofrece en **variantes**: una combinación de talle y color con
su propio stock.

### Servicios

- Atención y confirmación de pedidos por WhatsApp.
- Respuesta a consultas enviadas desde el formulario de contacto.
- Asesoramiento sobre talles y combinaciones por los mismos canales.

## Propuesta de valor

Urban Style ofrece una tienda online sencilla y moderna, que se adapta a
celulares y computadoras, donde el cliente ve el catálogo completo con talles,
colores, precios y stock, arma su pedido y lo envía por WhatsApp sin
registrarse.

## Alcance inicial

El primer lanzamiento es el del Trabajo Final Integrador (plazo: 30 de
octubre de 2026) y se limita a la tienda:

| Funcionalidad | Requerimientos | Incluye |
| --- | --- | --- |
| 1 · Catálogo, búsqueda y filtros | RF01 a RF05 | Inicio, catálogo, búsqueda por nombre, filtros y estado vacío |
| 2 · Detalle del producto y carrito | RF06 a RF11 | Detalle con talle, color y cantidad; carrito guardado en el navegador del cliente, con subtotales y total |
| 3 · Pedido por WhatsApp | RF12 y RF13 | Validación del pedido en Supabase, registro en la base de datos y envío por WhatsApp |

**Segunda etapa:**

- Página y formulario de contacto (RF14 y RF15).
- Panel de administración con inicio de sesión para productos, categorías,
  talles, colores, precios, stock, pedidos y consultas (RF16 a RF22).

Mientras no exista el panel propio, los productos, las variantes, los precios
y el stock se cargan, y el estado de los pedidos se cambia, desde el panel web
de Supabase.

El detalle de cada función y del alcance está en
[02-REQUERIMIENTOS.md](02-REQUERIMIENTOS.md) (sección “Alcance del Trabajo
Final Integrador”).

## No incluye por ahora

Estas funciones **no están implementadas ni forman parte del primer
lanzamiento**. Quedan documentadas como mejoras futuras:

- Pagos online.
- Seguimiento automático de envíos.
- Cuentas de clientes y registro público.
- Aplicación móvil independiente.
- Integración automática con empresas de transporte.
- Programa de puntos o fidelización.
- Subida de fotos desde el panel: en esta etapa las imágenes se agregan a la
  carpeta del proyecto y en el panel se indica su ruta.

> El pago y la entrega se acuerdan con el cliente por WhatsApp. El sitio no
> cobra, no calcula envíos y no promete plazos.

## Datos pendientes de completar

El sitio no inventa información comercial. Estos datos se cargan cuando el
negocio los defina:

| Dato | Estado | Dónde se configura |
| --- | --- | --- |
| Número de WhatsApp | Pendiente | `js/config/sitio.js` |
| Horarios de atención | Pendiente | `js/config/sitio.js` |
| Enlaces a redes sociales | Pendiente | `js/config/sitio.js` |
| Correo de contacto | Pendiente | `js/config/sitio.js` |
| Precios reales | Pendiente (los productos de demostración tienen precios de ejemplo) | Panel web de Supabase; panel propio en la segunda etapa |
| Fotos de los productos | Pendiente | `img/productos/` |
| Dominio del sitio | Pendiente | Marcador `DOMINIO-PENDIENTE` en los HTML, `sitemap.xml` y `robots.txt` (ver [09-SEO.md](09-SEO.md)) |
