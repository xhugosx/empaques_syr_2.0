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
      $("#tipo").val(tipoEgreso(arrayJson[0].tipo,1));
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
      $('#tipo').val(tipoEgreso(json.tipo,1));
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
  if (arrayJson == 0) return "<div></div>";

  // Mantenemos tu lógica de navegación y asignación de variable
  let accion = `onclick="mesIngreso = ${i + 1}; nextPageFunctionData('egresoMensual.html', setMesEgreso, mesIngreso);"`;

  let html1 = `
        <ons-card style="padding:0px; background: white;" class="botonPrograma" ${accion}>
            <ons-lit-header class="pedido-header" style="background: #f4f4f4; border-radius: 20px 20px 0 0; display: flex; justify-content: space-between;">
                <div class="header-left">
                    <span class="pedido-id">PERIODO MENSUAL</span>
                </div>
            </ons-lit-header>

            <ons-list-item modifier="nodivider chevron">
                <div class="left"> 
                    <div class="producto-icon-wrapper">
                        <i class="fa-solid fa-money-bill-trend-up fa-2x" style="transform: rotate(180deg);"></i> 
                    </div>
                </div> 

                <div class="center romperTexto"> 
                    <span class="list-item__title" style="font-size: 16px; font-weight: 800; color: #1e293b; text-transform: capitalize;">
                        ${mesNombre(i)}
                    </span>
                    <span class="list-item__subtitle" style="color: #94a3b8; font-size: 12px;">
                        Ver desglose de gastos por categoría
                    </span>
                </div>

                <div class="right">
                    <div class="pedido-cantidad-container" style="background: rgba(225, 29, 72, 0.1); border: none; padding: 8px 12px;">
                        <span class="pedido-cantidad-valor" style="color: #e11d48; font-size: 16px;">
                            $ ${arrayJson.toLocaleString("es-MX")}
                        </span>
                    </div>
                </div> 
            </ons-list-item> 
        </ons-card>
    `;

  return html1;
}

// Función para graficar egresos al año
function graficaEgresoAnual(importes) {
  // Actualizamos el total de egresos en el contenedor (con formato de moneda)
  $("#cantidadTotal").text("$ " + suma(importes).toLocaleString("es-MX"));

  if (chart) {
    chart.data.datasets[0].data = importes;
    chart.update();
  }
  else {
    var grafica = document.getElementById("grafica").getContext("2d");

    chart = new Chart(grafica, {
      type: "bar", // Cambiado a barras para consistencia con Ingresos
      data: {
        labels: meses(),
        datasets: [
          {
            label: "Gastos",
            data: importes,
            // Rojo vibrante llamativo (Rose 600)
            backgroundColor: 'rgba(225, 29, 72, 0.2)',
            borderColor: 'rgba(225, 29, 72, 1)',
            borderWidth: 2,
            borderRadius: 5, // Puntas redondeadas
            hoverBackgroundColor: 'rgba(225, 29, 72, 0.4)',
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false // Diseño limpio sin leyenda
        },
        tooltips: {
          mode: 'index',
          intersect: false,
          backgroundColor: 'rgba(30, 41, 59, 0.9)', // Fondo oscuro premium
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
              callback: (label) => '$ ' + label.toLocaleString()
            },
            gridLines: {
              color: 'rgba(0,0,0,0.05)',
              drawBorder: false
            }
          }],
          xAxes: [{
            gridLines: {
              display: false // Sin líneas verticales
            }
          }]
        }
      }
    });
  }
}
//funcion para enlistar por mes 
function enlitsarMesEgreso(arrayJson) {
  // Mantenemos tu lógica de navegación
  let accion = `onclick="nextPageFunctionData('egresoMensualTipo.html', setMesProveedorEgreso, ${arrayJson.tipo})"`;

  let html1 = `
    <ons-card style="padding:0px; background: white;" class="botonPrograma" ${accion}>
        <ons-lit-header class="pedido-header" style="background: #f4f4f4; border-radius: 20px 20px 0 0; display: flex; justify-content: space-between;">
            <div class="header-left">
                <span class="pedido-id">CATEGORÍA: 0${arrayJson.tipo}</span>
            </div>
            <b class="pedido-entrega-status" style="color: #666;">
                <i class="fas fa-tags"></i>&nbsp; Gastos por Tipo
            </b>
        </ons-lit-header>

        <ons-list-item modifier="nodivider chevron">
            <div class="left"> 
                <div class="producto-icon-wrapper">
                    <i class="fa-solid fa-user-group fa-2x"></i> 
                </div>
            </div> 

            <div class="center romperTexto"> 
                <span class="list-item__title" style="font-size: 15px; font-weight: 800; text-transform: uppercase;">
                    ${tipoEgreso(arrayJson.tipo)}
                </span>
                
                <span class="list-item__subtitle" style="margin-top: 4px; display: block;">
                    <div style="color: #64748b; font-size: 14px;">
                        <i class="fas fa-file-invoice" style="font-size: 12px;"></i> Gastos: <b>${arrayJson.facturas}</b>
                    </div>
                </span>
            </div>

            <div class="right">
                <div class="pedido-cantidad-container" style="background: rgba(225, 29, 72, 0.1); border: none; padding: 8px 12px;">
                    <span class="pedido-cantidad-valor" style="color: #e11d48; font-size: 16px;">
                        $${new Intl.NumberFormat('es-MX').format(arrayJson.importe)}
                    </span>
                </div>
            </div> 
        </ons-list-item> 
    </ons-card>
  `;

  return html1;
}

