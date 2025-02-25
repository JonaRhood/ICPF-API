/**
 * 
 * @fileoverview Lógica para el botón de la Venta
 * 
 */

// Imports

// Asignaciones del DOM
const stadsButton = document.querySelector("#stadsButton");
const modals = document.querySelector("#modals")
const modalStads = document.querySelector("#modalStads");
const buttonStadsX = document.querySelector("#buttonStadsX");
const ctxMonth = document.querySelector('#myChart');
const yearlyStadsYear = document.querySelector("#yearlyStadsYear");
const yearlyTotal = document.querySelector("#yearlyTotal")
const tableStadsBooks = document.querySelector("#tableStadsBooks")

// Lógica para mostrar el módulo de estadísticas
stadsButton.addEventListener("click", (e) => {
    e.preventDefault();
    stadsOrdersInitializer();
    stadsBooksInitializer();
    modals.style.display = "flex";
    modalStads.style.display = "flex";
});

// Lógica para cerrar el módulo de estadísticas 
buttonStadsX.addEventListener("click", (e) => {
    e.preventDefault();
    modals.style.display = "none";
    modalStads.style.display = "none";
    Chart.getChart('myChart').destroy();
    tableStadsBooks.querySelectorAll("tr").forEach(tr => tr.remove());
});


// Lógica para inicializar las estadísticas de las Ventas
const stadsOrdersInitializer = async () => {
    try {
        const responseMonth = await fetch(`libreria/month`);
        const resultMonth = await responseMonth.json();

        if (responseMonth.ok) {
            const gananciasPorMes = Array(12)

            // Asignar valores a los meses correspondientes
            resultMonth.forEach(obj => {
                const mesIndex = obj.mes - 1; 
                gananciasPorMes[mesIndex] = obj.total_ganado;
            });

            // Gráfico de la Libreria Chart.js ventas por mes
            new Chart(ctxMonth, {
                type: 'line',
                data: {
                    labels: months({ count: 12 }),
                    datasets: [{
                        label: 'Ganancia en €',
                        data: gananciasPorMes,
                        borderWidth: 3,
                        borderColor: "rgb(255 152 71)",
                        backgroundColor: "rgb(246 182 132)"
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    },
                    plugins: {
                        title: {
                            display: true,
                            text: `Gráfico de Ganancias por Meses en el Año: ${resultMonth[0].año}`,
                            align: 'start'
                        }
                    }
                }
            });
        }

        const responseYear = await fetch(`libreria/year`)
        const resultYear = await responseYear.json();

        if (responseYear.ok) {
            yearlyStadsYear.textContent = resultYear[0].año;
            yearlyTotal.textContent = new Intl.NumberFormat("es-ES", {
                style: "decimal",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(resultYear[0].total_ganado);
        }

    } catch (err) {
        console.error("No se han podido recibir las estadísticas: ", err);
    }
}

// Lógica para iniciar las estadísticas de Libros
const stadsBooksInitializer = async () => {
    try {
        const responseBooks = await fetch(`/libreria/year/best`);
        const resultBooks = await responseBooks.json();
        
        if (responseBooks.ok) {
            resultBooks.forEach(result => {
                const tr = document.createElement("tr")
                
                const td1 = document.createElement("td")
                td1.textContent = result.titulo;
        
                const td2 = document.createElement("td")
                td2.textContent = result.total_vendido

                tr.appendChild(td1);
                tr.appendChild(td2);

                tableStadsBooks.appendChild(tr);
            })
        }
    } catch(err) {
        console.error("Error al adquirir estadísticas de libros: ", err);
    }
}

// Utils
const MONTHS = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre'
];

function months(config) {
    var cfg = config || {};
    var count = cfg.count || 12;
    var section = cfg.section;
    var values = [];
    var i, value;

    for (i = 0; i < count; ++i) {
        value = MONTHS[Math.ceil(i) % 12];
        values.push(value.substring(0, section));
    }

    return values;
}
