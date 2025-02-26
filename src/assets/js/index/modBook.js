"use strict"

/**
 * Crear Libro
 */
// Imports
import { updateTable } from "./db.js";

// Asignaciones DOM
const formModBook = document.querySelector("#formModBook");
const messageModBook = document.querySelector("#messageModBook");
const tituloModBook = document.querySelector("#tituloModBook");
const autorModBook = document.querySelector("#autorModBook");
const paginasModBook = document.querySelector("#paginasModBook");
const precioModBook = document.querySelector("#precioModBook")
const fieldsetCategoria = document.querySelector("#fieldsetCategoriaModBook");
const cantidadModBook = document.querySelector("#cantidadModBook")
const imagenButton = document.querySelector("#imagenButtonModBook");
const imagenInput = document.querySelector("#imagenModBook");
const imageVisualizationModBook = document.querySelector("#imageVisualizationModBook");
const descripcionModBook = document.querySelector("#descripcionModBook");
const searchResultsTitleModBook = document.querySelector("#searchResultsTitleModBook");
const searchResultsModBook = document.querySelector("#searchResultsModBook");
const buttonPlusAuthorModBook = document.querySelector("#buttonPlusAuthorModBook");
const loaderCategoryModBook = document.querySelector("#loaderCategoryModBook");
const loaderSearchBookModBook = document.querySelector("#loaderSearchBookModBook");
const loaderSearchAuthorModBook = document.querySelector("#loaderSearchAuthorModBook");
const loaderModBook = document.querySelector("#loaderModBook");

let listAuthors = [];

// Lógica para la búsqueda de libros
let typingTimer;
const typingInterval = 500;
tituloModBook.addEventListener("input", async (event) => {
    event.preventDefault();
    resetTypingTimerBooks();
})

const fetchBooks = async (value) => {
    try {
        searchResultsTitleModBook.style.display = "flex"
        loaderSearchBookModBook.style.display = "flex"
        const response = await fetch(`/libros/buscar?titulo=${value}`);
        const result = await response.json();
        if (response.ok) {
            renderBookResults(result);
            loaderSearchBookModBook.style.display = "none"
        } else {
            searchResultsTitleModBook.style.display = "none";
        }

    } catch (error) {
        console.log("Error al recibir autores: ", error);
    }
}

const resetTypingTimerBooks = () => {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
        const value = tituloModBook.value;
        if (value) {
            fetchBooks(value);
        } else {
            searchResultsTitleModBook.style.display = "none";
        }
    }, typingInterval);
};

// Lógica para eliminar cualquier value del autor y del book input
autorModBook.addEventListener("click", () => autorModBook.value = "");
tituloModBook.addEventListener("click", () => tituloModBook.value = "");

// Lógica para la búsqueda de autores
autorModBook.addEventListener("input", async (event) => {
    event.preventDefault();
    resetTypingTimerAuthors()
})

const fetchAuthors = async (value) => {
    try {
        searchResultsModBook.style.display = "flex"
        loaderSearchAuthorModBook.style.display = "flex"
        const response = await fetch(`/autores/buscar?apellidos=${value}`);
        const result = await response.json();
        if (response.ok) {
            renderAuthorResults(result);
            loaderSearchAuthorModBook.style.display = "none"
        } else {
            searchResultsModBook.style.display = "none";
        }

    } catch (error) {
        console.log("Error al recibir autores: ", error);
    }
}


const resetTypingTimerAuthors = () => {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
        const value = autorModBook.value;
        if (value) {
            fetchAuthors(value);
        } else {
            searchResultsModBook.style.display = "none";
        }
    }, typingInterval);
};

