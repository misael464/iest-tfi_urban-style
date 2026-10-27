# Paleta de marca: Urban Style

Referencia rápida de los colores oficiales. El manual completo está en
[../docs/IDENTIDAD-MARCA.md](../docs/IDENTIDAD-MARCA.md).

![Logo de Urban Style sobre fondo marfil](logo.png)

## Colores oficiales

La paleta tiene **cuatro** colores. No se agregan otros.

| Nombre | HEX | RGB | Variable CSS | Uso |
| --- | --- | --- | --- | --- |
| Negro carbón | `#171717` | 23, 23, 23 | `--color-principal` | Títulos, textos, logo, bordes y encabezados |
| Beige | `#E8CDA8` | 232, 205, 168 | `--color-acento` | Botones principales, detalles y llamadas a la acción |
| Marfil | `#F7F5F0` | 247, 245, 240 | `--color-fondo` | Fondo principal del sitio |
| Gris medio | `#777777` | 119, 119, 119 | `--color-secundario` | Información complementaria en tamaño grande, líneas y estados inactivos |

## Proporción de uso

| Color | Proporción aproximada | Dónde se nota |
| --- | --- | --- |
| Marfil `#F7F5F0` | 60 % | Fondo de todas las páginas |
| Negro carbón `#171717` | 25 % | Textos, encabezado, pie de página y bordes |
| Beige `#E8CDA8` | 10 % | Botones y detalles que llaman a la acción |
| Gris medio `#777777` | 5 % | Líneas divisorias y elementos inactivos |

## Contraste

Valores calculados con la fórmula de contraste de WCAG 2.2. El nivel AA pide
**4,5:1** para texto normal y **3:1** para texto grande (desde 24 px, o desde
18,66 px en negrita) y para componentes de la interfaz.

| Texto | Fondo | Contraste | Texto normal | Texto grande y componentes |
| --- | --- | --- | --- | --- |
| Negro carbón `#171717` | Marfil `#F7F5F0` | 16,45:1 | Sí | Sí |
| Negro carbón `#171717` | Beige `#E8CDA8` | 11,72:1 | Sí | Sí |
| Marfil `#F7F5F0` | Negro carbón `#171717` | 16,45:1 | Sí | Sí |
| Beige `#E8CDA8` | Negro carbón `#171717` | 11,72:1 | Sí | Sí |
| Gris medio `#777777` | Marfil `#F7F5F0` | 4,11:1 | No | Sí |
| Gris medio `#777777` | Negro carbón `#171717` | 4,00:1 | No | Sí |
| Gris medio `#777777` | Beige `#E8CDA8` | 2,93:1 | No | No |
| Beige `#E8CDA8` | Marfil `#F7F5F0` | 1,40:1 | No | No |

## Combinaciones permitidas

- Texto Negro carbón sobre Marfil: combinación base de todo el sitio.
- Texto Negro carbón sobre Beige: botones principales y etiquetas.
- Texto Marfil o Beige sobre Negro carbón: encabezado, pie de página y banner.
- Gris medio sobre Marfil: solo en texto grande, líneas, íconos y estados inactivos.

## Combinaciones prohibidas

- Texto Beige sobre Marfil (1,40:1): no se lee.
- Texto Gris medio sobre Beige (2,93:1): no alcanza el mínimo.
- Texto Gris medio de menos de 24 px sobre cualquier fondo: no alcanza 4,5:1.
  Para textos secundarios chicos se usa Negro carbón.

## Archivos de esta carpeta

| Archivo | Contenido | Uso |
| --- | --- | --- |
| `logo.svg` | Logo horizontal, vectorial, fondo transparente | Encabezado del sitio sobre fondos claros |
| `logo.png` | Logo horizontal sobre Marfil, 1600 px de ancho | Documentos, informe y vista previa |
| `logo-oscuro.svg` | Logo horizontal para fondos oscuros, vectorial | Pie de página y banner sobre Negro carbón |
| `logo-oscuro.png` | Logo sobre Negro carbón, 1600 px de ancho | Documentos y redes con fondo oscuro |
| `isotipo.svg` | Solo la remera, vectorial | Ícono del sitio (favicon) |
| `isotipo.png` | Solo la remera sobre Marfil, 512 px | Íconos y avatares |
| `paleta.md` | Este archivo | Consulta rápida de colores |
