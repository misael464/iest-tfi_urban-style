# 10 · Seguridad

> **Pregunta que responde este archivo:** ¿cómo protegemos los datos y el sistema?

Regla general: **el navegador no es confiable.** Todo el código JavaScript del
sitio se puede leer y modificar desde el navegador, y cualquiera puede llamar
a Supabase sin pasar por las páginas. Por eso la protección real está en
Supabase: en las políticas RLS, en las restricciones de la base y en las
funciones RPC.

## Reglas obligatorias

1. **RLS activado en todas las tablas.** Los visitantes solo leen el catálogo
   activo y crean pedidos y consultas. No modifican nada más.
2. **En el navegador solo se usa la clave anon de Supabase.** La clave
   `service_role` nunca va en el código ni en el repositorio.
3. **El total del pedido y el stock los valida una función de Supabase (RPC)**
   con los precios de la base, no el navegador.

El SQL de las políticas y de las funciones está en [05-DATOS.md](05-DATOS.md).

## Datos que se protegen

| Dato | Dónde está | Por qué es sensible | Protección |
| --- | --- | --- | --- |
| Clave `service_role` | Panel de Supabase | Saltea la RLS: da acceso total a la base | No se usa en el proyecto; nunca en el código ni en el repositorio |
| Contraseña de la base de datos | Panel de Supabase | Da acceso total a la base | Solo para copias de seguridad; nunca en el repositorio |
| Contraseñas de administradores | Supabase Auth | Permiten entrar al panel | Supabase guarda solo el hash |
| Sesiones del panel | Supabase Auth y `localStorage` del navegador | Permiten actuar como administrador | Vencen y se renuevan; el cierre de sesión las invalida |
| Nombre de quien hace un pedido | Tabla `pedidos` | Dato personal | RLS: solo lo leen los administradores |
| Nombre, correo y mensaje de consultas | Tabla `consultas` | Datos personales | RLS: solo los leen los administradores |
| Precios y stock | Tablas `productos` y `variantes` | Si se alteran, se vende mal | RLS: solo los modifican los administradores |

### Protección de datos personales

- Se pide **lo mínimo**: no se guardan teléfonos, direcciones, documentos ni datos de pago.
- Los datos personales solo se ven dentro del panel, con sesión de administrador.
- El formulario de contacto avisa para qué se usan los datos: responder la consulta.
- Los datos no se comparten con terceros ni se usan para otra finalidad.
- Los datos se conservan solo mientras hagan falta para atender el pedido o la consulta.
- Como referencia legal, en Argentina rige la Ley 25.326 de Protección de los Datos Personales.

## Qué nunca debe llegar al navegador

- La clave `service_role` ni la contraseña de la base de datos.
- Pedidos, consultas y datos de administradores, salvo a un administrador con sesión.
- Productos dados de baja, variantes inactivas y categorías desactivadas.
- Mensajes de error internos: texto de errores SQL, nombres de tablas o trazas.

La RLS se encarga de los tres primeros puntos aunque alguien modifique el JS.

## Claves de Supabase

| Clave | Dónde va | Por qué |
| --- | --- | --- |
| URL del proyecto | `js/config/supabase.js` | Es pública |
| Clave `anon` | `js/config/supabase.js` | Es pública **por diseño**: solo permite lo que autorizan las políticas RLS |
| Clave `service_role` | En ningún archivo del proyecto | Saltea todas las políticas. El sitio no la necesita: el SQL se ejecuta en el editor del panel de Supabase |

- Antes de cada commit se revisa que la clave `service_role` no aparezca en
  ningún archivo.
- Si la clave `service_role` o la contraseña de la base se suben por error,
  se cambian de inmediato en el panel de Supabase. Borrarlas del repositorio
  no alcanza: quedan en el historial.
- En esta documentación solo hay valores de ejemplo, nunca claves reales.

```bash
# Busca la clave en los archivos y en todo el historial de Git.
# Tiene que no devolver nada.
git grep -n "service_role" -- ':!docs' ':!AGENTS.md'
git log -p -S "service_role" -- ':!docs' ':!AGENTS.md'
```

