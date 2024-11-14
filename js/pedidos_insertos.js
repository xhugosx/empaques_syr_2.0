//var filtro = false;
function agregarHtmlInserto()
{
    //validar si existe la variable de cantidad de insertos si no crearla
    //localStorage.setItem('insertos', 2);
    
    if(localStorage.getItem('insertos'))
    {
        let i = localStorage.getItem('insertos');
        localStorage.setItem('insertos', (parseInt(i)+1));
    }
    else localStorage.setItem('insertos', 1);
    //console.log(localStorage.getItem('insertos'));

    let i = localStorage.getItem('insertos');

    //tomar el valor del la variable y concatenar id

    let html="";

    html += '<div id="agregarInserto'+i+'">';
    html += '    <ons-card  style="padding:0px;" class="botonPrograma" >';
    html += '        <ons-list-item modifier="nodivider">';
    html += '            <div class="center">';
    html += '                <ons-select  class="input-100" id="inserto'+i+'" autofocus>';
    html += '                    <option value="">Inserto</option>';
    html += '                    <option value="DIV. UNICA">DIV. UNICA</option>';
    html += '                    <option value="DIV. CORTA">DIV. CORTA</option>';
    html += '                    <option value="DIV. LARGA">DIV. LARGA</option>';
    html += '                    <option value="CAMA">CAMA</option>';
    html += '                    <option value="SUAJADO">SUAJADO</option>';
    html += '                    <option value="BASE">BASE</option>';
    html += '                    <option value="SEPARADOR">SEPARADOR</option>';
    html += '                </ons-select>';
    html += '                <ons-select  class="input-100" id="resistencia'+i+'">';
    html += '                    <option value="" style="color: #ccc;">Resistencia</option>';
    html += '                    <option value="MICRO">MICRO</option>';
    html += '                    <option value="S/G">S/G</option>';
    html += '                    <option value="21 ECT ESP">21 ECT ESP</option>';
    html += '                    <option value="21 ECT">21 ECT</option>';
    html += '                    <option value="23 ECT">23 ECT</option>';
    html += '                    <option value="26 ECT">26 ECT</option>';
    html += '                    <option value="32 ECT">32 ECT</option>';
    html += '                    <option value="38 ECT">38 ECT</option>';
    html += '                    <option value="42 ECT">42 ECT</option>';
    html += '                    <option value="51 ECT">51 ECT</option>';
    html += '                    <option value="61 ECT">61 ECT</option>';
    html += '                    <option value="71 ECT">71 ECT</option>';
    html += '                </ons-select><br><br>';
    html += '                <ons-input id="cantidad'+i+'" type="number" class="input-100" cols="30" rows="1" placeholder="Cantidad"></ons-input><br><br><br>';
    html += '                <ons-input id="notas'+i+'" type="text" class="input-100" cols="30" rows="1" placeholder="Notas (opcional)" onkeyup="javascript:this.value=this.value.toUpperCase();"></ons-input>';
    html += '            </div>';
    html += '        </ons-list-item>';
    html += '    </ons-card>';
    html += '</div>';

    $("#insertos").append(html);
    //mandar html al div
}
function retrocederInserto()
{
    if(localStorage.getItem('insertos'))
    {
        let i = localStorage.getItem('insertos');
        localStorage.setItem('insertos', (parseInt(i)-1));

        if(localStorage.getItem('insertos') == 0) localStorage.removeItem('insertos');

        $("#agregarInserto"+i).remove();
        
    }

}
function limpiarLocalStorage()
{
    localStorage.removeItem('insertos');
}

function setAgregarPedidoInserto(...datos)
{
    //console.log(myLink+"/php/lista_pedidos_inserto/add.php?codigo="+datos[0]+"&resistencia="+datos[1]+"&cantidad="+datos[2]+"&observaciones="+datos[3]+"&fecha_oc="+datos[4]+"&notas="+datos[5]);
    servidor(myLink+"/php/lista_pedidos_inserto/add.php?codigo="+datos[0]+"&resistencia="+datos[1]+"&cantidad="+datos[2]+"&observaciones="+datos[3]+"&fecha_oc="+datos[4]+"&notas="+datos[5],getAgregaPedidoInserto);
}
function getAgregaPedidoInserto(respuesta)
{
    var resultado = respuesta.responseText;
    if(resultado != 1) alerta("no se pudo inserto");
    //console.log(resultado);
}

