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
    return `
    <ons-card class="botonPrograma" 
              onclick="nextPageFunction('estadisticasCajas.html', function() {setEstadisticasCajas('${arrayJson.codigo}');})"
              style="padding:0; margin: 8px 12px; border-radius: 14px; border: 1px solid #edf2f7; box-shadow: 0 3px 6px rgba(0,0,0,0.03); background: white;">
        
        <ons-list-item modifier="chevron nodivider" ripple style="padding: 6px 0;">
            
            <div class="left" style="margin-left: 14px;">
                <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 4px 10px; border-radius: 8px; text-align: center;">
                    <strong style="color: #475569; font-size: 13px;">${agregarCeros(arrayJson.codigo)}</strong>
                </div>
            </div>

            <div class="center">
                <span style="font-size: 15px; font-weight: 800; color: #1e293b; letter-spacing: -0.3px;">
                    ${arrayJson.nombre}
                </span>
            </div>

            <div class="right" style="padding-right: 12px; display: flex; align-items: center; gap: 15px;">
                
                <div style="text-align: right;">
                    <span style="display: block; font-size: 9px; color: #94a3b8; font-weight: 800; text-transform: uppercase; margin-bottom: -2px;">Volumen</span>
                    <b style="font-size: 16px; color: #0f172a;">
                        ${separator(arrayJson.total_m2)} <small style="font-size: 11px; font-weight: 400; color: #64748b;">m²</small>
                    </b>
                </div>

                <div style="background: #da3f3f; color: white; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 800; display: flex; align-items: center; gap: 4px; margin-right:15px;">
                    <i class="fas fa-boxes" style="font-size: 10px; opacity: 0.7; color:white"></i>
                    ${arrayJson.total}
                </div>
            </div>

        </ons-list-item>
    </ons-card>
    `;
}

function enlistarEstadisticaCajas(arrayJson) {
    let m2 = "";
    let entregas = "";
    let fechas = "";
    let facturas = "";
    let procesos = "";

    // Estilo moderno para los procesos
    arrayJson.procesos.forEach((proceso) => {
        procesos += `
            <span class="proceso proceso-terminado estadistica">
                ${procesosProgramaIcon(proceso)} ${procesosPrograma(proceso)}
            </span>
        `;
    });

    // Generamos las listas de la tabla
    for (let i = 0; i < arrayJson.parcial_m2.length; i++) {
        m2 += `<li style="padding: 4px 0;"> ${separator(arrayJson.parcial_m2[i])} <small>m²</small></li>`;
        entregas += `<li style="padding: 4px 0;"> ${separator(arrayJson.entregas[i])} </li>`;
        fechas += `<li style="padding: 4px 0;"> ${arrayJson.fechas[i]} </li>`;
        facturas += `<li style="padding: 4px 0; font-weight: bold; color: #334155;"> ${arrayJson.facturas[i]} </li>`;
    }

    return `
    <ons-card class="botonPrograma" style="padding:0; margin: 10px 12px; border-radius: 16px; border: 1px solid #f1f5f9; box-shadow: 0 4px 10px rgba(0,0,0,0.05); background: white;">
        
        <ons-list-header class="programa-header">
            <span style="color: #64748b; font-weight: 800;"># ${arrayJson.id_pedido}</span>
            <span style="color: #10b981; font-size: 11px; font-weight: 800;">
                <i class="fas fa-check-circle" style="color:#10b981"></i> FINALIZADO
            </span>
        </ons-list-header>

        <ons-list-item modifier="nodivider" >
            <div class="left" style="align-self: flex-start; margin-right: 12px;">
                <div class="badge-codigo" style="min-width: 50px; text-align: center;">
                    <strong>${arrayJson.codigo}</strong>
                </div>
            </div>

            <div class="center romperTexto" style="padding-right: 10px;">
                <div style="display: flex; flex-direction: column; width: 100%;">
                    <span style="font-size: 15px; color: #1e293b; font-weight: 800; line-height: 1.2;">
                        ${arrayJson.producto}
                    </span>
                    
                    <div style="font-size: 12px; color: #64748b; margin: 4px 0 8px 0;">
                        <b>Total Pedido:</b> ${arrayJson.m2} m²
                    </div>

                    <div style="display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 12px;">
                        ${procesos}
                    </div> 
                </div>
            </div>
        </ons-list-item>

        <div style="margin: 0 12px 12px 12px;">
            <div style="background: #f8fafc; padding: 10px 12px; border-radius: 10px; border: 1px solid #e2e8f0; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <span style="font-size: 10px; color: #64748b; display: block; font-weight: 800; text-transform: uppercase;">Entrada:</span>
                    <b style="font-size: 13px; color: #1e293b;">${arrayJson.entrada} pz(s).</b> 
                    <span style="color: #94a3b8; font-size: 11px;"> | ${arrayJson.entrada_fecha}</span>
                </div>
                <div style="text-align: right; border-left: 2px solid #e2e8f0; padding-left: 12px;">
                    <span style="font-size: 10px; color: #64748b; display: block; font-weight: 800; text-transform: uppercase;">Total Entregado:</span>
                    <b style="font-size: 16px; color: #334155;">${separator(arrayJson.total_m2)} <small style="font-size: 10px;">m²</small></b>
                </div>
            </div>

            <div style="overflow: hidden; border: 1px solid #e2e8f0; border-radius: 12px;">
                <table style="width: 100%; border-collapse: collapse; font-size: 11px; text-align: center;">
                    <thead>
                        <tr style="background: #f1f5f9; color: #475569; font-weight: 800; text-transform: uppercase; font-size: 9px;">
                            <th style="padding: 8px;">Factura</th>
                            <th style="padding: 8px;">Fecha</th>
                            <th style="padding: 8px;">Pzas</th>
                            <th style="padding: 8px;">m²</th>
                        </tr>
                    </thead>
                    <tbody style="color: #64748b;">
                        <tr>
                            <td style="padding: 5px 0;"><ul style="list-style:none; padding:0; margin:0;">${facturas}</ul></td>
                            <td style="padding: 5px 0;"><ul style="list-style:none; padding:0; margin:0;">${fechas}</ul></td>
                            <td style="padding: 5px 0;"><ul style="list-style:none; padding:0; margin:0;">${entregas}</ul></td>
                            <td style="padding: 5px 0;"><ul style="list-style:none; padding:0; margin:0;">${m2}</ul></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </ons-card>
    `;
}