// js/paginas/inicio.js
import { obtenerCategorias, obtenerDestacados } from "../lib/productos.js";
import { iniciarEncabezado } from "../componentes/encabezado.js";
import { crearGrillaProductos } from "../componentes/grillaProductos.js";
import { crearMensaje, TEXTO_ERROR_GENERICO } from "../componentes/mensaje.js";

iniciarEncabezado();
cargarInicio();

async function cargarInicio() {
  try {
    const [destacados, categorias] = await Promise.all([
      obtenerDestacados(),
      obtenerCategorias(),
    ]);
    mostrarDestacados(destacados);
    mostrarCategorias(categorias);
  } catch {
    mostrarError();
  }
}

// Sin destacados, la sección queda oculta (CA04).
function mostrarDestacados(destacados) {
  if (destacados.length === 0) {
    return;
  }
  document.getElementById("destacados").append(crearGrillaProductos(destacados));
  document.getElementById("seccion-destacados").hidden = false;
}

function mostrarCategorias(categorias) {
  const lista = document.getElementById("categorias");

  categorias.forEach((categoria) => {
    const enlace = document.createElement("a");
    enlace.className = "inicio-categoria";
    enlace.href = `/catalogo.html?categoria=${encodeURIComponent(categoria.slug)}`;
    enlace.textContent = categoria.nombre;

    const item = document.createElement("li");
    item.append(enlace);
    lista.append(item);
  });
}

function mostrarError() {
  document.getElementById("avisos-inicio").append(crearMensaje("error", TEXTO_ERROR_GENERICO));
}
