# 03 · Tecnologías

> **Pregunta que responde este archivo:** ¿con qué construimos Urban Style?

Si una decisión cambia, **primero se edita este archivo** y después el código.

## Cambio de stack

La primera versión de esta especificación usaba React y Next.js, con
PostgreSQL en Neon y un inicio de sesión propio. Se reemplazó por un sitio
hecho con HTML, CSS y JavaScript sin frameworks, con Supabase como base de
datos.

**Motivos:**

1. **Poder explicar todo el código en la defensa.** HTML, CSS y JavaScript son
   las tecnologías que se dominan. Con React y Next.js, una parte del
   funcionamiento queda dentro del framework y es difícil de justificar línea
   por línea.
2. **El modelo de datos del TP3 se mantiene.** Supabase usa PostgreSQL, así
   que las tablas, las relaciones y las restricciones de
   [05-DATOS.md](05-DATOS.md) siguen valiendo.
3. **Seguridad sin un servidor propio.** Supabase aporta el inicio de sesión
   (Supabase Auth), las políticas de acceso por fila (RLS) y las funciones en
   la base (RPC). Con eso se valida el pedido sin programar un backend.

| Capa | Antes | Ahora |
| --- | --- | --- |
| Estructura de las páginas | Componentes React | HTML, en archivos `.html` |
| Framework | Next.js (App Router) | Ninguno |
| Estilos | CSS con variables y CSS Modules | CSS con variables, en archivos `.css` separados |
| Lógica de la interfaz | JavaScript dentro de componentes | JavaScript (módulos ES), en archivos `.js` separados |
| Base de datos | PostgreSQL en Neon, con `pg` | PostgreSQL en Supabase, con `supabase-js` |
| Inicio de sesión del panel | Propio: `bcryptjs`, tabla `sesiones` y cookie | Supabase Auth |
| Validación en el servidor | Rutas de API de Next.js (`/api/...`) | Políticas RLS, restricciones `CHECK` y funciones RPC de Supabase |
| Tests | No definidos | Vitest |
| Código | GitHub | GitHub (sin cambios) |
| Publicación | Vercel, con funciones de servidor | Vercel, como sitio estático |

Lo que **no** cambia: la identidad visual, los requerimientos, las funciones
del sitio y el modelo de datos del catálogo y de los pedidos.

## Stack elegido

| Capa | Tecnología | Función en Urban Style | Motivo de la elección | Alternativas descartadas |
| --- | --- | --- | --- | --- |
| Estructura | HTML | Un archivo `.html` por página, con su título, descripción y `<h1>` escritos en el archivo | Es la base de la web y se puede explicar sin intermediarios | React y otros frameworks: suman una capa que no se puede justificar del todo |
| Estilos | CSS con variables | Aplicar la identidad visual con las variables de [IDENTIDAD-MARCA.md](IDENTIDAD-MARCA.md) | Control total para respetar la paleta de cuatro colores | Tailwind y Bootstrap: traen sus propios colores y estilos, y alejan el resultado del manual de marca |
| Lógica | JavaScript (módulos ES) | Armar el catálogo, los filtros, el carrito y el panel; hablar con Supabase | Se ejecuta en el navegador sin compilar; los módulos (`import`/`export`) ordenan el código sin un empaquetador | TypeScript: suma una curva de aprendizaje. Empaquetadores (Vite, webpack): agregan configuración que no hace falta |
| Base de datos | Supabase (PostgreSQL) | Guardar productos, variantes, stock, pedidos, consultas y administradores | Es PostgreSQL: mantiene claves foráneas, restricciones y transacciones. Suma RLS y funciones RPC para proteger los datos sin backend propio | Neon con un servidor propio: hay que programar y publicar ese servidor. MongoDB y Firebase: no garantizan las relaciones ni las restricciones de stock |
| Inicio de sesión | Supabase Auth | Ingreso de los administradores al panel | Maneja contraseñas, sesiones y límite de intentos sin programarlos a mano | Inicio de sesión propio: mucho código de seguridad delicado |
| Tests | Vitest | Probar las funciones de JavaScript que no dependen de la base | Entiende módulos ES sin configuración y se ejecuta con un solo comando | Jest: necesita configuración extra para módulos ES. Probar solo a mano: los errores vuelven sin aviso |
| Control de versiones | Git | Registrar cada cambio del código con su historial | Permite volver atrás y trabajar por ramas | Copias manuales de carpetas: sin historial y fáciles de pisar |
| Repositorio | GitHub | Respaldar el código y revisar los cambios con Pull Requests | Se conecta de forma directa con Vercel | Guardar el proyecto solo en la computadora: sin respaldo |
| Publicación | Vercel | Publicar el sitio estático con HTTPS y una vista previa por rama | Publica sola con cada `git push` | Un servidor propio: hay que configurarlo, actualizarlo y pagarlo |
| Inteligencia artificial | Claude Code (extensión oficial de Anthropic para VS Code), modelo Opus 5.5, plan Pro, en modo Manual | Ayudar a planificar, documentar, revisar y programar a partir de estas especificaciones | Acelera el trabajo repetitivo y lee [../AGENTS.md](../AGENTS.md) en cada sesión. El modo Manual obliga a aprobar cada cambio antes de que se aplique | Programar sin especificación: la IA inventa colores, datos y estructura |

