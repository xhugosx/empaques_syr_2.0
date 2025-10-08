document.addEventListener('init', function (event) {
    var page = event.target;
    //let codigocliente;
    if (page.id === 'estadisticas') {
        chart = null; // Reiniciar la variable chart al entrar a la página
        chart1 = null;
        codigocliente = "";
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
            setEstadisticasCliente();
            setEstadisticas2();

        }
    );
}
function setEstadisticas2() {
    let mes = $("#mesE").text();
    let anio = $("#anioE").text();
    //oCarga("Cargando Datos...");
    //console.log(myLink + "/php/m2/selectGraficaClientes.php?mes=" + mesNoE(mes) + "&anio=" + anio);
    servidor(myLink + "/php/m2/selectGraficaClientes.php?mes=" + mesNoE(mes) + "&anio=" + anio,
        function (respuesta) {
            let datos = respuesta.responseText;
            datos = convertJson(datos);
            //console.log(datos);
            let labels = [];
            let valores = [];
            let nombres = [];
            datos.forEach((element) => {
                labels.push(agregarCeros(element.codigo));
                valores.push(element.total_m2);
                nombres.push(element.nombre);
            });
            cargarGraficaLine(labels, valores, nombres);
            //cargarGraficaPastel(datos);
            //setEstadisticasCliente();

        }
    );
}

function setEstadisticasCliente() {
    let mes = $("#mesE").text();
    let anio = $("#anioE").text();
    //oCarga("Cargando Datos...");
    //console.log(myLink + "/php/m2/selectCliente.php?mes=" + mesNoE(mes) + "&anio=" + anio);
    servidor(myLink + "/php/m2/selectCliente.php?mes=" + mesNoE(mes) + "&anio=" + anio,
        function (respuesta) {
            let resultado = respuesta.responseText;
            var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'
            //console.log(arrayJson);
            listaInfinita('datosEstadisticas', '', arrayJson, enlistarEstadisticaCliente);
            cCarga();
        }
    );
}

function setEstadisticasCajas(codigo) {
    codigocliente = codigo;
    let mes = $("#mesE").text();
    let anio = $("#anioE").text();
    let search = $("#searchEstadisticasCajas").val();
    oCarga("Cargando Datos...");
    //console.log(myLink + "/php/m2/selectCaja.php?mes=" + mesNoE(mes) + "&anio=" + anio + "&codigo=" + codigo);
    servidor(myLink + "/php/m2/selectCaja.php?mes=" + mesNoE(mes) + "&anio=" + anio + "&codigo=" + codigo + "&search=" + search,
        function (respuesta) {
            let resultado = respuesta.responseText;
            var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'
            //console.log(arrayJson);
            listaInfinita('datosEstadisticasCajas', '', arrayJson, enlistarEstadisticaCajas);
            cCarga();
        }
    );
}

function setDescargarEstadisticasExcel() {

    alertComfirm('¿Deseas exportar las estadisticas detalladas?', ['No', 'Si'],
        function (idx) {
            if (idx) {
                let mes = $("#mesE").text();
                let anio = $("#anioE").text();
                let link = myLink + "/php/m2/selectCajaExcel.php?mes=" + mesNoE(mes) + "&anio=" + anio;
                //console.log(link);
                oCarga("Creando archivo Excel...");
                servidor(link,
                    function (respuesta) {
                        var resultado = respuesta.responseText;
                        //separamos los json en un arreglo, su delimitador siendo un '|', y eliminamos entradas vacías
                        const arrayJson = convertJson(resultado); // FUNCION EJECUTADA EN MAIN.JS

                        let nombreArchivo = "Estadisticas_" + mes + "-" + anio;
                        crearExcel(nombreArchivo, arrayJson); // FUNCION EJECUTADA EN EL ARCHIVO MAIN.JS
                        //let responseArray = JSON.parse(arrayJson);
                        cCarga();
                    }
                );
            }

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
            data: datos, // valores
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
        type: 'doughnut',
        data: data,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
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

let chart1;

function cargarGraficaLine(labels, datos, nombres) {
    const ctx = document.getElementById('grafica1').getContext('2d');

    const data = {
        labels: labels,
        datasets: [{
            label: "Producción por Cliente (m²)",
            data: datos,
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
        }]
    };

    const config = {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                title: {
                    display: true,
                    text: "Producción por Cliente (m²)"
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: "Metros cuadrados (m²)"
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: "Clientes"
                    }
                }
            }
        },
    };

    if (chart1) {
        chart1.data = data;
        chart1.options.plugins.title.text = "Producción por Cliente (m²)";
        chart1.update();
    } else {
        chart1 = new Chart(ctx, config);
    }
}


