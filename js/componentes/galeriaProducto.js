// js/componentes/galeriaProducto.js
// Foto principal grande y, si hay más de una, miniaturas que la cambian (CA02, CA34).

const ANCHO_FOTO = 600;
const ALTO_FOTO = 750;

function crearSinFoto() {
  const sinFoto = document.createElement("div");
  sinFoto.className = "galeria-producto-sin-foto";
  sinFoto.textContent = "Sin foto";
  return sinFoto;
}

// Pone la foto en el marco. Si no carga, muestra "Sin foto" en su lugar.
function mostrarFoto(marco, imagen) {
  const foto = document.createElement("img");
  foto.className = "galeria-producto-principal";
  foto.src = imagen.ruta;
  foto.alt = imagen.textoAlternativo;
  foto.width = ANCHO_FOTO;
  foto.height = ALTO_FOTO;
  foto.addEventListener("error", () => foto.replaceWith(crearSinFoto()), { once: true });
  marco.replaceChildren(foto);
}

function crearMiniaturas(imagenes, marco) {
  const lista = document.createElement("ul");
  lista.className = "galeria-producto-miniaturas";

  const botones = imagenes.map((imagen, indice) => {
    const boton = document.createElement("button");
    boton.className = "galeria-producto-miniatura";
    boton.type = "button";
    boton.setAttribute("aria-pressed", String(indice === 0));

    const miniatura = document.createElement("img");
    miniatura.src = imagen.ruta;
    miniatura.alt = imagen.textoAlternativo;
    miniatura.loading = "lazy";
    boton.append(miniatura);

    boton.addEventListener("click", () => {
      mostrarFoto(marco, imagen);
      botones.forEach((otro) => otro.setAttribute("aria-pressed", String(otro === boton)));
    });

    const item = document.createElement("li");
    item.append(boton);
    lista.append(item);
    return boton;
  });

  return lista;
}

export function crearGaleriaProducto(imagenes) {
  const galeria = document.createElement("div");
  galeria.className = "galeria-producto";

  const marco = document.createElement("div");
  marco.className = "galeria-producto-marco";
  galeria.append(marco);

  if (imagenes.length === 0) {
    marco.append(crearSinFoto());
    return galeria;
  }

  mostrarFoto(marco, imagenes[0]);
  if (imagenes.length > 1) {
    galeria.append(crearMiniaturas(imagenes, marco));
  }
  return galeria;
}
