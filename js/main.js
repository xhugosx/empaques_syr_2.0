/*/FUNCION PARA CREAR UNA PROMESA Y DEVOLVER ALGO
function promesa()
{
  
}*/



//FUNCION PARA GENERAR MENSAJES DE CONFIRMACION CON ENTRADA DE DATO
var myLink = "https://empaquessr.com/sistema/cinthya";
function alertComfirmDato(mensaje, tipoDato, botones, miFuncion, json) {
  ons.notification.prompt({
    title: '',
    inputType: tipoDato,
    buttonLabels: botones,
    message: mensaje,
  }).then(function (input) {
    miFuncion(input, json);
  });
}
//FUNCION PARA GENERAR MENSAJE DE CONFIRMACION
function alertComfirm(mensaje, botones, miFuncion, json) {
  ons.notification.confirm({
    title: "",
    message: mensaje,
    buttonLabels: botones,
    callback: function (idx) {
      miFuncion(idx, json);
    }
  });
}

function mensajeArriba(titulo, botones, funcion, datos) {
  ons.openActionSheet({
    title: titulo,
    cancelable: true,
    buttons: botones
  }).then(function (index) {
    funcion(index, datos)
  });
}
//function convertir json en array
function conversionJsonArray(json) {
  var array = [];
  for (var clave in json) {
    // Controlando que json realmente tenga esa propiedad
    if (json.hasOwnProperty(clave)) {
      // Mostrando en pantalla la clave junto a su valor
      array.push(clave);
      array.push(json[clave]);
    }
  }
  return array;
}

//funcion para convertirArray a Json
function conversionArrayJson(array) {
  var json = "{"
  for (var i = 0; i < array.length; i += 2) {
    json += '"' + array[i] + '":' + '"' + array[i + 1] + '",';

    //if(i<array.length-1) json += ",";
  }
  json = json.slice(0, -1); //esto para eliminar la ultima coma
  json += "}";

  //console.log(json);
  return json = JSON.parse(json);
}
function conversionTextoArray(txt) {
  let arrayJson = [];
  for (let i = 0; i < txt.length; i++) arrayJson.push(JSON.parse(txt[i]));
  //console.log(arrayJson);
  return arrayJson;
}

//ESTA FUNCION ES PARA EJECUTAR UNA FUNCION AL PAR LA SIGUIENTE PAGINA
function nextPageFunction(miPage, miFuncion) {
  myNavigator.pushPage(miPage, { data: { title: '' } }).then(function () {

    miFuncion();

  });
}
//ESTA FUNCION SOLO TE PASA A LA SIGUIENTE PAGINA
function nextPage(miPage) {
  myNavigator.pushPage(miPage, { data: { title: '' } });
}
// esta funcion solo pasa a la siguiente pagina con un una variable como parametro
function nextPageFunctionData(miPage, miFuncion, dato) {
  myNavigator.pushPage(miPage, { data: { title: '' } }).then(function () {

    miFuncion(dato);

  });
}
//FUMCION PRA MOSTRAR UN MENSAJE
function alerta(mensaje, tittle) {
  ons.notification.alert({
    title: ' ',
    message: mensaje,
    buttonLabels: 'Aceptar'
  });
}
//ESTA FUNCIONA PARA MANDAR DATOS AL SERVIDOR Y RECIBIR SU RESPUESTA
function servidor(link, miFuncion) {
  if (window.navigator.onLine) {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {

        miFuncion(this);

      }
      else if (this.status == 500) {
        alerta("Error en el servidor")
      }

    };

    xhttp.open("GET", link, true);
    xhttp.send();
  }
  else {
    alerta('Revisa tu conexión <i style="color:gray" class="fa-solid fa-wifi fa-lg"></i>');
  }

}
function servidorPost(link, miFuncion, data) {
  if (window.navigator.onLine) {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {

        miFuncion(this);

      }
      else if (this.status == 500) {
        alerta("Error en el servidor")
      }

    };

    xhttp.open("POST", link, true);
    xhttp.send(data);
  }
  else {
    alerta('Revisa tu conexión <i style="color:gray" class="fa-solid fa-wifi fa-lg"></i>');
  }

}