function graficaEgresoMes(json) {
  let importes = [];
  let tipos = [];

  // Mantenemos tu lógica de procesamiento de datos
  for (let i = 0; i < json.length - 1; i++) {
    json[i] = JSON.parse(json[i]);
    importes.push(json[i].importe);
    tipos.push(tipoEgreso(json[i].tipo, 1));
  }

  // Actualizamos el total del mes con formato local
  $("#cantidadTotalMes").text("$ " + suma(importes).toLocaleString("es-MX"));

  var grafica = document.getElementById("graficaMes").getContext("2d");

  // Destruimos la instancia anterior si existe para evitar errores de renderizado
  if (window.chartMesEgresos instanceof Chart) {
    window.chartMesEgresos.destroy();
  }

  window.chartMesEgresos = new Chart(grafica, {
    type: "bar", // Cambiado a barras para mejor comparación de gastos
    data: {
      labels: tipos,
      datasets: [
        {
          label: "Gasto por Categoría (" + mesNombre(mesIngreso - 1) + ")",
          data: importes,
          // Rojo vibrante llamativo (Rose 600)
          backgroundColor: 'rgba(225, 29, 72, 0.2)',
          borderColor: 'rgba(225, 29, 72, 1)',
          borderWidth: 2,
          borderRadius: 5, // Barras con puntas redondeadas
          hoverBackgroundColor: 'rgba(225, 29, 72, 0.4)',
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        display: false // Diseño limpio sin leyenda
      },
      tooltips: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(30, 41, 59, 0.9)', // Fondo oscuro premium
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
            display: false // Sin líneas verticales
          },
          ticks: {
            fontStyle: 'bold' // Resalta los tipos de egreso
          }
        }]
      }
    }
  });
}

//funcion para enlistar facturas de los proveedor
function enlitsarMesProveedorEgreso(arrayJson) {
  // Usamos la misma lógica de limpieza que en Ingresos
  let facturaTxt = arrayJson.factura ? `<i class="fas fa-file-invoice-dollar" style="font-size: 11px;"></i> <b>Factura:</b> ${arrayJson.factura}` : "";
  let obsTxt = arrayJson.observaciones ? `<span style="font-size: 13px; color: #94a3b8;">Obs: ${arrayJson.observaciones}</span>` : "";

  let html1 = `
        <ons-card style="padding:0px; background: white;" class="botonPrograma" onclick="setArribaEgreso(${arrayJson.id})"> 
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
                        <i class="fa-solid fa-file-invoice-dollar fa-2x" ></i> 
                    </div>
                </div> 

                <div class="center romperTexto"> 
                    <span class="list-item__title" style="font-size: 15px; font-weight: 800; color: #1e293b;">
                        0${arrayJson.idProveedor} ${arrayJson.proveedor}
                    </span>
                    
                    <span class="list-item__subtitle" style="margin-top: 4px; display: block; color: #64748b;">
                        <div>
                            <i class="fas fa-wallet" style="font-size: 11px;"></i> ${metodoPago(arrayJson.metodo)} 
                            <br>
                            ${facturaTxt ? facturaTxt : ''}
                        </div>
                        ${obsTxt}
                    </span>
                </div>

                <div class="right">
                    <div class="pedido-cantidad-container" style="background: rgba(225, 29, 72, 0.1); border: none; padding: 8px 12px;">
                        <span class="pedido-cantidad-valor" style="color: #e11d48; font-size: 15px;">
                            $${new Intl.NumberFormat('es-MX').format(arrayJson.importe)}
                        </span>
                    </div>
                </div> 
            </ons-list-item> 
        </ons-card>
    `;

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