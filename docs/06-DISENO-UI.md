# 06 · Diseño de la interfaz

> **Pregunta que responde este archivo:** ¿cómo se ven las pantallas?

Todo lo que se describe acá aplica la identidad de
[IDENTIDAD-MARCA.md](IDENTIDAD-MARCA.md). Los colores y las tipografías se
usan **solo** mediante las variables CSS de ese archivo.

## Identidad aplicada

| Variable | Valor | Dónde se usa en la interfaz |
| --- | --- | --- |
| `--color-fondo` | `#F7F5F0` Marfil | Fondo de todas las páginas y de los campos de formulario |
| `--color-principal` | `#171717` Negro carbón | Textos, títulos, bordes, encabezado y pie de página |
| `--color-acento` | `#E8CDA8` Beige | Botones principales, etiquetas y detalles |
| `--color-secundario` | `#777777` Gris medio | Líneas divisorias, íconos, elementos inactivos y texto complementario grande |
| `--fuente-titulos` | Montserrat Bold | Títulos, botones, precios y menú |
| `--fuente-textos` | Inter Regular | Párrafos, descripciones, formularios y mensajes |

Estilo general: fondos planos, bordes rectos de 2 px, esquinas casi sin
redondear (`--radio-borde: 2px`), sin sombras ni degradados. Las fotos de las
prendas son las protagonistas.

## Pantallas

| Pantalla | Dirección | Contenido principal |
| --- | --- | --- |
| Inicio | `/` | Banner con eslogan, productos destacados y categorías |
| Catálogo | `/catalogo` | Buscador, filtros y grilla de productos |
| Detalle de producto | `/catalogo/[slug]` | Fotos, datos, selector de talle y color, cantidad |
| Carrito | `/carrito` | Ítems, totales y envío por WhatsApp |
| Contacto | `/contacto` | Información, horarios, enlaces y formulario |
| No encontrado | cualquier dirección inexistente | Mensaje y botón al catálogo |
| Ingreso al panel | `/admin/ingresar` | Formulario de inicio de sesión |
| Panel de administración | `/admin` y subpáginas | Productos, categorías, talles y colores, pedidos y consultas |

### Inicio

1. **Encabezado** con logo y navegación.
2. **Banner principal:** fondo Negro carbón (o una foto con capa Negro carbón
   al 60 %), título en Marfil con el eslogan “Tu estilo, tus reglas”, una línea
   de apoyo (“Encontrá tu próximo look y combiná las prendas a tu manera.”) y
   el botón principal “Ver catálogo”.
3. **Destacados:** título “Destacados” y hasta 8 tarjetas de producto.
4. **Categorías:** un bloque por cada categoría activa, que lleva al catálogo
   ya filtrado.
5. **Cierre:** franja Beige con la frase “¿Dudas con el talle? Escribinos” y
   un botón secundario a Contacto.
6. **Pie de página.**

### Catálogo

- Título “Catálogo de ropa urbana” y cantidad de productos encontrados.
- Buscador por nombre arriba de la grilla.
- Filtros en una columna a la izquierda en computadora; en celular se abren
  con el botón “Filtrar”.
- Grilla de tarjetas.
- Estado vacío cuando no hay resultados.

### Detalle de producto

- A la izquierda, la galería de fotos; a la derecha, los datos. En celular,
  una columna: primero las fotos.
- Nombre (H1), precio, etiqueta de disponibilidad y descripción.
- Selector de color, selector de talle, stock de la combinación elegida,
  selector de cantidad y botón “Agregar al carrito”.
- Enlace para volver al catálogo.

### Carrito

- Lista de ítems y, al costado, el resumen con subtotal y total. En celular el
  resumen queda debajo.
- Campo “Tu nombre” y botón “Enviar pedido por WhatsApp”.
- Aclaración: “El pago y la entrega se coordinan por WhatsApp.”

### Contacto

- Información general, horarios y enlaces a WhatsApp y redes, leídos de la
  configuración. Si un dato no está cargado, ese bloque no se muestra.
- Formulario de consulta.

### Panel de administración

- Barra lateral Negro carbón con el logo oscuro y el menú: Resumen, Productos,
  Categorías, Talles y colores, Pedidos, Consultas, Cerrar sesión.
- Contenido sobre Marfil, con tablas y formularios.
- En celular, la barra se convierte en un menú desplegable.

## Componentes

### Encabezado y navegación

- Fondo Marfil con una línea inferior de 2 px en Negro carbón. Queda fijo
  arriba al desplazarse.
