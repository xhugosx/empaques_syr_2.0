document.addEventListener('init', function (event) {
    var page = event.target;
    if (page.id === 'estadisticas') {
        chart = null; // Reiniciar la variable chart al entrar a la página
        
        //setEstadisticas();

        const hoy = new Date();
        const mesActual = hoy.getMonth() + 1;
        const anioActual = hoy.getFullYear();
        $("#mesE").text(mesE(mesActual));
        $("#anioE").text(anioActual);
    }

});
function mesNoE(mes) {

    const meses = {
        "ENERO": 1,
        "FEBRERO": 2,
        "MARZO": 3,
        "ABRIL": 4,
        "MAYO": 5,
        "JUNIO": 6,
        "JULIO": 7,
        "AGOSTO": 8,
        "SEPTIEMBRE": 9,
        "OCTUBRE": 10,
        "NOVIEMBRE": 11,
        "DICIEMBRE": 12
    };

    return meses[mes] || null;

}
function mesE(mes) {
    const meses = [
        "ENERO",
        "FEBRERO",
        "MARZO",
        "ABRIL",
        "MAYO",
        "JUNIO",
        "JULIO",
        "AGOSTO",
        "SEPTIEMBRE",
        "OCTUBRE",
        "NOVIEMBRE",
        "DICIEMBRE"
    ]
    return meses[mes - 1];
}

function accionMesE(n) {
    let i = $("#mesE").text();
    i = parseInt(mesNoE(i)) + n;
    //console.log(mesE(i));
    $("#mesE").text(mesE(i));
    setEstadisticas();
}

function accionAnioE(n) {
    let i = $("#anioE").text();
    //console.log(i);
    $("#anioE").text(parseInt(i) + n);
    setEstadisticas();
}


function setEstadisticas() {
    let mes = $("#mesE").text();
    let anio = $("#anioE").text();
    oCarga("Cargando Datos...");
    //console.log(myLink + "/php/m2/select.php?mes=" + mesNoE(mes) + "&anio=" + anio);
    servidor(myLink + "/php/m2/select.php?mes=" + mesNoE(mes) + "&anio=" + anio,
        function (respuesta) {
            let datos = respuesta.responseText.split(",");
            let total = datos[datos.length - 1];
            datos.pop();
            $("#cantidadTotal").text(separator(total) + " m²");
            cargarGraficaPastel(datos);
            cCarga();
        }
    );
}

function cargarGraficaPastel(datos) {
    const ctx = document.getElementById('grafica').getContext('2d');

    const data = {
        labels: [
            'Flexo',
            'Pegado',
            'Impresión',
            'Suajado',
            'Cortadora',
            'Caimán'
        ],
        datasets: [{
            label: 'Producción Enero (m²)',
            data: datos, // valores ejemplo
            backgroundColor: [
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(153, 102, 255, 0.6)',
                'rgba(255, 159, 64, 0.6)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    };

    const config = {
        type: 'pie',
        data: data,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Producción por Proceso - Enero (m²)'
                }
            }
        },
    };

    if (chart) {
        // si ya existe, actualizamos datos
        chart.data = data;
        chart.update();
    } else {
        // si no existe, la creamos
        chart = new Chart(ctx, config);
    }
}
