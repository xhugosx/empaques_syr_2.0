//mostrar consumible search
function setMostrarConsumibleSearch(search,e)
{
    tecla = (document.all) ? e.keyCode : e.which;
    if (tecla==13) 
    {
        $("#consumibleLoading").empty();
        $("#consumibleLoading").append("<ons-progress-bar indeterminate></ons-progress-bar>");
        servidor('https://empaquessyrgdl.000webhostapp.com/empaquesSyR/consumibles/select.php?search='+search,getConsumibles);
    }
    else if(search == ""){
        $("#consumibleLoading").empty();
        $("#consumibleLoading").append("<ons-progress-bar indeterminate></ons-progress-bar>");
        setConsumible();
    } 
    
}
//fin de mostrar consumible search

//mostrar inventario consumibles
function setConsumible()
{
    servidor('https://empaquessyrgdl.000webhostapp.com/empaquesSyR/consumibles/select.php',getConsumibles);
}
function getConsumibles(respuesta)
{
    var resultado = respuesta.responseText;//respuesta del servidor
    var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'

    listaInfinita('datosConsumible','consumibleLoading',arrayJson,enlistarInventarioCodigoInserto);

}
//fin de mostrar inventario consumibles

//agregar consumible
function setAgregarConsumible()
{
    let descripcion = $('#descripcion').val();
    let cantidad = $('#cantidad').val();
    if(datoVacio(descripcion) && datoVacio(cantidad))
    {
        servidor('https://empaquessyrgdl.000webhostapp.com/empaquesSyR/consumibles/add.php?&descripcion='+descripcion+'&cantidad='+cantidad,getAgregarConsumible);
    }
    else alerta("Espacios vacios!");

   
}
function getAgregarConsumible(respuesta)
{
    if(respuesta.responseText=="1") 
    {
        alerta("Consumible agregado");
        resetearPilaFunction(setConsumible);
    }  
    else alerta("No se pudo Agregar");
}
//fin de agregar consumible

//eliminar consumible
function setEliminarConsumible(id)
{
    servidor('https://empaquessyrgdl.000webhostapp.com/empaquesSyR/consumibles/delete.php?id='+id,getEliminarConsumible)
}
function getEliminarConsumible(respuesta)
{
    if(respuesta.responseText=="1") 
    {
        alerta("Consumible Eliminado");
        setConsumible();
    }  
    else alerta("No se pudo Eliminar");
}
//fin de eliminar consumible

//actualizar consumible

function setActualizarConsumible(id)
{
    let cantidad = $('#salidaConsumible').val();
    if(cantidad > 0) servidor('https://empaquessyrgdl.000webhostapp.com/empaquesSyR/consumibles/update.php?id='+id+'&cantidad='+cantidad,getActualizarConsumible);
    else alerta("Debe ser mayor a 1");    
}
function getActualizarConsumible(respuesta)
{
    if(respuesta.responseText=="1") 
    {
        alertToast("Piezas Actualizadas!",2000)
        setConsumible();
        hideDialogo('my-dialogConsumible');
    }  
    else alerta("No se pudo Actualizar");
}
//fin de actualizar de consumible

function enlistarInventarioCodigoInserto(json)
{
    let html1 = "";
    html1 += '<ons-card style="padding:0px;" class="botonPrograma" onclick="alertaConsumible(\''+conversionJsonArray(json)+'\')">';
    html1 += '<ons-list-item class="" modifier="nodivider">';
    html1 += '  <div class="left">';
    html1 += '      <i class="fa-solid fa-toolbox fa-2x"></i>';
    html1 += '  </div>';
    html1 += '  <div class="center">';
    html1 += '    <span class="list-item__title"><b>'+ json.descripcion +'</b></span>';
    html1 += '    <span class="list-item__subtitle"><b>'+sumarDias(json.fecha,0)+' </b></span>';
    html1 += '  </div>"';
    html1 += '  <div class="right"><span class="notification">'+ json.cantidad +' pza(s)</span></div>';
    html1 += '</ons-list-item>';
    html1 += '</ons-card>';
    return html1
}
var idConsumible = "";
function alertaConsumible(array)
{
    array = array.split(",");
    var json = conversionArrayJson(array);
    mensajeArriba("Opciones",["<b>Piezas disponibles</b>",{label:'Eliminar',modifier: 'destructive'}],mensajeAccion,json);
}
function mensajeAccion(index,json)
{
    if(index == 0)
    {
       showDialogo("my-dialogConsumible","dialogConsumibleSalida.html"); 
       setTimeout(() => {
        $('#salidaConsumible').val(json.cantidad);
        idConsumible = json.id;
       }, 1);
       
    } 
    else if(index == 1) alertComfirm("Estas seguro de eliminar este consumible?",["Aceptar","Cancelar"],alertaEliminar,json)
}

function alertaEliminar(index,json)
{
    if(index == 0) setEliminarConsumible(json.id); 
}
function incrementar()
{
    let cantidad = $('#salidaConsumible').val();
    $('#salidaConsumible').val(parseInt(cantidad)+1);
}

function decrementar()
{
    let cantidad = $('#salidaConsumible').val();
    if(cantidad != 1) $('#salidaConsumible').val(parseInt(cantidad)-1);
}