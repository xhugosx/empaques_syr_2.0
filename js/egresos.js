//FUNCION PARA MOSTRAR EGRESOS MENSuALES TIPO
function setMesProveedorEgreso(tipo)
{
  $("#loadinEgresoMesTipo").empty();
  $('#loadinEgresoMesTipo').append("<ons-progress-bar indeterminate></ons-progress-bar>");
  let anio = $("#anioG").text();
  let mes = mesIngreso;

  servidor("https://empaquessyrgdl.000webhostapp.com/empaquesSyR/egresos/egresoMensualTipo.php?anio="+anio+"&mes="+mes+"&tipo="+tipo,getMesProveedorEgreso);
}
function getMesProveedorEgreso(respuesta)
{
  let resultado = respuesta.responseText;
  let arrayJson = resultado.split("|");
  //console.log(resultado);
  listaInfinita('mesesTipoEgresos','loadinEgresoMesTipo',arrayJson,enlitsarMesProveedorEgreso);
}


//FUNCION PARA MOSTRAR EGRESOS MENSIALES
function setMesEgreso(mes)
{
  $("#loadinEgresoMes").empty();
  $('#loadinEgresoMes').append("<ons-progress-bar indeterminate></ons-progress-bar>");
  let anio = $("#anioG").text();
  mes = mes ? mes : mesIngreso;
  //console.log(anio,mes);

  servidor("https://empaquessyrgdl.000webhostapp.com/empaquesSyR/egresos/egresoMensual.php?anio="+anio+"&mes="+mes,getMesEgreso);
}
function getMesEgreso(respuesta)
{
  let resultado = respuesta.responseText;
  let arrayJson = resultado.split("|");
  //console.log(resultado);
  listaInfinita('mesesEgresos','loadinEgresoMes',arrayJson,enlitsarMesEgreso);

  graficaEgresoMes(arrayJson);
}

//FUNCION PARA MOSTRAR EGRESOS ANUALES
function setEgresos()
{
  $("#loadingEgreso").empty();
  $('#loadingEgreso').append("<ons-progress-bar indeterminate></ons-progress-bar>");
  var anio = $("#anioG").text();
  servidor('https://empaquessyrgdl.000webhostapp.com/empaquesSyR/egresos/egresoTotal.php?anio='+anio,getEgresos);
}
function getEgresos(respuesta)
{
  let resultado = respuesta.responseText;
  let importes = resultado.split("|");
  if(importes.length>1) listaInfinita('egresos','loadingEgreso',importes,enlitsarEgreso);
  else 
  {
    importes.pop();
    listaInfinita('egresos','loadingEgreso',importes,enlitsarEgreso);
    importes.push("");
  }
  importes.pop();
  $("#cantidadTotal").text("$ "+suma(importes));
  graficaEgresoAnual(importes);
}

//funcion para buscar los proveedores
function accionEgresoProveedor()
{
  setEgresoProveedor();
  dateHoy('fecha');
}
function setEgresoProveedor()
{
  servidor("https://empaquessyrgdl.000webhostapp.com/empaquesSyR/proveedores/select.php?type=0", getEgresoProveedor);
}
function getEgresoProveedor(respuesta)
{
  let resultado = respuesta.responseText;
  let arrayJson = resultado.split("|");
  
  for(let i=0; i<arrayJson.length-1; i++)
  {
    arrayJson[i] = JSON.parse(arrayJson[i]);
    $("#proveedor:first-child").find('select').append("<option value='"+arrayJson[i].codigo+"'>"+arrayJson[i].nombre+"</option>");
    
  }

}
function setEgresoTipo(id)
{
  servidor("https://empaquessyrgdl.000webhostapp.com/empaquesSyR/proveedores/select.php?search="+id+"&type=0",getEgresoTipo)
}
function getEgresoTipo(respuesta)
{
  let resultado = respuesta.responseText;
  let arrayJson = resultado.split("|");
  arrayJson[0] = JSON.parse(arrayJson[0]);
  $("#tipo").val(tipoEgreso(arrayJson[0].tipo))
}

//funcion para modificar
function setModificarEgreso()
{
  let id =  $('#id').val();
  let fecha = $('#fecha').val();
  let importe = $('#importe').val();
  let metodoPago = $('#metodo').val();
  let proveedor = $('#proveedor').val();

  var form = $('#formEgreso')[0];
  var formData = new FormData(form);

  if(vacio(proveedor,fecha,importe,metodoPago))
  {
    servidorPost("https://empaquessyrgdl.000webhostapp.com/empaquesSyR/egresos/update.php?id="+id,getModificarEgreso,formData);
  }
  else alerta("Espacios vacios!");
  //servidor(,)
}
function getModificarEgreso(respuesta)
{
  //console.log(respuesta.responseText);
  if(respuesta.responseText == 1 )
  {
    alerta("Egreso Modificado");
    resetearPilaFunction(resetearPilaFunction,setMesEgreso);
  }
  else alerta("No se pudo Modificar!");
  
}

