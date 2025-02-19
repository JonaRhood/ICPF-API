/**
 * 
 * @fileoverview Lógica para el botón de la Venta
 * 
 */

// Asignaciones del DOM
const ventaButton = document.querySelector("#ventaButton");
const modals = document.querySelector("#modals")
const modalVentas = document.querySelector("#modalVentas");
const buttonVentasX = document.querySelector("#buttonVentasX");
const tituloVentas = document.querySelector("#tituloVentas");
const searchResultsVentas = document.querySelector("#searchResultsVentas");
const tableBodyVentas = document.querySelector("#tableBodyVentas");
const ventasTotal = document.querySelector("#ventasTotal");
const submitVentas = document.querySelector("#submitVentas");

// Lógica para las ventas
ventaButton.addEventListener("click", (e) => {
    e.preventDefault();
    modals.style.display = "flex";
    modalVentas.style.display = "flex";
})

buttonVentasX.addEventListener("click", (e) => {
    e.preventDefault();
    modals.style.display = "none";
    modalVentas.style.display = "none";
})

// Lógica para la búsqueda de libros
tituloVentas.addEventListener("input", async (event) => {
    event.preventDefault();

    const value = event.target.value;

    try {
        const response = await fetch(`/libros/buscar?titulo=${value}`);
        const result = await response.json();
        if (response.ok) {
            searchResultsVentas.style.display = "flex"
            renderBookResults(result);
        } else {
            searchResultsVentas.style.display = "none";
        }

    } catch (error) {
        console.log("Error al recibir autores: ", error);
    }
})

// Función para renderizar resultados en la búsqueda
function renderBookResults(Books) {
    searchResultsVentas.innerHTML = ""; // Limpiar resultados previos
    if (Books.length === 0) {
        searchResultsVentas.style.display = "none";
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
        searchResultsVentas.appendChild(li);
    });

    // Añadir Event Listener a cada autor para poder hacer click
    const booksLis = document.querySelectorAll(".author-result");

    booksLis.forEach((li, index, list) => {
        // Evento de click
        li.addEventListener("click", async (event) => {
            tituloVentas.dataset.libroId = event.target.id
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
                    tituloVentas.focus();
                }
            } else if (event.key === "Enter") {
                event.preventDefault();
                li.click();
            }
        });
    });

    // Pasa del input a la lista de autores con el arrowdown 
    tituloVentas.addEventListener("keydown", (event) => {
        if (event.key === "ArrowDown") {
            event.preventDefault();
            booksLis[0]?.focus();
        }
    })
};

let total = 0;

const fetchBookDetails = async (bookId) => {
    try {
        const response = await fetch(`/libros/${bookId}`);
        const result = await response.json();
        
        if (response.ok) {
            const tr = document.createElement("tr");
            tr.id = result[0].libro_id
    
            const td1 = document.createElement("td")
            td1.textContent = result[0].libro_precio + "€";
    
            const td2 = document.createElement("td")
            td2.textContent = result[0].libro_cantidad
    
            const td3 = document.createElement("td")
            td3.textContent = result[0].libro_titulo
    
            const td4 = document.createElement("td")
            td4.textContent = result[0].autores
                .map(autor => `${autor.nombre} ${autor.apellidos}`)
                .join(", ")

            const td5 = document.createElement("td");
            td5.textContent = "-";
            td5.style.textAlign = "center";
            
            tr.appendChild(td1)
            tr.appendChild(td2)
            tr.appendChild(td3)
            tr.appendChild(td4)
            tr.appendChild(td5)
            
            tableBodyVentas.appendChild(tr);

            searchResultsVentas.style.display = "none"; 
            
            total += parseFloat(result[0].libro_precio);
            ventasTotal.textContent = total.toFixed(2); 

            // Lógica para la eliminación de la lista 
            td5.addEventListener("click", (e) => {
                tableBodyVentas.removeChild(tr);
                total -= parseFloat(result[0].libro_precio);
                ventasTotal.textContent = total.toFixed(2); 
            })
        }

    } catch(error) {
        console.error("Error al recibir detalles del libro: ", error);
    }
}

// Lógica para el submit de las ventas
submitVentas.addEventListener("click", async (e) => {
    e.preventDefault();
    const tableTrs = document.querySelectorAll("#tableBodyVentas tr")
    const ids = Array.from(tableTrs).map(tr => tr.id);

    try {
        
    } catch(error) {
        console.error("Error al hacer la venta: ", error);
    }
    
})

// Cierra el div de los autores al hacer click fuera de él
document.addEventListener("click", (event) => {
    if (!searchResultsVentas.contains(event.target)) {
        searchResultsVentas.style.display = "none";
    }
});