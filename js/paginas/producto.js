// js/paginas/producto.js
import { agregarAlCarrito, guardarCarrito, leerCarrito } from "../lib/carrito.js";
import { formatearPrecio, textoStock } from "../lib/formato.js";
import { obtenerProductoPorSlug } from "../lib/productos.js";
import { obtenerCantidadMaxima } from "../lib/validaciones.js";
import { actualizarContadorCarrito, iniciarEncabezado } from "../componentes/encabezado.js";
import { crearEtiquetaDisponibilidad } from "../componentes/etiquetaDisponibilidad.js";
import { crearGaleriaProducto } from "../componentes/galeriaProducto.js";
import { crearMensaje, TEXTO_ERROR_GENERICO } from "../componentes/mensaje.js";
import { crearSelectorCantidad } from "../componentes/selectorCantidad.js";
import { crearSelectorVariante } from "../componentes/selectorVariante.js";

const LARGO_DESCRIPCION_META = 155;
const CANTIDAD_INICIAL = 1;

const slug = new URLSearchParams(window.location.search).get("slug") ?? "";
const botonAgregar = document.getElementById("boton-agregar");
const contenedorCantidad = document.getElementById("selector-cantidad");
const avisosAgregar = document.getElementById("avisos-agregar");

let productoActual = null;
let varianteActual = null;
let selectorCantidad = null;

iniciarEncabezado();
botonAgregar.addEventListener("click", agregarVariante);
cargarProducto();

async function cargarProducto() {
  if (!slug) {
    mostrarNoEncontrado();
    return;
  }

  try {
    const producto = await obtenerProductoPorSlug(slug);
    if (producto) {
      mostrarProducto(producto);
    } else {
      mostrarNoEncontrado();
    }
  } catch {
    document
      .getElementById("avisos-producto")
      .replaceChildren(crearMensaje("error", TEXTO_ERROR_GENERICO));
  }
}

// Título, descripción y dirección canónica con los datos del producto
// (CA05, 09-SEO.md). En el HTML, la canónica apunta al catálogo.
function actualizarMetadatos(producto) {
  document.title = `${producto.nombre} | Urban Style`;
  document
    .querySelector('meta[name="description"]')
    .setAttribute("content", producto.descripcion.slice(0, LARGO_DESCRIPCION_META));
  document
    .querySelector('link[rel="canonical"]')
    .setAttribute(
      "href",
      `${window.location.origin}/producto.html?slug=${encodeURIComponent(producto.slug)}`
    );
}

function mostrarProducto(producto) {
  productoActual = producto;
  actualizarMetadatos(producto);

  document.getElementById("producto-nombre").textContent = producto.nombre;
  document.getElementById("producto-precio").textContent = formatearPrecio(producto.precio);
  document
    .getElementById("producto-disponibilidad")
    .replaceChildren(crearEtiquetaDisponibilidad(producto.stockTotal));
  document.getElementById("producto-descripcion").textContent = producto.descripcion;
  document.getElementById("galeria").replaceChildren(crearGaleriaProducto(producto.imagenes));

  const selector = crearSelectorVariante(producto.variantes, alCambiarVariante);
  document.getElementById("selector-variante").replaceChildren(selector.elemento);
  alCambiarVariante(selector.obtenerEleccion());

  document.getElementById("producto").hidden = false;
}

// Stock de la combinación, cantidad y botón "Agregar al carrito" (CA12 a CA14).
function alCambiarVariante({ talle, color, variante }) {
  const stock = document.getElementById("stock-combinacion");
  const hayCombinacion = talle !== null && color !== null;
  const hayStock = Boolean(variante) && variante.stock > 0;

  varianteActual = hayStock ? variante : null;
  avisosAgregar.replaceChildren();
  stock.textContent = hayCombinacion ? textoStock(variante ? variante.stock : 0) : "";
  botonAgregar.disabled = !hayStock;

  // La cantidad aparece en 1 al elegir una combinación con stock.
  if (hayStock) {
    selectorCantidad = crearSelectorCantidad({
      cantidad: CANTIDAD_INICIAL,
      maximo: obtenerCantidadMaxima(variante.stock),
    });
    contenedorCantidad.replaceChildren(selectorCantidad.elemento);
  } else {
    selectorCantidad = null;
    contenedorCantidad.replaceChildren();
  }
}

// Suma la variante al carrito sin pasar del máximo (CA18, CA19, CA38).
function agregarVariante() {
  if (!varianteActual || !selectorCantidad) {
    return;
  }

  const { carrito, resultado } = agregarAlCarrito(
    leerCarrito(),
    varianteActual.id,
    selectorCantidad.obtenerCantidad(),
    obtenerCantidadMaxima(varianteActual.stock)
  );

  if (resultado === "completo") {
    avisosAgregar.replaceChildren(
      crearMensaje("error", "Ya tenés en tu carrito todas las unidades disponibles de este talle.")
    );
    return;
  }

  guardarCarrito(carrito);
  actualizarContadorCarrito();
  avisosAgregar.replaceChildren(
    crearMensaje("confirmacion", `¡Listo! Sumaste ${productoActual.nombre} a tu carrito.`)
  );
}

// Producto inexistente o dado de baja: "No encontrado" y noindex (CA07).
function mostrarNoEncontrado() {
  const noIndexar = document.createElement("meta");
  noIndexar.name = "robots";
  noIndexar.content = "noindex";
  document.head.append(noIndexar);

  document.title = "Página no encontrada | Urban Style";
  document.getElementById("no-encontrado").hidden = false;
}