//funcion para agregar
function setAgregarEgreso()
{
  let fecha = $('#fecha').val();
  let importe = $('#importe').val();
  let metodoPago = $('#metodo').val();
  let proveedor = $('#proveedor').val();

  var form = $('#formEgreso')[0];
  var formData = new FormData(form);

  if(vacio(proveedor,fecha,importe,metodoPago))
  {
    servidorPost("https://empaquessyrgdl.000webhostapp.com/empaquesSyR/egresos/add.php",getAgregarEgreso,formData);
  }
  else alerta("Espacios vacios!");
  //servidor(,)
}
function getAgregarEgreso(respuesta)
{
  //console.log(respuesta.responseText);
  if(respuesta.responseText == 1 )
  {
    alerta("Egreso Agregado");
    resetearPilaFunction(setEgresos);
  }
  else alerta("No se pudo Agregar!");
  
}

//esta funcion es para buscar y rellenar los input

function setBuscarEgreso(id)
{
  servidor("https://empaquessyrgdl.000webhostapp.com/empaquesSyR/egresos/select.php?id="+id,getBuscarEgreso);
}
function getBuscarEgreso(respuesta)
{
  //console.log(respuesta.responseText)
  var json = JSON.parse(respuesta.responseText);

  setEgresoProveedor();
  console.log(json);
  $('#id').val(json.id);
 
  $('#fecha').val(json.fecha);
  $('#factura').val(json.factura);
  $('#tipo').val(tipoEgreso(json.tipo));
  $('#importe').val(json.importe);
  $('#metodo').val(json.metodo);
  $('#observaciones').val(json.observaciones);


  //esto es para que lo ejecute varias veces hasta que se llene el select
  var idSet = setInterval(() => {
    if($('#proveedor').val() != "") clearInterval(idSet); 
    else $('#proveedor').val(json.egresos_proovedor);
    //console.log("entro");
  }, 1);

  
};

//FUNCION PARA ELIMINAR EGRESO
function setEliminarEgreso(id)
{
  servidor("https://empaquessyrgdl.000webhostapp.com/empaquesSyR/egresos/delete.php?id="+id,getEliminarEgreso);
}
function getEliminarEgreso(respuesta)
{
  if(respuesta.responseText == 1)
  {
    alerta("La factura fue eliminada");
    resetearPilaFunction(setMesEgreso);
  }
  else alerta("No se pudo eliminar");
   
}

  

//funcion para enlistar el total
function enlitsarEgreso(arrayJson,i)
{
  let html1 = "";
  
  html1 += '<ons-card style="padding:0px;" class="botonPrograma" onclick="mesIngreso='+(i+1)+'; nextPageFunctionData(\'egresoMensual.html\',setMesEgreso,mesIngreso);"> ';
  html1 += '    <ons-list-item class="" modifier="nodivider chevron">'; 
  html1 += '        <div class="left"> ';
  html1 += '            <i class="fa-solid fa-money-bill-trend-up fa-2x" style="transform: rotate(180deg);"></i> ';
  html1 += '        </div> ';
  html1 += '        <div class="center"> ';
  html1 += '            <b> '+mesNombre(i)+' </b>';
  html1 += '        </div>';
  html1 += '        <div class="right" style="color: red;font-size:14px">$ ' + arrayJson.toLocaleString("en")+'</div> ';
  html1 += '    </ons-list-item> ';
  html1 += '</ons-card>';
  return html1;
}

