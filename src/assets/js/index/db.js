/**
 * 
 * @fileoverview Lógica para la Base de Datos en el Cliente
 * 
 */

// Asignaciones del DOM
const tableBody = document.querySelector(".tableBodyDB");

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch(`/libros`);
        const result = await response.json()
        if (response.ok) {
            createTable(result);
        }
    } catch(error) {
        console.log("Error al recibir los datos para la Base de Datos: ", error);
    }
})

const createTable = (results) => {

    results.forEach(result => {
        const tr = document.createElement("tr");
        tr.id = result.libro_id

        const td1 = document.createElement("td")
        td1.textContent = result.libro_precio + "€";

        const td2 = document.createElement("td")
        td2.textContent = result.libro_cantidad

        const td3 = document.createElement("td")
        td3.textContent = result.libro_titulo

        const td4 = document.createElement("td")
        td4.textContent = result.autores
            .map(autor => `${autor.nombre} ${autor.apellidos}`)
            .join(", ")

        const td5 = document.createElement("td")
        td5.textContent = result.categorias
            .map(categoria => `${categoria.categoria}`)
            .join(", ")

        tr.appendChild(td1)
        tr.appendChild(td2)
        tr.appendChild(td3)
        tr.appendChild(td4)
        tr.appendChild(td5)

        tableBody.appendChild(tr);

    })
}