function enlistarEstadisticaCliente(arrayJson) {
    let html = `
        <ons-card style="padding:0px;" class="botonPrograma"
            onclick="nextPageFunction('estadisticasCajas.html', 
            function() {setEstadisticasCajas('${arrayJson.codigo}');})">
            <ons-list-item modifier="chevron nodivider">
            <div class="left">
                <strong>${agregarCeros(arrayJson.codigo)}</strong>
            </div>
            <div class="center">
                ${arrayJson.nombre}
            </div>
            <div class="right" style="white-space: nowrap;">
                <b>${separator(arrayJson.total_m2)} m²</b> &nbsp;&nbsp;
                <span class="notification">${arrayJson.total}</span>
            </div>
            </ons-list-item>
        </ons-card>
    `;
    return html;
}

function enlistarEstadisticaCajas(arrayJson) {
    let m2 = "";
    let entregas = "";
    let fechas = "";
    let facturas = "";
    let procesos = "";

    arrayJson.procesos.forEach((proceso) => {
        procesos += `
            <span class="proceso proceso-terminado estadistica">
                ${procesosProgramaIcon(proceso)} &nbsp; ${procesosPrograma(proceso)}
            </span>
        `;
    });

    for (let i = 0; i < arrayJson.parcial_m2.length; i++) {
        m2 += `<li> ${separator(arrayJson.parcial_m2[i])} m²</li>`;
        entregas += `<li> ${separator(arrayJson.entregas[i])} </li>`;
        fechas += `<li> ${arrayJson.fechas[i]} </li>`;
        facturas += `<li> ${arrayJson.facturas[i]} </li>`;
    }

    let html = `
        <ons-card style="padding:0px;" class="botonPrograma">
                <ons-list-header style="background-color: rgba(255, 255, 255, 0)">
                    ${arrayJson.id_pedido}
                </ons-list-header>

                <ons-list-item modifier="nodivider">

                    <div class="center">
                        <span class="list-item__title">
                            <b> ${arrayJson.codigo} </b> &nbsp; ${arrayJson.producto} &nbsp;|&nbsp; ${arrayJson.m2}&nbsp;m²
                        </span>

                        <span class="list-item__subtitle">
                            <hr>
                            ${procesos}
                            <hr>
                            <span style="font-size: 14px;">
                            <b>Entrada:</b> ${arrayJson.entrada} pz(s).   |   ${arrayJson.entrada_fecha} 
                            </span>
                            <hr>
                            <table border="1" cellpadding="8" cellspacing="0"
                                style="border-collapse: collapse; text-align: center; width: 100%;">
                                <thead style="background-color: #f2f2f2;">
                                    <tr>
                                        <th>FACTURAS</th>
                                        <th>FECHAS</th>
                                        <th>ENTREGAS</th>
                                        <th>M²</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <ul style="list-style: none; padding: 0; margin: 0;">
                                                ${facturas}
                                            </ul>
                                        </td>
                                        <td>
                                            <ul style="list-style: none; padding: 0; margin: 0;">
                                                ${fechas}
                                            </ul>
                                        </td>
                                        <td>
                                            <ul style="list-style: none; padding: 0; margin: 0;">
                                                ${entregas}
                                            </ul>
                                        </td>
                                        <td>
                                            <ul style="list-style: none; padding: 0; margin: 0;">
                                                ${m2}
                                            </ul>
                                        </td>
                                    </tr>
                                    <!-- Fila total -->
                                    <tr style="font-weight: bold;color:white; background-color: #57575774; font-size: 15px;">
                                        <td colspan="2" style="text-align: right;">TOTAL:</td>
                                        <td> ${separator(arrayJson.total_entregado)} pz(s).</td>
                                        <td> ${separator(arrayJson.total_m2)} m²</td>
                                    </tr>
                                </tbody>
                            </table>


                        </span>
                    </div>


                </ons-list-item>
            </ons-card>
    `;
    return html;
}