function mostrarTodoPedidosLamina()
{
    $('#loadingPedidosLamina').append("<ons-progress-bar indeterminate></ons-progress-bar>");
    $('#loadingPedidosLaminaPACK').append("<ons-progress-bar indeterminate></ons-progress-bar>");
    setMostrarPedidosLamina();
    setMostrarPedidosLaminaPACK();
}
function setMostrarBusquedaLamina(search,e)
{ 
    tecla = (document.all) ? e.keyCode : e.which;
    if (tecla==13) 
    {
        servidor('https://empaquessyrgdl.000webhostapp.com/empaquesSyR/lista_pedidos_lamina/select.php?proveedor=1&search='+search,getMostrarPedidosLamina);
    }
    else if(search == "") setMostrarPedidosLamina();
}
function setMostrarBusquedaLaminaPack(search,e)
{ 
    tecla = (document.all) ? e.keyCode : e.which;
    if (tecla==13) 
    {
        servidor('https://empaquessyrgdl.000webhostapp.com/empaquesSyR/lista_pedidos_lamina/select.php?proveedor=2&search='+search,getMostrarPedidosLaminaPACK);
    }
    else if(search == "") setMostrarPedidosLaminaPACK();
}
function setMostrarPedidosLamina()
{
    servidor("https://empaquessyrgdl.000webhostapp.com/empaquesSyR/lista_pedidos_lamina/select.php?proveedor=1",getMostrarPedidosLamina)
}
function getMostrarPedidosLamina(respuesta)
{
    var resultado = respuesta.responseText;//respuesta del servidor
    //alert(resultado)
    var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'
    listaInfinita('datospedidosLamina','loadingPedidosLamina',arrayJson,enlistarPedidosLamina);
}
function setMostrarPedidosLaminaPACK()
{
    servidor("https://empaquessyrgdl.000webhostapp.com/empaquesSyR/lista_pedidos_lamina/select.php?proveedor="+2,getMostrarPedidosLaminaPACK)
}
function getMostrarPedidosLaminaPACK(respuesta)
{
    var resultado = respuesta.responseText;//respuesta del servidor
    var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'
    listaInfinita('datospedidosLaminaPACK','loadingPedidosLaminaPACK',arrayJson,enlistarPedidosLamina);
}
function setAgregarPedidoLamina()
{
    var form = $('#formPedidoLamina')[0];
    var formData = new FormData(form);
    
    //console.log(form.children[0]);
    var o_c = $('#O_CLP').val();
    var proveedor = $('#proveedorPL').val();
    var ancho = $('#anchoPL').val();
    var largo = $('#largoPL').val();
    var p_o = $('#pzas_ordenadasPL').val();
    var resistencia = $('#resistenciaPL').val();
    //if($('#checkCaja')[0].checked) var caja = $('#cajaLP').val(); //check para tomar el valor de caja
    var fecha = $('#fechaLP').val();
    //var observaciones = $('#observacionesPL').val();

    if(datoVacio(o_c) && datoVacio(ancho) && datoVacio(largo) && datoVacio(p_o) && datoVacio(resistencia) && datoVacio(fecha) && datoVacio(proveedor))
    servidorPost("https://empaquessyrgdl.000webhostapp.com/empaquesSyR/lista_pedidos_lamina/add.php",getAgregarPedidoLamina,formData);
    else alerta("Existen datos vacios");
    
}
function getAgregarPedidoLamina(respuesta)
{
    if(respuesta.responseText == 1)
    {
        alerta("Lamina agregada");
        resetearPilaFunction(mostrarTodoPedidosLamina);
    }
    else alerta("Inserta otra Orden de Compra");
}
function setActualizarEstadoPL(estado,o_c,cantidad,entrada)
{
    //alert('https://empaquessyrgdl.000webhostapp.com/empaquesSyR/lista_pedidos_lamina/updateEntrada.php?id_lp='+o_c+'&cantidad='+cantidad+'&entrada='+entrada+'&estado='+estado);
    servidor('https://empaquessyrgdl.000webhostapp.com/empaquesSyR/lista_pedidos_lamina/updateEntrada.php?id_lp='+o_c+'&cantidad='+cantidad+'&entrada='+entrada+'&estado='+estado,getActualizarEstadoPL)
}
function getActualizarEstadoPL(respuesta)
{
    var resultado = respuesta.responseText;
    if(resultado == 11 || resultado == 1)
    {
       alertToast("Estado Actualizado",500)
       mostrarTodoPedidosLamina();
    }
     
    else alerta("no se pudo actualizar"+resultado);
}

