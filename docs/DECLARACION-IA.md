# Declaración de uso de inteligencia artificial

> **Pregunta que responde este archivo:** ¿qué se hizo con IA, qué hizo el autor y qué riesgos se controlaron?

Este documento cumple el principio P8 de [CONSTITUCION.md](CONSTITUCION.md).
El registro detallado de prompts, errores y aciertos está en
[PROMPTS.md](PROMPTS.md).

## Herramientas de IA usadas

| Herramienta | Para qué se usó | Cómo se controló |
| --- | --- | --- |
| Claude Code (extensión de VS Code), modelo Opus 5.5, plan Pro | Redactar y corregir la especificación, crear los comandos y las skills, escribir el código y los archivos SQL | Modo Manual: cada cambio se mostró antes de aplicarse y el autor lo aprobó o lo rechazó |
| Claude (chat en claude.ai) | Revisar las propuestas de Claude Code, detectar inconsistencias entre archivos, explicar conceptos y preparar borradores de documentos | El autor leyó cada respuesta y decidió qué aplicar |
| Google Gemini (gemini.google.com, gratis) | Generar las 8 imágenes fotorrealistas | Cada imagen tiene su ficha en [FICHAS-IA.md](../multimedia/FICHAS-IA.md) y la leyenda «Generado con IA» |
| Kling 3.0, a través de Higgsfield (plan Starter) | Video promocional: 4 clips de 15 s a partir de imágenes de Gemini | Tiene su ficha en [FICHAS-IA.md](../multimedia/FICHAS-IA.md) y la leyenda «Generado con IA» en pantalla |

## Qué hizo la IA y qué hizo el autor

| Parte del trabajo | IA | Autor |
| --- | --- | --- |
| Idea del emprendimiento, marca y alcance | Propuso redacciones y detectó contradicciones | Definió el negocio, el alcance (RF01 a RF13) y aprobó cada decisión |
| Especificación (`docs/`) y constitución | Redactó los borradores | Revisó, corrigió a mano y aprobó cada archivo |
| Comandos y skills de Claude Code | Escribió los archivos | Definió qué tenía que hacer cada uno y revisó los borradores |
| Código (HTML, CSS, JS, SQL) | Escribió el código en tareas chicas | Aprobó cada cambio, probó en el navegador y en Supabase, y hizo los commits |
| Pruebas | Escribió los tests y comprobó las copias | Ejecutó `npm test`, las pruebas manuales y las consultas de comprobación |
| Imágenes y video promocional | Generó las piezas | Escribió los prompts, eligió las piezas y les puso la leyenda |
| Video demo | No participó | Grabó la pantalla y la narración con su voz |
| Commits y publicación | No hizo commits ni push | Hizo todos los commits desde VS Code y publicó el sitio |

## Riesgos y cómo se controlaron

### Riesgo 1 · La IA inventa o se equivoca

**Qué puede pasar:** la IA escribe código o documentación que parece correcta
pero no lo es, o inventa datos del negocio (precios, teléfonos, horarios).

**Cómo se controló:**

- La constitución obliga a que cada regla tenga una comprobación concreta.
- Modo Manual: ningún cambio se aplicó sin aprobación.
- Los datos del negocio quedan como `PENDIENTE` y los productos de
  demostración lo dicen en su descripción, con precios de ejemplo.
- Tests con Vitest y `/verificar`, que no marca un criterio como cumplido
  sin evidencia.

**Evidencia:** 11 errores de la IA detectados y corregidos, registrados en
[PROMPTS.md](PROMPTS.md).

### Riesgo 2 · Seguridad de los datos

**Qué puede pasar:** que una clave secreta termine en el código, o que un
visitante pueda cambiar precios, stock o pedidos desde el navegador.

**Cómo se controló:**

- En el sitio va solo la clave anon de Supabase; la `service_role` nunca se
  copió a ningún archivo.
- RLS activada en las 10 tablas, y el total del pedido lo calcula la función
  `crear_pedido` con los precios de la base.
- El texto se inserta siempre con `textContent`, nunca con `innerHTML`.

**Evidencia:** la consulta de comprobación devolvió 0 tablas sin RLS, y un
intento de cambiar un precio con la clave anon devolvió una lista vacía.

### Riesgo 3 · Imágenes generadas con IA que engañen

**Qué puede pasar:** que una foto generada con IA se tome como una foto real
de un producto en venta, o que muestre algo que la tienda no tiene.

**Cómo se controló:**

- Toda imagen o video generado con IA lleva la leyenda «Generado con IA».
- Cada pieza tiene su ficha en `multimedia/FICHAS-IA.md`, con la herramienta,
  el prompt y la fecha.
- Las fotos reales de los productos las va a cargar el negocio; las de IA
  se usan solo como ilustración del proyecto.

**Evidencia:** las 8 imágenes tienen la leyenda dentro de la imagen y su
ficha con el prompt en [FICHAS-IA.md](../multimedia/FICHAS-IA.md).

## Declaración

Declaro que conozco y puedo explicar todo el contenido de este trabajo,
incluido el código generado con asistencia de IA. Revisé y aprobé cada
cambio antes de incorporarlo, y registré los errores de la IA y cómo se
corrigieron. Las piezas generadas con IA están identificadas como tales.

Nombre: Andrés Misael Gordillo

Fecha: 03/11/2026

Firma: ______________________________
