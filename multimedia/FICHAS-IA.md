# Fichas de las piezas generadas con IA

> **Pregunta que responde este archivo:** ¿qué piezas se generaron con IA, con qué herramienta, con qué prompt y cuándo?

Este archivo cumple el principio P8 de [CONSTITUCION.md](../docs/CONSTITUCION.md)
y el riesgo 3 de [DECLARACION-IA.md](../docs/DECLARACION-IA.md). Todas las
imágenes llevan la leyenda «Generado con IA» en la esquina inferior derecha.

**Revisión del autor:** el autor escribió y eligió los prompts, eligió cada
imagen y comprobó que no tuvieran logos, marcas ni texto. Después se
recortaron al tamaño que usa el sitio, se pasaron a `.webp` (la de redes,
a `.jpg`) y se les agregó la leyenda.

## Imágenes

| N.º | Archivo | Dónde se usa | Herramienta | Fecha |
| --- | --- | --- | --- | --- |
| 1 | `img/productos/remera-demo-oversize-negro.webp` | Foto del producto «Remera Demo Oversize» | Google Gemini | 03/11/2026 |
| 2 | `img/productos/buzo-demo-canguro-gris.webp` | Foto del producto «Buzo Demo Canguro» | Google Gemini | 03/11/2026 |
| 3 | `img/productos/pantalon-demo-cargo-negro.webp` | Foto del producto «Pantalón Demo Cargo» | Google Gemini | 03/11/2026 |
| 4 | `img/productos/campera-demo-rompeviento-negro.webp` y `multimedia/imagenes/campera-rompeviento.webp` | Foto del producto «Campera Demo Rompeviento» y video promocional | Google Gemini | 03/11/2026 |
| 5 | `img/compartir.jpg` | Vista previa al compartir el sitio en redes (`og:image`) | Google Gemini | 03/11/2026 |
| 6 | `multimedia/imagenes/estilo-urbano.webp` | Video promocional | Google Gemini | 03/11/2026 |
| 7 | `multimedia/imagenes/perchero.webp` | Video promocional | Google Gemini | 03/11/2026 |
| 8 | `multimedia/imagenes/compra-celular.webp` | Video promocional | Google Gemini | 03/11/2026 |

## Prompts usados

1. **Remera:** «Foto de producto fotorrealista de una remera negra oversize de
   algodón, sin estampados ni logos, colgada en una percha de madera sobre un
   fondo liso color marfil, luz suave de estudio, vista de frente, formato
   vertical 4:5.»
2. **Buzo:** «Foto de producto fotorrealista de un buzo canguro gris con
   capucha y bolsillo delantero, sin logos ni texto, colgado en una percha de
   madera sobre un fondo liso color marfil, luz suave de estudio, vista de
   frente, formato vertical 4:5.»
3. **Pantalón:** «Foto de producto fotorrealista de un pantalón cargo negro con
   bolsillos laterales, sin logos, doblado sobre un fondo liso color marfil,
   luz suave de estudio, vista desde arriba, formato vertical 4:5.»
4. **Campera:** «Foto de producto fotorrealista de una campera rompeviento
   negra con detalles beige, sin logos ni texto, colgada sobre un fondo liso
   color marfil, luz suave de estudio, formato vertical 4:5.»
5. **Compartir:** «Composición fotorrealista vista desde arriba de una remera
   negra, un buzo gris y una gorra beige doblados sobre un fondo liso color
   marfil, estilo minimalista, sin logos ni texto, formato horizontal
   1200 x 630.»
6. **Estilo urbano:** «Fotografía urbana fotorrealista de una persona joven con
   remera negra oversize y pantalón cargo caminando por una calle de una
   ciudad pequeña del norte argentino al atardecer, sin logos ni texto,
   formato horizontal 16:9.»
7. **Perchero:** «Fotografía fotorrealista de un perchero metálico negro con
   ropa urbana en tonos negro, gris, blanco y beige, en un local minimalista
   de paredes claras, luz natural, sin logos ni texto, formato horizontal
   16:9.»
8. **Compra con el celular:** «Fotografía fotorrealista de unas manos
   sosteniendo un celular frente a un perchero de ropa urbana desenfocado,
   con la pantalla del celular sin contenido legible, tonos negro, beige y
   marfil, sin logos, formato horizontal 16:9.»

## Observaciones

- La persona de la imagen 6 no es una persona real: la generó la IA.
- Las fotos de los productos son ilustrativas. Las fotos reales las va a
  cargar el negocio cuando tenga su stock.

## Video promocional

| Escena | Herramienta | Imagen de partida | Prompt | Fecha |
| --- | --- | --- | --- | --- |
| 1 | Kling 3.0 (Higgsfield), 15 s | `estilo-urbano.webp` | The young man walks slowly along the cobblestone street at sunset, the camera tracks him smoothly from the side, warm golden light, gentle cinematic movement, photorealistic. No text, no logos. | 03/11/2026 |
| 2 | Kling 3.0 (Higgsfield), 15 s | `perchero.webp` | Slow smooth camera dolly forward toward the clothing rack in the minimalist store, natural window light, the clothes on the hangers sway very slightly, photorealistic. No people, no text, no logos. | 03/11/2026 |
| 3 | Kling 3.0 (Higgsfield), 15 s | `remera-demo-oversize-negro.webp` | The black oversized t-shirt on the wooden hanger moves gently as if touched by a soft breeze, the camera slowly pushes in, soft studio light on an ivory background, photorealistic product shot. No text, no logos. | 03/11/2026 |
| 4 | Kling 3.0 (Higgsfield), 15 s | `compra-celular.webp` | The hands hold the phone steady and a thumb gently scrolls on the screen, the clothing rack stays softly blurred in the background, natural light, photorealistic. The phone screen shows no readable text. No logos. | 03/11/2026 |

Los cuatro clips se unieron con ffmpeg, con los textos del guion técnico
(Anexo II del informe) y una placa final con la leyenda «Generado con IA».
Antes se probaron Veo en vidogrid.ai (sin créditos) y la redacción
automática de Clipchamp.