//ASIGNAR DATOS A UN HTML Y BORRAR UNA SECCION DEL HTML
function setDataPage(agregar, eliminar, html) {
  if (eliminar != 0) $(eliminar).empty();
  $(agregar).append(html);
}
//ESTA ES PARA MOSTRAR MENSAJE DEL LADO INFERIOR
function crearObjetMensaje(codigo, contador) {
  ons.openActionSheet({
    title: 'OPCIONES',
    cancelable: true,
    buttons: [
      'Ver Plano',
      'Modificar',
      {
        label: 'Eliminar',
        modifier: 'destructive'
      }
    ]
  }).then(function (index) {
    if (index == 0) {
      let navegador = navigator.userAgent;
      var timestamp = new Date().getTime();
      let codigos = codigo.split("/");
      let codigo1 = codigos[0];
      let codigo2 = codigos[1];
      var url = myLink + '/planos/' + codigo1 + '/' + codigo1 + '-' + codigo2 + '.pdf?timestamp=' + timestamp;
      if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i)) {
        nextPageFunctionData('verPlano.html', verPlano, url);
      } else {
        window.open(url, '_blank');

        //window.open(myLink+'/planos/' + codigo.substring(0, 3) + '/' + codigo.substring(0, 3) + '-' + codigo.substring(4, 7) + '.pdf', '_blank');
      }
    }  //window.open(myLink+'/planos/'+codigo.substring(0,3)+'/'+codigo.substring(0,3)+'-'+codigo.substring(4,7)+'.pdf', '_blank');
    else if (index == 1) nextPageFunctionData('ActualizarProductos.html', setBuscarProductoActualizar, codigo); //alert("modificara "+codigo);
    else if (index == 2) alertaConfirm('Estas seguro de eliminar este producto? ' + codigo, setEliminarProducto, codigo, contador);
  });
}
function crearObjetMensajePedido(oc, id, codigo, estado, observaciones, fecha) {
  observaciones = observaciones == "" ? "Sin observaciones" : observaciones;
  let titulo = estadoPedidos(estado);
  let botonEstado = estado == 0 || estado == 1 || estado == 6 ? "Cancelar" : "Estado";
  //if (estado == 1) titulo = "🟠 En proceso"; else if(estado == 2) titulo = "🟢 Producto terminado"; else titulo = " ⚪Pendiente"; 
  ons.openActionSheet({
    title: titulo + " " + id,
    cancelable: true,
    buttons: [
      '<b>Programar<b/>',
      botonEstado,
      'Ver Plano',
      'Detalles',
      'Modificar',
      {
        label: 'Eliminar',
        modifier: 'destructive'
      }
    ]
  }).then(function (index) {
    if (index == 0) {
      if (estado == 0) Abrirdialogo('my-dialog-programa', 'dialogPrograma.html', id);
      else if (estado == 1) alertaConfirPrograma("Ya fue programado deseas actualizarlo?", setLlenarProcesoPrograma, [id, 1]);
      else if (estado == 6) alerta("Pedido Cancelado");
      else alerta("Pedido ya se encuentra en Terminado");
    }
    else if (index == 1 && botonEstado == "Cancelar") {
      if (estado == 1) alerta("Primero elimina el pedido del programa");
      else if (estado == 6) alerta("Ya se encuentra cancelado");
      else alertaConfirm('Estas seguro de Cancelar el pedido? ' + id, setActualizarEstadoPedido, [id, 6]); //aqui se cancela el pedido
    }
    else if (index == 1 && botonEstado == "Estado") {
      crearObjetMensajePedidoEstado(id); // aqui se cambiara el estado
    }
    else if (index == 2) {
      let navegador = navigator.userAgent;
      var timestamp = new Date().getTime();
      let codigos = codigo.split("/");
      let codigo1 = codigos[0];
      let codigo2 = codigos[1];
      var url = myLink + '/planos/' + codigo1 + '/' + codigo1 + '-' + codigo2 + '.pdf?timestamp=' + timestamp;
      if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i)) {
        //console.log("Estás usando un dispositivo móvil!!");
        nextPageFunctionData('verPlano.html', verPlano, url);
      } else {
        window.open(url, '_blank');
      }
      //window.open(myLink+'/planos/'+codigo.substring(0,3)+'/'+codigo.substring(0,3)+'-'+codigo.substring(4,7)+'.pdf', '_blank');

    }
    else if (index == 3) alerta("<b>Orden de Compra: </b><br>" + oc + "<br><br><b>Fecha del pedido:</b><br>" + fecha + "<br><br><b>Observaciones: </b><br>" + observaciones + "<br>");
    else if (index == 4) {
      if (estado != 4 && estado != 5) nextPageFunctionData('pedidosModificar.html', setModificarBuscarPedido, id);
      else alertComfirm("Qué deseas Modificar?", ["Pedido", "Facturas", "<b style=\"color:red\">Cancelar</b>"], modificarPedidoFaturas, id);
    }
    else if (index == 5) alertaConfirm('Estas seguro de eliminar este pedido? ' + id, setEliminarPedido, id);

  });
}
function modificarPedidoFaturas(index, id) {
  //alerta(index + " " + id);
  if (index == 0) nextPageFunctionData('pedidosModificar.html', setModificarBuscarPedido, id);
  else if (index == 1) nextPageFunctionData('facturasModificar.html', setModificarBuscarFacturas, id);

}

