# Urban Style · Instrucciones para agentes de IA

Este archivo es el índice del proyecto y el conjunto de reglas que todo
agente de IA debe leer y respetar **antes de escribir código o documentación**.

## El proyecto

**Urban Style** es una tienda online de ropa urbana (remeras, buzos,
pantalones y camperas). Su eslogan es “Tu estilo, tus reglas”. El cliente
explora el catálogo, elige talle y color, arma un carrito y envía el pedido
por WhatsApp. El negocio administra productos, stock y pedidos desde un panel
protegido.

| Dato | Valor |
| --- | --- |
| Tipo de proyecto | Sitio web responsive |
| Stack | React, Next.js (App Router), CSS, PostgreSQL, GitHub y Vercel |
| Idioma de la interfaz | Español, tratando de vos |
| Estado | Especificación terminada. El sitio todavía no está programado |
| Autor | Andrés Misael Gordillo |

## Archivos de especificación

Cada archivo responde una sola pregunta.

| Orden | Archivo | Pregunta que responde |
| --- | --- | --- |
| 1 | [docs/IDENTIDAD-MARCA.md](docs/IDENTIDAD-MARCA.md) | ¿Cómo nos vemos y cómo hablamos? |
| 2 | [docs/01-CONTEXTO.md](docs/01-CONTEXTO.md) | ¿Por qué existe y para quién es? |
| 3 | [docs/02-REQUERIMIENTOS.md](docs/02-REQUERIMIENTOS.md) | ¿Qué tiene que hacer? |
| 4 | [docs/03-TECNOLOGIAS.md](docs/03-TECNOLOGIAS.md) | ¿Con qué lo construimos? |
| 5 | [docs/04-ARQUITECTURA.md](docs/04-ARQUITECTURA.md) | ¿Cómo se organiza el código? |
| 6 | [docs/05-DATOS.md](docs/05-DATOS.md) | ¿Qué información guarda? |
| 7 | [docs/06-DISENO-UI.md](docs/06-DISENO-UI.md) | ¿Cómo se ven las pantallas? |
| 8 | [docs/07-CONVENCIONES.md](docs/07-CONVENCIONES.md) | ¿Cómo escribimos el código? |
| 9 | [docs/08-TAREAS.md](docs/08-TAREAS.md) | ¿En qué orden lo hacemos? |
| 10 | [docs/09-SEO.md](docs/09-SEO.md) | ¿Cómo nos encuentran en Google? |
| 11 | [docs/10-SEGURIDAD.md](docs/10-SEGURIDAD.md) | ¿Cómo protegemos datos y sistema? |

Recursos de marca: [marca/logo.svg](marca/logo.svg),
[marca/logo.png](marca/logo.png) y [marca/paleta.md](marca/paleta.md).

## Orden de lectura

1. **Siempre, al empezar una sesión:** este archivo,
   [docs/IDENTIDAD-MARCA.md](docs/IDENTIDAD-MARCA.md) y
   [docs/08-TAREAS.md](docs/08-TAREAS.md).
2. **La primera vez:** todos los archivos, en el orden de la tabla.
3. **Antes de cada tarea,** además:

| Si la tarea es sobre… | Leer también |
| --- | --- |
| Pantallas, componentes o estilos | [06-DISENO-UI.md](docs/06-DISENO-UI.md) y [07-CONVENCIONES.md](docs/07-CONVENCIONES.md) |
| Base de datos o consultas | [05-DATOS.md](docs/05-DATOS.md) y [10-SEGURIDAD.md](docs/10-SEGURIDAD.md) |
| Carrito o pedidos | [02-REQUERIMIENTOS.md](docs/02-REQUERIMIENTOS.md), [04-ARQUITECTURA.md](docs/04-ARQUITECTURA.md) y [10-SEGURIDAD.md](docs/10-SEGURIDAD.md) |
| Panel de administración | [10-SEGURIDAD.md](docs/10-SEGURIDAD.md) y [05-DATOS.md](docs/05-DATOS.md) |
| Títulos, descripciones o imágenes | [09-SEO.md](docs/09-SEO.md) |
| Instalar o configurar algo | [03-TECNOLOGIAS.md](docs/03-TECNOLOGIAS.md) |

## Reglas obligatorias

### Identidad visual

- Usar **solo** los cuatro colores de la marca, siempre mediante variables CSS:

| Variable | Color | HEX |
| --- | --- | --- |
| `--color-principal` | Negro carbón | `#171717` |
| `--color-acento` | Beige | `#E8CDA8` |
| `--color-fondo` | Marfil | `#F7F5F0` |
| `--color-secundario` | Gris medio | `#777777` |

