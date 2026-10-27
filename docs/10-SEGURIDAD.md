# 10 · Seguridad

> **Pregunta que responde este archivo:** ¿cómo protegemos los datos y el sistema?

Regla general: **el navegador no es confiable.** Todo lo que llega desde el
navegador se valida en el servidor, y nada secreto sale del servidor.

## Datos que se protegen

| Dato | Dónde está | Por qué es sensible | Protección |
| --- | --- | --- | --- |
| Cadena de conexión `DATABASE_URL` | Variables de entorno | Da acceso total a la base | Solo en el servidor; nunca en el repositorio |
| Contraseñas de administradores | Tabla `administradores` | Permiten entrar al panel | Se guarda solo el hash |
| Sesiones del panel | Tabla `sesiones` y cookie | Permiten actuar como administrador | Cookie protegida y vencimiento |
| Nombre de quien hace un pedido | Tabla `pedidos` | Dato personal | Visible solo en el panel |
| Nombre, correo y mensaje de consultas | Tabla `consultas` | Datos personales | Visibles solo en el panel |
| Precios y stock | Tablas `productos` y `variantes` | Si se alteran, se vende mal | Solo se modifican desde el panel |

### Protección de datos personales

- Se pide **lo mínimo**: no se guardan teléfonos, direcciones, documentos ni datos de pago.
- Los datos personales solo se ven dentro del panel, con sesión iniciada.
- El formulario de contacto avisa para qué se usan los datos: responder la consulta.
- Los datos no se comparten con terceros ni se usan para otra finalidad.
- Los datos se conservan solo mientras hagan falta para atender el pedido o la consulta.
- Como referencia legal, en Argentina rige la Ley 25.326 de Protección de los Datos Personales.

## Qué nunca debe llegar al navegador

- `DATABASE_URL` ni ninguna otra credencial.
- Hashes de contraseñas e identificadores de sesión de otros usuarios.
- Pedidos, consultas y datos de administradores, salvo en el panel con sesión.
- Productos dados de baja y variantes inactivas.
- Mensajes de error internos: texto de errores SQL, rutas de archivos o trazas.

## Variables de entorno y secretos

- Los secretos viven en `.env.local` (desarrollo) y en el panel de Vercel (producción).
- `.env.local` está en `.gitignore` y **nunca** se sube a GitHub.
- Un secreto nunca lleva el prefijo `NEXT_PUBLIC_`, porque ese prefijo lo envía al navegador.
- `DATABASE_URL` se lee en un solo archivo: `lib/db.js`.
- Si un secreto se sube por error, se cambia de inmediato en el servicio
  correspondiente. Borrarlo del repositorio no alcanza: queda en el historial.
- En esta documentación solo hay valores de ejemplo, nunca credenciales reales.

```javascript
// lib/db.js · único archivo que se conecta a la base
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export function consultar(texto, valores = []) {
  return pool.query(texto, valores);
}
```

## Validación de formularios

Se valida **dos veces**: en el navegador, para avisar rápido al usuario, y en
el servidor, que es la validación que realmente protege.

| Campo | Regla | Mensaje al usuario |
| --- | --- | --- |
| Nombre (pedido y consulta) | Obligatorio, de 2 a 60 caracteres | “Escribí tu nombre (entre 2 y 60 caracteres).” |
| Correo (consulta) | Obligatorio, formato de correo, hasta 120 caracteres | “Revisá el correo: parece incompleto.” |
| Mensaje (consulta) | Obligatorio, de 10 a 1000 caracteres | “Contanos tu consulta en al menos 10 caracteres.” |
| Identificador de variante | Entero positivo que exista en la base | “Uno de los productos ya no está disponible.” |
| Cantidad | Entero de 1 a 10, sin superar el stock | “Solo quedan N unidades de este talle.” |
| Ítems del pedido | De 1 a 20 variantes distintas | “Tu carrito tiene demasiados productos distintos.” |
| Precio (panel) | Número mayor o igual a 0, con hasta 2 decimales | “El precio no puede ser negativo.” |
| Stock (panel) | Entero mayor o igual a 0 | “El stock tiene que ser un número entero.” |
| Color `hex` (panel) | Formato `#RRGGBB` | “Usá un color con formato #RRGGBB.” |