function crearObjetMensajePedidoEstado(id) {
  ons.openActionSheet({
    title: "<b>Estado</b>",
    cancelable: true,
    buttons: [
      estadoPedidos(4),
      estadoPedidos(5),
    ]
  }).then(function (index) {

    if (index == 0) {
      idPedido = id;
      estadoPedido = 4;
    } //setActualizarEstadoPedido([id,4]);
    else if (index == 1) {
      idPedido = id;
      estadoPedido = 5;
    }//setActualizarEstadoPedido([id,5]);

    if (index == 0 || index == 1) {

      Abrirdialogo('my-dialogAgregarFactura', 'dialogAgregarFactura.html', id, fechaFactura);
      setTimeout(() => {

      }, 500);
    }

  });
}
function fechaFactura() {
  $('#fechaFactura').val(fechaHoy());
}
var estadoPedido;

function crearObjetMensajePedidoInserto(id, codigo, estado, notas) {
  let titulo = estadoPedidos(estado);
  ons.openActionSheet({
    title: titulo,
    cancelable: true,
    buttons: [
      '<b>Programar<b/>',
      'Notas',
      'Modificar',
      {
        label: 'Eliminar',
        modifier: 'destructive'
      }
    ]
  }).then(function (index) {
    if (index == 0) {
      if (estado == 0) Abrirdialogo('my-dialog-programa1', 'dialogPrograma1.html', id);
      else if (estado == 1) alertaConfirPrograma("Ya fue programado deseas actualizarlo?", setLlenarProcesoPrograma, [id, 0]);
      else alerta("Pedido ya se encuentra en inventario");
    }
    else if (index == 1) alerta("<b>Notas: </b><br><br>" + notas);
    else if (index == 2) nextPageFunctionData('pedidosInsertoModificar.html', setModificarBuscarPedidoInserto, id); //alert("modificara "+codigo);
    else if (index == 3) alertaConfirm('Estas seguro de eliminar este pedido? ' + id, setEliminarPedidoInserto, id);

  });
}
function estadoPedidos(estado) {
  const estados = {
    0: "⚪ Pendiente",
    1: "🟠 En proceso",
    2: "🟢 Producto terminado",
    3: "🟩 Producto terminado (Inventario)",
    6: "⚫ Cancelado",
    4: "🔵 Entregado",
    5: "🟣 E. Parcial"
  };

  return estados[estado];
}

