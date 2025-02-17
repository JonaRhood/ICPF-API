"use strict"

/**
 * Crear Libro
 */

const formModBook = document.querySelector("#formModBook");
const messageModBook = document.querySelector("#messageModBook");
const tituloModBook = document.querySelector("#tituloModBook");
const autorModBook = document.querySelector("#autorModBook");
const paginasModBook = document.querySelector("#paginasModBook");
const precioModBook = document.querySelector("#precioModBook")
const categoriaModBook = document.querySelector("#categoriaModBook")
const fieldsetCategoria = document.querySelector("#fieldsetCategoriaModBook");
const cantidadModBook = document.querySelector("#cantidadModBook")
const imagenButton = document.querySelector("#imagenButtonModBook");
const imagenInput = document.querySelector("#imagenModBook");
const descripcionModBook = document.querySelector("#descripcionModBook");
const searchResultsTitleModBook = document.querySelector("#searchResultsTitleModBook");
const searchResultsModBook = document.querySelector("#searchResultsModBook");
const buttonPlusAuthorModBook = document.querySelector("#buttonPlusAuthorModBook");

// Lógica para la búsqueda de libros
tituloModBook.addEventListener("input", async (event) => {
    event.preventDefault();

    const value = event.target.value;

    try {
        const response = await fetch(`/libros/buscar?titulo=${value}`);
        const result = await response.json();
        if (response.ok) {
            searchResultsTitleModBook.style.display = "flex"
            renderResults(result);
        } else {
            searchResultsTitleModBook.style.display = "none";
        }

    } catch (error) {
        console.log("Error al recibir autores: ", error);
    }
})

// Lógica para eliminar cualquier value del autor input
autorModBook.addEventListener("click", () => autorModBook.value = "");

// Lógica para la búsqueda de autores
autorModBook.addEventListener("input", async (event) => {
    event.preventDefault();


    const value = event.target.value;

    try {
        const response = await fetch(`/autores/buscar?apellidos=${value}`);
        const result = await response.json();
        if (response.ok) {
            searchResultsModBook.style.display = "flex"
            renderResults(result);
        } else {
            searchResultsModBook.style.display = "none";
        }

    } catch (error) {
        console.log("Error al recibir autores: ", error);
    }
})

// Función para renderizar resultados en la búsqueda
function renderResults(Books) {
    searchResultsTitleModBook.innerHTML = ""; // Limpiar resultados previos
    if (Books.length === 0) {
        searchResultsTitleModBook.style.display = "none";
        return;
    }

    Books.forEach((Book, index) => {
        const li = document.createElement("li");
        li.tabIndex = "0";
        li.classList.add("author-result");
        if (index % 2 == 0) {
            li.style.backgroundColor = 'white';
        } else {
            li.style.backgroundColor = 'rgb(241 239 239)';
        }
        li.innerHTML = `${Book.titulo}`;
        li.id = Book.id;
        searchResultsTitleModBook.appendChild(li);
    });

    // Añadir Event Listener a cada autor para poder hacer click
    const AuthorsLis = document.querySelectorAll(".author-result");

    AuthorsLis.forEach((li, index, list) => {
        // Evento de click
        li.addEventListener("click", async (event) => {
            autorModBook.dataset.autorId = event.target.id
            autorModBook.value = event.target.textContent.trim();
            searchResultsTitleModBook.style.display = "none";
        });

        // Evento de keydown para ENTER y Arrows en la lista de autores
        li.addEventListener("keydown", (event) => {
            if (event.key === "ArrowDown") {
                event.preventDefault();
                list[index + 1]?.focus();
            } else if (event.key === "ArrowUp") {
                event.preventDefault();
                list[index - 1]?.focus();
                if (index === 0) {
                    autorModBook.focus();
                }
            } else if (event.key === "Enter") {
                event.preventDefault();
                li.click();
            }
        });
    });

    // Pasa del input a la lista de autores con el arrowdown 
    autorModBook.addEventListener("keydown", (event) => {
        if (event.key === "ArrowDown") {
            event.preventDefault();
            AuthorsLis[0]?.focus();
        }
    })
};

// Lógica para el botón + de Autores
buttonPlusAuthorModBook.addEventListener("click", (e) => {
    if (autorModBook.dataset.autorId !== undefined && autorModBook.dataset.autorId !== "") {
        console.log(autorModBook.dataset.autorId);
        e.preventDefault();
    
        const newDiv = document.createElement("div");
        newDiv.id = autorModBook.dataset.autorId;
        newDiv.className = "autorPlus"
    
        const newP = document.createElement("p");
        newP.className = "pAuthors"
        newP.textContent = "Autor: " + autorModBook.value;
    
        const buttonRemove = document.createElement("div");
        buttonRemove.className = "buttonRemove";
        buttonRemove.textContent = "-";
    
        buttonRemove.addEventListener("click", () => newDiv.remove());
    
        newDiv.appendChild(newP);
        newDiv.appendChild(buttonRemove);
    
        // Agregar el nuevo bloque al contenedor
        searchResultsModBook.insertAdjacentElement("afterend", newDiv);
        autorModBook.value = "";
        autorModBook.dataset.autorId = "";
    }
});