- Usar solo **Montserrat Bold** para títulos y botones e **Inter Regular** para textos.
- No escribir colores HEX a mano en componentes ni en archivos `.module.css`.
- No agregar colores, tipografías, pesos, sombras ni degradados.
- No usar rojo ni verde para errores o confirmaciones: se resuelven con ícono, texto y borde.
- No usar Gris medio en textos de menos de 24 px, ni Beige como texto sobre Marfil.
- Usar el logo de `marca/` tal cual. No redibujarlo, deformarlo ni recolorearlo.
- Escribir los textos con el tono de la marca: juvenil, cercano, claro y directo.

### Tecnologías

- Usar únicamente el stack de [docs/03-TECNOLOGIAS.md](docs/03-TECNOLOGIAS.md).
- No instalar bibliotecas nuevas sin preguntar antes. Las únicas previstas son `pg` y `bcryptjs`.
- No usar Tailwind, Bootstrap, TypeScript, ORM ni bases de datos no relacionales.
- Escribir el código en JavaScript, con las convenciones de [docs/07-CONVENCIONES.md](docs/07-CONVENCIONES.md).

### Arquitectura

- Respetar el árbol de carpetas de [docs/04-ARQUITECTURA.md](docs/04-ARQUITECTURA.md).
- Conectarse a la base **solo** desde `lib/db.js`.
- Escribir consultas SQL **solo** en archivos de `lib/`.
- Mantener `db/esquema.sql` idéntico a [docs/05-DATOS.md](docs/05-DATOS.md). Si cambia uno, cambia el otro.
- Trabajar **una tarea por vez** de [docs/08-TAREAS.md](docs/08-TAREAS.md) y marcarla con `[x]` al terminarla y probarla.

### Seguridad

- Usar siempre consultas parametrizadas. Nunca concatenar valores dentro del SQL.
- Validar en el servidor todo lo que llega del navegador.
- Calcular precios, subtotales y totales en el servidor, con datos de la base.
- Comprobar la sesión en cada página y en cada ruta del panel.
- Nunca mostrar, registrar ni subir `DATABASE_URL`, contraseñas o identificadores de sesión.
- Nunca poner un secreto en una variable que empiece con `NEXT_PUBLIC_`.
- Nunca usar `dangerouslySetInnerHTML`.
- Nunca guardar contraseñas en texto plano.

### Información del negocio

- **No inventar** precios reales, números de teléfono, direcciones, horarios, redes sociales, correos ni promociones.
- Los precios de ejemplo quedan en `$ 0`, como marcador.
- Los datos de prueba se identifican con la palabra “Demo” o “demostración”.
- El número de WhatsApp es un valor de configuración **pendiente de completar**:

```javascript
// config/sitio.js
export const sitio = {
  nombre: "Urban Style",
  eslogan: "Tu estilo, tus reglas",
  whatsappNumero: "0000000000000", // PENDIENTE: completar con el número real
  horarios: [], // PENDIENTE: completar
  redes: {}, // PENDIENTE: completar
  correo: "", // PENDIENTE: completar
};
```

### Alcance

No programar funciones que están fuera del alcance inicial: pagos online,
seguimiento de envíos, cuentas de clientes, aplicación móvil, integración con
transportes, programa de puntos ni subida de fotos desde el panel. Están
detalladas en [docs/01-CONTEXTO.md](docs/01-CONTEXTO.md).

## Qué hacer y qué no hacer

| Sí | No |
| --- | --- |
| Leer los archivos indicados antes de cada tarea | Empezar a programar sin leer las especificaciones |
| Hacer una tarea por vez y mostrar el resultado | Resolver varias etapas de una sola vez |
| Preguntar cuando algo no está especificado | Inventar datos, colores o funciones |
| Proponer cambios y esperar la aprobación | Cambiar una decisión del proyecto por cuenta propia |
| Actualizar la documentación junto con el código | Dejar que el código y los `.md` digan cosas distintas |
| Avisar si una instrucción contradice estos archivos | Elegir en silencio una de las dos versiones |

## Si algo no está claro

**Preguntar antes de decidir.** Hay que detenerse y consultar cuando:

- La tarea necesita un dato que no está en estos archivos.
- Hay que tomar una decisión importante que no está especificada (una
  biblioteca nueva, un cambio en la base, una pantalla nueva).
- Dos archivos se contradicen.
- La tarea parece pedir algo que está fuera del alcance inicial.

Si la respuesta cambia una decisión, primero se actualiza el archivo `.md`
correspondiente y después el código.

## Antes de dar una tarea por terminada

- [ ] Cumple los criterios de aceptación de su requerimiento.
- [ ] Usa las variables CSS de la marca.
- [ ] Se ve bien en celular y en computadora.
- [ ] No expone secretos ni datos privados.
- [ ] Respeta las convenciones de nombres y de commits.
- [ ] La casilla de [docs/08-TAREAS.md](docs/08-TAREAS.md) quedó marcada.
