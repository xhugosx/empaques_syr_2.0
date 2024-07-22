var chart;
var mesIngreso;
//FUNCION PARA MOSTRAR LOS INGRESOS POR CLIENTE
function setIngresoMensualCliente(datos) {
  let mes = datos[0];
  let cliente = datos[1];

  $("#loadingIngresoMesCliente").empty();
  $('#loadingIngresoMesCliente').append("<ons-progress-bar indeterminate></ons-progress-bar>");
  let anio = $("#anioG").text();

  //console.log(myLink+"/php/ingresos/ingresoMensualCliente.php?anio="+anio+"&mes="+mes+"&cliente="+cliente);
  servidor(myLink+"/php/ingresos/ingresoMensualCliente.php?anio=" + anio + "&mes=" + mes + "&cliente=" + cliente, getIngresoMensualCliente);
}
function getIngresoMensualCliente(respuesta) {
  let resultado = respuesta.responseText;
  let arrayJson = resultado.split("|");
  //console.log(arrayJson);
  listaInfinita('mesesIngresosCliente', 'loadingIngresoMesCliente', arrayJson, enlitsarMesIngresoCliente);
  //console.log(arrayJson);
}
//FUNCION PARA MOSTRAR INGRESOS POR MES
function setMesIngreso(mes) {
  $("#loadingIngresoMes").empty();
  $('#loadingIngresoMes').append("<ons-progress-bar indeterminate></ons-progress-bar>");
  let anio = $("#anioG").text();
  mes = mes ? mes : mesIngreso;
  //console.log(anio,mes);
  servidor(myLink+"/php/ingresos/ingresoMensual.php?anio=" + anio + "&mes=" + mes, getMesIngreso);
}
function getMesIngreso(respuesta) {
  let resultado = respuesta.responseText;
  let arrayJson = resultado.split("|");

  listaInfinita('mesesIngresos', 'loadingIngresoMes', arrayJson, enlitsarMesIngreso);

  graficaIngresoCliente(arrayJson);
}
//FUNCION PARA MOSTRAR INGRESOS TOTALES POR AÑO
function setIngresos() {
  $("#loadingIngreso").empty();
  $('#loadingIngreso').append("<ons-progress-bar indeterminate></ons-progress-bar>");
  var anio = $("#anioG").text();
  servidor(myLink+'/php/ingresos/ingresoTotal.php?anio=' + anio, getIngresos);
}
function getIngresos(respuesta) {
  let resultado = respuesta.responseText;
  let importes = resultado.split("|");

  if (importes.length > 1) listaInfinita('Ingresos', 'loadingIngreso', importes, enlitsarIngreso);
  else {
    importes.pop();
    listaInfinita('Ingresos', 'loadingIngreso', importes, enlitsarIngreso);
    importes.push("");
  }

  importes.pop();

  graficaIngreso(importes)

}

//FUNCION PARA LLENAR SELECT DE AGREGAR INGRESO
function setIngresoClientes() {
  servidor(myLink+"/php/clientes/select.php?type=2", getIngresoClientes)
}
function getIngresoClientes(respuesta) {
  let resultado = respuesta.responseText;
  let arrayJson = resultado.split("|");

  for (let i = 0; i < arrayJson.length - 1; i++) {
    arrayJson[i] = JSON.parse(arrayJson[i]);
    $("#cliente:first-child").find('select').append("<option value='" + arrayJson[i].codigo + "'>" + agregarCeros(arrayJson[i].codigo) + " " + arrayJson[i].nombre + "</option>");

  }
  dateHoy("fecha");
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
    servidorPost(myLink+"/php/ingresos/add.php", getAgregarIngreso, formData);
  }
  else alerta("Espacios vacios!");

  //servidorPost(link,miFuncion,data)
}