## Bibliotecas

Se agrega solo lo necesario. Cada elemento tiene su justificación.

| Elemento | Tipo | Cómo se incorpora | Justificación |
| --- | --- | --- | --- |
| `@supabase/supabase-js` | Biblioteca del navegador | Módulo ES desde jsDelivr, con versión fija, importado **solo** en `js/lib/supabase.js` | Es el cliente oficial para leer datos, llamar a las funciones RPC y usar Supabase Auth |
| Vitest | Herramienta de desarrollo | `npm install --save-dev vitest` | Ejecuta los tests. No llega al sitio publicado |

```javascript
// js/lib/supabase.js · único archivo que importa supabase-js
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/+esm";

import { SUPABASE_URL, SUPABASE_CLAVE_ANON } from "../config/supabase.js";

export const supabase = createClient(SUPABASE_URL, SUPABASE_CLAVE_ANON);
```

- La versión va escrita completa en la dirección (`@2.45.4`), nunca `@2` ni
  `@latest`, para que el sitio no cambie solo. Al crear el proyecto se elige
  la última versión estable y se actualiza este archivo.
- Las funciones con tests (`carrito.js`, `validaciones.js`, `formato.js` y
  `whatsapp.js`) **no importan Supabase**. Así Vitest las prueba sin conexión
  y sin internet.

No se agregan bibliotecas para formularios, validaciones ni plantillas: se
resuelven con funciones propias en `js/lib/`.

## Tecnologías que no se usan en este proyecto

- React, Next.js, Vue, Angular u otros frameworks.
- Empaquetadores y compiladores (Vite, webpack, Babel).
- Tailwind, Bootstrap u otras bibliotecas de estilos.
- TypeScript y ORM.
- Bases de datos no relacionales.
- Plataformas de tienda ya armadas: el objetivo del trabajo es desarrollar el sitio.
- Pasarelas de pago: los pagos online están fuera del alcance (ver [01-CONTEXTO.md](01-CONTEXTO.md)).

Es una decisión para este proyecto, no una regla definitiva.

## Cómo se conectan

```text
Navegador del cliente (celular o computadora)
  ├── HTML + CSS + JS  ◄── HTTPS ──  Vercel (archivos estáticos)
  │
  └── js/lib/supabase.js  ── HTTPS, con la clave anon ──►  Supabase
                                                            ├── Auth          → sesión del panel
                                                            ├── Políticas RLS → qué puede leer o escribir cada uno
                                                            ├── Funciones RPC → crear_pedido, confirmar_pedido…
                                                            └── PostgreSQL    → productos, variantes, pedidos, consultas

Computadora de desarrollo ── git push ──► GitHub ── publica ──► Vercel
```