// Función para renderizar resultados en la búsqueda
function renderBookResults(Books) {
    searchResultsTitleModBook.querySelectorAll("li").forEach(item => item.remove()); // Limpiar resultados previos
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
    const booksLis = document.querySelectorAll(".author-result");

    booksLis.forEach((li, index, list) => {
        // Evento de click
        li.addEventListener("click", async (event) => {
            tituloModBook.dataset.libroId = event.target.id
            await fetchBookDetails(event.target.id);
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
                    tituloModBook.focus();
                }
            } else if (event.key === "Enter") {
                event.preventDefault();
                li.click();
            }
        });
    });


    // Pasa del input a la lista de autores con el arrowdown 
    tituloModBook.addEventListener("keydown", (event) => {
        if (event.key === "ArrowDown") {
            event.preventDefault();
            booksLis[0]?.focus();
        }
    })

    // Al hacer click a un Libro, hace un request al API usando su id y rellena el formulario
    const fetchBookDetails = async (bookId) => {
        const categorias = document.querySelectorAll(".categoriaModBook");
        const autores = document.querySelectorAll(".autorPlusModBook");
        try {
            const response = await fetch(`/libros/${bookId}`);
            const result = await response.json();

            if (response.ok) {
                listAuthors = [];
                searchResultsTitleModBook.style.display = "none";
                tituloModBook.disabled = false;
                autorModBook.disabled = false;
                autores.forEach(autor => autor.remove());
                paginasModBook.disabled = false
                cantidadModBook.disabled = false
                precioModBook.disabled = false
                categorias.forEach(input => {
                    input.disabled = false;
                    input.checked = false;
                });

                imagenButton.style.color = "black";
                imagenButton.style.backgroundColor = "#eaeaea";
                imagenInput.disabled = false;
                descripcionModBook.disabled = false;

                tituloModBook.value = result[0].libro_titulo;
                paginasModBook.value = result[0].libro_paginas;
                cantidadModBook.value = result[0].libro_cantidad;
                precioModBook.value = result[0].libro_precio;
                descripcionModBook.value = result[0].libro_descripcion;

                const resultCategory = result[0].categorias;
                categorias.forEach((input) => {
                    resultCategory.forEach((cat) => {
                        if (input.value == cat.id) {
                            input.checked = true;
                        }
                    })
                })

                const resultAuthors = result[0].autores;
                resultAuthors.forEach(author => {
                    if (author.id == null) {
                        return;
                    } else {
                        const newDiv = document.createElement("div");
                        newDiv.id = author.id;
                        newDiv.className = "autorPlusModBook"

                        const newP = document.createElement("p");
                        newP.className = "pAuthors"
                        newP.textContent = "Autor: " + author.nombre + " " + author.apellidos;

                        const buttonRemove = document.createElement("div");
                        buttonRemove.className = "buttonRemove";
                        buttonRemove.textContent = "-";

                        buttonRemove.addEventListener("click", () => {
                            newDiv.remove()
                            listAuthors = listAuthors.filter(author => author != newDiv.id)
                        });

                        newDiv.appendChild(newP);
                        newDiv.appendChild(buttonRemove);

                        // Agregar el nuevo bloque al contenedor
                        searchResultsModBook.insertAdjacentElement("afterend", newDiv);
                        autorModBook.value = "";
                        autorModBook.dataset.autorId = "";

                        listAuthors.push(author.id);
                    }
                })

                imagenButton.addEventListener("mouseover", () => imageVisualizationModBook.style.display = "flex");
                imagenButton.addEventListener("mouseout", () => imageVisualizationModBook.style.display = "none");
                imageVisualizationModBook.src = result[0].libro_imagen;

                imagenButton.innerHTML = "Cambiar Imagen<br>(Previsualizar al pasar el ratón)"

            }
        } catch (error) {
            console.log("Error al recibir autor: ", error);
        }
    };
};

// Función para renderizar resultados en la búsqueda
function renderAuthorResults(Books) {
    searchResultsModBook.querySelectorAll("li").forEach(item => item.remove()); // Limpiar resultados previos
    if (Books.length === 0) {
        searchResultsModBook.style.display = "none";
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
        searchResultsModBook.appendChild(li);
    });

    // Añadir Event Listener a cada autor para poder hacer click
    const AuthorsLis = document.querySelectorAll(".author-result");

    AuthorsLis.forEach((li, index, list) => {
        // Evento de click
        li.addEventListener("click", async (event) => {
            autorModBook.dataset.autorId = event.target.id
            autorModBook.value = event.target.textContent.trim();
            searchResultsModBook.style.display = "none";
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
    e.preventDefault();

    const authorsList = document.querySelectorAll(".autorPlusModBook");

    for (const div of authorsList) {
        if (autorModBook.dataset.autorId == div.id) {
            console.log("SAME");
            return; // Sale de la función si se encuentra una coincidencia
        }
    }

    if (autorModBook.dataset.autorId !== undefined && autorModBook.dataset.autorId !== "") {

        const newDiv = document.createElement("div");
        newDiv.id = autorModBook.dataset.autorId;
        newDiv.className = "autorPlusModBook"

        const newP = document.createElement("p");
        newP.className = "pAuthors"
        newP.textContent = "Autor: " + autorModBook.value;

        const buttonRemove = document.createElement("div");
        buttonRemove.className = "buttonRemove";
        buttonRemove.textContent = "-";

        buttonRemove.addEventListener("click", () => {
            newDiv.remove();
            listAuthors = listAuthors.filter(author => author != newDiv.id)
        });

        newDiv.appendChild(newP);
        newDiv.appendChild(buttonRemove);

        // Agregar el nuevo bloque al contenedor
        searchResultsModBook.insertAdjacentElement("afterend", newDiv);
        autorModBook.value = "";
        autorModBook.dataset.autorId = "";

        listAuthors.push(Number(newDiv.id));
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
                label.innerHTML = `<input type="checkbox" name="categoria" class="categoriaModBook" disabled value="${categoria.id}">
                ${categoria.categoria} &nbsp&nbsp`;
                fieldsetCategoria.appendChild(label);
            });
            loaderCategoryModBook.style.display = "none";
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
        imageVisualizationModBook.src = "";
        imageChanged = true;
    } else {
        imagenButton.innerHTML = "Seleccionar Imagen";
        imagenButton.style.backgroundColor = "#eaeaea";
    }
});

