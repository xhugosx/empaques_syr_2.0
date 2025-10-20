//FUNCION PARA MOSTRAR EGRESOS MENSuALES TIPO
function setMesProveedorEgreso(tipo) {
  oCarga("Cargando Egresos...");
  let anio = $("#anioG").text();
  let mes = mesIngreso;

  servidor(myLink + "/php/egresos/egresoMensualTipo.php?anio=" + anio + "&mes=" + mes + "&tipo=" + tipo,
    function (respuesta) {
      let resultado = respuesta.responseText;
      let arrayJson = resultado.split("|");
      listaInfinita('mesesTipoEgresos', '', arrayJson, enlitsarMesProveedorEgreso);
      cCarga();
    }
  );
}

//FUNCION PARA MOSTRAR EGRESOS MENSIALES
function setMesEgreso(mes) {
  oCarga("Cargando Egresos...");
  let anio = $("#anioG").text();
  mes = mes ? mes : mesIngreso;

  servidor(myLink + "/php/egresos/egresoMensual.php?anio=" + anio + "&mes=" + mes,
    function (respuesta) {
      let resultado = respuesta.responseText;
      let arrayJson = resultado.split("|");
      listaInfinita('mesesEgresos', 'loadinEgresoMes', arrayJson, enlitsarMesEgreso);
      //console.log(myLink + "/php/ingresos/ingresoMensual.php?anio=" + anio + "&mes=" + mes,respuesta.responseText);
      graficaEgresoMes(arrayJson);
      cCarga();
    }
  );
}

//FUNCION PARA MOSTRAR EGRESOS ANUALES
function setEgresos() {
  oCarga("Cargando Egresos...");
  var anio = $("#anioG").text();
  servidor(myLink + '/php/egresos/egresoTotal.php?anio=' + anio,
    function (respuesta) {
      //console.log(respuesta.responseText);
      let resultado = respuesta.responseText;
      let importes = resultado.split("|");
      if (importes.length > 1) listaInfinita('egresos', 'loadingEgreso', importes, enlitsarEgreso);
      else {
        importes.pop();
        listaInfinita('egresos', 'loadingEgreso', importes, enlitsarEgreso);
        importes.push("");
      }
      importes.pop();
      $("#cantidadTotal").text("$ " + suma(importes));
      graficaEgresoAnual(importes);
      cCarga();
      
    }
  );
}

//funcion para buscar los proveedores
function accionEgresoProveedor() {
  setEgresoProveedor();
  dateHoy('fecha');
}

function setEgresoProveedor() {
  oCarga("Cargando Proveedores...");
  servidor(myLink + "/php/proveedores/select.php?type=0",
    function (respuesta) {
      let resultado = respuesta.responseText;
      let arrayJson = resultado.split("|");

      for (let i = 0; i < arrayJson.length - 1; i++) {
        arrayJson[i] = JSON.parse(arrayJson[i]);
        $("#proveedor:first-child").find('select').append("<option value='" + arrayJson[i].codigo + "'>" + arrayJson[i].nombre + "</option>");

      }
      cCarga();
    }
  );
}

function setEgresoTipo(id) {
  servidor(myLink + "/php/proveedores/select.php?search=" + id + "&type=0",
    function (respuesta) {
      let resultado = respuesta.responseText;
      let arrayJson = resultado.split("|");
      arrayJson[0] = JSON.parse(arrayJson[0]);
      $("#tipo").val(tipoEgreso(arrayJson[0].tipo))
    }
  )
}


//funcion para modificar
function setModificarEgreso() {
  let id = $('#id').val();
  let fecha = $('#fecha').val();
  let importe = $('#importe').val();
  let metodoPago = $('#metodo').val();
  let proveedor = $('#proveedor').val();

  var form = $('#formEgreso')[0];
  var formData = new FormData(form);

  if (vacio(proveedor, fecha, importe, metodoPago)) {
    oCarga("Modificando Egreso...");
    servidorPost(myLink + "/php/egresos/update.php?id=" + id,
      function (respuesta) {
        console.log(respuesta.responseText);
        if (respuesta.responseText == 1) {
          alerta("Egreso Modificado");
          resetearPilaFunction(resetearPilaFunction, setMesEgreso);
        }
        else alerta("No se pudo Modificar!");
        cCarga();

      }, formData);
  }
  else alerta("Espacios vacios!");
  //servidor(,)
}

