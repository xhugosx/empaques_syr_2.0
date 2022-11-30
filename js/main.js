//ESTA FUNCION ES PARA EJECUTAR UNA FUNCION AL PAR LA SIGUIENTE PAGINA
function nextPageFunction(miPage,miFuncion)
{
    myNavigator.pushPage(miPage, {data: {title: ''}}).then(function() {

        miFuncion();

    });
}
//ESTA FUNCION SOLO TE PASA A LA SIGUIENTE PAGINA
function nextPage(miPage)
{
    myNavigator.pushPage(miPage, {data: {title: ''}});
}
// esta funcion solo pasa a la siguiente pagina con un una variable como parametro
function nextPageFunctionData(miPage,miFuncion,dato)
{
    myNavigator.pushPage(miPage, {data: {title: ''}}).then(function() {

        miFuncion(dato);

    });
}
//FUMCION PRA MOSTRAR UN MENSAJE
function alerta(mensaje)
{
    ons.notification.alert({
      title: ' ',
      message: mensaje,
      buttonLabels: 'Aceptar'
    });
}
//ESTA FUNCIONA PARA MANDAR DATOS AL SERVIDOR Y RECIBIR SU RESPUESTA
function servidor(link,miFuncion)
{
   var xhttp = new XMLHttpRequest();

   xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){

            miFuncion(this);

        }
    
    };

    xhttp.open("GET",link,true);
    xhttp.send();
}

//ASIGNAR DATOS A UN HTML Y BORRAR UNA SECCION DEL HTML
function setDataPage(agregar,eliminar,html)
{
    if(eliminar!=0)$(eliminar).empty();
    $(agregar).append(html);
}
//ESTA ES PARA MOSTRAR MENSAJE DEL LADO INFERIOR
function crearObjetMensaje(codigo,contador) 
{
    ons.openActionSheet({
      title: 'OPCIONES',
      cancelable: true,
      buttons: [
        'Ver Plano',
        'Modificar',
        {
          label:'Eliminar',
          modifier: 'destructive'
        }
      ]
    }).then(function (index) { 
      if(index==0) window.open('https://empaquessyrgdl.000webhostapp.com/planos/'+codigo.substring(0,3)+'/'+codigo.substring(0,3)+'-'+codigo.substring(4,7)+'.pdf', '_blank');
      else if(index==1) nextPageFunctionData('ActualizarProductos.html',setBuscarProductoActualizar,codigo); //alert("modificara "+codigo);
      else if(index==2) alertaConfirm('Estas seguro de eliminar este producto? '+codigo,setEliminarProducto,codigo,contador);
    });
}
function crearObjetMensajePedido(oc,id,codigo,estado) 
{
    ons.openActionSheet({
      title: 'OPCIONES',
      cancelable: true,
      buttons: [
        '<b>Programar<b/>',
        'Ver Plano',
        'Detalles',
        'Modificar',
        {
          label:'Eliminar',
          modifier: 'destructive'
        }
      ]
    }).then(function (index) { 
      if(index==0)  
      {
        if(estado == 0) Abrirdialogo('my-dialog-programa','dialogPrograma.html',id);
        else alerta("Ya fue programado");
      }
      else if(index==1) window.open('https://empaquessyrgdl.000webhostapp.com/planos/'+codigo.substring(0,3)+'/'+codigo.substring(0,3)+'-'+codigo.substring(4,7)+'.pdf', '_blank');
      else if(index==2) alerta("<b>Orden de Compra: </b>"+oc);
      else if(index==3) nextPageFunctionData('pedidosModificar.html',setModificarBuscarPedido,id); //alert("modificara "+codigo);
      else if(index==4) alertaConfirm('Estas seguro de eliminar este pedido? '+id,setEliminarPedido,id);
      
    });
}

function crearObjetMensajeCliente(id,i) 
{
    ons.openActionSheet({
      title: 'OPCIONES',
      cancelable: true,
      buttons: [
        {
          label:'Eliminar',
          modifier: 'destructive'
        }
      ]
    }).then(function (index) { 
      if(index==0) alertaConfirm('Estas seguro de eliminar este cliente '+agregarCeros(id)+'?',setEliminarCliente,id,i);  
    });
}

function crearObjetMensajeProcesoPrograma(id) 
{
    ons.openActionSheet({
      title: 'ASIGNAR PROCESO',
      cancelable: true,
      buttons: [
        '<i class="fa-solid fa-circle" style="color: rgba(35, 154, 75, 0.933);"></i> Terminado ',
        '<i class="fa-solid fa-circle" style="color: rgb(233, 188, 105);"></i> Proceso ',
        '<i class="fa-solid fa-circle" style="color:rgb(209, 209, 209);"></i> Pendiente ',
        'Terminar',
        {
          label:'Eliminar',
          modifier: 'destructive'
        }
      ]
    }).then(function (index) { 
      if(index == 0) setActualizarEstado(id,2);
      else if(index == 1) setActualizarEstado(id,1);
      else if(index==2) setActualizarEstado(id,0); 
      else if(index == 3) alertPrompt();
      else if(index == 4) ;//eliminar
      
    });
}
//FUNCION DE MENSAJE DE CONFIRMACION
function alertaConfirm(mensaje,funcion,variable,contador)
{
    ons.notification.confirm({
        title: '',
        message: mensaje,
        buttonLabels: ['SI', 'NO'],
        callback: function(idx) {
            if(idx==0) funcion(variable,contador);
          }
   });
}
function alertaConfirmSiNo(mensaje,funcionSi,funcionNo,funcion)
{
    ons.notification.confirm({
        message: mensaje,
        buttonLabels: ['SI', 'NO'],
        callback: function(idx) {
            if(idx==0) funcionSi();
            else funcionNo(funcion);
          }
   });
}
//FUNCION PARA AGREGAR CEROS
function agregarCeros(numero)
{
    numero = String(numero);
    if(numero.length === 1) return "00"+numero;
    else if(numero.length === 2) return "0"+numero;
    else return numero;
}

