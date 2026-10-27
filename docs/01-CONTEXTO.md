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

El primer lanzamiento incluye:

- Páginas públicas: inicio, catálogo, detalle de producto, carrito y contacto.
- Búsqueda y filtros del catálogo.
- Carrito guardado en el navegador del cliente.
- Registro del pedido en la base de datos y envío por WhatsApp.
- Formulario de contacto con validaciones.
- Panel de administración con inicio de sesión para productos, categorías,
  talles, colores, precios, stock, pedidos y consultas.

El detalle de cada función está en [02-REQUERIMIENTOS.md](02-REQUERIMIENTOS.md).

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
| Número de WhatsApp | Pendiente | `config/sitio.js` |
| Horarios de atención | Pendiente | `config/sitio.js` |
| Enlaces a redes sociales | Pendiente | `config/sitio.js` |
| Correo de contacto | Pendiente | `config/sitio.js` |
| Precios reales | Pendiente (se usa `$ 0` como marcador) | Panel de administración |
| Fotos de los productos | Pendiente | `public/img/productos/` |
| Dominio del sitio | Pendiente | Variable `NEXT_PUBLIC_SITE_URL` |