function setBuscarActualizarPL(search)
{
    servidor('https://empaquessyrgdl.000webhostapp.com/empaquesSyR/lista_pedidos_lamina/select.php?search='+search,getBuscarActualizarPL);
}
function getBuscarActualizarPL(respuesta)
{
    //console.log(respuesta.responseText);

    var resultado = respuesta.responseText;//respuesta del servidor
    var arrayJson = resultado.split('|');
    arrayJson = JSON.parse(arrayJson[0]);
    //variable para acceder desde otra funcion
    localStorage.setItem('o_c', arrayJson.o_c);

    $('#o_c').val(arrayJson.o_c.slice(0,-2));
    $('#proveedor').val(arrayJson.proveedor);
    $('#ancho').val(arrayJson.ancho);
    $('#largo').val(arrayJson.largo);
    $('#pzas_ordenadas').val(arrayJson.pzas_ordenadas);
    $('#resistencia').val(arrayJson.resistencia);
    $('#fecha').val(arrayJson.fecha);
    $('#observaciones').val(arrayJson.observaciones);
    if(arrayJson.caja != "")
    {
        $('#checkCaja')[0].checked = true;
        asignarInputCaja($('#checkCaja')[0]);
        $('#cajaLP').val(arrayJson.caja);
    } 
    
}
function setActualizarPL()
{
    var form = $('#formPedidoLamina')[0];
    var formData = new FormData(form);
    
    var o_cTemp = localStorage.getItem('o_c');
    //console.log(form.children[0]);

    var o_c = $('#o_c').val();
    var proveedor = $('#proveedor').val();
    var ancho = $('#ancho').val();
    var largo = $('#largo').val();
    var p_o = $('#pzas_ordenadas').val();
    var resistencia = $('#resistencia').val();
    var fecha = $('#fecha').val();

    if(datoVacio(o_c) && datoVacio(ancho) && datoVacio(largo) && datoVacio(p_o) && datoVacio(resistencia) && datoVacio(fecha) && datoVacio(proveedor))
    servidorPost("https://empaquessyrgdl.000webhostapp.com/empaquesSyR/lista_pedidos_lamina/update.php?&o_c="+o_cTemp,getActualizarPL,formData);
    else alerta("Existen datos vacios");
    
}
function getActualizarPL(respueta)
{
    //console.log(respueta.responseText);
    var resultado = respueta.responseText;
    if(resultado == 1)
    {
        // en caso de que si se actualice se limpia la memoria
        localStorage.removeItem('o_c');
        alerta("Pedido Actulizado");
        resetearPilaFunction(mostrarTodoPedidosLamina);
    }
    else alerta("No se pudo actualizar debido a un error");
    


}
function setEliminarPL(o_c)
{
    servidor('https://empaquessyrgdl.000webhostapp.com/empaquesSyR/lista_pedidos_lamina/delete.php?o_c='+o_c,getEliminarPL);
}
function getEliminarPL(respuesta)
{
    var resultado = respuesta.responseText;
    if(resultado == 1)
    {
        alerta("Pedido Eliminado");
        mostrarTodoPedidosLamina();
    }
    else alerta("No se pudo Eliminar debido a un error");

}

function asignarInputCaja(value)
{
    //caja = caja != "" ? caja : 
    if(value.checked) 
    {
        //alerta("entro");
        var html = "";
        html += '<ons-card class="contenedorInputSub agrandar">';
        html += '    <ons-list-item modifier="nodivider">';
        html += '        <div class="left">';
        html += '            <i class="fa-solid fa-box"></i>';
        html += '        </div>';
        html += '        <div class="center">';
        html += '            <ons-input name="caja" id="cajaLP" class="input-100" type="text" placeholder="Codigo Caja"  onkeyup="javascript:this.value=this.value.toUpperCase();"></ons-input>';
        html += '        </div>';
        html += '    </ons-list-item>';
        html += '</ons-card>';
        $('#llenarInputCaja').append(html);
    }
    else
    {
        $('#llenarInputCaja').empty();
        cajaGlobal = "";
        
    }
}


function enlistarPedidosLamina(arrayJson)
{
    let html1 = "";
    var o_c  = arrayJson.o_c.slice(0,-2);
    html1 += '<ons-card  style="padding:0px;" class="botonPrograma" onclick="crearMensajePL(\''+arrayJson.estado+'\',\''+arrayJson.entrada+'\',\''+arrayJson.pzas_ordenadas+'\',\''+arrayJson.o_c+'\')">'
    html1 += '<ons-list-header style="background:'+colorEstado(arrayJson.estado)+'; color:white;">';
    html1 += arrayJson.entrada != "" ? '      <div class="contenedorHead" style="color:'+colorEstado(arrayJson.estado)+';">llego: '+separator(arrayJson.entrada)+' pzas</div>' : "";
    html1 +=        estadoLamina(arrayJson.estado)+' | ';
    html1 +=        sumarDias(arrayJson.fecha,0) //aqui ira una fecha 
    html1 += '</ons-list-header>';
    html1 += '<ons-list-item modifier="nodivider">'; 
    html1 += '    <div class="left">';
    html1 += '        <strong style="width:38px">'+o_c+'</strong>';
    html1 += '    </div>';
    html1 += '    <div class="center romperTexto">';
    html1 += '        <span class="list-item__title">'+esEntero(arrayJson.ancho)+' X '+esEntero(arrayJson.largo)+' - <b>'+arrayJson.resistencia+'</b></span>'; 
    html1 += arrayJson.producto != "" ? '<span class="list-item__subtitle">'+arrayJson.caja+' '+arrayJson.producto+' - <b>'+arrayJson.cliente+'</b></span>' : "";
    html1 += '    </div>';
    html1 += '    <div class="right">';
    html1 += '         <div class="centrar">';
    html1 += '              <span class="notification"><font size="2px">'+separator(arrayJson.pzas_ordenadas)+' pza(s)</font></span>';   
    html1 += '         </div>';
    html1 += '    </div>';
    html1 += '</ons-list-item>';
    html1 += '</ons-card>';
    
    return html1;
}
function estadoLamina(d)
{
    if(d == 1) return "BACKORDER";
    else if(d == 2) return "PARCIAL";
    else if(d == 3) return "COMPLETO";
    else if(d == 4) return "CANCELADA";
    else if(d == 5) return "PROGRAMADO";
    
}
//te quedaste en el color 
function colorEstado(d)
{
    if(d == 1) return "#E8C07C";
    else if(d == 2) return "#CE84DA";
    else if(d == 3) return "#00A514";
    else if(d == 4) return "#000000";
    else if(d == 5) return "#E1D000";
}
function esEntero(numero)
{
    //
    numero = parseFloat(numero);
    return Number.isInteger(numero) ? numero+".0" : numero;
}