// Lógica para el envio de datos al Servidor API una vez se ennvia el formulario
formModBook.addEventListener("submit", async (event) => {
    event.preventDefault();
    loaderModBook.style.display = "flex";

    const formData = new FormData();

    const titulo = tituloModBook.value
    const descripcion = descripcionModBook.value;
    let precio = precioModBook.value
    const cantidad = cantidadModBook.value
    const paginas = paginasModBook.value
    const imagen = imagenInput.files[0];
    const categorias = document.querySelectorAll(".categoriaModBook");

    const newAuthors = document.querySelectorAll(".autorPlusModBook");

    if (precio.includes(",")) {
        precio = precio.replace(",", ".");
    }

    const data = {
        titulo,
        descripcion,
        precio,
        cantidad,
        paginas
    }

    formData.append("imagen", imagen);

    try {
        const libroId = tituloModBook.dataset.libroId;

        //  Fetch para actualizar el libro
        const updateBook = await fetch(`/libros/${libroId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (imageChanged) {
            const updateImage = await fetch(`/libros/${libroId}/imagen`, {
                method: "PUT",
                body: formData
            })
            if (updateImage.ok) {
                console.log("Imagen actualizada correctamente");
            }
        };

        // Fetch para asignar autores y categorias al libro modificado
        if (updateBook.ok) {
            const deleteAuthorsFromBook = await fetch(`/libros/autor?libro=${libroId}`, {
                method: "DELETE",
            });

            if (deleteAuthorsFromBook.ok) {
                if (autorModBook.value !== "") {
                    const addNewAuthorFromInput = await fetch(
                        `/libros/autor?libro=${libroId}&autor=${autorModBook.dataset.autorId}`, {
                        method: "POST"
                    });
                    if (addNewAuthorFromInput.ok) {
                        console.log("Nuevos autores assignados al libro");
                    }
                };

                if (newAuthors) {
                    for (const div of newAuthors) {
                        await fetch(`/libros/autor?libro=${libroId}&autor=${div.id}`, {
                            method: "POST"
                        });
                    }
                }
            }

            const fieldsetCategoriaChecks = document.querySelectorAll("#fieldsetCategoriaModBook input[type='checkbox']");
            const deleteAllCategories = await fetch(`libros/categoria?libro=${libroId}`, { method: "DELETE" });

            if (deleteAllCategories.ok) {
                for (const input of fieldsetCategoriaChecks) {
                    if (input.checked) {
                        const addCategoriesToBook = await fetch(
                            `/libros/categoria?libro=${libroId}&categoria=${input.value}`, {
                            method: 'POST'
                        });
                        if (addCategoriesToBook.ok) {
                            console.log("Categorías añadidas al libro")
                        }
                    }
                }
            }
        }

        if (updateBook.ok) {
            console.log("Libro modificado con éxito");
            messageModBook.style.color = "rgb(63 135 77)";
            messageModBook.textContent = "Libro modificado con éxito"
            imagenButton.innerHTML = "Seleccionar Imagen";
            imagenButton.style.backgroundColor = "#eaeaea";
            autorModBook.dataset.autorId = ""
            imageVisualizationModBook.src = "";
            formModBook.reset();
            autorModBook.disabled = true;
            descripcionModBook.disabled = true;
            paginasModBook.disabled = true;
            cantidadModBook.disabled = true;
            precioModBook.disabled = true;
            imagenInput.disabled = true;
            categorias.forEach(input => { input.checked = false; input.disabled = true });
            newAuthors.forEach(div => div.remove());
            loaderModBook.style.display = "none";
            updateTable();
            setTimeout(() => {
                messageModBook.style.display = "none";
            }, 3000);
        } else {
            console.log("Error al modificar libro");
            messageModBook.style.color = "rgb(135 63 63)";
            messageModBook.textContent = "Error al Modificar Libro"
        }

    } catch (error) {
        console.error('Error al enviar el formulario:', error);
    }
});

// Cierra el div de los autores al hacer click fuera de él
document.addEventListener("click", (event) => {
    if (!searchResultsTitleModBook.contains(event.target) && !searchResultsModBook.contains(event.target)) {
        searchResultsTitleModBook.style.display = "none";
        searchResultsModBook.style.display = "none";
    }
});