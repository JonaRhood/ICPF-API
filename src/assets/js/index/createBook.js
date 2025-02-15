"use strict"

/**
 * Crear Libro
 */

const formCreateBook = document.querySelector("#formCreateBook");
const messageCreateBook = document.querySelector("#messageCreateBook");
const tituloCreateBook = document.querySelector("#tituloCreateBook");
const autorCreateBook = document.querySelector("#autorCreateBook");
const paginasCreateBook = document.querySelector("#paginasCreateBook");
const precioCreateBook = document.querySelector("#precioCreateBook")
const categoriaCreateBook = document.querySelector("#categoriaCreateBook")
const cantidadCreateBook = document.querySelector("#cantidadCreateBook")
const imagenButton = document.querySelector("#imagenButtonCreateBook");
const imagenInput = document.querySelector("#imagenCreateBook");
// const imageVisualization = document.querySelector("#imageVisualization");
const descripcionCreateBook = document.querySelector("#descripcionCreateBook");
const searchResultsCreateBook = document.querySelector("#searchResultsCreateBook");
const buttonPlusAuthorCreateBook = document.querySelector("#buttonPlusAuthorCreateBook");

// Lógica para la búsqueda de autores
autorCreateBook.addEventListener("input", async (event) => {
    event.preventDefault();


    const value = event.target.value;

    try {
        const response = await fetch(`/autores/buscar?apellidos=${value}`);
        const result = await response.json();
        if (response.ok) {
            searchResultsCreateBook.style.display = "flex"
            renderResults(result);
        } else {
            searchResultsCreateBook.style.display = "none";
        }

    } catch (error) {
        console.log("Error al recibir autores: ", error);
    }
})

// Función para renderizar resultados en la búsqueda
function renderResults(Books) {
    searchResultsCreateBook.innerHTML = ""; // Limpiar resultados previos
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

    const newDiv = document.createElement("div");
    newDiv.id = autorCreateBook.dataset.autorId;
    newDiv.className = "autorPlus"
    newDiv.textContent = "Autor: " + autorCreateBook.value;

    const buttonRemove = document.createElement("div");
    buttonRemove.className = "buttonRemove";
    buttonRemove.textContent = "-";

    newDiv.appendChild(buttonRemove);

    // Agregar el nuevo bloque al contenedor
    searchResultsCreateBook.insertAdjacentElement("afterend", newDiv);
    autorCreateBook.value = "";
    autorCreateBook.dataset.autorId = "";
})

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
formCreateBook.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData();
    const nombre = document.querySelector("#nombreCreateBook").value;
    const apellidos = document.querySelector("#autorCreateBook").value;
    const imagen = document.querySelector("#imagenCreateBook").files[0];
    const descripcion = document.querySelector("#descripcionCreateBook").value;

    formData.append("imagen", imagen);

    const data = {
        nombre,
        apellidos,
        descripcion
    };

    try {
        const response = await fetch(`/autores/${BookId}`, {
            method: "PUT",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (imageChanged) {
            const image = await fetch(`autores/${BookId}/imagen`, {
                method: "PUT",
                body: formData
            });
        }

        if (response.ok) {
            console.log("Autor Createificado con éxito");
            messageCreateBook.style.color = "rgb(63 135 77)";
            messageCreateBook.textContent = "Autor Createificado con éxito"
            imagenButton.innerHTML = "Seleccionar Imagen";
            imagenButton.style.backgroundColor = "#eaeaea";
            imageVisualization.src = "";
            formCreateBook.reset();
            nombreCreateBook.disabled = true;
            descripcionCreateBook.disabled = true;
            imagenInput.disabled = true;
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