function mostrarTodoEntrada()
{
    setMostrarEntradaCajas();
    //aqui iran las otras dos funciones mostrar insertos y lamina
}


function setMostrarEntradaCajas()
{
    servidor("https://empaquessyrgdl.000webhostapp.com/empaquesSyR/entrada/caja/select.php",getMostrarEntradaCajas)
}
function getMostrarEntradaCajas(respuesta)
{
    var resultado = respuesta.responseText;
    var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'

    listaInfinita('datosCajaInventario','cajaInventarioLoading',arrayJson,enlistarEntradas);
}
function setEliminarEntrada(id)
{
    servidor('https://empaquessyrgdl.000webhostapp.com/empaquesSyR/entrada/caja/delete.php?id='+id,getEliminarEntrada);
}
function getEliminarEntrada(respuesta)
{
    if(respuesta.responseText) 
    {
        alerta("Se eliminao el pedido Entrada");
        mostrarTodoEntrada();

    }
    else alerta("hubo un error al tratar de eliminar");
}

function enlistarEntradas(arrayJson)
{
    let html1 = '';
    
    html1 += '<ons-card  style="padding:0px;" class="botonPrograma" onclick="abrirDialog(\''+arrayJson.observaciones+'\')">'
    html1 += ' <ons-list-header>'+ arrayJson.id_lp +' <b style="color: rgb(61, 174, 80);">Terminado: '+ sumarDias(arrayJson.fecha,0) +'</b></ons-list-header>';
    html1 += '<ons-list-item modifier="nodivider">'; 
    html1 += '        <div class="left">';
    html1 +=              '<i class="fa-solid fa-box fa-2x"></i>';
    html1 += '        </div>';
    html1 += '        <div class="center">';
    html1 += '            <span class="list-item__title"><b>'+arrayJson.codigo+'</b>&nbsp;'+ arrayJson.producto +'</span>';
    html1 += '            <span class="list-item__subtitle">'+ arrayJson.nombre +'</span>';
    html1 += '        </div>';
    html1 += '        <div class="right">';
    html1 += '            <span class="notification" style="background: rgb(61, 174, 80);">'+ separator(arrayJson.cantidad) +' <font size="2px">pza(s)</font></span>';
    html1 += '        </div>';
    html1 += '</ons-list-item>';
    html1 += '</ons-card>';

    return html1;
}