function setPedidosInsertos()
{
    //var type = filtro ? 1 : 2;
    var busqueda = $('#searchPedidoInserto').val();
    if(busqueda == "" || busqueda == undefined)servidor(myLink+"/php/lista_pedidos_inserto/selectAll.php?filtro=" + filtroGlobal + "&estado=" + estadoGlobal+"&anio=" + anioGlobal,getPedidosInsertos);
    else setSearchPedidosInsertos(busqueda,13);
}
function getPedidosInsertos(respuesta)
{
    var resultado = respuesta.responseText;//respuesta del servidor
    var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'
    
    $('#todoPedidosInsertos').attr("badge", arrayJson.length-1);

    listaInfinita('datosPedidosInsertos','datosPedidosInsertosLoading',arrayJson,enlistarPedidosInsertos);

}
function setEliminarPedidoInserto(id)
{
    servidor(myLink+"/php/lista_pedidos_inserto/delete.php?id="+id,getEliminarpedidoInserto);
}
function getEliminarpedidoInserto(respuesta)
{
    if(respuesta.responseText == 1) 
    {  
        alerta("Pedido Eliminado");
        buscarDtospedidos();
    }
    else alerta("Hubo un error al tratar de eliminar el Pedido...");
}
function setModificarBuscarPedidoInserto(id)
{
    //var type = filtro ? 1 : 2;
    servidor(myLink+"/php/lista_pedidos_inserto/selectAllEditar.php?id="+id,getModificarBuscarPedidoInserto);
    
}
function getModificarBuscarPedidoInserto(respuesta)
{
    //console.log(respuesta.responseText);
    var resultado = respuesta.responseText;//respuesta del servidor
    var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'
    arrayJson[0] = JSON.parse(arrayJson[0]);
   
    //asignar datos encontrados a inputs de insertos
    $('#id').val(arrayJson[0].id);
    $("#inserto").val(arrayJson[0].observaciones);
    $("#resistencia").val(arrayJson[0].resistencia);
    $("#cantidad").val(arrayJson[0].cantidad);
    $("#notas").val(arrayJson[0].notas);
}
function setModificarPedidoInserto()
{
    var id = $("#id").val();
    var observaciones = $("#inserto").val();
    var resistencia = $("#resistencia").val();
    var cantidad = $("#cantidad").val();
    var notas = $("#notas").val();

    if(datoVacio(resistencia) && datoVacio(cantidad) && datoVacio(observaciones))
    {
        servidor(myLink+"/php/lista_pedidos_inserto/update.php?resistencia="+resistencia+"&cantidad="+cantidad+"&id="+id+"&observaciones="+observaciones+"&notas="+notas,getModificarPedidoInserto)
    }
    else alerta('Espacios Vacios! <br>(No escribir "CEROS")')
    
}
function getModificarPedidoInserto(respuesta)
{
    if(respuesta.responseText == 1) 
    {  
        alerta("Pedido Actualizado");
        resetearPilaFunction(buscarDtospedidos);
    }
    else alerta("Hubo un error al tratar de modificar el Pedido...");
}

function setSearchPedidosInsertos(search,e)
{
    
    tecla = (document.all) ? e.keyCode : e.which;
    if (tecla==13 || e==13) 
    {
        //var type = filtro ? 1 : 2;
        servidor(myLink+"/php/lista_pedidos_inserto/selectAll.php?search="+search+"&filtro=" + filtroGlobal + "&estado=" + estadoGlobal,getSearchPedidosInsertos);
    }
    else if(search == "") setPedidosInsertos();
}

