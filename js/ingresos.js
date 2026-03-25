var chart;
var mesIngreso;
//FUNCION PARA MOSTRAR LOS INGRESOS POR CLIENTE
function setIngresoMensualCliente(datos) {
  oCarga("Cargando Ingresos...");
  let mes = datos[0];
  let cliente = datos[1];
  let anio = $("#anioG").text();
  servidor(myLink + "/php/ingresos/ingresoMensualCliente.php?anio=" + anio + "&mes=" + mes + "&cliente=" + cliente,
    function (respuesta) {
      let resultado = respuesta.responseText;
      let arrayJson = resultado.split("|");
      //console.log(arrayJson);
      listaInfinita('mesesIngresosCliente', 'loadingIngresoMesCliente', arrayJson, enlitsarMesIngresoCliente);
      cCarga();
    }
  );
}

//FUNCION PARA MOSTRAR INGRESOS POR MES
function setMesIngreso(mes) {
  oCarga("Cargando Ingresos...");
  let anio = $("#anioG").text();
  mes = mes ? mes : mesIngreso;
  //console.log(anio,mes);
  servidor(myLink + "/php/ingresos/ingresoMensual.php?anio=" + anio + "&mes=" + mes,
    function (respuesta) {
      let resultado = respuesta.responseText;
      let arrayJson = resultado.split("|");
      listaInfinita('mesesIngresos', 'loadingIngresoMes', arrayJson, enlitsarMesIngreso);

      graficaIngresoCliente(arrayJson);
      cCarga();
    }
  );
}

//FUNCION PARA MOSTRAR INGRESOS TOTALES POR AÑO
function setIngresos() {
  oCarga("Cargando Ingresos...");
  var anio = $("#anioG").text();
  servidor(myLink + '/php/ingresos/ingresoTotal.php?anio=' + anio,
    function (respuesta) {
      let resultado = respuesta.responseText;
      let importes = resultado.split("|");

      if (importes.length > 1) listaInfinita('Ingresos', 'loadingIngreso', importes, enlitsarIngreso);
      else {
        importes.pop();
        listaInfinita('Ingresos', 'loadingIngreso', importes, enlitsarIngreso);
        importes.push("");
      }

      importes.pop();

      graficaIngreso(importes);
      cCarga();
    }
  );
}

//FUNCION PARA LLENAR SELECT DE AGREGAR INGRESO
function setIngresoClientes() {
  oCarga("Cargando Clientes...");
  servidor(myLink + "/php/clientes/select.php?type=2",
    function (respuesta) {
      let resultado = respuesta.responseText;
      let arrayJson = resultado.split("|");

      for (let i = 0; i < arrayJson.length - 1; i++) {
        arrayJson[i] = JSON.parse(arrayJson[i]);
        $("#cliente:first-child").find('select').append("<option value='" + arrayJson[i].codigo + "'>" + agregarCeros(arrayJson[i].codigo) + " " + arrayJson[i].nombre + "</option>");

      }
      dateHoy("fecha");
      cCarga();
    });
}


//funcion para agregar
function setAgregarIngreso() {
  var form = $('#formingreso')[0];
  var formData = new FormData(form);
  var cliente = $('#cliente').val();
  var fecha = $('#fecha').val();
  var factura = $('#factura').val();
  var importe = $('#importe').val();
  var metodoPago = $('#metodo').val();

  if (vacio(cliente, fecha, factura, importe, metodoPago)) {
    oCarga("Agregando Ingreso...");
    servidorPost(myLink + "/php/ingresos/add.php",
      function (respuesta) {
        //console.log();
        if (respuesta.responseText == 1) {
          alerta("Ingreso Agregado");
          resetearPilaFunction(setIngresos);
          cCarga();
        }
        else alerta("No se pudo Agregar!");
        //console.log(respuesta.responseText);

      }, formData);
  }
  else alerta("Espacios vacios!");

}

//esta funcion es para eliminar la factura
function setEliminarIngreso(id) {
  oCarga("Eliminando Ingreso...");
  servidor(myLink + "/php/ingresos/delete.php?id=" + id,
    function (respuesta) {
      if (respuesta.responseText == 1) {
        alerta("La factura fue eliminada");
        resetearPilaFunction(setMesIngreso);
        cCarga();
      }
      else alerta("No se pudo eliminar");
    }
  );
}