function crearObjetMensajeCliente(id, i) {
  ons.openActionSheet({
    title: 'OPCIONES / ' + agregarCeros(id),
    cancelable: true,
    buttons: [
      'Copiar RFC',
      'Copiar Contraseña',
      'Editar',
      {
        label: 'Eliminar',
        modifier: 'destructive'
      }
    ]
  }).then(function (index) {
    if (index == 0) { copyToClipboard('#rfc' + i); alertToast("Copiado al portapapeles!", 2000); }
    else if (index == 1) { copyToClipboard('#contrasena' + i); alertToast("Copiado al portapapeles!", 2000); }
    else if (index == 2) nextPageFunctionData('editarClientes.html', setBuscarEditarCliente, id);
    else if (index == 3) alertaConfirm('Estas seguro de eliminar este cliente ' + agregarCeros(id) + '?<br><font color="red">(Recuerda que esto eliminara todos lo enlazado Archivos, Pedidos, Inventario)</font>', setEliminarCliente, id, i);
  });
}

//funcion para copiar rfc o contraseña del usuario
function copyToClipboard(elemento) {
  var $temp = $("<input>")
  $("body").append($temp);
  $temp.val($(elemento).text()).select();
  document.execCommand("copy");
  $temp.remove();
}

function crearObjetMensajeProcesoPrograma(idP, id, cantidad, codigo, resistencia, observaciones, papel) {

  ons.openActionSheet({
    title: 'ASIGNAR PROCESO - ' + codigo,
    cancelable: true,
    buttons: [
      '<i class="fa-solid fa-circle" style="color: rgba(35, 154, 75, 0.933);"></i> Terminado ',
      '<i class="fa-solid fa-circle" style="color: rgb(233, 188, 105);"></i> Proceso ',
      '<i class="fa-solid fa-circle" style="color:rgb(209, 209, 209);"></i> Pendiente ',
      'Finalizar',
      {
        label: 'Eliminar',
        modifier: 'destructive'
      }
    ]
  }).then(function (index) {
    if (index == 0) setActualizarEstado(idP, 2);
    else if (index == 1) setActualizarEstado(idP, 1);
    else if (index == 2) setActualizarEstado(idP, 0);
    else if (index == 3) alertPrompt(id, cantidad, codigo, resistencia, observaciones, papel);
    else if (index == 4) alertaConfirPrograma("Estas seguro de eliminar este pedido del programa?", setEliminarPrograma, id);//eliminar

  });
}
//FUNCION DE MENSAJE DE CONFIRMACION
function alertaConfirm(mensaje, funcion, variable, contador) {
  ons.notification.confirm({
    title: '',
    message: mensaje,
    buttonLabels: ['SI', 'NO'],
    callback: function (idx) {
      if (idx == 0) funcion(variable, contador);
    }
  });
}
function alertaConfirmSiNo(mensaje, funcionSi, funcionNo, funcion) {
  ons.notification.confirm({
    message: mensaje,
    buttonLabels: ['SI', 'NO'],
    callback: function (idx) {
      if (idx == 0) funcionSi();
      else funcionNo(funcion);
    }
  });
}
function alertaConfirPrograma(mensaje, funcionSi, id) {
  ons.notification.confirm({
    title: "",
    message: mensaje,
    buttonLabels: ['SI', 'NO'],
    callback: function (idx) {
      if (idx == 0) funcionSi(id);
    }
  });
}