function getAgregarIngreso(respuesta) {
  //console.log();
  if (respuesta.responseText == 1) {
    alerta("Ingreso Agregado");
    resetearPilaFunction(setIngresos);
  }
  else alerta("No se pudo Agregar!");

}
//esta funcion es para eliminar la factura
function setEliminarIngreso(id) {
  servidor(myLink+"/php/ingresos/delete.php?id=" + id, getEliminarIngreso);
}
function getEliminarIngreso(respuesta) {
  if (respuesta.responseText == 1) {
    alerta("La factura fue eliminada");
    resetearPilaFunction(setMesIngreso);
  }
  else alerta("No se pudo eliminar");

}
//esta funcion es para buscar y rellenar los input
function setBuscarIngreso(id) {
  servidor(myLink+"/php/ingresos/select.php?id=" + id, getBuscarIngreso);
}
function getBuscarIngreso(respuesta) {
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

  //console.log(arrayClientes,arrayCodigos);
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
    servidorPost(myLink+"/php/ingresos/update.php?id=" + id, getModificarIngreso, formData);
  }
  else alerta("Espacios vacios!");

  //servidorPost(link,miFuncion,data)
}

function getModificarIngreso(respuesta) {
  //console.log();
  if (respuesta.responseText == 1) {
    alerta("Ingreso Modificado");
    resetearPilaFunction(resetearPilaFunction, setMesIngreso);
  }
  else alerta("No se pudo Modificar!");
  //console.log(respuesta.responseText);
}

function enlitsarIngreso(arrayJson, i) {
  let html1 = "";
  if(arrayJson == 0) return "<div></div>";
  html1 += '<ons-card style="padding:0px;" class="botonPrograma" onclick="nextPageFunctionData(\'ingresosMensual.html\',setMesIngreso,' + (i + 1) + ');mesIngreso=' + (i + 1) + '"> ';
  html1 += '    <ons-list-item class="" modifier="nodivider chevron">';
  html1 += '        <div class="left"> ';
  html1 += '            <i class="fa-solid fa-money-bill-trend-up fa-2x"></i> ';
  html1 += '        </div> ';
  html1 += '        <div class="center"> ';
  html1 += '            <b> ' + mesNombre(i) + ' </b>';
  html1 += '        </div>';
  html1 += '        <div class="right" style="color: green; font-size:15px"><span>$ ' + arrayJson.toLocaleString("es-MX") + '</span></div> ';
  html1 += '    </ons-list-item> ';
  html1 += '</ons-card>';
  return html1;
}
function graficaIngreso(importes) {
  $("#cantidadTotal").text("$ " + suma(importes));
  if (chart) {
    chart.data.datasets[0].data = importes;
    chart.update();
  }
  else {
    var grafica = document.getElementById("grafica").getContext("2d");
    chart = new Chart(grafica, {
      type: "line",
      data: {
        labels: meses(),
        datasets: [
          {
            label: "Ganancias",
            backgroundColor: 'rgba(163,221,203,0.2)',
            borderColor: 'rgba(163,221,203,1)',
            data: importes

          }
        ]
      },
      options: {
        tooltips: {
          callbacks: {
            label(t, d) {
              const xLabel = d.datasets[t.datasetIndex].label;
              const yLabel = t.yLabel >= 1000 ? '$ ' + t.yLabel.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '$ ' + t.yLabel;
              return xLabel + ': ' + yLabel;
            }
          }
        },
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                callback: (label, index, labels) => {
                  return '$ ' + label.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                }
              }
            }
          ]
        }

      }
    });
  }
}

function enlitsarMesIngreso(arrayJson, i) {
  let html1 = "";

  html1 += '<ons-card style="padding:0px;" class="botonPrograma" onclick="nextPageFunctionData(\'ingresosMensualCliente.html\',setIngresoMensualCliente,[mesIngreso,' + arrayJson.cliente + '])"> ';
  html1 += '    <ons-list-item class="" modifier="nodivider chevron">';
  html1 += '        <div class="left"> ';
  html1 += '            <i class="fa-solid fa-user fa-2x"></i> ';
  html1 += '        </div> ';
  html1 += '        <div class="center"> ';
  //html1 += '            <b> '+ agregarCeros(arrayJson.cliente)+' </b> &nbsp; '+arrayJson.nombre;
  html1 += '            <span class="list-item__title"><b> ' + agregarCeros(arrayJson.cliente) + ' </b> &nbsp; ' + arrayJson.nombre + '</span>';
  html1 += '            <span class="list-item__subtitle"><div style="color:grey; font-size: 15px;">Facturas: ' + arrayJson.facturas + '</div></span>';
  html1 += '        </div>';
  html1 += '        <div class="right"><span style="color: green;font-size:15px">$' + new Intl.NumberFormat('es-MX').format(arrayJson.suma) + '</span> </div> ';
  html1 += '    </ons-list-item> ';
  html1 += '</ons-card>';
  return html1;
}