//esta funcion es para buscar y rellenar los input
function setBuscarIngreso(id) {
  servidor(myLink + "/php/ingresos/select.php?id=" + id,
    function (respuesta) {
      var json = JSON.parse(respuesta.responseText);
      let arrayCodigos = json.codigos.split("@");
      let arrayClientes = json.clientes.split("@");
      for (let i = 0; i < arrayCodigos.length; i++) {
        html = '<option value="' + arrayCodigos[i] + '">' + agregarCeros(arrayCodigos[i]) + ' ' + arrayClientes[i] + '</option>';

        $("#cliente:first-child").find('select').append(html);

      }

      $('#id').val(json.id);
      $('#cliente').val(json.ingreso_cliente);
      $('#fecha').val(json.fecha);
      $('#factura').val(json.factura);
      $('#importe').val(json.importe);
      $('#metodo').val(json.metodo);
      $('#observaciones').val(json.observaciones);
    }
  );
}

//funcion para modificar
function setModificarIngreso() {
  var form = $('#formingreso')[0];
  var formData = new FormData(form);
  var cliente = $('#cliente').val();
  var fecha = $('#fecha').val();
  var factura = $('#factura').val();
  var importe = $('#importe').val();
  var metodoPago = $('#metodo').val();
  var id = $('#id').val();

  if (vacio(cliente, fecha, factura, importe, metodoPago)) {
    oCarga("Modificando Ingreso...");
    servidorPost(myLink + "/php/ingresos/update.php?id=" + id,
      function (respuesta) {
        //console.log();
        if (respuesta.responseText == 1) {
          alerta("Ingreso Modificado");
          resetearPilaFunction(resetearPilaFunction, setMesIngreso);
          cCarga();
        }
        else alerta("No se pudo Modificar!");
        //console.log(respuesta.responseText);
      }, formData);
  }
  else alerta("Espacios vacios!");

  //servidorPost(link,miFuncion,data)
}


function enlitsarIngreso(arrayJson, i) {
  if (arrayJson == 0) return "<div></div>";

  // Mantenemos tu lógica de navegación y asignación de variable
  let accion = `onclick="nextPageFunctionData('ingresosMensual.html', setMesIngreso, ${i + 1}); mesIngreso = ${i + 1}"`;

  let html1 = `
        <ons-card style="padding:0px; background: white;" class="botonPrograma" ${accion}>

            <ons-list-item modifier="nodivider chevron">
                <div class="left"> 
                    <div class="producto-icon-wrapper">
                        <i class="fa-solid fa-money-bill-trend-up fa-2x"></i> 
                    </div>
                </div> 

                <div class="center romperTexto"> 
                    <span class="list-item__title" style="font-size: 16px; font-weight: 800; color: #1e293b; text-transform: capitalize;">
                        ${mesNombre(i)}
                    </span>
                    <span class="list-item__subtitle" style="color: #94a3b8; font-size: 12px;">
                        Ver detalle de ingresos por cliente
                    </span>
                </div>

                <div class="right">
                    <div class="pedido-cantidad-container" style="background: rgba(61, 174, 80, 0.1); border: none; padding: 8px 12px;">
                        <span class="pedido-cantidad-valor" style="color: #2e7d32; font-size: 16px;">
                            $ ${arrayJson.toLocaleString("es-MX")}
                        </span>
                    </div>
                </div> 
            </ons-list-item> 
        </ons-card>
    `;

  return html1;
}
function graficaIngreso(importes) {
  // Actualizamos el total con formato de moneda
  $("#cantidadTotal").text("$ " + suma(importes).toLocaleString("es-MX"));

  if (chart) {
    chart.data.datasets[0].data = importes;
    chart.update();
  }
  else {
    var grafica = document.getElementById("grafica").getContext("2d");

    chart = new Chart(grafica, {
      type: "bar", // Cambiado a barras
      data: {
        labels: meses(),
        datasets: [
          {
            label: "Ganancias",
            data: importes,
            // Verde más llamativo (Esmeralda)
            backgroundColor: 'rgba(16, 185, 129, 0.2)',
            borderColor: 'rgba(16, 185, 129, 1)',
            borderWidth: 2,
            borderRadius: 5, // Bordes ligeramente redondeados en las barras
            hoverBackgroundColor: 'rgba(16, 185, 129, 0.4)',
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false // Ocultamos la leyenda para que se vea más limpio
        },
        tooltips: {
          mode: 'index',
          intersect: false,
          backgroundColor: 'rgba(30, 41, 59, 0.9)', // Fondo oscuro para el tooltip
          titleFontColor: '#fff',
          bodyFontColor: '#fff',
          callbacks: {
            label(t, d) {
              const xLabel = d.datasets[t.datasetIndex].label;
              const yLabel = '$ ' + t.yLabel.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
              return xLabel + ': ' + yLabel;
            }
          }
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              padding: 10,
              callback: (label) => {
                return '$ ' + label.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
              }
            },
            gridLines: {
              color: 'rgba(0,0,0,0.05)',
              drawBorder: false
            }
          }],
          xAxes: [{
            gridLines: {
              display: false // Quitamos líneas verticales para mayor limpieza
            }
          }]
        }
      }
    });
  }
}