//genera un pop de la pila de ventanas de la app *return* y ejecuta una funcion
function resetearPilaFunction(miFuncion)
{
    document.querySelector('ons-navigator').popPage().then(function(){
        miFuncion();
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
function sumarDias(fecha, dias){
    fecha = new Date(fecha)
    fecha.setDate(fecha.getDate() + dias+1);
    // Creamos array con los meses del año
    const meses = ['ene', 'febr', 'mar', 'abr', 'may', 'jun', 'jul', 'agos', 'sep', 'oct', 'nov', 'dic'];
    // Creamos array con los días de la semana
    const dias_semana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vier', 'Sáb'];
    // Construimos el formato de salida
    fecha = dias_semana[fecha.getDay()] + ', ' + fecha.getDate() + ' de ' + meses[fecha.getMonth()] + ' de ' + fecha.getUTCFullYear();
    return fecha;
}

//$('ons-back-button')
function reducirTexto(cadena)
{
    if(cadena.length > 30) return cadena.substr(0,30) + "...";
    else return cadena;
    
}

/*
function crearObjetMensajeAgregarSalida()
{
    ons.openActionSheet({
        title: 'AGREGAR',
        cancelable: true,
        buttons: [
          '<i class="fa-solid fa-box" style="color:rgb(0, 118, 255)"></i> Caja',
          '<i class="fa-solid fa-box-open" style="color:rgb(0, 118, 255)"></i> Inserto',
          '<i class="fa-solid fa-layer-group" style="color:rgb(0, 118, 255)"></i> Lamina',
          {
            label:'Cancelar',
            modifier: 'destructive'
          }
        ]
      }).then(function (index) { 
        if(index==0) nextPage("agregarSalidasCaja.html");
        //else if(index==1) window.open('https://empaquessyrgdl.000webhostapp.com/planos/'+codigo.substring(0,3)+'/'+codigo.substring(0,3)+'-'+codigo.substring(4,7)+'.pdf', '_blank');
       // else if(index==2) nextPageFunctionData('pedidosModificar.html',setModificarBuscarPedido,id); //alert("modificara "+codigo);
        //else if(index==3) alertaConfirm('Estas seguro de eliminar este pedido? '+id,setEliminarPedido,id);
      });

}

function crearObjetMensajeAgregarEntrada()
{
    ons.openActionSheet({
        title: 'AGREGAR',
        cancelable: true,
        buttons: [
          '<i class="fa-solid fa-box" style="color:rgb(0, 118, 255)"></i> Caja',
          '<i class="fa-solid fa-box-open" style="color:rgb(0, 118, 255)"></i> Inserto',
          '<i class="fa-solid fa-layer-group" style="color:rgb(0, 118, 255)"></i> Lamina',
          {
            label:'Cancelar',
            modifier: 'destructive'
          }
        ]
      }).then(function (index) { 
        if(index==0) nextPage("agregarEntradaCaja.html");
        //else if(index==1) window.open('https://empaquessyrgdl.000webhostapp.com/planos/'+codigo.substring(0,3)+'/'+codigo.substring(0,3)+'-'+codigo.substring(4,7)+'.pdf', '_blank');
       // else if(index==2) nextPageFunctionData('pedidosModificar.html',setModificarBuscarPedido,id); //alert("modificara "+codigo);
        //else if(index==3) alertaConfirm('Estas seguro de eliminar este pedido? '+id,setEliminarPedido,id);
      });

}

function crearObjetMensajeInventario(ob)
{
    ons.openActionSheet({
        title: 'Detalles',
        cancelable: true,
        buttons: [
          'Observaciones',
          {
            label:'Salida',
            modifier: 'destructive'
          }
        ]
      }).then(function (index) { 
        if(index==0) abrirDialog(ob);
        //else if(index==1) window.open('https://empaquessyrgdl.000webhostapp.com/planos/'+codigo.substring(0,3)+'/'+codigo.substring(0,3)+'-'+codigo.substring(4,7)+'.pdf', '_blank');
       // else if(index==2) nextPageFunctionData('pedidosModificar.html',setModificarBuscarPedido,id); //alert("modificara "+codigo);
        //else if(index==3) alertaConfirm('Estas seguro de eliminar este pedido? '+id,setEliminarPedido,id);
      });

}*/

function abrirDialog(texto) {
  if(texto == "") texto = "Sin observaciones";

  var dialog = document.getElementById('my-dialog');  
  
  if (dialog) {
    dialog.show();
  } else {
    ons.createElement('dialog.html', { append: true }).then(function(dialog) {
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
  }, 500);
  
};
  
function cerrarDialog() {
  document.getElementById("my-dialog").hide();
};


function Abrirdialogo(id,template,idProducto)
{
  idPedido = idProducto;
  var dialog = document.getElementById(id);  
  
  if (dialog) {
    dialog.show();
  } else {
    ons.createElement(template, { append: true }).then(function(dialog) {
        dialog.show();
      });
  }
}
function cerrarDialogo(id)
{
  idPedido = "";
  document.getElementById(id).hide();
}
function alertToast(mensaje,tiempo)
{
  ons.notification.toast(mensaje, { timeout: tiempo, animation: 'fall' })
}

function alertPrompt()
{
  ons.notification.prompt({
    title: '',
    inputType: 'number',
    buttonLabels: [
      'Agregar'
    ],
    message: 'Cantidad total (pzas)'
    }).then(function(input) {
      if(input == 0) alerta("Cancelado");
      else alerta('Se mandara a entrada: '+input);

      
  });
}
