# 08 · Tareas

> **Pregunta que responde este archivo:** ¿en qué orden lo hacemos?

El desarrollo se divide en 12 etapas. Cada tarea indica entre paréntesis el
requerimiento de [02-REQUERIMIENTOS.md](02-REQUERIMIENTOS.md) que cubre.

## Cómo usar este archivo

- Se trabaja **una tarea por vez**, en orden.
- Una casilla se marca con `[x]` recién cuando la tarea está hecha y probada.
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
| 8 | Contacto | 2 y 3 |
| 9 | Administración | 3 y 7 |
| 10 | Seguridad | 7, 8 y 9 |
| 11 | Pruebas | 10 |
| 12 | Publicación y revisión final | 11 |

Las etapas 2 y 3 se pueden hacer en paralelo, y la etapa 8 (Contacto) se
puede adelantar en cualquier momento después de ellas.

## Etapa 1 · Preparación del proyecto

- [ ] Crear el proyecto con `npx create-next-app@latest`, eligiendo la configuración personalizada: App Router, sin TypeScript y sin Tailwind.
- [ ] Conservar este `AGENTS.md` si el instalador ofrece crear uno propio.
- [ ] Crear el repositorio en GitHub y subir el primer commit.
- [ ] Armar las carpetas de [04-ARQUITECTURA.md](04-ARQUITECTURA.md).
- [ ] Copiar `AGENTS.md`, `docs/` y `marca/` al proyecto.
- [ ] Crear `.env.example` y agregar `.env.local` a `.gitignore`.
- [ ] Crear `config/sitio.js` con los datos del negocio marcados como pendientes.

**Criterio de terminado:** `npm run dev` muestra la página inicial sin errores
y el repositorio está en GitHub sin archivos secretos.

## Etapa 2 · Identidad visual

- [x] Definir nombre, eslogan, paleta, tipografías y tono en [IDENTIDAD-MARCA.md](IDENTIDAD-MARCA.md).
- [x] Diseñar el logo en SVG y PNG, con versiones para fondo claro y oscuro (carpeta `marca/`).
- [ ] Cargar las variables CSS de la marca en `app/globals.css`.
- [ ] Configurar Montserrat Bold e Inter Regular con `next/font`.
- [ ] Copiar `logo.svg` y `logo-oscuro.svg` a `public/` y el isotipo a `app/icon.svg`.
- [ ] Crear los componentes `Encabezado`, `PieDePagina`, `Boton` y `Mensaje` (RNF01, RNF02).

**Criterio de terminado:** el encabezado y el pie se ven en todas las páginas
con los colores y las fuentes del manual, en celular y en computadora.

## Etapa 3 · Configuración de la base de datos

- [ ] Crear el proyecto de PostgreSQL en Neon.
- [ ] Guardar `DATABASE_URL` en `.env.local`.
- [ ] Escribir `db/esquema.sql` según [05-DATOS.md](05-DATOS.md) y ejecutarlo.
- [ ] Escribir `db/datos-demo.sql` y cargar los datos de demostración.
- [ ] Crear `lib/db.js` con la única conexión a la base.
- [ ] Probar una consulta de lectura desde una página.

**Criterio de terminado:** las 11 tablas existen, tienen datos de demostración
y una página del sitio puede leer la lista de categorías.

## Etapa 4 · Catálogo

- [ ] Crear `lib/productos.js` con la consulta de productos activos.
- [ ] Crear `TarjetaProducto`, `GrillaProductos` y `EtiquetaDisponibilidad` (RF02).
- [ ] Armar la página `/catalogo` con la grilla de 2, 3 y 4 columnas (RF02, RNF01).
- [ ] Armar la página de inicio con banner, destacados y categorías (RF01).
- [ ] Crear la página “No encontrado”.

**Criterio de terminado:** el inicio y el catálogo muestran los productos de
demostración con foto, nombre, precio y disponibilidad.

## Etapa 5 · Filtros y detalle de productos

- [ ] Agregar la búsqueda por nombre, sin distinguir mayúsculas ni tildes (RF03).
- [ ] Agregar los filtros por categoría, talle, color y disponibilidad (RF04).
- [ ] Guardar la búsqueda y los filtros en la dirección de la página (RF04).
- [ ] Mostrar el estado vacío con el botón “Limpiar filtros” (RF05).
- [ ] Armar la página de detalle con galería y datos (RF06).
- [ ] Crear `SelectorVariante` con el stock por combinación (RF07).
- [ ] Crear `SelectorCantidad` con sus límites (RF08).

**Criterio de terminado:** se puede llegar a un producto filtrando y buscando,
y el detalle muestra el stock correcto de cada talle y color.

## Etapa 6 · Carrito

