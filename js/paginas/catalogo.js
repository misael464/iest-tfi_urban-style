// js/paginas/catalogo.js
import { armarParametros, crearFiltrosVacios, leerFiltros } from "../lib/filtros.js";
import { textoCantidadProductos } from "../lib/formato.js";
import { buscarProductos, obtenerCategorias, obtenerTallesYColores } from "../lib/productos.js";
import { iniciarEncabezado } from "../componentes/encabezado.js";
import { crearEstadoVacio } from "../componentes/estadoVacio.js";
import { crearFiltrosCatalogo } from "../componentes/filtrosCatalogo.js";
import { crearGrillaProductos } from "../componentes/grillaProductos.js";
import { crearMensaje, TEXTO_ERROR_GENERICO } from "../componentes/mensaje.js";

const cantidad = document.getElementById("cantidad-resultados");
const avisos = document.getElementById("avisos-catalogo");
const grilla = document.getElementById("grilla-catalogo");
const buscador = document.getElementById("buscador");
const campoBuscar = document.getElementById("campo-buscar");
const contenedorFiltros = document.getElementById("filtros");
const botonFiltrar = document.querySelector("[data-boton-filtrar]");

// Los filtros salen de la dirección, así una dirección compartida se abre igual (CA23).
const filtros = leerFiltros(new URLSearchParams(window.location.search));
let opcionesDeFiltro = null;
let numeroDeBusqueda = 0;

iniciarEncabezado();
iniciarBotonFiltrar();
campoBuscar.value = filtros.buscar;
buscador.addEventListener("submit", alBuscar);
cargarOpcionesDeFiltro();
cargarProductos();

// Enter en el campo y el botón "Buscar" disparan el mismo submit (CA16).
function alBuscar(evento) {
  evento.preventDefault();
  filtros.buscar = campoBuscar.value.trim();
  aplicarFiltros();
}

function alCambiarFiltros(elegidos) {
  Object.assign(filtros, elegidos);
  aplicarFiltros();
}

// Borra la búsqueda y todos los filtros (CA24).
function limpiarFiltros() {
  Object.assign(filtros, crearFiltrosVacios());
  campoBuscar.value = "";
  mostrarFiltros();
  aplicarFiltros();
  // Al rearmar los filtros, el foco vuelve al botón nuevo.
  contenedorFiltros.querySelector("[data-boton-limpiar]")?.focus();
}

// Guarda los filtros en la dirección (CA18, CA22) y vuelve a buscar.
function aplicarFiltros() {
  const parametros = armarParametros(filtros).toString();
  const direccion = parametros ? `${window.location.pathname}?${parametros}` : window.location.pathname;
  window.history.replaceState(null, "", direccion);
  cargarProductos();
}

// En celular y tableta, el botón "Filtrar" abre y cierra los filtros (CA25).
function iniciarBotonFiltrar() {
  botonFiltrar.hidden = false;
  botonFiltrar.addEventListener("click", () => {
    const estanAbiertos = botonFiltrar.getAttribute("aria-expanded") === "true";
    botonFiltrar.setAttribute("aria-expanded", String(!estanAbiertos));
  });
}

async function cargarOpcionesDeFiltro() {
  try {
    const [categorias, { talles, colores }] = await Promise.all([
      obtenerCategorias(),
      obtenerTallesYColores(),
    ]);
    opcionesDeFiltro = { categorias, talles, colores };
    mostrarFiltros();
  } catch {
    avisos.append(crearMensaje("error", TEXTO_ERROR_GENERICO));
  }
}

function mostrarFiltros() {
  if (!opcionesDeFiltro) {
    return;
  }
  contenedorFiltros.replaceChildren(
    crearFiltrosCatalogo(opcionesDeFiltro, filtros, {
      alCambiar: alCambiarFiltros,
      alLimpiar: limpiarFiltros,
    })
  );
}

// Si se cambian los filtros muy rápido, solo se muestra la última respuesta.
async function cargarProductos() {
  numeroDeBusqueda += 1;
  const estaBusqueda = numeroDeBusqueda;
  avisos.replaceChildren();

  try {
    const productos = await buscarProductos(filtros);
    if (estaBusqueda === numeroDeBusqueda) {
      mostrarProductos(productos);
    }
  } catch {
    if (estaBusqueda === numeroDeBusqueda) {
      mostrarErrorDeProductos();
    }
  }
}

function mostrarProductos(productos) {
  cantidad.textContent = textoCantidadProductos(productos.length);

  // Sin resultados: mensaje y botón para limpiar (CA27).
  if (productos.length === 0) {
    grilla.replaceChildren(
      crearEstadoVacio({
        texto: "No encontramos prendas con esos filtros.",
        textoBoton: "Limpiar filtros",
        alTocar: limpiarFiltros,
      })
    );
    return;
  }

  grilla.replaceChildren(crearGrillaProductos(productos));
}

// No se muestra el error de Supabase, solo el texto genérico (CA15).
function mostrarErrorDeProductos() {
  cantidad.textContent = "";
  grilla.replaceChildren();
  avisos.replaceChildren(crearMensaje("error", TEXTO_ERROR_GENERICO));
}
