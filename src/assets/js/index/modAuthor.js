"use strict"

/**
 * Modificar Autor
 */

// Asignaciones DOM
const formModAuthor = document.querySelector("#formModAuthor");
const messageModAuthor = document.querySelector("#messageModAuthor");
const nombreModAuthor = document.querySelector("#nombreModAuthor");
const apellidosModAuthor = document.querySelector("#apellidosModAuthor");
const imagenButton = document.querySelector("#imagenButtonModAuthor");
const imagenInput = document.querySelector("#imagenModAuthor");
const imageVisualization = document.querySelector("#imageVisualization");
const imageVisualizatorModal = document.querySelector("#imageVisualizatorModal");
const descripcionModAuthor = document.querySelector("#descripcionModAuthor");
const searchResultsModAuthor = document.querySelector("#searchResultsModAuthor");
const generalLoader = document.querySelector("#loaderSearchAuthorModAuthor");
const loaderModAuthor = document.querySelector("#loaderModAuthor")

// Lógica para la búsqueda de autores
let typingTimer;
const typingInterval = 500;
apellidosModAuthor.addEventListener("input", async (event) => {
    event.preventDefault();
    resetTypingTimer();
})

const fetchAutores = async (value) => {
    try {
        searchResultsModAuthor.style.display = "flex";
        generalLoader.style.display = "flex"
        const response = await fetch(`/autores/buscar?apellidos=${value}`);
        const result = await response.json();
        if (response.ok) {
            renderResults(result);
            generalLoader.style.display = "none"
        } else {
            searchResultsModAuthor.style.display = "none";
        }
    } catch (error) {
        console.log("Error al recibir autores: ", error);
    }
};

const resetTypingTimer = () => {
    clearTimeout(typingTimer); // Limpiar el temporizador anterior
    typingTimer = setTimeout(() => {
        const value = apellidosModAuthor.value;
        if (value) {
            fetchAutores(value); // Ejecutar la búsqueda solo si hay valor
        } else {
            searchResultsModAuthor.style.display = "none";
        }
    }, typingInterval); // Establecer el temporizador para 2 segundos
};

// Función para renderizar resultados en la búsqueda
let authorId = null;

function renderResults(authors) {
    searchResultsModAuthor.querySelectorAll("li").forEach(item => item.remove());
    if (authors.length === 0) {
        searchResultsModAuthor.style.display = "none";
        return;
    }

    authors.forEach((author, index) => {
        const li = document.createElement("li");
        li.tabIndex = "0";
        li.classList.add("author-result");
        if (index % 2 == 0) {
            li.style.backgroundColor = 'white';
        } else {
            li.style.backgroundColor = 'rgb(241 239 239)';
        }
        li.innerHTML = `${author.nombre} ${author.apellidos}`;
        li.id = author.id;
        searchResultsModAuthor.appendChild(li);
    });

    // Añadir Event Listener a cada autor para poder hacer click
    const authorLis = document.querySelectorAll(".author-result");

    authorLis.forEach((li, index, list) => {
        // Evento de click
        li.addEventListener("click", async (event) => {
            authorId = event.target.id;
            await fetchAuthorDetails(authorId);
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
                    apellidosModAuthor.focus();
                }
            } else if (event.key === "Enter") {
                event.preventDefault();
                li.click(); 
            }
        });
    });

    // Pasa del input a la lista de autores con el arrowdown 
    apellidosModAuthor.addEventListener("keydown", (event) => {
        if (event.key === "ArrowDown") {
            event.preventDefault();
            authorLis[0]?.focus();
        }
    })

    // Al hacer click a un Autor, hacer un request al API usando su id
    const fetchAuthorDetails = async (authorId) => {
        try {
            const response = await fetch(`/autores/${authorId}`);
            const result = await response.json();

            if (response.ok) {
                searchResultsModAuthor.style.display = "none";
                nombreModAuthor.disabled = false;
                imagenButton.style.color = "black";
                imagenButton.style.backgroundColor = "#eaeaea";
                imagenInput.disabled = false;
                descripcionModAuthor.disabled = false;

                nombreModAuthor.value = result[0].autor_nombre;
                apellidosModAuthor.value = result[0].autor_apellidos;

                imagenButton.addEventListener("mouseover", () => imageVisualizatorModal.style.display = "flex");
                imagenButton.addEventListener("mouseout", () => imageVisualizatorModal.style.display = "none");
                imageVisualization.src = result[0].autor_imagen;

                imagenButton.innerHTML = "Cambiar Imagen<br>(Previsualizar al pasar el ratón)"

                descripcionModAuthor.value = result[0].autor_descripcion;

            }
        } catch (error) {
            console.log("Error al recibir autor: ", error);
        }
    };
};

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
formModAuthor.addEventListener("submit", async (event) => {
    event.preventDefault();
    loaderModAuthor.style.display = "flex"

    const formData = new FormData();
    const nombre = document.querySelector("#nombreModAuthor").value;
    const apellidos = document.querySelector("#apellidosModAuthor").value;
    const imagen = document.querySelector("#imagenModAuthor").files[0];
    const descripcion = document.querySelector("#descripcionModAuthor").value;

    formData.append("imagen", imagen);

    const data = {
        nombre,
        apellidos,
        descripcion
    };

    try {
        const response = await fetch(`/autores/${authorId}`, {
            method: "PUT",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (imageChanged) {
            const image = await fetch(`autores/${authorId}/imagen`, {
                method: "PUT",
                body: formData
            });
            if (image.ok) {
                console.log("Imagen actualizada correctamente");
            }
        }

        if (response.ok) {
            console.log("Autor modificado con éxito");
            messageModAuthor.style.color = "rgb(63 135 77)";
            messageModAuthor.textContent = "Autor modificado con éxito"
            imagenButton.innerHTML = "Seleccionar Imagen";
            imagenButton.style.backgroundColor = "#eaeaea";
            imageVisualization.src = "";
            formModAuthor.reset();
            nombreModAuthor.disabled = true;
            descripcionModAuthor.disabled = true;
            imagenInput.disabled = true;
            loaderModAuthor.style.display = "none"
            setTimeout(() => {
                messageModAuthor.style.display = "none";
            }, 3000);
        } else {
            console.log("Error al crear autor");
            messageModAuthor.style.color = "rgb(135 63 63)";
            messageModAuthor.textContent = "Error al modificar Autor"
        }

    } catch (error) {
        console.error('Error al enviar el formulario:', error);
    }
});

// Cierra el div de los autores al hacer click fuera de él
document.addEventListener("click", (event) => {
    if (!searchResultsModAuthor.contains(event.target)) {
        searchResultsModAuthor.style.display = "none";
    }
});