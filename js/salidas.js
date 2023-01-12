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
    listaInfinita('datosCajaInventario','cajaInventarioLoading',arrayJson,enlistarSalidas);
}

function enlistarSalidas(arrayJson)
{
    let html1 = "";
    html1 += '<ons-card  style="padding:0px;" class="botonPrograma" onclick="abrirDialog(\''+arrayJson.observaciones+'\')">';
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
    html1 += '        </div>';
    html1 += '    </ons-list-item>';
    html1 += '</ons-card>';

    return html1;
}