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
    resultado = enlistarSalidas(arrayJson);

    $('#datosCajaSalida').empty();
    setDataPage('#datosCajaSalida','#cajaSalidaLoading',resultado);
}

function enlistarSalidas(arrayJson)
{
    if(arrayJson=="") return "<ons-card> <center> <h2>Sin resultados...</h2> </center> </ons-card>";
    let html1;
    html1 = '<ons-list>';

    for(var i=0;i<arrayJson.length-1;i++) 
    {
        arrayJson[i] = JSON.parse(arrayJson[i]); //convertimos los jsonText en un objeto json

        html1 += '<ons-list onclick="abrirDialog(\''+arrayJson[i].observaciones+'\')">';
        html1 += '    <ons-list-header style="font-weight: bold;color: rgb(211, 64, 64);"> Entregado: '+ sumarDias(arrayJson[i].fecha,0) +'</ons-list-header>';
        html1 += '    <ons-list-item tappable>';
        html1 += '        <div class="left">';
        html1 +=              '<i class="fa-solid fa-box fa-lg"></i>';
        html1 += '        </div>';
        html1 += '        <div class="center">';
        html1 += '            <span class="list-item__title"><b>'+arrayJson[i].codigo+'</b>&nbsp;'+ arrayJson[i].producto +'</span>';
        html1 += '            <span class="list-item__subtitle">'+ arrayJson[i].nombre +'</span>';
        html1 += '        </div>';
        html1 += '        <div class="right">';
        html1 += '            <span class="notification">'+ separator(arrayJson[i].cantidad) +'</span>';
        html1 += '        </div>';
        html1 += '    </ons-list-item>';
        html1 += '</ons-list>';
    }

    html1 += '</ons-list> <br><br>';

    return html1;
}