//funcion para graficar egresos al año
function graficaEgresoAnual(importes)
{
  console.log(importes);
  if(chart) 
  {
    chart.data.datasets[0].data = importes;
    chart.update();
  }
  else 
  {
    var grafica = document.getElementById("grafica").getContext("2d");
    chart = new Chart(grafica,{
      type: "line",
      data:{
        labels: meses(),
          datasets:[
              {
                  label:"Gastos",
                  backgroundColor: 'rgba(229,112,126,0.2)',
                  borderColor: 'rgba(229,112,126,1)',
                  data: importes,

              }
          ],
      },
      options: {
        tooltips: {
            callbacks: {
              label (t, d) {
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
function enlitsarMesEgreso(arrayJson)
{
  let html1 = "";

  html1 += '<ons-card style="padding:0px;" class="botonPrograma" onclick="nextPageFunctionData(\'egresoMensualTipo.html\',setMesProveedorEgreso,'+arrayJson.tipo+')"> ';
  html1 += '    <ons-list-item class="" modifier="nodivider chevron">'; 
  html1 += '        <div class="left"> ';
  html1 += '            <i class="fa-solid fa-user-group fa-2x"></i> ';
  html1 += '        </div> ';
  html1 += '        <div class="center"> ';
  html1 += '            <span class="list-item__title"><b> 0'+ arrayJson.tipo +' '+tipoEgreso(arrayJson.tipo)+'</b></span>';
  html1 += '            <span class="list-item__subtitle"><div style="color:grey; font-size: 15px;">Facturas: ' + arrayJson.facturas+'</div></span>'; 
  html1 += '        </div>';
  html1 += '        <div class="right"><span style="color: red;font-size:14px">$' + new Intl.NumberFormat('es-MX').format(arrayJson.importe)+'</span> </div> ';
  html1 += '    </ons-list-item> ';
  html1 += '</ons-card>';
  return html1;
}

function graficaEgresoMes(json)
{
  //json = conversionTextoArray(json);
  let importes = [];
  let tipos = [];

  for(let i=0;i<json.length-1;i++)
  {
    json[i] = JSON.parse(json[i]);
    importes.push(json[i].importe);
    tipos.push( tipoEgreso(json[i].tipo) );
  }
  //console.log(json);
  
  $("#cantidadTotalMes").text("$ "+suma(importes));

  var grafica = document.getElementById("graficaMes").getContext("2d");

  var chartMes = new Chart(grafica,{
    type: "line",
    data:{
        labels: tipos,
        datasets:[
          {
            label: mesNombre(mesIngreso-1),
            backgroundColor: 'rgba(229,112,126,0.2)',
            borderColor: 'rgba(229,112,126,1)',
            data: importes,
          }
        ]
    },
    options: {
      tooltips: {
          callbacks: {
            label (t, d) {
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
function enlitsarMesProveedorEgreso(arrayJson)
{
  let html1 = "";
  let factura = arrayJson.factura != "" ? 'Facturas: ' + arrayJson.factura +'<br>' : "";
  let observaciones = arrayJson.observaciones != "" ? 'Observaciones: ' + arrayJson.observaciones +'<br>' : "";

  html1 += '<ons-card style="padding:0px;" class="botonPrograma" onclick="setArribaEgreso('+arrayJson.id+')"> ';
  html1 += '    <ons-list-header style="background:white">'+ sumarDias(arrayJson.fecha,0)+'</ons-list-header>';
  html1 += '    <ons-list-item class="" modifier="nodivider ">'; 
  html1 += '        <div class="left"> ';
  html1 += '            <i class="fa-solid fa-user fa-2x"></i> ';
  html1 += '        </div> ';
  html1 += '        <div class="center"> ';
  html1 += '            <span class="list-item__title"><b> 0'+ arrayJson.idProveedor +' '+ arrayJson.proveedor +'</b> - '+ metodoPago(arrayJson.metodo)+'</span>';
  html1 += '            <span class="list-item__subtitle"><div style="color:grey; font-size: 15px;">'+ factura +' '+ observaciones +'</div></span>'; 
  html1 += '        </div>';
  html1 += '        <div class="right"><span style="color: red;font-size:14px">$' + new Intl.NumberFormat('es-MX').format(arrayJson.importe)+'</span> </div> ';
  html1 += '    </ons-list-item> ';
  html1 += '</ons-card>';
  return html1;
}

// FUNCIONES PARA NOTIFICACIONES

function setArribaEgreso(id)
{
  mensajeArriba("Opciones",["Modificar",{label:'Eliminar',modifier: 'destructive'}],getArribaEgreso,id)
}
function getArribaEgreso(index,id)
{
  //console.log(index,id);
  if(index == 0) nextPageFunctionData("modificarEgresos.html",setBuscarEgreso,id)
  else if(index == 1) setConfirmEliminarEgreso(id);
}

function setConfirmEliminarEgreso(id)
{
  //console.log(id);
  alertComfirm("Estas seguro de eliminar esta factura?",["Aceptar","Cancelar"],getConfirmEliminarEgreso,id)
}
function getConfirmEliminarEgreso(index,id)
{
  //console.log(index,id);
  if(index == 0) setEliminarEgreso(id);
}

//FIN DE FUNCIONES PARA NOTIFICACIONES 


function mesNombre(numero)
{
  var mes = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  return mes[numero];
}
function suma(array)
{
  let total = 0;
  for(let i=0; i<array.length;i++)
  {
      total+=parseFloat(array[i]);
  }
  return separator(total.toFixed(2));
}


function prevE() {
  //var carousel = document.getElementById(id);
  //carousel.prev();
  var anio = parseInt($("#anioG").text())-1;
  $("#anioG").text(anio);
  setEgresos();
};

function nextE() {
  //var carousel = document.getElementById(id);
  //carousel.next();
  var anio = parseInt($("#anioG").text())+1;
  $("#anioG").text(anio);
  setEgresos();
};