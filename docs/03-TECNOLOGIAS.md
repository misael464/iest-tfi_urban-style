# 03 · Tecnologías

> **Pregunta que responde este archivo:** ¿con qué construimos Urban Style?

Se mantiene el stack trabajado en clase porque cubre todo lo que la tienda
necesita y evita sumar herramientas. Si una decisión cambia, **primero se edita
este archivo** y después el código.

## Stack elegido

| Capa | Tecnología | Función en Urban Style | Motivo de la elección | Alternativas descartadas |
| --- | --- | --- | --- | --- |
| Interfaz | React | Construir la interfaz con componentes reutilizables: tarjeta de producto, filtros, selector de talle y color, ítem del carrito | La misma tarjeta se usa en inicio y catálogo; un cambio se hace una sola vez | Vue y Angular: no se vieron en la materia. HTML y JavaScript sin biblioteca: el carrito y los filtros serían difíciles de mantener |
| Framework | Next.js (App Router) | Organizar las páginas por carpetas, ejecutar código en el servidor y exponer las rutas de API | Reúne páginas, servidor y herramientas de SEO en un solo proyecto; permite validar el pedido en el servidor sin armar un backend aparte | React solo, con un servidor Express separado: dos proyectos para mantener y publicar |
| Estilos | CSS con variables y CSS Modules | Aplicar la identidad visual con las variables de [IDENTIDAD-MARCA.md](IDENTIDAD-MARCA.md) | Control total para respetar la paleta de cuatro colores; viene incluido en Next.js | Tailwind y Bootstrap: traen sus propios colores y estilos, y alejan el resultado del manual de marca |
| Lenguaje | JavaScript | Lenguaje de todo el proyecto | Es el que se usa en la carrera y no requiere configuración extra | TypeScript: útil, pero suma una curva de aprendizaje; queda para más adelante |
| Base de datos | PostgreSQL | Guardar productos, variantes, stock, pedidos, consultas y administradores | Los datos están muy relacionados (producto, variante, pedido) y PostgreSQL asegura esas relaciones con claves foráneas, restricciones y transacciones | MongoDB y Firebase: no garantizan las relaciones ni las restricciones de stock de la misma forma |
| Control de versiones | Git | Registrar cada cambio del código con su historial | Permite volver atrás y trabajar por ramas | Copias manuales de carpetas: sin historial y fáciles de pisar |
| Repositorio | GitHub | Respaldar el código en la nube y revisar los cambios con Pull Requests | Se conecta de forma directa con Vercel | Guardar el proyecto solo en la computadora: sin respaldo |
| Publicación | Vercel | Publicar el sitio con HTTPS y generar una vista previa por cada rama | Está hecha por el mismo equipo que Next.js y publica sola con cada `git push` | Un servidor propio: hay que configurarlo, actualizarlo y pagarlo |
| Inteligencia artificial | Asistente de IA de programación (en clase, OpenCode) | Ayudar a planificar, documentar, revisar y programar a partir de estas especificaciones | Acelera el trabajo repetitivo; lee [../AGENTS.md](../AGENTS.md) en cada sesión | Programar sin especificación: la IA inventa colores, datos y estructura |

## Servicios y bibliotecas adicionales

Se agrega solo lo necesario. Cada elemento tiene su justificación.

| Elemento | Tipo | Para qué | Justificación |
| --- | --- | --- | --- |
| Neon | Servicio de PostgreSQL en la nube | Alojar la base de datos | Vercel publica el sitio pero no aloja la base. Neon ofrece PostgreSQL con un plan gratuito suficiente para el proyecto |
| `pg` (node-postgres) | Biblioteca | Conectar Next.js con PostgreSQL | Next.js no incluye un conector. `pg` permite consultas parametrizadas y transacciones, y funciona igual con cualquier PostgreSQL |
| `bcryptjs` | Biblioteca | Guardar las contraseñas de los administradores como hash | Nunca se guarda una contraseña en texto plano. Está escrita en JavaScript puro y no necesita compilarse al publicar |

No se agregan bibliotecas para sesiones, validaciones ni formularios: se
resuelven con funciones propias en `lib/` y con el módulo `crypto` de Node.js.

## Tecnologías que no se usan en este proyecto

- Tailwind, Bootstrap u otras bibliotecas de estilos.
- TypeScript y ORM como Prisma (por ahora).
- Bases de datos no relacionales.
- Plataformas de tienda ya armadas: el objetivo del trabajo es desarrollar el sitio.
- Pasarelas de pago: los pagos online están fuera del alcance (ver [01-CONTEXTO.md](01-CONTEXTO.md)).