// Lógica para crear el fieldset de Categorías
document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch("/categorias");
        const categorias = await response.json();

        if (response.ok) {
            categorias.forEach(categoria => {
                const label = document.createElement("label");
                label.innerHTML = `<input type="checkbox" name="categoria" disabled value="${categoria.id}">
                ${categoria.categoria} &nbsp&nbsp`;
                fieldsetCategoria.appendChild(label);
            });
        }
    } catch (error) {
        console.error("Error al cargar categorias:", error)
    }
});

// Lógica para el botón del Hidden Input para la imagen
imagenButton.addEventListener("click", () => {
    imagenInput.click();
});

// Lógica para la subida de Imagen en el Cliente
let imageChanged = false;

imagenInput.addEventListener("change", (event) => {
    const file = event.target.files[0];

    if (file) {
        imagenButton.textContent = "Archivo subido: " + file.name;
        imagenButton.style.backgroundColor = "#C8E1CD";
        imageVisualization.src = "";
        imageChanged = true;
    } else {
        imagenButton.innerHTML = "Seleccionar Imagen";
        imagenButton.style.backgroundColor = "#eaeaea";
    }
});

// Lógica para el envio de datos al Servidor API una vez se ennvia el formulario
formModBook.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (imagenInput.files.length === 0) {
        imagenButton.classList.add("noImage");
        setTimeout(() => {
            imagenButton.classList.remove("noImage")
        }, 3000)
    }

    const formData = new FormData();

    const titulo = tituloModBook.value
    const descripcion = descripcionModBook.value;
    const precio = precioModBook.value
    const cantidad = cantidadModBook.value
    const paginas = paginasModBook.value
    const imagen = imagenInput.files[0];

    const addedAuthors = document.querySelectorAll(".autorPlus");
    
    if (precio.includes(",")) {
        precio = precio.replace(",", ".");
    }
        
    formData.append("titulo", titulo);
    formData.append("descripcion", descripcion);
    formData.append("precio", precio);
    formData.append("cantidad", cantidad);
    formData.append("paginas", paginas);
    formData.append("imagen", imagen);



    try {
        //  Fetch para subir nuevo libro
        const responseBook = await fetch(`/libros`, {
            method: "POST",
            body: formData
        });
        const resultBook = await responseBook.json()

        // Fetch para asignar autores y categorias al nuevo libro
        if (responseBook.ok) {
            if (autorModBook.value !== "") {
                const responseAuthors = await fetch(`
                    libros/autor?libro=${resultBook[0].id}&autor=${autorModBook.dataset.autorId}
                `, { method: "POST" });
            };
           
            if (addedAuthors) {
                addedAuthors.forEach(async (div) => {              
                    const responseAddedAuthors = await fetch(`
                        libros/autor?libro=${resultBook[0].id}&autor=${div.id}
                    `, { method: "POST" });
                })
            };

            const fieldsetCategoriaChecks = document.querySelectorAll("#fieldsetCategoriaModBook input[type='checkbox']");
            fieldsetCategoriaChecks.forEach(async (input) => {
                if (input.checked) {
                    const responseCategories = await fetch(`
                        libros/categoria?libro=${resultBook[0].id}&categoria=${input.value}
                    `, { method: "POST" })
                }
            });
        }

        if (responseBook.ok) {
            console.log("Libro creado con éxito");
            messageModBook.style.color = "rgb(63 135 77)";
            messageModBook.textContent = "Libro creado con éxito"
            imagenButton.innerHTML = "Seleccionar Imagen";
            imagenButton.style.backgroundColor = "#eaeaea";
            autorModBook.dataset.autorId = ""
            formModBook.reset();
            setTimeout(() => {
                messageModBook.style.display = "none";
            }, 3000);
        } else {
            console.log("Error al crear autor");
            messageModBook.style.color = "rgb(135 63 63)";
            messageModBook.textContent = "Error al Modificar Autor"
        }

    } catch (error) {
        console.error('Error al enviar el formulario:', error);
    }
});

// Cierra el div de los autores al hacer click fuera de él
document.addEventListener("click", (event) => {
    if (!searchResultsModBook.contains(event.target)) {
        searchResultsModBook.style.display = "none";
    }
});