//funcion para agregar
function setAgregarEgreso() {
  let fecha = $('#fecha').val();
  let importe = $('#importe').val();
  let metodoPago = $('#metodo').val();
  let proveedor = $('#proveedor').val();

  var form = $('#formEgreso')[0];
  var formData = new FormData(form);

  if (vacio(proveedor, fecha, importe, metodoPago)) {
    oCarga("Agregando Egreso...");
    servidorPost(myLink + "/php/egresos/add.php",
      function (respuesta) {
        if (respuesta.responseText == 1) {
          alerta("Egreso Agregado");
          resetearPilaFunction(setEgresos);
          cCarga();
        }
        else alerta("No se pudo Agregar!")
        //console.log(respuesta.responseText);
      }, formData);
  }
  else alerta("Espacios vacios!");
  //servidor(,)
}

function setBuscarEgreso(id) {
  oCarga("Cargando Egreso...");
  servidor(myLink + "/php/egresos/select.php?id=" + id,
    function (respuesta) {
      //console.log(respuesta.responseText)
      var json = JSON.parse(respuesta.responseText);

      setEgresoProveedor();
      //console.log(json);
      $('#id').val(json.id);

      $('#fecha').val(json.fecha);
      $('#factura').val(json.factura);
      $('#tipo').val(tipoEgreso(json.tipo));
      $('#importe').val(json.importe);
      $('#metodo').val(json.metodo);
      $('#observaciones').val(json.observaciones);


      //esto es para que lo ejecute varias veces hasta que se llene el select
      var idSet = setInterval(() => {
        if ($('#proveedor').val() != "") clearInterval(idSet);
        else $('#proveedor').val(json.egresos_proovedor);
        //console.log("entro");
      }, 1);
      cCarga();
    }
  );
}

//FUNCION PARA ELIMINAR EGRESO
function setEliminarEgreso(id) {
  oCarga("Eliminando Egreso...");
  servidor(myLink + "/php/egresos/delete.php?id=" + id,
    function (respuesta) {
      if (respuesta.responseText == 1) {
        alerta("La factura fue eliminada");
        resetearPilaFunction(setMesEgreso);
        cCarga();
      }
      else alerta("No se pudo eliminar");
    }
  );
}

//funcion para enlistar el total
function enlitsarEgreso(arrayJson, i) {
  let html1 = "";
  if (arrayJson == 0) return "<div></div>";
  html1 += '<ons-card style="padding:0px;" class="botonPrograma" onclick="mesIngreso=' + (i + 1) + '; nextPageFunctionData(\'egresoMensual.html\',setMesEgreso,mesIngreso);"> ';
  html1 += '    <ons-list-item class="" modifier="nodivider chevron">';
  html1 += '        <div class="left"> ';
  html1 += '            <i class="fa-solid fa-money-bill-trend-up fa-2x" style="transform: rotate(180deg);"></i> ';
  html1 += '        </div> ';
  html1 += '        <div class="center"> ';
  html1 += '            <b> ' + mesNombre(i) + ' </b>';
  html1 += '        </div>';
  html1 += '        <div class="right" style="color: red;font-size:14px">$ ' + arrayJson.toLocaleString("en") + '</div> ';
  html1 += '    </ons-list-item> ';
  html1 += '</ons-card>';
  return html1;
}

//funcion para graficar egresos al año
function graficaEgresoAnual(importes) {
  //console.log(importes);
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
            label: "Gastos",
            backgroundColor: 'rgba(229,112,126,0.2)',
            borderColor: 'rgba(229,112,126,1)',
            data: importes,

          }
        ],
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
//funcion para enlistar por mes 
function enlitsarMesEgreso(arrayJson) {
  let html1 = "";

  html1 += '<ons-card style="padding:0px;" class="botonPrograma" onclick="nextPageFunctionData(\'egresoMensualTipo.html\',setMesProveedorEgreso,' + arrayJson.tipo + ')"> ';
  html1 += '    <ons-list-item class="" modifier="nodivider chevron">';
  html1 += '        <div class="left"> ';
  html1 += '            <i class="fa-solid fa-user-group fa-2x"></i> ';
  html1 += '        </div> ';
  html1 += '        <div class="center"> ';
  html1 += '            <span class="list-item__title"><b> 0' + arrayJson.tipo + ' ' + tipoEgreso(arrayJson.tipo) + '</b></span>';
  html1 += '            <span class="list-item__subtitle"><div style="color:grey; font-size: 15px;">Facturas: ' + arrayJson.facturas + '</div></span>';
  html1 += '        </div>';
  html1 += '        <div class="right"><span style="color: red;font-size:14px">$' + new Intl.NumberFormat('es-MX').format(arrayJson.importe) + '</span> </div> ';
  html1 += '    </ons-list-item> ';
  html1 += '</ons-card>';
  return html1;
}