## Políticas de acceso (RLS)

| Quién | Qué puede hacer |
| --- | --- |
| Visitante (clave anon) | Leer categorías, productos, imágenes y variantes activas, y todos los talles y colores. Crear pedidos con `crear_pedido` y consultas con `crear_consulta`. **Nada más** |
| Usuario con sesión que no es administrador | Lo mismo que un visitante |
| Administrador activo | Leer y modificar el catálogo; leer pedidos y consultas; cambiar el estado de los pedidos con las funciones RPC; marcar consultas como respondidas |

- Ninguna tabla tiene políticas de `INSERT`, `UPDATE` ni `DELETE` para los visitantes.
- Los pedidos no tienen política de `UPDATE` ni siquiera para el
  administrador: el estado cambia solo con `confirmar_pedido`,
  `entregar_pedido` y `cancelar_pedido`, que mantienen el stock correcto.
- Una tabla nueva se crea siempre con su `ENABLE ROW LEVEL SECURITY` y sus
  políticas en el mismo cambio.

## Validación de formularios

Se valida **dos veces**: en el navegador, para avisar rápido al usuario, y en
Supabase, que es la validación que realmente protege.

| Campo | Regla | Mensaje al usuario | Dónde lo controla Supabase |
| --- | --- | --- | --- |
| Nombre (pedido y consulta) | Obligatorio, de 2 a 60 caracteres | “Escribí tu nombre (entre 2 y 60 caracteres).” | `CHECK` de la tabla y `crear_pedido` |
| Correo (consulta) | Obligatorio, formato de correo, hasta 120 caracteres | “Revisá el correo: parece incompleto.” | `CHECK` de la tabla |
| Mensaje (consulta) | Obligatorio, de 10 a 1000 caracteres | “Contanos tu consulta en al menos 10 caracteres.” | `CHECK` de la tabla |
| Identificador de variante | Entero positivo que exista y esté a la venta | “Uno de los productos ya no está disponible.” | `crear_pedido` |
| Cantidad | Entero de 1 a 10, sin superar el stock | “Solo quedan N unidades de este talle.” | `crear_pedido` y `CHECK` de `pedido_detalles` |
| Ítems del pedido | De 1 a 20 variantes distintas | “Tu carrito tiene demasiados productos distintos.” | `crear_pedido` |
| Precio (panel) | Número mayor o igual a 0, con hasta 2 decimales | “El precio no puede ser negativo.” | `CHECK` y tipo `NUMERIC(12,2)` |
| Stock (panel) | Entero mayor o igual a 0 | “El stock tiene que ser un número entero.” | `CHECK` y tipo `INTEGER` |
| Color `hex` (panel) | Formato `#RRGGBB` | “Usá un color con formato #RRGGBB.” | `CHECK` de la tabla |

- Las reglas del navegador están en `js/lib/validaciones.js`, con sus tests.
- Las funciones RPC leen solo los campos que esperan e ignoran el resto.
- El formulario de contacto incluye un campo oculto que las personas no ven.
  `crear_consulta` lo recibe y, si llega completo, descarta el envío por ser
  automático.

## Cantidades, precios y disponibilidad

- El navegador envía a `crear_pedido` solo **identificadores de variante y cantidades**.
- La función lee el precio y el stock de la base y calcula el total.
- Un precio o un total enviados desde el navegador se ignoran siempre.
- El mensaje de WhatsApp se arma con el total que devuelve la función, no con
  el que calculó el navegador.
- La base tiene restricciones (`precio >= 0`, `stock >= 0`, cantidad entre 1 y
  10) que actúan como última barrera.

El detalle del cálculo está en [05-DATOS.md](05-DATOS.md).

## Inyección SQL

- El JS **nunca** arma texto SQL. Habla con la base solo con los métodos de
  `supabase-js` (`from`, `select`, `eq`, `rpc`…), que envían los valores como
  datos y no como instrucciones.
- Dentro de las funciones RPC, los valores se usan como parámetros (`p_items`,
  `p_nombre_cliente`). No se usa `EXECUTE` con texto armado a partir de datos
  del usuario.