- A la izquierda, el logo principal (`logo.svg`), con 40 px de alto como mínimo.
- Enlaces: **Inicio**, **Catálogo** y **Contacto**, en Montserrat Bold de 14 px.
- A la derecha, el acceso al carrito con un contador (círculo Beige con
  número en Negro carbón).
- La página actual se marca con una línea inferior de 2 px.
- En celular, los enlaces pasan a un menú que se abre con un botón “Menú”.

### Pie de página

Fondo Negro carbón, texto Marfil, logo oscuro (`logo-oscuro.svg`), enlaces de
navegación y enlaces a redes configurados.

### Botones

| Tipo | Fondo | Texto | Borde | Uso |
| --- | --- | --- | --- | --- |
| Principal | Beige `#E8CDA8` | Negro carbón `#171717` | 2 px Negro carbón | “Agregar al carrito”, “Ver catálogo”, “Enviar pedido por WhatsApp” |
| Secundario | Transparente | Negro carbón `#171717` | 2 px Negro carbón | “Seguir comprando”, “Limpiar filtros” |
| Sobre fondo oscuro | Beige `#E8CDA8` | Negro carbón `#171717` | Sin borde | Botón del banner |
| De texto | Transparente | Negro carbón, subrayado | Sin borde | “Quitar”, “Volver al catálogo” |

- Texto en Montserrat Bold de 14 px, en mayúsculas.
- Alto mínimo de 44 px, para tocarlos cómodamente en el celular.
- El borde Negro carbón hace visible el botón Beige sobre el fondo Marfil.

```css
.boton-principal {
  background: var(--color-acento);
  color: var(--color-principal);
  border: var(--borde);
  border-radius: var(--radio-borde);
  font-family: var(--fuente-titulos);
  font-weight: var(--peso-titulos);
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  min-height: 44px;
  padding: 0 var(--espacio-4);
}

.boton-principal:hover {
  background: var(--color-principal);
  color: var(--color-fondo);
}

.boton-principal:focus-visible {
  outline: 3px solid var(--color-principal);
  outline-offset: 3px;
}

.boton-principal:disabled {
  background: transparent;
  color: var(--color-secundario);
  border-color: var(--color-secundario);
  cursor: not-allowed;
}
```

### Tarjeta de producto

- Foto en proporción 4:5, que ocupa todo el ancho de la tarjeta.
- Etiqueta de disponibilidad sobre la esquina superior izquierda de la foto.
- Nombre en Montserrat Bold de 16 px, Negro carbón.
- Precio en Montserrat Bold de 18 px, Negro carbón.
- Toda la tarjeta es un enlace al detalle.
- Al pasar el mouse o recibir foco, aparece un borde de 2 px en Negro carbón.

### Etiqueta de disponibilidad

La disponibilidad se comunica **con texto**, no solo con color.

| Estado | Texto | Aspecto |
| --- | --- | --- |
| Hay stock | “Disponible” | Fondo Beige, texto Negro carbón |
| Quedan pocas | “Últimas unidades” | Fondo Marfil, texto y borde Negro carbón |
| Agotado | “Sin stock” | Fondo Negro carbón, texto Marfil; la foto se atenúa |

### Filtros del catálogo

- **Categoría:** lista de opciones, una sola a la vez.
- **Talle:** botones cuadrados con el nombre del talle; se pueden elegir varios.
- **Color:** círculos con el color de la prenda y su nombre al lado; se pueden
  elegir varios. El color del círculo viene del catálogo, no de la paleta.
- **Disponibilidad:** casilla “Solo con stock”.
- Opción elegida: fondo Negro carbón con texto Marfil.
- Botón secundario “Limpiar filtros”.

### Selector de variante y de cantidad

- Los talles y colores sin stock se muestran tachados y deshabilitados.
- Debajo se informa el stock: “Quedan 2 unidades” o “Sin stock en esta combinación”.
- La cantidad se cambia con los botones “−” y “+” o escribiendo el número.

### Formularios

- Cada campo tiene su etiqueta visible arriba, en Inter Regular de 14 px. No
  se usa el texto de ejemplo como etiqueta.
- Campo: fondo Marfil, borde de 2 px Negro carbón, texto de 16 px, alto mínimo
  de 44 px.
- Los campos obligatorios se indican con la palabra “(obligatorio)”.
- Foco: contorno de 3 px Negro carbón.
- Error: borde de 4 px, ícono de alerta y mensaje debajo del campo que empieza
  con “Error:”.

