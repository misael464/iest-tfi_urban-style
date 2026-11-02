// js/lib/productos.js
// Lecturas del catálogo. La RLS ya devuelve solo lo activo (05-DATOS.md).
import { supabase } from "./supabase.js";

const CANTIDAD_DESTACADOS = 8;

// No se propaga el mensaje de Supabase: la página muestra un texto propio (P4).
function comprobarError(error) {
  if (error) {
    throw new Error("No se pudo leer el catálogo.");
  }
}

// Convierte una fila de buscar_productos al objeto que usan los componentes.
function normalizarResultado(fila) {
  return {
    id: fila.id,
    nombre: fila.nombre,
    slug: fila.slug,
    precio: Number(fila.precio),
    stockTotal: Number(fila.stock_total),
    imagen: fila.imagen,
    textoAlternativo: fila.texto_alternativo ?? "",
  };
}

// Calcula el stock total y elige la primera foto, porque esta lectura no
// pasa por buscar_productos.
function normalizarDestacado(producto) {
  const [primeraImagen] = [...producto.producto_imagenes].sort((a, b) => a.orden - b.orden);
  const stockTotal = producto.variantes.reduce((suma, variante) => suma + variante.stock, 0);

  return {
    id: producto.id,
    nombre: producto.nombre,
    slug: producto.slug,
    precio: Number(producto.precio),
    stockTotal,
    imagen: primeraImagen ? primeraImagen.ruta : null,
    textoAlternativo: primeraImagen ? primeraImagen.texto_alternativo : "",
  };
}

// Recibe el objeto de js/lib/filtros.js. Los filtros vacíos van como null,
// que buscar_productos interpreta como "sin filtro".
export async function buscarProductos(filtros) {
  const { data, error } = await supabase.rpc("buscar_productos", {
    p_texto: filtros.buscar || null,
    p_categoria: filtros.categoria || null,
    p_talles: filtros.talles.length > 0 ? filtros.talles : null,
    p_colores: filtros.colores.length > 0 ? filtros.colores : null,
    p_solo_con_stock: filtros.soloConStock,
  });
  comprobarError(error);
  return data.map(normalizarResultado);
}

export async function obtenerDestacados() {
  const { data, error } = await supabase
    .from("productos")
    .select("id, nombre, slug, precio, producto_imagenes(ruta, texto_alternativo, orden), variantes(stock)")
    .eq("destacado", true)
    .order("nombre")
    .limit(CANTIDAD_DESTACADOS);
  comprobarError(error);
  return data.map(normalizarDestacado);
}

function ordenarImagenes(imagenes) {
  return [...imagenes]
    .sort((a, b) => a.orden - b.orden)
    .map((imagen) => ({ ruta: imagen.ruta, textoAlternativo: imagen.texto_alternativo }));
}

function normalizarDetalle(producto) {
  const variantes = producto.variantes.map((variante) => ({
    id: variante.id,
    stock: variante.stock,
    talle: variante.talles.nombre,
    ordenTalle: variante.talles.orden,
    color: variante.colores.nombre,
    hex: variante.colores.hex,
  }));

  return {
    id: producto.id,
    nombre: producto.nombre,
    slug: producto.slug,
    precio: Number(producto.precio),
    descripcion: producto.descripcion,
    imagenes: ordenarImagenes(producto.producto_imagenes),
    variantes,
    stockTotal: variantes.reduce((suma, variante) => suma + variante.stock, 0),
  };
}

// Devuelve null si el producto no existe, está dado de baja o su categoría
// está desactivada: la RLS no lo devuelve (CA07).
export async function obtenerProductoPorSlug(slug) {
  const { data, error } = await supabase
    .from("productos")
    .select(
      "id, nombre, slug, precio, descripcion, producto_imagenes(ruta, texto_alternativo, orden), variantes(id, stock, talles(nombre, orden), colores(nombre, hex))"
    )
    .eq("slug", slug)
    .maybeSingle();
  comprobarError(error);
  return data ? normalizarDetalle(data) : null;
}

// Lee nombre, precio y stock actuales de las variantes del carrito (CA23).
// Una variante que no vuelve, o vuelve sin producto, no está a la venta (CA26).
export async function obtenerVariantesDelCarrito(ids) {
  if (ids.length === 0) {
    return [];
  }

  const { data, error } = await supabase
    .from("variantes")
    .select(
      "id, stock, productos(nombre, slug, precio, producto_imagenes(ruta, texto_alternativo, orden)), talles(nombre), colores(nombre)"
    )
    .in("id", ids);
  comprobarError(error);

  return data
    .filter((variante) => variante.productos)
    .map((variante) => {
      const [primeraImagen] = ordenarImagenes(variante.productos.producto_imagenes);
      return {
        varianteId: variante.id,
        stock: variante.stock,
        nombre: variante.productos.nombre,
        slug: variante.productos.slug,
        precio: Number(variante.productos.precio),
        imagen: primeraImagen ? primeraImagen.ruta : null,
        textoAlternativo: primeraImagen ? primeraImagen.textoAlternativo : "",
        talle: variante.talles.nombre,
        color: variante.colores.nombre,
      };
    });
}

export async function obtenerCategorias() {
  const { data, error } = await supabase
    .from("categorias")
    .select("nombre, slug")
    .order("orden");
  comprobarError(error);
  return data;
}

export async function obtenerTallesYColores() {
  const [respuestaTalles, respuestaColores] = await Promise.all([
    supabase.from("talles").select("nombre").order("orden"),
    supabase.from("colores").select("nombre, hex").order("nombre"),
  ]);
  comprobarError(respuestaTalles.error);
  comprobarError(respuestaColores.error);
  return { talles: respuestaTalles.data, colores: respuestaColores.data };
}
