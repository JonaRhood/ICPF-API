"use strict"

/**
 * Modificar Autor
 */
const formModAuthor = document.querySelector("#formModAuthor");
const messageModAuthor = document.querySelector("#messageModAuthor");
const apellidosModAuthor = document.querySelector("#apellidosModAuthor");
const imagenButton = document.querySelector("#imagenButtonModAuthor");
const imagenInput = document.querySelector("#imagenModAuthor");
const searchResultsModAuthor = document.querySelector("#searchResultsModAuthor");

// Lógica para la búsqueda de autores
apellidosModAuthor.addEventListener("input", async (event) => {
    event.preventDefault();

    const value = event.target.value;
    console.log(event.target.value);

    try {
        const response = await fetch(`/autores/buscar?apellidos=${value}`);
        const result = await response.json();
        if (response.ok) {
            searchResultsModAuthor.style.display = "flex"
            console.log(result);
            renderResults(result);
        } else {
            
        }

    } catch (error) {
        console.log("Error al recibir autores: ", error);
    }
})

// Función para renderizar resultados en la búsqueda
function renderResults(authors) {
    searchResultsModAuthor.innerHTML = ""; // Limpiar resultados previos

    if (authors.length === 0) {
        searchResultsModAuthor.style.display = "none";
        return;
    }

    authors.forEach(author => {
        const div = document.createElement("div");
        div.classList.add("author-result");
        div.innerHTML = `${author.nombre} ${author.apellidos}`;
        searchResultsModAuthor.appendChild(div);
    });
}

// Lógica para el botón del Hidden Input
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

// Lógica para el envio de datos al Servidor API
formModAuthor.addEventListener("submit", async (event) => {
    const formData = new FormData();

    const nombre = document.querySelector("#nombreModAuthor").value;
    const apellidos = document.querySelector("#apellidosModAuthor").value;
    const imagen = document.querySelector("#imagenModAuthor").files[0];
    const descripcion = document.querySelector("#descripcionModAuthor").value;

    event.preventDefault();

    console.log("Hola");

    // formData.append("nombre", nombre);
    // formData.append("apellidos", apellidos);
    // formData.append("imagen", imagen);
    // formData.append("descripcion", descripcion);

    // try {
    //     const response = await fetch("/autores", {
    //         method: "POST",
    //         body: formData
    //     });

    //     if (response.ok) {
    //         console.log("Autor creado con éxito");
    //         messageModAuthor.style.color = "rgb(63 135 77)";
    //         messageModAuthor.textContent = "Autor creado con éxito"
    //         imagenButton.innerHTML = "Seleccionar Imagen";
    //         imagenButton.style.backgroundColor = "#eaeaea";
    //         formModAuthor.reset();
    //     } else {
    //         console.log("Error al crear autor");
    //         messageModAuthor.style.color = "rgb(135 63 63)";
    //         messageModAuthor.textContent = "Error al crear Autor"
    //     }

    // } catch (error) {
    //     console.error('Error al enviar el formulario:', error);
    // }
});