### Carrito

- Cada ítem muestra foto, nombre, talle, color, precio unitario, selector de
  cantidad, subtotal y el botón de texto “Quitar”.
- El resumen muestra subtotal y total en Montserrat Bold; el total, en 24 px.
- Si una variante cambió de precio o de stock, se muestra un aviso junto al ítem.

### Mensajes de error y de confirmación

No se usan rojo ni verde: no están en la paleta y un aviso que depende solo
del color no es accesible.

| Tipo | Ícono | Aspecto | Ejemplo |
| --- | --- | --- | --- |
| Confirmación | Tilde | Fondo Beige, texto Negro carbón | “¡Listo! Sumaste la remera a tu carrito.” |
| Error | Signo de exclamación | Fondo Marfil, borde izquierdo de 6 px Negro carbón, texto que empieza con “Error:” | “Error: solo quedan 2 unidades de este talle.” |
| Información | Letra i | Fondo Marfil, borde de 2 px Gris medio | “El pago y la entrega se coordinan por WhatsApp.” |

Los mensajes que aparecen después de una acción se anuncian a los lectores de
pantalla con `role="status"` o `role="alert"`.

### Estados vacíos

| Situación | Texto | Acción |
| --- | --- | --- |
| Catálogo sin resultados | “No encontramos prendas con esos filtros.” | Botón “Limpiar filtros” |
| Carrito vacío | “Tu carrito está vacío. Mirá el catálogo y armá tu look.” | Botón “Ver catálogo” |
| Sin productos destacados | La sección no se muestra | — |
| Panel sin pedidos | “Todavía no hay pedidos.” | — |
| Panel sin consultas | “No hay consultas nuevas.” | — |

El título del estado vacío va en Montserrat Bold; el texto de apoyo puede ir
en Gris medio si mide 24 px o más.

### Panel de administración

- Tablas con encabezado Negro carbón y texto Marfil; filas separadas por una
  línea Gris medio.
- Estado del pedido con una etiqueta de texto: `pendiente`, `confirmado`,
  `entregado` o `cancelado`.
- Las acciones que no se pueden deshacer fácilmente (dar de baja un producto,
  cancelar un pedido) piden confirmación antes de ejecutarse.
- Los formularios del panel usan los mismos campos y botones que la tienda.

## Estados de interacción

| Estado | Regla |
| --- | --- |
| Normal | Como se describe en cada componente |
| Mouse encima (`hover`) | Se invierten los colores o aparece un borde; nunca cambia el tamaño |
| Foco (`focus-visible`) | Contorno de 3 px Negro carbón, separado 3 px del elemento. Sobre fondo Negro carbón, el contorno es Beige |
| Presionado | El elemento se desplaza 1 px hacia abajo |
| Deshabilitado | Texto y borde Gris medio, cursor de “no permitido” |
| Cargando | El botón muestra “Enviando…” y queda deshabilitado para evitar envíos dobles |

## Diseño responsive

Se diseña primero para celular y después se amplía.

| Ancho de pantalla | Dispositivo | Columnas de la grilla | Navegación | Filtros |
| --- | --- | --- | --- | --- |
| Menos de 768 px | Celular | 2 | Botón “Menú” | Botón “Filtrar” |
| De 768 a 1023 px | Tableta | 3 | Enlaces visibles | Botón “Filtrar” |
| 1024 px o más | Computadora | 4 | Enlaces visibles | Columna lateral |

- Ancho máximo del contenido: 1200 px, centrado.
- El ancho mínimo soportado es 360 px, sin desplazamiento horizontal.
- Las imágenes se adaptan al ancho de su contenedor.

## Accesibilidad

- [ ] Contraste según las reglas de [IDENTIDAD-MARCA.md](IDENTIDAD-MARCA.md).
- [ ] Todo se puede usar con teclado, en un orden lógico.
- [ ] El foco siempre es visible.
- [ ] Cada campo tiene su etiqueta asociada.
- [ ] Cada imagen de producto tiene texto alternativo (ver [09-SEO.md](09-SEO.md)).
- [ ] Ninguna información depende solo del color.
- [ ] Las áreas táctiles miden 44 px o más.
- [ ] La página declara el idioma: `<html lang="es">`.
- [ ] Se usan etiquetas semánticas: `header`, `nav`, `main` y `footer`.
- [ ] Si el usuario pidió reducir el movimiento, no hay animaciones.