//funcion para alert confirm global
function alertConfirmReporteFaltante(mensaje, json, input) {
  //setAgregarFaltante(id,codigo,cantidad,resistencia,oc,fecha_oc)
  ons.notification.confirm({
    title: "",
    message: mensaje,
    buttonLabels: ['SI', 'NO'],
    callback: function (idx) {
      if (idx == 0) {
        setAgregarFaltante(json);
        setProcesosProgramaEntradaPedido(json.id, input);
      }
      else setProcesosProgramaEntradaPedido(json.id, input);
    }
  });
}
function alertPrompt(id, cantidad, codigo, resistencia, observaciones, papel) {
  //el id es el id de la lista del pedido
  //json = JSON.parse(json);
  ons.notification.prompt({
    title: '',
    inputType: 'number',
    buttonLabels: [
      'Cancelar',
      'Agregar'
    ],
    message: 'Cantidad total hechas (pzas)'
  }).then(function (input) {

    if (input !== null && input !== "" && input != 0) {
      if (parseInt(cantidad) > parseInt(input)) {
        //alert("si entro cantidad: "+ cantidad +"input: "+input);
        ons.notification.confirm({
          title: "",
          message: 'Se mandará a inventario <br><br> <font size="8px">' + input + ' pza(s)</font>',
          buttonLabels: ['Aceptar', 'Cancelar'],
          callback: function (idx) {
            if (idx == 0) {
              cantidad -= input;
              json = JSON.parse(crearJson(["id", "cantidad", "codigo", "resistencia", "observaciones", "papel"], [id, cantidad, codigo, resistencia, observaciones, papel]));

              alertConfirmReporteFaltante("La cantidad es menor al del pedido, ¿Deseas generar reporte de faltante?", json, input);
            }
            else alerta("Cancelado");
          }
        });



      }

      else {
        ons.notification.confirm({
          title: "",
          message: 'Se mandará a inventario <br><br> <font size="8px">' + input + ' pza(s)</font>',
          buttonLabels: ['Aceptar', 'Cancelar'],
          callback: function (idx) {
            if (idx == 0) {
              setProcesosProgramaEntradaPedido(id, input);
            }
            else alerta("Cancelado");
          }
        });
        //
      }
    }
    else if (input == 0) alerta("*ERROR* <br>Debe se mayor de <b>0</b>");
    else alerta("No se envio nada");
  });
}
//alert prompt para inventario
function alertPromptInventario(id_lp, salida, inventario) {
  ons.notification.prompt({
    title: '',
    inputType: 'number',
    buttonLabels: [
      'Cancelar',
      'Agregar'
    ],
    message: 'Agrega salida menor o igual a: ' + inventario + ' pza(s)'
  }).then(function (input) {
    if (input !== null && input > 0 && input !== "") {
      //alert("la cantidad es: "+input + " inventario: " +inventario);
      if (parseInt(input) > parseInt(inventario)) alerta("La cantidad es mayor a la existinte");
      else {
        ons.notification.confirm({
          title: "",
          message: 'Se generá la siguiente salida:<br><br> <font size="8px">' + input + ' pza(s)</font>',
          buttonLabels: ['Aceptar', 'Cancelar'],
          callback: function (idx) {
            if (idx == 0) {
              let suma = parseInt(input) + parseInt(salida);
              setActualizarSalida(salida, suma, id_lp);
            }
          }
        });

      }

    }
    //else alerta("Cancelado");
  });
}
//FUNCION PARA AGREGAR CEROS
function agregarCeros(numero) {
  numero = String(numero);
  if (numero.length === 1) return "00" + numero;
  else if (numero.length === 2) return "0" + numero;
  else return numero;
}

//genera un pop de la pila de ventanas de la app *return* y ejecuta una funcion
function resetearPilaFunction(miFuncion, data) {
  document.querySelector('ons-navigator').popPage().then(function () {
    miFuncion(data);
  });
}

//funcion para poner coma y puntos en un numro
function separator(numb) {
  var str = numb.toString().split(".");
  str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return str.join(".");
}

/* Función que suma o resta días a una fecha, si el parámetro
   días es negativo restará los días*/
function sumarDias(fecha, dias) {
  fecha = new Date(fecha)
  fecha.setDate(fecha.getDate() + dias + 1);
  // Creamos array con los meses del año
  const meses = ['ene', 'febr', 'mar', 'abr', 'may', 'jun', 'jul', 'agos', 'sep', 'oct', 'nov', 'dic'];
  // Creamos array con los días de la semana
  const dias_semana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vier', 'Sáb'];
  // Construimos el formato de salida
  fecha = dias_semana[fecha.getDay()] + ', ' + fecha.getDate() + ' de ' + meses[fecha.getMonth()] + ' de ' + fecha.getUTCFullYear();
  return fecha;
}

