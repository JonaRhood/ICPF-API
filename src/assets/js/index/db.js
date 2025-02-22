/**
 * 
 * @fileoverview Lógica para la Base de Datos en el Cliente
 * 
 */

// Asignaciones del DOM
const divTableDB = document.querySelector(".divTableDB")
const tableBody = document.querySelector(".tableBodyDB");
const buscarInput = document.querySelector("#buscarTituloDB");
const precioButton = document.querySelector("#tablePrecio");
const stockButton = document.querySelector("#tableStock");
const tituloButton = document.querySelector("#tableTitulo");

// Lógica para cargar los libros en la tabla del cliente
if (!window.contentLoadedEventListener) {
    document.addEventListener("DOMContentLoaded", async () => {
        try {
            const response = await fetch(`/libros`);
            const result = await response.json()
            if (response.ok) {
                createTable(result);
            }
        } catch (error) {
            console.log("Error al recibir los datos para la Base de Datos: ", error);
        }
    })
    window.contentLoadedEventListener = true;
}

// Función para renderizar los resultados de la tabla
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

// Función para eliminar los resultados de la tabla
const deleteTable = () => {
    document.querySelectorAll("tbody tr").forEach(tr => tr.remove());
}

// Función para actualizar los resultados de la tabla
const updateTable = async () => {
    try {
        const response = await fetch(`/libros`);
        const result = await response.json()
        if (response.ok) {
            deleteTable();
            createTable(result);
        }
    } catch (error) {
        console.log("Error al recibir los datos para la Base de Datos: ", error);
    }
}

// Lógica para buscar título en el buscador 
if (!window.buscarInputListenerAdded) {
    buscarInput.addEventListener("input", (e) => {
        e.preventDefault();

        const titlesTd = document.querySelectorAll(".tableBodyDB tr td:nth-child(3)");  
        const value = e.target.value.toLowerCase();  

        let foundMatch = false;  

        titlesTd.forEach(td => {
            if (td.textContent.toLowerCase().includes(value)) {
                td.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
                foundMatch = true;
            }
        });

        if (!foundMatch) {
            console.log("No se encontraron coincidencias.");
        }
    });
    window.buscarInputListenerAdded = true; 
}

const fetchData = async (column, type) => {
    try {
        const response = await fetch(`/libros/columna?columna=${column}&tipo=${type}`);
        const result = await response.json();
        deleteTable();
        createTable(result);
    } catch(error) {
        console.log("Error fetching data: ", error);
    }
}


// Lógica para ordenar la tabla por precio 
let statePrecio = "DESC";
if (!window.precioButtonEventEmitter) {
    precioButton.addEventListener("click", async (e) => {
        e.preventDefault();
        try {
            const response = await fetchData("l.precio", `${statePrecio}`);
            statePrecio === "DESC" ? statePrecio = "ASC" : statePrecio = "DESC";
            divTableDB.scrollTo(0, 0);
        } catch(error) {
            console.log("Error al ordenar por Precio: ", error);
        }
    })
    window.precioButtonEventEmitter = true;
}

// Lógica para ordenar la tabla por Stock 
let stateStock = "DESC";
if (!window.stockButtonEventEmitter) {
    stockButton.addEventListener("click", async (e) => {
        e.preventDefault();
        try {
            const response = await fetchData("l.cantidad", `${stateStock}`);
            stateStock === "DESC" ? stateStock = "ASC" : stateStock = "DESC";
            divTableDB.scrollTo(0, 0);
        } catch(error) {
            console.log("Error al ordenar por Cantidad: ", error);
        }
    })
    window.stockButtonEventEmitter = true;
}

// Lógica para ordenar la tabla por título 
let tituloStock = "DESC";
if (!window.tituloButtonEventEmitter) {
    tituloButton.addEventListener("click", async (e) => {
        e.preventDefault();
        try {
            const response = await fetchData("l.titulo", `${tituloStock}`);
            tituloStock === "DESC" ? tituloStock = "ASC" : tituloStock = "DESC";
            divTableDB.scrollTo(0, 0);
        } catch(error) {
            console.log("Error al ordenar por Título: ", error);
        }
    })
    window.tituloButtonEventEmitter = true;
}


export {
    updateTable
}