function graficaEgresoMes(json) {
  //json = conversionTextoArray(json);
  let importes = [];
  let tipos = [];

  for (let i = 0; i < json.length - 1; i++) {
    json[i] = JSON.parse(json[i]);
    importes.push(json[i].importe);
    tipos.push(tipoEgreso(json[i].tipo));
  }
  //console.log(json);

  $("#cantidadTotalMes").text("$ " + suma(importes));

  var grafica = document.getElementById("graficaMes").getContext("2d");

  var chartMes = new Chart(grafica, {
    type: "line",
    data: {
      labels: tipos,
      datasets: [
        {
          label: mesNombre(mesIngreso - 1),
          backgroundColor: 'rgba(229,112,126,0.2)',
          borderColor: 'rgba(229,112,126,1)',
          data: importes,
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

//funcion para enlistar facturas de los proveedor
function enlitsarMesProveedorEgreso(arrayJson) {
  let html1 = "";
  let factura = arrayJson.factura != "" ? 'Facturas: ' + arrayJson.factura + '<br>' : "";
  let observaciones = arrayJson.observaciones != "" ? 'Observaciones: ' + arrayJson.observaciones + '<br>' : "";

  html1 += '<ons-card style="padding:0px;" class="botonPrograma" onclick="setArribaEgreso(' + arrayJson.id + ')"> ';
  html1 += '    <ons-list-header style="background:white">' + sumarDias(arrayJson.fecha, 0) + '</ons-list-header>';
  html1 += '    <ons-list-item class="" modifier="nodivider ">';
  html1 += '        <div class="left"> ';
  html1 += '            <i class="fa-solid fa-user fa-2x"></i> ';
  html1 += '        </div> ';
  html1 += '        <div class="center"> ';
  html1 += '            <span class="list-item__title"><b> 0' + arrayJson.idProveedor + ' ' + arrayJson.proveedor + '</b> - ' + metodoPago(arrayJson.metodo) + '</span>';
  html1 += '            <span class="list-item__subtitle"><div style="color:grey; font-size: 15px;">' + factura + ' ' + observaciones + '</div></span>';
  html1 += '        </div>';
  html1 += '        <div class="right"><span style="color: red;font-size:14px">$' + new Intl.NumberFormat('es-MX').format(arrayJson.importe) + '</span> </div> ';
  html1 += '    </ons-list-item> ';
  html1 += '</ons-card>';
  return html1;
}

// FUNCIONES PARA NOTIFICACIONES

function setArribaEgreso(id) {
  mensajeArriba("Opciones", ['<i class="fas fa-pen-to-square"></i>&nbsp;Modificar', { label: '<i class="fas fa-trash" style="color:red"></i>&nbsp;Eliminar', modifier: 'destructive' }],
    function (index) {
      if (index == 0)
        nextPageFunctionData("modificarEgresos.html", setBuscarEgreso, id);
      else if (index == 1)
        alertComfirm("Estas seguro de eliminar esta factura?", ["Aceptar", "Cancelar"],
          function (index) {
            if (index == 0) setEliminarEgreso(id);
          });
    });
}



function mesNombre(numero) {
  var mes = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  return mes[numero];
}
function suma(array) {
  let total = 0;
  for (let i = 0; i < array.length; i++) {
    total += parseFloat(array[i]);
  }
  return separator(total.toFixed(2));
}


function prevE() {
  //var carousel = document.getElementById(id);
  //carousel.prev();
  var anio = parseInt($("#anioG").text()) - 1;
  $("#anioG").text(anio);
  setEgresos();
};

function nextE() {
  //var carousel = document.getElementById(id);
  //carousel.next();
  var anio = parseInt($("#anioG").text()) + 1;
  $("#anioG").text(anio);
  setEgresos();
};