//$('ons-back-button')
function reducirTexto(cadena) {
  if (cadena.length > 30) return cadena.substr(0, 30) + "...";
  else return cadena;

}
var idSalidasEntradas = "";
var observacionesSalidasEntradas = "";
var type = "";
function abrirDialog(texto, _id, tipo) {
  idSalidasEntradas = _id;
  observacionesSalidasEntradas = texto;
  type = tipo;

  if (texto == "") texto = "(Sin comentarios)";

  var dialog = document.getElementById('my-dialog');

  if (dialog) {
    dialog.show();
  } else {
    ons.createElement('dialog.html', { append: true }).then(function (dialog) {
      dialog.show();
    });
  }
  setTimeout(() => {
    $("#datoDialog").empty();
    $("#datoDialog").append('<ons-progress-circular indeterminate style="margin-bottom:10px"></ons-progress-circular>');
  }, 1);
  setTimeout(() => {
    $("#datoDialog").empty();
    $("#datoDialog").append(texto);
    $('#aceptar').empty();
    $('#aceptar').append('<i style="color: orange;" class="fa-solid fa-pen-to-square fa-2x" onclick="asignarTextSalidaEntrada(observacionesSalidasEntradas)"></i>');
  }, 500);

}

function abrirDialogLamina(texto, _id, tipo) {
  idSalidasEntradas = _id;
  observacionesSalidasEntradas = texto;
  type = tipo;

  if (texto == "") texto = "(Sin comentarios)";

  var dialog = document.getElementById('my-dialog');

  if (dialog) {
    dialog.show();
  } else {
    ons.createElement('dialog.html', { append: true }).then(function (dialog) {
      dialog.show();
    });
  }
  setTimeout(() => {
    $("#datoDialog").empty();
    $("#datoDialog").append('<ons-progress-circular indeterminate style="margin-bottom:10px"></ons-progress-circular>');
  }, 10);
  setTimeout(() => {
    $("#datoDialog").empty();
    $("#datoDialog").append(texto);
    $('#aceptar').empty();
    $('#aceptar').append('<i style="color: orange;" class="fa-solid fa-pen-to-square fa-2x" onclick="asignarTextSalidaEntradaLamina(observacionesSalidasEntradas)"></i>');
  }, 500);

}

function cerrarDialog() {
  document.getElementById("my-dialog").hide();
}


function Abrirdialogo(id, template, idProducto, funcion) {
  if (idProducto != "") idPedido = idProducto;

  var dialog = document.getElementById(id);

  if (dialog) {
    dialog.show();
  } else {
    ons.createElement(template, { append: true }).then(function (dialog) {
      dialog.show();
      if (funcion) funcion();
    });
  }
  //eliminar div dentro

}
function cerrarDialogo(id) {
  idPedido = "";
  document.getElementById(id).hide();
}
function alertToast(mensaje, tiempo) {
  ons.notification.toast(mensaje, { timeout: tiempo, animation: 'ascend' })
}

function showDialogo(id, idHtml) {
  var dialog = document.getElementById(id);

  if (dialog) {
    dialog.show();
  } else {
    ons.createElement(idHtml, { append: true }).then(function (dialog) {
      dialog.show();
    });
  }
}
function hideDialogo(id) {
  document.getElementById(id).hide();
}


/*function alertPromptFiltroCalendario()
{
  
  ons.notification.prompt({
    title: '',
    inputType: 'date',
    defaultValue: fechaHoy(),
    buttonLabels: [
      'Filtrar'
    ],
    message: 'Selecciona la fecha para filtrar...'
    }).then(function(input) {
      
      alerta("text date: "+input)
  });
}*/

function fechaHoy() {
  var fecha = new Date(); //Fecha actual
  var mes = fecha.getMonth() + 1; //obteniendo mes
  var dia = fecha.getDate(); //obteniendo dia
  var ano = fecha.getFullYear(); //obteniendo año
  if (dia < 10) dia = '0' + dia; //agrega cero si el menor de 10
  if (mes < 10) mes = '0' + mes; //agrega cero si el menor de 10

  return ano + "-" + mes + "-" + dia;
}

function fechaHoy2() {
  var fecha = new Date(); // Fecha actual
  fecha.setDate(fecha.getDate() + 20); // Suma 20 días a la fecha actual
  var mes = fecha.getMonth() + 1; // Obteniendo mes
  var dia = fecha.getDate(); // Obteniendo día
  var ano = fecha.getFullYear(); // Obteniendo año
  if (dia < 10) dia = '0' + dia; // Agrega cero si es menor de 10
  if (mes < 10) mes = '0' + mes; // Agrega cero si es menor de 10

  return ano + "-" + mes + "-" + dia;
}

console.log(fechaHoy());