function enlitsarMesIngreso(arrayJson, i) {
  // La acción de clic que ya tenías definida
  let accion = `onclick="nextPageFunctionData('ingresosMensualCliente.html', setIngresoMensualCliente, [mesIngreso, ${arrayJson.cliente}])"`;

  let html1 = `
        <ons-card style="padding:0px; background: white;" class="botonPrograma" ${accion}>
            <ons-lit-header class="pedido-header" style="background: #f4f4f4; border-radius: 20px 20px 0 0; display: flex; justify-content: space-between;">
                <div class="header-left">
                    <span class="pedido-id">CODIGO: ${agregarCeros(arrayJson.cliente)}</span>
                </div>
                <b class="pedido-entrega-status" style="color: #666;">
                    <i class="fa-solid fa-address-card"></i>&nbsp; Perfil Cliente
                </b>
            </ons-lit-header>

            <ons-list-item modifier="nodivider chevron">
                <div class="left"> 
                    <div class="producto-icon-wrapper">
                        <i class="fa-solid fa-user fa-2x"></i> 
                    </div>
                </div> 

                <div class="center romperTexto"> 
                    <span class="list-item__title" style="font-size: 15px; font-weight: 800; color: #1e293b;">
                        ${arrayJson.nombre}
                    </span>
                    
                    <span class="list-item__subtitle" style="margin-top: 4px; display: block;">
                        <div style="color: #64748b; font-size: 14px;">
                            <i class="fas fa-file-invoice" style="font-size: 12px;"></i>&nbsp;Facturas: <b>${arrayJson.facturas}</b>
                        </div>
                    </span>
                </div>

                <div class="right">
                    <div class="pedido-cantidad-container" style="background: rgba(61, 174, 80, 0.1); border: none; padding: 8px 12px;">
                        <span class="pedido-cantidad-valor" style="color: #2e7d32; font-size: 16px;">
                            $ ${new Intl.NumberFormat('es-MX').format(arrayJson.suma)}
                        </span>
                    </div>
                </div> 
            </ons-list-item> 
        </ons-card>
    `;

  return html1;
}

function graficaIngresoCliente(json) {
  let importes = [];
  let clientes = [];

  // Mantenemos tu lógica de procesamiento de datos
  for (let i = 0; i < json.length - 1; i++) {
    json[i] = JSON.parse(json[i]);
    importes.push(json[i].suma);
    clientes.push(agregarCeros(json[i].cliente));
  }

  // Actualizamos el total del mes con formato local
  $("#cantidadTotalMes").text("$ " + suma(importes).toLocaleString("es-MX"));

  var grafica = document.getElementById("graficaMes").getContext("2d");
  if (window.chartMes instanceof Chart) {
    window.chartMes.destroy();
  }

  window.chartMes = new Chart(grafica, {
    type: "bar", // Cambiado a barras para consistencia
    data: {
      labels: clientes,
      datasets: [
        {
          label: "Ingreso por Cliente (" + mesNombre(mesIngreso - 1) + ")",
          data: importes,
          // Verde Esmeralda llamativo
          backgroundColor: 'rgba(16, 185, 129, 0.2)',
          borderColor: 'rgba(16, 185, 129, 1)',
          borderWidth: 2,
          borderRadius: 5, // Barras con puntas redondeadas
          hoverBackgroundColor: 'rgba(16, 185, 129, 0.4)',
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        display: false // Más limpio sin leyenda
      },
      tooltips: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(30, 41, 59, 0.9)',
        callbacks: {
          label(t, d) {
            const yLabel = '$ ' + t.yLabel.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            return "Total: " + yLabel;
          }
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            padding: 10,
            callback: (label) => '$ ' + label.toLocaleString()
          },
          gridLines: {
            color: 'rgba(0,0,0,0.05)',
            drawBorder: false
          }
        }],
        xAxes: [{
          gridLines: {
            display: false // Limpieza total en el eje X
          },
          ticks: {
            fontStyle: 'bold' // Resalta el ID del cliente
          }
        }]
      }
    }
  });
}