- [ ] Crear `CarritoContext` y guardar el carrito en `localStorage` (RF09).
- [ ] Conectar el botón “Agregar al carrito” y el contador del encabezado (RF09).
- [ ] Crear la ruta `POST /api/carrito`, que devuelve precio y stock actuales.
- [ ] Armar la página `/carrito` con `ItemCarrito` y `ResumenCarrito` (RF10).
- [ ] Permitir cambiar cantidades y quitar ítems (RF10).
- [ ] Calcular subtotales y total (RF11).
- [ ] Mostrar el estado de carrito vacío (RF10).

**Criterio de terminado:** el carrito conserva los productos al recargar y los
importes se actualizan solos al cambiar una cantidad.

## Etapa 7 · Validación y envío de pedidos

- [ ] Escribir las reglas de `lib/validaciones.js` para el pedido.
- [ ] Crear `lib/pedidos.js`: leer variantes, comprobar stock y calcular el total (RF12).
- [ ] Crear la ruta `POST /api/pedidos`, que registra el pedido en una transacción (RF13).
- [ ] Crear `lib/whatsapp.js`, que arma el mensaje y el enlace (RF13).
- [ ] Mostrar en el carrito los errores de stock que devuelve el servidor (RF12).
- [ ] Abrir WhatsApp con el mensaje y vaciar el carrito (RF13).

**Criterio de terminado:** un pedido válido queda guardado como `pendiente` y
abre WhatsApp con el detalle; un pedido con un precio alterado o sin stock es
rechazado por el servidor.

## Etapa 8 · Contacto

- [ ] Armar la página `/contacto` con los datos de `config/sitio.js` (RF14).
- [ ] Crear `FormularioContacto` con validación en el navegador (RF15).
- [ ] Crear la ruta `POST /api/consultas` con validación en el servidor (RF15).
- [ ] Mostrar la confirmación y los mensajes de error (RF15).

**Criterio de terminado:** una consulta válida queda guardada en la base y una
consulta con datos inválidos muestra el error junto al campo.

## Etapa 9 · Administración

- [ ] Escribir `db/crear-admin.js` y crear el primer administrador.
- [ ] Crear `lib/auth.js`: comprobar la contraseña y manejar sesiones (RF16).
- [ ] Armar `/admin/ingresar` y la ruta de inicio y cierre de sesión (RF16).
- [ ] Proteger el grupo `(panel)` y todas las rutas de `api/admin/` (RF16).
- [ ] Alta, edición y baja lógica de productos (RF17).
- [ ] Gestión de categorías (RF18).
- [ ] Gestión de talles, colores y variantes (RF19).
- [ ] Edición de precios y stock (RF20).
- [ ] Listado de pedidos y cambio de estado con descuento de stock (RF21).
- [ ] Listado de consultas (RF22).

**Criterio de terminado:** sin iniciar sesión no se puede ver ni modificar
nada del panel, y con sesión se puede cargar un producto completo y confirmar
un pedido.

## Etapa 10 · Seguridad

- [ ] Recorrer la lista de control de [10-SEGURIDAD.md](10-SEGURIDAD.md).
- [ ] Verificar que todas las consultas SQL usan parámetros.
- [ ] Verificar que cada ruta de API valida sus datos.
- [ ] Probar el bloqueo por intentos fallidos de inicio de sesión.
- [ ] Verificar que los mensajes de error no muestran datos internos.
- [ ] Revisar que no haya secretos en el repositorio ni en el código del navegador.

**Criterio de terminado:** todas las casillas de la lista de control de
seguridad están marcadas (RNF06).

## Etapa 11 · Pruebas

- [ ] Recorrer una compra completa en celular y en computadora (RNF01, RNF04).
- [ ] Probar cada criterio de aceptación de RF01 a RF22.
- [ ] Navegar todo el sitio usando solo el teclado (RNF02).
- [ ] Ejecutar Lighthouse en inicio y catálogo (RNF02, RNF03).
- [ ] Probar en Chrome, Firefox, Edge y Safari (RNF07).
- [ ] Revisar ortografía y tono de todos los textos (RNF08).
- [ ] Corregir los errores encontrados y repetir las pruebas.

**Criterio de terminado:** todos los criterios de aceptación se cumplen y no
quedan errores conocidos sin anotar.

## Etapa 12 · Publicación y revisión final

- [ ] Completar los datos pendientes de [01-CONTEXTO.md](01-CONTEXTO.md).
- [ ] Importar el repositorio en Vercel y cargar las variables de entorno.
- [ ] Verificar el sitio publicado con HTTPS.
- [ ] Revisar títulos, descripciones y la imagen para redes de [09-SEO.md](09-SEO.md).
- [ ] Reemplazar los datos de demostración por los productos reales.
- [ ] Hacer una copia de seguridad de la base de datos.
- [ ] Revisar que la documentación coincida con el sitio publicado.

**Criterio de terminado:** el sitio está publicado, funciona con datos reales
y las especificaciones describen lo que efectivamente se construyó.

## Estado actual

| Etapa | Estado |
| --- | --- |
| Especificación (esta carpeta) | Terminada |
| 2 · Identidad visual | En curso: marca y logo definidos; falta aplicarlos al sitio |
| Resto de las etapas | Sin empezar |
