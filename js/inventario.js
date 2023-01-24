var codigoCliente = "";
function mostrarTodoInventario()
{
    setMostrarInventario();
    setMostrarInventarioPedidosLamina();
    //aqui iran las otras dos funciones mostrar insertos y lamina
}

function setMostrarInventario()
{
    servidor("https://empaquessyrgdl.000webhostapp.com/empaquesSyR/inventario/select.php",getMostrarInventario)
}
function getMostrarInventario(respuesta)
{
    var resultado = respuesta.responseText;
    var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'
    listaInfinita('datosCajaInventario','cajaInventarioLoading',arrayJson,enlistarInventario);
}
function setActualizarSalida(salida,cantidad,id)
{
    //alert("https://empaquessyrgdl.000webhostapp.com/empaquesSyR/inventario/updateSalida.php?cantidad="+cantidad+"&id_lp="+id)
    servidor("https://empaquessyrgdl.000webhostapp.com/empaquesSyR/inventario/updateSalida.php?cantidad="+cantidad+"&id_lp="+id+"&salida="+salida,getActualizarSalida)
}
function getActualizarSalida(respuesta)
{
    //alert(respuesta.responseText)
    if(respuesta.responseText == 1)
    {
        alerta("Salida Generada");
        resetearPilaFunction(mostrarTodoInventario);
    }
    else alerta("no se pudo actualizar");

}
function setSalidaTotal(codigo)
{
    ons.notification.confirm({
        title: '',
        message: "Se dará salida a todo el inventario",
        buttonLabels: ['SI', 'NO'],
        callback: function(idx) {
            if(idx==0) servidor("https://empaquessyrgdl.000webhostapp.com/empaquesSyR/inventario/updateSalidaTodo.php?codigo="+codigo,getActualizarSalida);;
          }
   });
    
}
function enlistarInventario(arrayJson)
{
    let html1 = "";

    html1 += '<ons-card  style="padding:0px;" class="botonPrograma" onclick="nextPageFunctionData(\'InventarioPedidos.html\',setMostrarInventarioPedidos,\''+arrayJson.codigo+'\')">';
    html1 += '<ons-list-item modifier="nodivider chevron">'; 
    html1 += '        <div class="left">';
    html1 +=              '<i class="fa-solid fa-box fa-2x"></i>';
    html1 += '        </div>';
    html1 += '        <div class="center">';
    html1 += '            <span class="list-item__title"><b>'+arrayJson.codigo+'</b>&nbsp;'+ arrayJson.producto +'</span>';
    html1 += '            <span class="list-item__subtitle">'+ arrayJson.cliente +'</span>';
    html1 += '        </div>';
    html1 += '        <div class="right">';
    html1 += '            <span class="notification" style="background: rgb(8, 136, 205);">'+ separator(arrayJson.inventario) +' <font size="2px">pza(s)</font> </span>';
    html1 += '        </div>';
    html1 += '</ons-list-item>';
    html1 += '</ons-card>';

    return html1;
}

function setMostrarInventarioPedidos(codigo)
{
    codigoCliente = codigo;
    servidor('https://empaquessyrgdl.000webhostapp.com/empaquesSyR/inventario/selectCodigo.php?codigo='+codigo,getMostrarInventarioPedidos);
}

function getMostrarInventarioPedidos(respuesta)
{
    var resultado = respuesta.responseText;
    var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'
    
    listaInfinita('datosInventarioPedidos','InventarioPedidosLoading',arrayJson,enlistarInventarioCodigo);
}

function setMostrarInventarioPedidosLamina()
{
    //codigoCliente = codigo;
    servidor('https://empaquessyrgdl.000webhostapp.com/empaquesSyR/inventario/selectLamina.php',getMostrarInventarioPedidosLamina);
}

function getMostrarInventarioPedidosLamina(respuesta)
{
    var resultado = respuesta.responseText;
    var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'
    
    listaInfinita('datosLaminaInventario','laminaInventarioLoading',arrayJson,enlistarInventarioLamina);
}

function enlistarInventarioCodigo(arrayJson)
{
    let html = "";
    var inventario = arrayJson.entrada - arrayJson.salida
    html += '<ons-card  style="padding:0px;" class="botonPrograma" onclick="alertPromptInventario(\''+arrayJson.id_lp+'\',\''+arrayJson.salida+'\',\''+inventario+'\')">';
    html += '    <ons-list-header>'+arrayJson.id_lp+'</ons-list-header>';
    html += '    <ons-list-item modifier="nodivider"> ';
    html += '        <div class="left">';
    html += '            <i class="fa-solid fa-box fa-2x"></i>';
    html += '        </div>';
    html += '        <div class="center">';
    html += '            <span class="list-item__title"><b>'+arrayJson.codigo+'</b>&nbsp;'+arrayJson.producto+'</span>';
    html += '            <span class="list-item__subtitle">'+arrayJson.cliente+'</span>';
    html += '        </div>';
    html += '        <div class="right">';
    html += '            <span class="notification" style="background: rgb(61, 174, 80);">'+ separator(arrayJson.entrada)+' </span>';
    html += '            <i class="fa-solid fa-minus"></i>';
    html += '            <span class="notification">'+ separator(arrayJson.salida)+' </span>';
    html += '            <i class="fa-solid fa-equals"></i>';
    html += '            <span class="notification" style="background: rgb(8, 136, 205);">  '+separator(inventario)+' <font size="2px">pza(s)</font> </span>';
    html += '        </div>';
    html += '    </ons-list-item>';
    html += '</ons-card>';
    return html;
}

function enlistarInventarioLamina(arrayJson)
{
    let html1 = '';
    var o_c = arrayJson.codigo;
    o_c = o_c[o_c.length-1] == 1 ? o_c.slice(0,-1) + "PCM" : o_c.slice(0,-1) + "PACK";
    
    html1 += '<ons-card  style="padding:0px;" class="botonPrograma" onclick="">'
    html1 += ' <ons-list-header style="background:white">'+ o_c +'</ons-list-header>';
    html1 += '<ons-list-item modifier="nodivider">'; 
    html1 += '        <div class="left">';
    html1 +=              '<i class="fa-solid fa-stop fa-2x"></i>';
    html1 += '        </div>';
    html1 += '        <div class="center">';
    html1 += '        <span class="list-item__title">'+esEntero(arrayJson.ancho)+' X '+esEntero(arrayJson.largo)+' - <b>'+arrayJson.resistencia+'</b></span>'; 
    html1 += arrayJson.producto != "" ? '<span class="list-item__subtitle">'+arrayJson.caja+' '+arrayJson.producto+' - <b>'+arrayJson.cliente+'</b></span>' : "";
    html1 += '        </div>';
    html1 += '        <div class="right">';
    html1 += '            <span class="notification" style="background: rgb(8, 136, 205);">'+ separator(arrayJson.inventario) +' <font size="2px">pza(s)</font></span>';
    //html1 += '            <div style="position: absolute;bottom:60px; right: 10px;" ><i style="color: '+color+';filter: drop-shadow(0 2px 5px rgba(0, 0, 0, 0.3))" class="fa-solid fa-comment-dots fa-2x"></i></div>';
    html1 += '        </div>';
    html1 += '</ons-list-item>';
    html1 += '</ons-card>';
    
    return html1;
}