function llenarFecha() {
  $('#pedidoFechaOc').val(fechaHoy());
  $('#pedidoFechaEntrega').val(fechaHoy2());
}

function actualizarFechaEntrega(valor) {
  // Si el valor no está presente, no hace nada
  if (!valor) return;

  // Convierte el valor a un objeto Date
  var fecha = new Date(valor);
  // Suma 20 días a la fecha
  fecha.setDate(fecha.getDate() + 20);
  // Obtiene el año, mes y día con el formato YYYY-MM-DD
  var nuevoValor = fecha.getFullYear() + '-' + ('0' + (fecha.getMonth() + 1)).slice(-2) + '-' + ('0' + fecha.getDate()).slice(-2);
  // Establece el nuevo valor en el segundo input
  $('#pedidoFechaEntrega').val(nuevoValor);
}

//funcion para llenar input date

function dateHoy(id) {
  $('#' + id).val(fechaHoy());
}
//funcion para crear objetos
function crearJson(nombres, variables) {
  var json = "{"
  for (var i = 0; i < variables.length; i++) {
    //alert("entro");
    json += '"' + nombres[i] + '":' + '"' + variables[i] + '"';
    if (i < variables.length - 1) json += ",";
    //"producto": "'.$datos['producto'].'",
  }
  json += "}";
  return json;
}

function listaInfinita(agregarHtml, eliminarLoadingHtml, arrayJson, miFuncion) {
  if (eliminarLoadingHtml != "") $("#" + eliminarLoadingHtml).empty();
  var contador = 1;
  var html = '<ons-card id="contenedorPrograma"> <center> <h2 style="color:white">Sin resultados...</h2> </center> </ons-card>';

  var infiniteList = document.getElementById(agregarHtml);

  infiniteList.delegate = {
    createItemContent: function (i) {

      if (arrayJson != "") {
        var tempJson = JSON.parse(arrayJson[i]);
      }
      return ons.createElement(arrayJson == "" ? html : miFuncion(tempJson, i));
    },
    countItems: function () {
      return contador = arrayJson == "" ? contador : arrayJson.length - 1;
    }
  };
  infiniteList.refresh();
}


function agregarCeros(numero) {
  numero = String(numero);
  if (numero.length === 1) return "00" + numero;
  else if (numero.length === 2) return "0" + numero;
  else return numero;
}

//funcion para saber si tiene datos una variable
function datoVacio(dato) {
  if (dato == "" || dato == 0) return false;
  else return true;
}
function agregarClase(i) {

  $("#list-cliente" + i).addClass("list-cliente-animation");
  setTimeout(function () {
    $('.list-cliente-animation').remove();
  }, 1500);
}

