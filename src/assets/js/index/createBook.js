"use strict"

/**
 * Crear Libro
 */
// Imports
import { updateTable } from "./db.js";

const formCreateBook = document.querySelector("#formCreateBook");
const messageCreateBook = document.querySelector("#messageCreateBook");
const tituloCreateBook = document.querySelector("#tituloCreateBook");
const autorCreateBook = document.querySelector("#autorCreateBook");
const paginasCreateBook = document.querySelector("#paginasCreateBook");
const precioCreateBook = document.querySelector("#precioCreateBook")
const fieldsetCategoria = document.querySelector("#fieldsetCategoriaCreateBook");
const cantidadCreateBook = document.querySelector("#cantidadCreateBook")
const imagenButton = document.querySelector("#imagenButtonCreateBook");
const imagenInput = document.querySelector("#imagenCreateBook");
const descripcionCreateBook = document.querySelector("#descripcionCreateBook");
const searchResultsCreateBook = document.querySelector("#searchResultsCreateBook");
const buttonPlusAuthorCreateBook = document.querySelector("#buttonPlusAuthorCreateBook");
const loaderCategoryCreateBook = document.querySelector("#loaderCategoryCreateBook");
const loaderSearchAuthorCreateBook = document.querySelector("#loaderSearchAuthorCreateBook")
const loaderCreateBook = document.querySelector("#loaderCreateBook");

// Lógica para eliminar cualquier value del autor input
autorCreateBook.addEventListener("click", () => autorCreateBook.value = "");

// Lógica para la búsqueda de autores
let typingTimer;
const typingInterval = 500;
autorCreateBook.addEventListener("input", async (event) => {
    event.preventDefault();
    resetTypingTimer();
})

const fetchAuthors = async (value) => {
    try {
        searchResultsCreateBook.style.display = "flex"
        loaderSearchAuthorCreateBook.style.display = "flex"
        const response = await fetch(`/autores/buscar?apellidos=${value}`);
        const result = await response.json();
        if (response.ok) {
            loaderSearchAuthorCreateBook.style.display = "none"
            renderResults(result);
        } else {
            searchResultsCreateBook.style.display = "none";
        }

    } catch (error) {
        console.log("Error al recibir autores: ", error);
    }
}

const resetTypingTimer = () => {
    clearTimeout(typingTimer); 
    typingTimer = setTimeout(() => {
        const value = autorCreateBook.value;
        if (value) {
            fetchAuthors(value); 
        } else {
            searchResultsCreateBook.style.display = "none";
        }
    }, typingInterval);
};

// Función para renderizar resultados en la búsqueda
function renderResults(Books) {
    searchResultsCreateBook.querySelectorAll("li").forEach(item => item.remove()); // Limpiar resultados previos
    if (Books.length === 0) {
        searchResultsCreateBook.style.display = "none";
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
        li.innerHTML = `${Book.nombre} ${Book.apellidos}`;
        li.id = Book.id;
        searchResultsCreateBook.appendChild(li);
    });

    // Añadir Event Listener a cada autor para poder hacer click
    const AuthorsLis = document.querySelectorAll(".author-result");

    AuthorsLis.forEach((li, index, list) => {
        // Evento de click
        li.addEventListener("click", async (event) => {
            autorCreateBook.dataset.autorId = event.target.id
            autorCreateBook.value = event.target.textContent.trim();
            searchResultsCreateBook.style.display = "none";
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
                    autorCreateBook.focus();
                }
            } else if (event.key === "Enter") {
                event.preventDefault();
                li.click();
            }
        });
    });

    // Pasa del input a la lista de autores con el arrowdown 
    autorCreateBook.addEventListener("keydown", (event) => {
        if (event.key === "ArrowDown") {
            event.preventDefault();
            AuthorsLis[0]?.focus();
        }
    })
};

