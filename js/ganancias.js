
function setIngresosEgresos() {
    let anio = $("#anioG").text();
    oCarga("Cargando datos...");
    servidor(myLink + "/php/IngresosEgresos/select.php?anio=" + anio,
        function (respuesta) {
                //console.log(respuesta.responseText);

                let resultado = respuesta.responseText;
                let arrayJson = resultado.split("@");

                let jsonIngresos;
                let jsonEgresos;

                if (arrayJson[0] != "") {
                    jsonIngresos = arrayJson[0].split('|');
                    for (let i = 0; i < jsonIngresos.length - 1; i++) jsonIngresos[i] = JSON.parse(jsonIngresos[i]);
                }
                else jsonIngresos = { "suma": 0, "mes": 1 };

                if (arrayJson[1] != "") {
                    jsonEgresos = arrayJson[1].split('|');
                    for (let i = 0; i < jsonEgresos.length - 1; i++)jsonEgresos[i] = JSON.parse(jsonEgresos[i]);
                }
                else jsonEgresos = { "suma": 0, "mes": 1 };
                graficaIngresosEgresos(jsonIngresos, jsonEgresos);
                cCarga();
        }
    );
}


function graficaIngresosEgresos(jsonIngresos, jsonEgresos) {
    let ingresos = [];
    let egresos = [];

    for (let i = 0; i < jsonIngresos.length; i++) ingresos.push(jsonIngresos[i].suma);
    for (let i = 0; i < jsonEgresos.length; i++) egresos.push(jsonEgresos[i].suma);

    if (chart) {
        chart.data.datasets[0].data = ingresos;
        chart.data.datasets[1].data = egresos;
        chart.update();
    }
    else {
        var dataFirst = {
            label: "Ingresos",
            data: ingresos,
            backgroundColor: 'rgba(0, 200, 83, 0.7)',
            borderColor: 'rgba(0, 200, 83, 1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(0, 200, 83, 0.9)',
            barPercentage: 0.6,
            categoryPercentage: 0.5
        };

        var dataSecond = {
            label: "Egresos",
            data: egresos,
            backgroundColor: 'rgba(229, 57, 53, 0.7)',
            borderColor: 'rgba(229, 57, 53, 1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(229, 57, 53, 0.9)',
            barPercentage: 0.6,
            categoryPercentage: 0.5
        };

        var speedData = {
            labels: meses(),
            datasets: [dataFirst, dataSecond]
        };

        var options = {
            responsive: true,
            maintainAspectRatio: false,

            tooltips: {
                mode: 'index',
                intersect: false,
                backgroundColor: '#1e1e1e',
                callbacks: {
                    label(t, d) {
                        const xLabel = d.datasets[t.datasetIndex].label;
                        const yLabel = t.yLabel >= 1000
                            ? '$ ' + t.yLabel.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                            : '$ ' + t.yLabel;
                        return xLabel + ': ' + yLabel;
                    }
                }
            },

            legend: {
                labels: {
                    fontSize: 12
                }
            },

            scales: {
                xAxes: [{
                    gridLines: {
                        display: false
                    },
                    stacked: false
                }],
                yAxes: [{
                    gridLines: {
                        color: 'rgba(0,0,0,0.05)'
                    },
                    ticks: {
                        beginAtZero: true,
                        callback: (label) => {
                            return '$ ' + label.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                        }
                    }
                }]
            },

            animation: {
                duration: 800,
                easing: 'easeOutQuart'
            }
        };

        chart = new Chart(grafica, {
            type: "bar",
            data: speedData,
            options: options
        });
    }
}

function prevIE() {

    var anio = parseInt($("#anioG").text()) - 1;
    $("#anioG").text(anio);
    setIngresosEgresos();

};

function nextIE() {

    var anio = parseInt($("#anioG").text()) + 1;
    $("#anioG").text(anio);
    setIngresosEgresos();

};