Es una decisión para este proyecto, no una regla definitiva.

## Cómo se conectan

```text
Navegador del cliente (celular o computadora)
        │  HTTPS
        ▼
Vercel · Next.js
  ├── Páginas (React)            → muestran catálogo, carrito y panel
  ├── Rutas de API (/api/...)    → validan y registran pedidos y consultas
  └── lib/db.js                  → única conexión, usa DATABASE_URL
        │  SQL parametrizado
        ▼
PostgreSQL (Neon)                → productos, variantes, pedidos, consultas

Computadora de desarrollo ── git push ──► GitHub ── publica ──► Vercel
```

La cadena de conexión a la base vive solo en el servidor. Nunca llega al
navegador (ver [10-SEGURIDAD.md](10-SEGURIDAD.md)).

## Variables de entorno

| Variable | Qué contiene | Visible en el navegador | Dónde se carga |
| --- | --- | --- | --- |
| `DATABASE_URL` | Cadena de conexión a PostgreSQL | **No. Es secreta** | `.env.local` en desarrollo y panel de Vercel en producción |
| `NEXT_PUBLIC_SITE_URL` | Dirección pública del sitio, usada en los metadatos | Sí | `.env.local` y panel de Vercel |

Reglas:

- Solo las variables que empiezan con `NEXT_PUBLIC_` llegan al navegador. Un
  secreto **nunca** lleva ese prefijo.
- `.env.local` no se sube al repositorio. Sí se sube `.env.example`, que tiene
  los nombres de las variables y valores de ejemplo.

```bash
# .env.example  (copiar como .env.local y completar)
DATABASE_URL="postgresql://USUARIO:CONTRASENA@SERVIDOR/BASE?sslmode=require"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

Los datos del negocio que no son secretos (número de WhatsApp, horarios y
redes) no van en variables de entorno: se guardan en `config/sitio.js`.

## Creación del proyecto

El instalador de Next.js propone por defecto TypeScript y Tailwind. Como este
proyecto no los usa, se elige la **configuración personalizada**:

```bash
npx create-next-app@latest urban-style
# TypeScript: No · Tailwind CSS: No · App Router: Sí · Alias de importación: @/*
```

Si el instalador ofrece generar un `AGENTS.md`, se conserva el de este
proyecto y se le suma lo que aporte el de Next.js.

## Requisitos para ejecutar el proyecto

1. Node.js en su versión LTS vigente (20.9 o superior) y npm.
2. Git instalado y una cuenta de GitHub.
3. Una base de datos PostgreSQL (un proyecto en Neon).
4. Visual Studio Code u otro editor.

```bash
# 1. Clonar el repositorio e instalar las dependencias
git clone URL_DEL_REPOSITORIO
cd urban-style
npm install

# 2. Crear el archivo de variables de entorno y completarlo
cp .env.example .env.local

# 3. Crear las tablas y cargar los datos de demostración
psql "$DATABASE_URL" -f db/esquema.sql
psql "$DATABASE_URL" -f db/datos-demo.sql

# 4. Crear el primer usuario administrador
node db/crear-admin.js

# 5. Iniciar el servidor de desarrollo
npm run dev
```

Si no se tiene `psql` instalado, los archivos `.sql` se pueden pegar y ejecutar
en el editor SQL de Neon.

## Requisitos para publicar

1. Subir el código a un repositorio de GitHub.
2. Importar el repositorio desde Vercel.
3. Cargar `DATABASE_URL` y `NEXT_PUBLIC_SITE_URL` en la configuración del proyecto en Vercel.
4. Usar en `DATABASE_URL` la cadena de conexión **con pool** que entrega Neon,
   pensada para funciones que se ejecutan a demanda.
5. Verificar el sitio publicado con la lista de [08-TAREAS.md](08-TAREAS.md).

> **A tener en cuenta:** el plan gratuito de Vercel (Hobby) está limitado a
> proyectos personales y no comerciales, y publicitar la venta de un producto
> cuenta como uso comercial. Alcanza para este trabajo práctico; si la tienda
> empieza a vender de verdad, corresponde pasar a un plan pago.

## Versiones

Al crear el proyecto se instala la última versión estable de cada herramienta
y queda fijada en `package.json`. No se actualizan versiones mayores en medio
del desarrollo sin probar antes en una rama.