function crearMensajePL(estado, entrada, pzas_ordenadas, o_c, observaciones) {

  ons.openActionSheet({
    title: 'ESTADO',
    cancelable: true,
    buttons: [
      '<i class="fa-solid fa-circle" style="color: #E8C07C"></i> BACKORDER ',
      '<i class="fa-solid fa-circle" style="color: #CE84DA"></i> PARCIAL ',
      '<i class="fa-solid fa-circle" style="color: #00A514"></i> COMPLETO',
      '<i class="fa-solid fa-circle" style="color: #000000"></i> CANCELADA',
      '<i class="fa-solid fa-circle" style="color: #E1D000"></i> PROGRAMADO',
      'Observaciones',
      'Modificar',
      {
        label: 'Eliminar',
        modifier: 'destructive'
      }
    ]
  }).then(function (index) {
    //if(estado != index || index != -1) alerta('No puedes cambiar de estado por ya existen en Inventario')
    var faltante = pzas_ordenadas - entrada;
    entrada = entrada == "" ? 0 : entrada;
    if (index == 5) alerta("<b>Observaciones:</b><br><br>" + observaciones);
    else if (index == 6) nextPageFunctionData('actualizarPedidosLamina.html', setBuscarActualizarPL, o_c); //actualiza pedido
    else if (index == 7) alertaConfirPrograma("Estas seguro de eliminar este Pedido de Lamina?", setEliminarPL, o_c); //elimina pedido

    if (index == -1) return 0;
    if (estado == 3 && index != 5 && index != 6 && index != 7) alerta("Este pedido ya se encuentra completo en inventario");
    //else if((entrada > 0 && estado != 2) && index != -1) alerta("No puedes cambiar a este estado por que ya existen en inventario");
    else if (index != -1) {

      if (index == 1 || index == 2) //en este actualiza y manda datos a entrada (menor al valor que muestra las piezas ordenadas)
      {
        //alerta(index);
        ons.notification.prompt({
          title: '',
          inputType: 'number',
          buttonLabels: [
            'Cancelar',
            'Enviar'
          ],
          message: 'Existencia en inventario: ' + entrada + ' de ' + pzas_ordenadas
        }).then(function (input) {
          if (input !== null && input >= 0 && input !== "") {
            ons.notification.confirm({
              title: "",
              message: 'Se generá la siguiente Entrada:<br><br> <font size="8px">' + input + ' pza(s)</font>',
              buttonLabels: ['Cancelar', 'Aceptar'],
              callback: function (idx) {
                if (idx == 1) {
                  var suma = parseInt(input) + parseInt(entrada);
                  if (index == 2) setActualizarEstadoPL(3, o_c, suma, entrada);
                  else setActualizarEstadoPL(2, o_c, suma, entrada);

                }
              }
            });
          }
        });
      }

      else if (estado != 2) {
        if (index == 0) setActualizarEstadoPL(1, o_c);//en este solo actualiza el estado del pedido
        else if (index == 3) setActualizarEstadoPL(4, o_c);//actualiza el estado
        else if (index == 4) setActualizarEstadoPL(5, o_c);//actuliza el estado

      }
      else alerta("No puedes cambiar a este estado por que ya existen en inventario");



    }

    // elimina el pedido
  });
}

//funcion para validar si  un arreglo esta vacio o si le falta un dato
function arrayVacio(array) {
  let j = 0;
  for (let i = 0; i < array.length; i++) {
    if (array[i] == "") j++;
  }
  return j;
  //return arrays[0];
}

function vacio(...datos) {
  for (let i = 0; i < datos.length; i++) if (datos[i] == "") return false;
  return true;
}

function metodoPago(dato) {
  if (dato == 1) return "Efectivo (1)";
  else if (dato == 2) return "Cheque (2)";
  else if (dato == 3) return "Transferencia (03)";
  else if (dato == 4) return "Tarjeta de Credito (04)"
  else if (dato == 28) return "Tarjeta de Debito (28)";
  else if (dato == 99) return "Por definir (99)";
}

function meses() {
  return ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
}

/*function tipoEgreso(dato)
{
  dato--;
  let tipo = ["Consumible","Lamina","Servicio","Suajes y Grabados","Maquila","Gasolina","Herramienta","Otros","Pagos Fijos"];
  return tipo[dato];

}*/

//no se esta usando
function tipoEgreso(dato) {
  const egreso = {
    1: "Consumible",
    2: "Lamina",
    3: "Servicio",
    4: "Suajes y Grabados",
    5: "Maquila",
    6: "Gasolina",
    7: "Herramienta",
    8: "Otros",
    9: "Pagos Fijos"
  }
  return egreso[dato];
}

function filtrarRadio() {
  tipoFilter = $('input[name=tipo]:checked')[0].id;
  setProveedor();
  cerrarDialogo('my-dialog-FiltroProveedor');
}
function borrarRadioProveedor() {
  //console.log($('input[name=tipo]:checked').val())
  if (tipoFilter > 0) $('input[name=tipo]:checked')[0].checked = false;

  tipoFilter = 0;
  setProveedor();
  cerrarDialogo('my-dialog-FiltroProveedor');
}

function validarEntradaSalidaP() {
  if (salida) setEditarCantidadSalidaP();
  else setEditarCantidadEntradaP();
}

function validarEntradaSalidaI() {
  if (salida) setEditarCantidadSalidaI();
  else setEditarCantidadEntradaI();
}

//funcion para validar a que lado se ira el editar la lamina
function validarEntradaSalidaL() {
  if (salida) setEditarCantidadSalidaL();
  else setEditarCantidadEntradaL();
}