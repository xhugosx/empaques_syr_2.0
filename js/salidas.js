function mostrarTodoSalida()
{
    setMostrarSalidaCajas();
    //aqui iran las otras dos funciones
}


function setMostrarSalidaCajas()
{
    servidor("https://empaquessyrgdl.000webhostapp.com/empaquesSyR/salida/caja/select.php",getMostrarSalidaCajas)
}
function getMostrarSalidaCajas(respuesta)
{
    var resultado = respuesta.responseText;
    var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'
    //alerta(resultado);
    listaInfinita('datosCajaEntradaSalida','cajaSalidasEntradasLoading',arrayJson,enlistarSalidas);
}
function asignarTextSalidaEntrada(observaciones)
{
    
    $("#datoDialog").empty();
    $("#datoDialog").append('<textarea id="observacionesSalidasEntradas" cols="40" rows="5" onkeyup="javascript:this.value=this.value.toUpperCase();"></textarea>');

    setTimeout(() => {
        $("#observacionesSalidasEntradas").val(observaciones == "" ? "" : observaciones);
    }, 1);
    $('#aceptar').empty();
    $('#aceptar').append('<i style="color:green" class="fa-solid fa-check fa-2x" onclick="setActualizaObservaciones()"></i>')
    
    
   // $("#observacionesSalidasEntradas").val(id);
}
function setActualizaObservaciones()
{
    observacionesSalidasEntradas = $("#observacionesSalidasEntradas").val();
    var observaciones = $("#observacionesSalidasEntradas").val() == "" ? "(Sin comentarios)" : $("#observacionesSalidasEntradas").val();
    $('#aceptar').empty();
    $('#aceptar').append('<i style="color: orange;" class="fa-solid fa-pen-to-square fa-2x" onclick="asignarTextSalidaEntrada(observacionesSalidasEntradas)"></i>');

    $("#datoDialog").empty();
    $('#datoDialog').text(observaciones);
    
    servidor("https://empaquessyrgdl.000webhostapp.com/empaquesSyR/inventario/updateObservaciones.php?observaciones="+observacionesSalidasEntradas+"&id="+idSalidasEntradas+"&type="+type,getActualizarObservaciones);
}
function getActualizarObservaciones(respuesta)
{
    if(respuesta.responseText == 1) setMostrarSalidaCajas();
    else if(respuesta.responseText == 2) setMostrarEntradaCajas();
    else alerta("no se actualizo "+respuesta.responseText);
}

function enlistarSalidas(arrayJson)
{
    var color = arrayJson.observaciones == "" ? "gray" : "rgb(115, 168, 115)";
    let html1 = "";
    html1 += '<ons-card  style="padding:0px;" class="botonPrograma" onclick="abrirDialog(\''+arrayJson.observaciones+'\',\''+arrayJson.id_lp+'\',\''+1+'\')">';
    html1 += '    <ons-list-header>'+arrayJson.id_lp+' <b style="color: rgb(211, 64, 64);">Entregado: '+ sumarDias(arrayJson.fecha,0) +'</b></ons-list-header>';
    html1 += '    <ons-list-item modifier="nodivider">';
    html1 += '        <div class="left">';
    html1 +=              '<i class="fa-solid fa-box fa-2x"></i>';
    html1 += '        </div>';
    html1 += '        <div class="center">';
    html1 += '            <span class="list-item__title"><b>'+arrayJson.codigo+'</b>&nbsp;'+ arrayJson.producto +'</span>';
    html1 += '            <span class="list-item__subtitle">'+ arrayJson.nombre +'</span>';
    html1 += '        </div>';
    html1 += '        <div class="right">';
    html1 += '            <span class="notification">'+ separator(arrayJson.cantidad) +' <font size="2px">pza(s)</font></span>';
    html1 += '            <div style="position: absolute;bottom:60px; right: 10px;" ><i style="color: '+color+';filter: drop-shadow(0 2px 5px rgba(0, 0, 0, 0.3))" class="fa-solid fa-comment-dots fa-2x"></i></div>';
    html1 += '        </div>';
    html1 += '    </ons-list-item>';
    html1 += '</ons-card>';

    return html1;
}
function error(variable)
{
    try{
        variable;
        return true;
    }
    catch{
        return false;
    }
}