- Las funciones `SECURITY DEFINER` fijan `SET search_path = public`, para que
  nadie pueda reemplazar una tabla con otra del mismo nombre.
- Los nombres de columnas para ordenar o filtrar no se toman del usuario: se
  eligen de una lista fija definida en el código.

```javascript
// MAL: el texto del usuario pasa a formar parte de un filtro armado a mano
supabase.from("productos").select("*").or(`nombre.ilike.%${busqueda}%`);

// BIEN: el valor viaja como parámetro de una función RPC
supabase.rpc("buscar_productos", { p_texto: busqueda });
```

## XSS: contenido insertado en la página

- No se usan `innerHTML`, `outerHTML`, `insertAdjacentHTML` ni `document.write`.
- El texto se muestra con `textContent` y los atributos se asignan con
  propiedades (`imagen.src`, `enlace.href`).
- Las descripciones de productos y los mensajes de consultas se muestran como
  texto, nunca como HTML.
- Las rutas de imágenes deben empezar con `/img/productos/` (lo controla un
  `CHECK` de la base).
- Los valores que van dentro de una dirección (el `slug`, el texto del pedido
  para WhatsApp) se codifican con `encodeURIComponent`.

Esto es especialmente importante porque `supabase-js` guarda la sesión del
panel en `localStorage`: un código inyectado en la página podría leerla.

## Autenticación y sesiones

| Aspecto | Decisión |
| --- | --- |
| Quién tiene cuenta | Solo administradores. El registro público está **desactivado** en Supabase Auth |
| Quién es administrador | Un usuario de Supabase Auth que además figura activo en la tabla `administradores` |
| Contraseña | Mínimo 12 caracteres, configurado en Supabase Auth |
| Almacenamiento | Supabase Auth guarda solo el hash. El proyecto no guarda contraseñas |
| Intentos fallidos | Se aplica el límite de intentos de Supabase Auth (ver RF16 en [02-REQUERIMIENTOS.md](02-REQUERIMIENTOS.md)) |
| Mensaje de error de ingreso | Siempre el mismo: “Correo o contraseña incorrectos”, sin indicar cuál falló |
| Sesión | `supabase-js` la guarda en `localStorage`. El token vence y se renueva solo mientras se usa el panel |
| Cierre de sesión | `supabase.auth.signOut()` invalida la sesión en Supabase y la borra del navegador |

### Alta de un administrador

1. En el panel de Supabase, **Authentication → Users → Add user**: cargar
   correo y contraseña.
2. Copiar el identificador (UUID) del usuario creado.
3. En el editor SQL de Supabase, agregarlo a la tabla de administradores:

```sql
INSERT INTO administradores (id, nombre)
VALUES ('UUID-DEL-USUARIO', 'Nombre del administrador');
```

Para quitarle el acceso a alguien sin borrar su usuario:
`UPDATE administradores SET activo = FALSE WHERE id = 'UUID-DEL-USUARIO';`.

## Protección del panel

Los archivos de `admin/` son HTML públicos: cualquiera puede abrirlos. Ocultar
el enlace o redirigir **no** protege los datos. La protección tiene tres capas:

| Capa | Qué hace | ¿Protege? |
| --- | --- | --- |
| La página comprueba la sesión al cargar | Si no hay administrador, redirige a `admin/ingresar.html` | No: es comodidad para el usuario |
| Políticas RLS | Sin `es_admin()`, la base no devuelve pedidos, consultas ni productos inactivos, y no acepta cambios | **Sí** |
| Funciones RPC del panel | `confirmar_pedido`, `entregar_pedido` y `cancelar_pedido` comprueban `es_admin()` antes de hacer algo | **Sí** |

```javascript
// js/lib/auth.js
import { supabase } from "./supabase.js";

// Devuelve el administrador con sesión, o null si no hay sesión
// o el usuario no figura activo en la tabla administradores.
export async function obtenerAdministrador() {
  const { data: datosUsuario } = await supabase.auth.getUser();
  if (!datosUsuario.user) {
    return null;
  }

  const { data, error } = await supabase
    .from("administradores")
    .select("id, nombre")
    .eq("id", datosUsuario.user.id)
    .maybeSingle();

  return error ? null : data;
}
```