//funcion para enlistar por mes cliente ingreso
function enlitsarMesIngresoCliente(arrayJson) {
  let html1 = `
        <ons-card style="padding:0px; background: white;" class="botonPrograma" onclick="setArribaIngreso(${arrayJson.id})"> 
            <ons-lit-header class="pedido-header" style="background: #f4f4f4; border-radius: 20px 20px 0 0; display: flex; justify-content: space-between;">
                <div class="header-left">
                    <span class="pedido-id">ID: ${arrayJson.id}</span>
                </div>
                <b class="pedido-entrega-status" style="color: #666;">
                    <i class="far fa-calendar-check"></i>&nbsp; ${sumarDias(arrayJson.fecha, 0)}
                </b>
            </ons-lit-header>

            <ons-list-item modifier="nodivider">
                <div class="left"> 
                    <div class="producto-icon-wrapper">
                        <i class="fa-solid fa-file-invoice-dollar fa-2x"></i> 
                    </div>
                </div> 

                <div class="center romperTexto"> 
                    <span class="list-item__title" style="font-size: 15px; font-weight: 800; color: #1e293b;">
                        Factura: ${arrayJson.factura}
                    </span>
                    <span class="list-item__subtitle" style="margin-top: 4px; display: block; color: #64748b;">
                        <i class="fas fa-hand-holding-usd" style="font-size: 11px;"></i> ${metodoPago(arrayJson.metodo_pago)}
                    </span>

                    <div style="margin-top: 6px; font-size: 13px; color: #94a3b8; font-style: italic;">
                        ${arrayJson.observaciones ? 'Observaciones: ' + arrayJson.observaciones : 'Sin observaciones'}
                    </div>
                </div>

                <div class="right">
                    <div class="pedido-cantidad-container" style="background: rgba(61, 174, 80, 0.1); border: none; padding: 8px 12px;">
                        <span class="pedido-cantidad-valor" style="color: #2e7d32; font-size: 16px;">
                            $${new Intl.NumberFormat('es-MX').format(arrayJson.total_importe)}
                        </span>
                    </div>
                </div> 
            </ons-list-item> 
        </ons-card>
    `;

  return html1;
}

function setArribaIngreso(id) {
  mensajeArriba("Opciones", ['<i class="fas fa-pen-to-square"></i>&nbsp;Modificar', { label: '<i class="fas fa-trash" style="color:red"></i>&nbsp;Eliminar', modifier: 'destructive' }],
    function (index) {
      if (index == 0) nextPageFunctionData("modificarIngresos.html", setBuscarIngreso, id)
      else if (index == 1) alertComfirm("Estas seguro de eliminar esta factura?", ["Aceptar", "Cancelar"],
        function (index) {
          if (index == 0) setEliminarIngreso(id);
        }
      );
    }
  );
}

function asignarAnio() {
  setTimeout(() => {
    let moonLanding = new Date();
    $("#anioG").text(moonLanding.getFullYear());
  }, 1);
}

//FUNCIONES PARA CAROUSEL!!
function prevI() {
  //var carousel = document.getElementById(id);
  //carousel.prev();
  var anio = parseInt($("#anioG").text()) - 1;
  $("#anioG").text(anio);
  setIngresos();
};

function nextI() {
  //var carousel = document.getElementById(id);
  //carousel.next();
  var anio = parseInt($("#anioG").text()) + 1;
  $("#anioG").text(anio);
  setIngresos();
};