function graficaIngresoCliente(json) {
  //json = conversionTextoArray(json);
  let importes = [];
  let clientes = [];
  for (let i = 0; i < json.length - 1; i++) {
    json[i] = JSON.parse(json[i])
    importes.push(json[i].suma);
    clientes.push(agregarCeros(json[i].cliente));
  }
  //console.log(json);

  $("#cantidadTotalMes").text("$ " + suma(importes));

  var grafica = document.getElementById("graficaMes").getContext("2d");

  var chartMes = new Chart(grafica, {
    type: "line",
    data: {
      labels: clientes,
      datasets: [
        {
          label: mesNombre(mesIngreso - 1),
          backgroundColor: 'rgba(163,221,203,0.2)',
          borderColor: 'rgba(163,221,203,1)',
          data: importes

        }
      ]
    },
    options: {
      tooltips: {
        callbacks: {
          label(t, d) {
            const xLabel = d.datasets[t.datasetIndex].label;
            const yLabel = t.yLabel >= 1000 ? '$ ' + t.yLabel.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '$ ' + t.yLabel;
            return xLabel + ': ' + yLabel;
          }
        }
      },
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              callback: (label, index, labels) => {
                return '$ ' + label.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
              }
            }
          }
        ]
      }

    }
  });
}

//funcion para enlistar por mes cliente ingreso
function enlitsarMesIngresoCliente(arrayJson) {
  let html1 = "";

  html1 += '<ons-card style="padding:0px;" class="botonPrograma" onclick="setArribaIngreso(' + arrayJson.id + ')"> ';
  html1 += '     <ons-list-header style="background:white">' + sumarDias(arrayJson.fecha, 0) + '</ons-list-header>';
  html1 += '    <ons-list-item class="" modifier="nodivider">';
  html1 += '        <div class="left"> ';
  html1 += '            <i class="fa-solid fa-file-invoice-dollar fa-2x"></i> ';
  html1 += '        </div> ';
  html1 += '        <div class="center"> ';
  //html1 += '            <b> '+ agregarCeros(arrayJson.cliente)+' </b> &nbsp; '+arrayJson.nombre;
  html1 += '            <span class="list-item__title"><b> Factura: ' + arrayJson.factura + ' </b> -&nbsp; ' + metodoPago(arrayJson.metodo_pago) + '</span>';
  html1 += '            <span class="list-item__subtitle"><div style="color:grey; font-size: 15px;">Observaciones: ' + arrayJson.observaciones + '</div></span>';
  html1 += '        </div>';
  html1 += '        <div class="right"><span style="color: green;font-size:15px">$' + new Intl.NumberFormat('es-MX').format(arrayJson.total_importe) + '</span> </div> ';
  html1 += '    </ons-list-item> ';
  html1 += '</ons-card>';
  return html1;
}

function setArribaIngreso(id) {
  mensajeArriba("Opciones", ["Modificar", { label: 'Eliminar', modifier: 'destructive' }], getArribaIngreso, id)
}
function getArribaIngreso(index, id) {
  //console.log(index,id);
  if (index == 0) nextPageFunctionData("modificarIngresos.html", setBuscarIngreso, id)
  else if (index == 1) setConfirmEliminarIngreso(id)
}

function setConfirmEliminarIngreso(id) {
  //console.log(id);
  alertComfirm("Estas seguro de eliminar esta factura?", ["Aceptar", "Cancelar"], getConfirmEliminarIngreso, id)
}
function getConfirmEliminarIngreso(index, id) {
  //console.log(index,id);
  if (index == 0) setEliminarIngreso(id);
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