// Lógica para el botón + de Autores
buttonPlusAuthorCreateBook.addEventListener("click", (e) => {
    e.preventDefault();

    const authorsList = document.querySelectorAll(".autorPlus");
    
    for (const div of authorsList) {
        if (autorCreateBook.dataset.autorId == div.id) {
            console.log("SAME");
            return; // Sale de la función si se encuentra una coincidencia
        }
    }

    if (autorCreateBook.dataset.autorId !== undefined && autorCreateBook.dataset.autorId !== "") {
        console.log(autorCreateBook.dataset.autorId);

        const newDiv = document.createElement("div");
        newDiv.id = autorCreateBook.dataset.autorId;
        newDiv.className = "autorPlus"

        const newP = document.createElement("p");
        newP.className = "pAuthors"
        newP.textContent = "Autor: " + autorCreateBook.value;

        const buttonRemove = document.createElement("div");
        buttonRemove.className = "buttonRemove";
        buttonRemove.textContent = "-";

        buttonRemove.addEventListener("click", () => newDiv.remove());

        newDiv.appendChild(newP);
        newDiv.appendChild(buttonRemove);

        // Agregar el nuevo bloque al contenedor
        searchResultsCreateBook.insertAdjacentElement("afterend", newDiv);
        autorCreateBook.value = "";
        autorCreateBook.dataset.autorId = "";
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
                label.innerHTML = `<input type="checkbox" name="categoria" value="${categoria.id}">
                ${categoria.categoria} &nbsp&nbsp`;
                fieldsetCategoria.appendChild(label);
            });
            loaderCategoryCreateBook.style.display = "none";
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
imagenInput.addEventListener("change", (event) => {
    const file = event.target.files[0];

    if (file) {
        imagenButton.textContent = "Archivo subido: " + file.name;
        imagenButton.style.backgroundColor = "#C8E1CD";
    } else {
        imagenButton.innerHTML = "Seleccionar Imagen";
        imagenButton.style.backgroundColor = "#eaeaea";
    }
});

// Lógica para el envio de datos al Servidor API una vez se ennvia el formulario
formCreateBook.addEventListener("submit", async (event) => {
    event.preventDefault();
    loaderCreateBook.style.display = "flex";

    if (imagenInput.files.length === 0) {
        imagenButton.classList.add("noImage");
        setTimeout(() => {
            imagenButton.classList.remove("noImage")
        }, 3000)
    }

    const formData = new FormData();

    const titulo = tituloCreateBook.value
    const descripcion = descripcionCreateBook.value;
    let precio = precioCreateBook.value
    const cantidad = cantidadCreateBook.value
    const paginas = paginasCreateBook.value
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
            if (autorCreateBook.value !== "") {
                await fetch(`
                    libros/autor?libro=${resultBook[0].id}&autor=${autorCreateBook.dataset.autorId}
                `, { method: "POST" });
            };

            if (addedAuthors) {
                addedAuthors.forEach(async (div) => {
                    await fetch(`
                        libros/autor?libro=${resultBook[0].id}&autor=${div.id}
                    `, { method: "POST" });
                })
            };

            const fieldsetCategoriaChecks = document.querySelectorAll("#fieldsetCategoriaCreateBook input[type='checkbox']");
            fieldsetCategoriaChecks.forEach(async (input) => {
                if (input.checked) {
                    await fetch(`
                        libros/categoria?libro=${resultBook[0].id}&categoria=${input.value}
                    `, { method: "POST" })
                }
            });
        }

        if (responseBook.ok) {
            console.log("Libro creado con éxito");
            messageCreateBook.style.color = "rgb(63 135 77)";
            messageCreateBook.textContent = "Libro creado con éxito"
            imagenButton.innerHTML = "Seleccionar Imagen";
            imagenButton.style.backgroundColor = "#eaeaea";
            autorCreateBook.dataset.autorId = ""
            addedAuthors.forEach(div => div.remove());
            formCreateBook.reset();
            loaderCreateBook.style.display = "none";
            updateTable();
            setTimeout(() => {
                messageCreateBook.style.display = "none";
            }, 3000);
        } else {
            console.log("Error al crear autor");
            messageCreateBook.style.color = "rgb(135 63 63)";
            messageCreateBook.textContent = "Error al Createificar Autor"
        }

    } catch (error) {
        console.error('Error al enviar el formulario:', error);
    }
});

// Cierra el div de los autores al hacer click fuera de él
document.addEventListener("click", (event) => {
    if (!searchResultsCreateBook.contains(event.target)) {
        searchResultsCreateBook.style.display = "none";
    }
});