```javascript
// js/paginas/admin/pedidos.js
import { obtenerAdministrador } from "../../lib/auth.js";

const administrador = await obtenerAdministrador();
if (!administrador) {
  window.location.replace("/admin/ingresar.html");
}
```

### Solicitudes desde otros sitios

Supabase acepta solicitudes desde cualquier origen: no hay forma de que solo
responda a las páginas de Urban Style. Por eso ninguna regla de seguridad
depende de la página que hace la solicitud, sino de la RLS y de las funciones.

## Manejo seguro de errores

| Situación | Qué ve el usuario | Qué se registra |
| --- | --- | --- |
| Dato inválido | Mensaje claro junto al campo, o el `mensaje` que devuelve la función RPC | Nada |
| Sin permiso | “No autorizado.” | Supabase registra la solicitud en sus logs |
| Error inesperado | “Algo salió mal. Probá de nuevo en un momento.” | Supabase registra el error en sus logs |

- Nunca se muestra al usuario el `error.message` que devuelve Supabase: se
  reemplaza por un mensaje propio.
- En la consola del navegador no se muestran tokens ni datos personales.

## Limitación conocida

Cualquier persona puede llamar a `crear_pedido` muchas veces y registrar
pedidos falsos. No afectan el stock, porque el stock se descuenta recién
cuando el administrador confirma. El administrador los cancela desde el
panel. Limitar la cantidad de pedidos por visitante queda fuera del alcance
inicial.

## HTTPS

- Vercel publica el sitio solo por HTTPS: entrega el certificado y redirige de
  HTTP a HTTPS.
- Todas las llamadas a Supabase van por HTTPS.

## Copias de seguridad y actualizaciones

- **Código:** el repositorio de GitHub es el respaldo. Cada cambio queda en el historial.
- **Base de datos:** una copia con `pg_dump` antes de cada cambio importante y
  al menos una vez por semana cuando el sitio esté en uso. Las copias se
  guardan fuera del repositorio.
- **Dependencias:** `supabase-js` queda fijo en una versión; se actualiza en
  una rama y se prueba antes de fusionar. `npm audit` revisa Vitest una vez
  por mes.
- **Accesos:** desactivar en `administradores` a quien deje de participar y
  cambiar la contraseña de la base.

```bash
# Copia de seguridad de la base, con la cadena de conexión que entrega Supabase.
# La cadena incluye la contraseña de la base: se escribe en la terminal,
# nunca en un archivo del proyecto. El archivo generado no se sube.
pg_dump "CADENA_DE_CONEXION_DE_SUPABASE" > respaldo-urban-style.sql
```

## Lista de control antes de publicar

- [ ] Las 10 tablas tienen RLS activado.
- [ ] Con la clave anon no se puede insertar, modificar ni borrar en ninguna tabla.
- [ ] Con la clave anon no se leen pedidos, consultas, administradores ni productos inactivos.
- [ ] La clave `service_role` no está en el código, en el repositorio ni en su historial.
- [ ] `js/config/supabase.js` tiene solo la URL y la clave anon.
- [ ] `crear_pedido` calcula el total con los precios de la base e ignora los del navegador.
- [ ] `crear_pedido` rechaza cantidades que superan el stock.
- [ ] Las funciones del panel rechazan a quien no es administrador.
- [ ] El registro público de Supabase Auth está desactivado.
- [ ] El límite de intentos de ingreso de Supabase Auth está activo.
- [ ] No se usan `innerHTML`, `outerHTML`, `insertAdjacentHTML` ni `document.write`.
- [ ] Los mensajes de error no muestran datos internos.
- [ ] El sitio publicado responde por HTTPS.
- [ ] Hay una copia de seguridad reciente de la base.
- [ ] `npm audit` no informa vulnerabilidades graves sin resolver.
