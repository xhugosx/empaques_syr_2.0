function verOrden(orden)
{
    $("#loadingOrden").empty();
    $("#ordenArchivo").attr("src","https://docs.google.com/gview?url="+orden+"&embedded=true");
    
}

function abrirCarpeta(elemento)
{
    var id = elemento.firstChild.nextElementSibling.id;

    $(".fa-folder").removeClass('fa-folder-open')
    $("#"+id).toggleClass('fa-folder-open');

    setBuscarOrden(id);
}
function asignarAnioOrden()
{
    const moonLanding = new Date();
    $('#yearOrden').text(moonLanding.getFullYear());
}

function setAgregarOrden()
{
    if(datoVacio($('input[type=file]').val())) 
    {
        var form = $('#formOrdenes')[0];
        var formData = new FormData(form);

        var michelle = $('#michelle').prop('checked');

        var carpeta = michelle ? $('#yearOrden').text() + "-M" : $('#yearOrden').text();
        //console.log(myLink+'/php/ordenes/add.php?year='+carpeta,michelle);
        servidorPost(myLink+'/php/ordenes/add.php?year='+carpeta,getAgregarOrden,formData);
    }
    else alerta("Espacios en blanco");
}
function getAgregarOrden(respuesta)
{
    //respuesta del servidor
    if(respuesta.responseText=="1") 
    {
        alerta("Registro insertado");
        resetearPilaFunction(mostrarTodoPedidosLamina);
    }
    else alerta('Error al registrar!');
    //console.log(respuesta.responseText);
}

function setBuscarAnio()
{
    servidor(myLink+"/php/ordenes/selectAnio.php",getBuscarAnio)
}
function getBuscarAnio(respuesta)
{
    var resultado = respuesta.responseText;
    resultado = resultado.split(',');

    var html = "";

    for(let i=0;i<resultado.length-1;i+=4)
    {
        html += '<div class="contenedor-flexbox">';
                
        for(let j=i; j<i+4 && j<resultado.length-1;j++)
        {
            html += '<span class="ordenesLamina" onclick="abrirCarpeta(this)">';
            html += '    <i class="fa-solid fa-folder fa-3x" id="'+ resultado[j] +'"></i>';
            html += '    <br><br>';
            html += '    <font><b> '+ resultado[j] +' </b></font>';
            html += '</span>';
        }
        
        html += '</div>';
    }
    $('#ordenes').html("");
    $('#carpetasAnio').html("");
    $('#carpetasAnio').html(html);
    //console.log(resultado.length,html,resultado,respuesta.responseText);
}

function setBuscarOrden(anio)
{
    servidor(myLink+"/php/ordenes/select.php?year="+anio,getBuscarOrden)
}
function getBuscarOrden(respuesta)
{
    var resultado = respuesta.responseText;
    var arrayJson = resultado.split('|');
    //console.log(respuesta.responseText);
    var html = "";

    for(let i=0;i<arrayJson.length-1;i+=4)
    {
        html += '<div class="contenedor-flexbox">';
                
        for(let j=i; j<i+4 && j<arrayJson.length-1;j++)
        {
            var tempJson = JSON.parse(arrayJson[j]);
            html += '<span class="ordenesLamina" onclick="mensajeOrden([\''+tempJson.id+'\',\''+tempJson.carpeta+'\',\''+tempJson.path+'\'])">';
            html += '    <i class="fa-solid fa-file-pdf fa-3x"></i>';
            html += '    <br><br>';
            html += '    <font><b> '+tempJson.path+'</b></font>';
            html += '</span>';
        }
        
        html += '</div>';
    }
    $('#ordenes').html("");
    $('#ordenes').html(html);
}

function setEliminarOrden(id)
{
    servidor(myLink+"/php/ordenes/delete.php?id="+id,getEliminarOrden)
}
function getEliminarOrden(respuesta)
{
    var resultado = respuesta.responseText;
    if(resultado == 1)
    {
        alerta("Orden eliminada");
        mostrarTodoPedidosLamina();
    }
    
}

//funciones para mostrar mensaje
function mensajeOrden(datos){mensajeArriba('Opciones', ["Ver orden",{label:'Eliminar',modifier: 'destructive'}] ,accionMensajeOrden,datos); }  
function accionMensajeOrden(index,datos) 
{ 
    let id = datos[0];
    let anio = datos[1];
    let archivo = datos[2];

    if(index == 0){
        
        let navegador = navigator.userAgent;
      if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i)) {
        //console.log("Estás usando un dispositivo móvil!!");
        nextPageFunctionData('verOrden.html',verOrden,myLink+'/ordenes/'+anio+'/'+archivo);
      } else {
        window.open(myLink+'/ordenes/'+anio+'/'+archivo, '_blank');
      }
    } 
    else if(index == 1) mensajeConfirmOrden(id); 
}

//mensajes para confirmar eliminar
function mensajeConfirmOrden(codigo){ alertComfirm("Estas seguro de borrar esta orden? ",["Aceptar","Cancelar"],accionConfirmOrden,codigo)}
function accionConfirmOrden(index,codigo) { if(index==0) setEliminarOrden(codigo); }