Vercel solo entrega archivos. Todo lo que hay que proteger (precios, stock,
pedidos, panel) lo resuelve Supabase en su servidor (ver
[10-SEGURIDAD.md](10-SEGURIDAD.md)).

## Claves de Supabase

| Clave | Qué permite | Dónde va |
| --- | --- | --- |
| URL del proyecto | Saber a qué proyecto conectarse | `js/config/supabase.js`. Es pública |
| Clave `anon` | Actuar como visitante; solo puede lo que permiten las políticas RLS | `js/config/supabase.js`. Es pública **por diseño**: la protección está en la RLS |
| Clave `service_role` | Saltear la RLS y hacer cualquier cosa en la base | **Nunca** en el código, en el navegador ni en el repositorio. Solo se usa desde el panel web de Supabase |

```javascript
// js/config/supabase.js · datos públicos del proyecto
export const SUPABASE_URL = "https://PROYECTO.supabase.co"; // PENDIENTE: completar
export const SUPABASE_CLAVE_ANON = "PENDIENTE"; // PENDIENTE: completar con la clave anon
```

> En el panel actual de Supabase, la clave `anon` puede figurar como
> *publishable* y la `service_role` como *secret*. La regla es la misma: en el
> sitio va solo la primera.

Un sitio estático no tiene variables de entorno: lo que el navegador necesita
es público por definición. Los datos del negocio (WhatsApp, horarios, redes)
se guardan en `js/config/sitio.js`.

## Creación del proyecto

No hay instalador: el proyecto es una carpeta con archivos. Se parte del
repositorio que ya existe, `iest-tfi_urban-style`.

```bash
cd iest-tfi_urban-style
npm init -y
npm install --save-dev vitest
```

En `package.json` se agrega el comando de tests:

```json
{
  "type": "module",
  "scripts": {
    "test": "vitest run"
  }
}
```

`node_modules/` se agrega a `.gitignore`.

## Requisitos para ejecutar el proyecto

1. Node.js en su versión LTS vigente y npm (solo para ejecutar los tests).
2. Git instalado y una cuenta de GitHub.
3. Un proyecto en Supabase.
4. Visual Studio Code u otro editor, con un servidor local de archivos
   estáticos (por ejemplo, la extensión Live Server). Los módulos ES no
   funcionan si se abre el `.html` con doble clic.

```bash
# 1. Clonar el repositorio e instalar Vitest
git clone https://github.com/misael464/iest-tfi_urban-style.git
cd iest-tfi_urban-style
npm install

# 2. Completar js/config/supabase.js con la URL y la clave anon del proyecto

# 3. En el editor SQL de Supabase, ejecutar en este orden:
#    db/esquema.sql, db/politicas.sql, db/funciones.sql y db/datos-demo.sql

# 4. Crear el administrador (ver 10-SEGURIDAD.md)

# 5. Ejecutar los tests
npm test

# 6. Abrir index.html con el servidor local
```

## Requisitos para publicar

1. Subir el código a un repositorio de GitHub.
2. Importar el repositorio desde Vercel, sin framework ni comando de compilación.
3. En Supabase, desactivar el registro público de usuarios y cargar la
   dirección del sitio publicado en la configuración de Auth.
4. Verificar el sitio publicado con la lista de [08-TAREAS.md](08-TAREAS.md).

> **A tener en cuenta:** el plan gratuito de Vercel (Hobby) está limitado a
> proyectos personales y no comerciales, y publicitar la venta de un producto
> cuenta como uso comercial. El plan gratuito de Supabase pausa los proyectos
> que pasan un tiempo sin uso. Los dos alcanzan para este trabajo práctico; si
> la tienda empieza a vender de verdad, corresponde pasar a planes pagos.

## Versiones

La versión de `supabase-js` queda fija en la dirección del módulo y la de
Vitest en `package.json`. No se actualizan versiones mayores en medio del
desarrollo sin probar antes en una rama.