function getSearchPedidosInsertos(respuesta)
{
    var resultado = respuesta.responseText;//respuesta del servidor
    var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'
    listaInfinita('datosPedidosInsertos','',arrayJson,enlistarPedidosInsertos);

}

//funcion para actualizar el estado del pedido de los insertos

function setActualizarEstadoPedidoInserto(datos) {
    let id = datos[0];
    let estado = datos[1];
    servidor(myLink+"/php/lista_pedidos_inserto/updateEstado.php?id=" + id + "&estado=" + estado, getActulizarestadoPedidoInserto);
}
function getActulizarestadoPedidoInserto(respuesta)
{
    if (respuesta.responseText == 1) {
        alerta("Estado Actualizado");
        buscarDtospedidos();
        //$('#facturaF').val("");
        //$('#cantidadF').val("");
        //hideDialogo('my-dialogAgregarFactura')
    }
    else alerta("Hubo un error al tratar de modificar el Estado...");
}

function enlistarPedidosInsertos(arrayJson,i)
{
    //alerta(""+arrayJson)
    let html1 = "";
    var color = "";
    var entregado = "";
    var estado = "";
    if(arrayJson.id[(arrayJson.id).length-1] == "F") 
    {
        color = "#a01a1a";
        entregado = "Faltante";
    }
    else if(arrayJson.fechaSalida != "") 
    {
        color = "rgb(8, 136, 205)";
        entregado = "Entregado: "+ sumarDias(arrayJson.fechaSalida,0);
    }
    else 
    {
        entregado = 'Entrega: '+sumarDias(arrayJson.fecha_oc,20);
        color = "rgb(61, 121, 75)";
    }
    
    if (arrayJson.estado == 0) estado = '⚪';
    else if (arrayJson.estado == 1) estado = '🟠';
    else if (arrayJson.estado == 2) estado = '🟢';
    else if (arrayJson.estado == 3) estado = '🟩';
    
    var color1 = arrayJson.notas == "" ? "gray" : "rgb(115, 168, 115)";
    
    html1 += '<ons-card  style="padding:0px;" class="botonPrograma" onclick="crearObjetMensajePedidoInserto(\''+arrayJson.id+'\',\''+arrayJson.codigo+'\',\''+arrayJson.estado+'\',\''+arrayJson.notas+'\')">'
    html1 += '<ons-list-header style="background:white;">'+estado+'&emsp;';
    html1 += arrayJson.id;
    html1 += '    &emsp;';
    html1 += '    <b style="color: '+color+';">';
    html1 +=        entregado; //aqui ira una fecha 
    html1 += '    </b>';
    html1 += '</ons-list-header>';
    html1 += '<ons-list-item modifier="nodivider">'; 
    html1 += '    <div class="left">';
    html1 += '        <strong>'+arrayJson.codigo+'</strong>';
    html1 += '    </div>';
    html1 += '    <div class="center romperTexto">';
    html1 += '        <span class="list-item__title">'+arrayJson.observaciones+' | <b style="color:#404040">'+arrayJson.resistencia+'</b></span>'; 
    html1 += '        <span class="list-item__subtitle">';
    html1 += '<span><b>'+arrayJson.producto+'</b> <br> '+arrayJson.cliente+' <br><strong>'+(arrayJson.notas != '' ? '<i style="color: rgb(115, 168, 115)" class="fa-solid fa-comment-dots fa-2x"></i> &nbsp;'+arrayJson.notas : '')+'</strong></span>';
    html1 += '        </span>';
    html1 += '    </div>';
    html1 += '    <div class="right">';
    html1 += '         <div class="centrar">';              
    html1 += '               <br>';                    
    html1 += '               <b style="font-size:16px">'+separator(arrayJson.cantidad)+' <span style="font-size:14px">pzas</span></b>';
    html1 += '         </div>';
    html1 += '            <div style="position: absolute;bottom:60px; right: 10px;" ><i style="color: '+color1+'" class="fa-solid fa-comment-dots fa-2x"></i></div>';
    html1 += '    </div>';
    html1 += '</ons-list-item>';
    html1 += '</ons-card>';
    
    return html1;
}