- Las reglas están en `lib/validaciones.js` y se usan en ambos lados, para
  que no se desincronicen.
- El servidor acepta solo los campos esperados e ignora el resto.
- El formulario de contacto incluye un campo oculto que las personas no ven:
  si llega completo, el envío se descarta por ser automático.

## Cantidades, precios y disponibilidad

- El navegador envía solo **identificadores de variante y cantidades**.
- El servidor lee el precio y el stock de la base y calcula el total.
- Un precio o un total enviados desde el navegador se ignoran siempre.
- La base tiene restricciones (`precio >= 0`, `stock >= 0`, cantidad entre 1 y
  10) que actúan como última barrera.

El detalle del cálculo está en [05-DATOS.md](05-DATOS.md).

## Inyección SQL: consultas parametrizadas

Los valores **nunca** se pegan dentro del texto de la consulta. Viajan aparte,
como parámetros, y la base los trata como datos y no como instrucciones.

```javascript
// MAL: el texto del usuario pasa a formar parte de la consulta
const texto = "SELECT * FROM productos WHERE nombre ILIKE '%" + busqueda + "%'";

// BIEN: el valor viaja como parámetro ($1)
const resultado = await consultar(
  "SELECT id, nombre, precio FROM productos " +
    "WHERE activo AND unaccent(nombre) ILIKE unaccent($1)",
  [`%${busqueda}%`]
);
```

Los nombres de columnas para ordenar o filtrar no se toman del usuario: se
eligen de una lista fija definida en el código.

## XSS: contenido insertado en la página

- React escapa de forma automática el texto que se muestra.
- No se usa `dangerouslySetInnerHTML`.
- Las descripciones de productos y los mensajes de consultas se muestran como
  texto, nunca como HTML.
- Las rutas de imágenes se validan: deben empezar con `/img/productos/`.
- El texto del pedido se codifica con `encodeURIComponent` antes de armar el
  enlace de WhatsApp.

## Autenticación y sesiones

| Aspecto | Decisión |
| --- | --- |
| Quién tiene cuenta | Solo administradores. No hay registro público |
| Alta de administradores | Con el script `db/crear-admin.js`, desde la terminal |
| Contraseña | Entre 12 y 72 caracteres (72 es el máximo que procesa bcrypt) |
| Almacenamiento | Hash con `bcryptjs`, factor de costo 12. Nunca en texto plano |
| Intentos fallidos | Tras 5 intentos seguidos, la cuenta se bloquea 15 minutos |
| Mensaje de error de ingreso | Siempre el mismo: “Correo o contraseña incorrectos”, sin indicar cuál falló |
| Identificador de sesión | 32 bytes aleatorios generados con `crypto.randomBytes` |
| Guardado de la sesión | En la base se guarda el hash SHA-256 del identificador, no el identificador |
| Duración | 8 horas; después hay que volver a ingresar |
| Cierre de sesión | Borra la sesión en la base y la cookie |

La cookie de sesión se crea con estos atributos:

| Atributo | Valor | Para qué sirve |
| --- | --- | --- |
| `HttpOnly` | Activado | El código JavaScript de la página no puede leerla |
| `Secure` | Activado en producción | Solo viaja por HTTPS |
| `SameSite` | `Lax` | No se envía en formularios ni en solicitudes en segundo plano iniciados desde otros sitios |
| `Path` | `/` | Vale para todo el sitio |
| `Max-Age` | 28800 segundos | Vence a las 8 horas |

## Protección de rutas administrativas

Ocultar el enlace al panel **no** lo protege. La sesión se comprueba en el
servidor en dos lugares:

1. En el `layout.js` del grupo `(panel)`: si no hay sesión válida, redirige a
   `/admin/ingresar`.
2. En **cada** ruta de `app/api/admin/`: si no hay sesión válida, responde
   `401` y no ejecuta nada.

```javascript
// app/api/admin/productos/route.js
import { exigirAdmin } from "@/lib/auth";
import { validarProducto } from "@/lib/validaciones";
import { crearProducto } from "@/lib/productos";

export async function POST(solicitud) {
  const admin = await exigirAdmin(solicitud);
  if (!admin) {
    return Response.json({ ok: false, mensaje: "No autorizado." }, { status: 401 });
  }

  const datos = await solicitud.json();
  const errores = validarProducto(datos);
  if (errores.length > 0) {
    return Response.json({ ok: false, mensaje: "Revisá los datos.", errores }, { status: 400 });
  }

  const producto = await crearProducto(datos);
  return Response.json({ ok: true, producto }, { status: 201 });
}
```

### Solicitudes no autorizadas

- Las operaciones que modifican datos usan `POST`, `PUT` o `DELETE`, nunca `GET`.
- Las rutas del panel comprueban que el encabezado `Origin` coincida con el
  dominio del sitio, para rechazar solicitudes armadas desde otra página.
- Las rutas públicas (`/api/pedidos`, `/api/consultas`, `/api/carrito`) solo
  permiten crear o consultar; ninguna modifica productos, precios ni stock.
- Los pedidos y las consultas no se pueden leer desde rutas públicas.

## Manejo seguro de errores

| Situación | Qué ve el usuario | Qué se registra en el servidor |
| --- | --- | --- |
| Dato inválido | Mensaje claro junto al campo | Nada |
| Sin permiso | “No autorizado.” | Ruta y hora |
| Error inesperado | “Algo salió mal. Probá de nuevo en un momento.” | El error completo |

Nunca se muestra al usuario el texto de un error de la base de datos, y en
los registros no se guardan contraseñas ni identificadores de sesión.

## HTTPS

- En producción el sitio funciona solo por HTTPS. Vercel entrega el
  certificado y redirige de HTTP a HTTPS.
- La conexión con la base usa cifrado (`sslmode=require`).

## Copias de seguridad y actualizaciones

- **Código:** el repositorio de GitHub es el respaldo. Cada cambio queda en el historial.
- **Base de datos:** una copia con `pg_dump` antes de cada cambio importante y
  al menos una vez por semana cuando el sitio esté en uso. Las copias se
  guardan fuera del repositorio.
- **Dependencias:** ejecutar `npm audit` una vez por mes y antes de publicar;
  aplicar las actualizaciones de seguridad en una rama y probar antes de fusionar.
- **Accesos:** cambiar la contraseña de la base si alguien deja de participar
  en el proyecto.

```bash
# Copia de seguridad de la base, con la cadena de conexión directa (sin pool).
# El archivo generado no se sube al repositorio.
pg_dump "$DATABASE_URL" > respaldo-urban-style.sql
```

## Lista de control antes de publicar

- [ ] `.env.local` no está en el repositorio.
- [ ] Ninguna variable secreta empieza con `NEXT_PUBLIC_`.
- [ ] Todas las consultas SQL usan parámetros.
- [ ] Todas las rutas de API validan lo que reciben.
- [ ] El total del pedido se calcula en el servidor.
- [ ] Sin sesión no se puede abrir ninguna página ni ruta del panel.
- [ ] Las contraseñas están guardadas como hash.
- [ ] La cookie de sesión tiene `HttpOnly`, `Secure` y `SameSite`.
- [ ] El bloqueo por intentos fallidos funciona.
- [ ] No se usa `dangerouslySetInnerHTML`.
- [ ] Los mensajes de error no muestran datos internos.
- [ ] El sitio publicado responde por HTTPS.
- [ ] Hay una copia de seguridad reciente de la base.
- [ ] `npm audit` no informa vulnerabilidades graves sin resolver.
