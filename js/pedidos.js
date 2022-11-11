//variable global para ver si filtrar o no
var filtro = false;
//variable global para saber que cliente se filtro
var cliente = "";
function asignarFiltro(valor)
{
    filtro = valor.checked;
    buscarDtospedidos();

}

function buscarDtospedidos()
{
    setBusquedaPendiente();
    setPedidosCliente();
    setPedidosClienteFiltrado(cliente);
    //aqui se ejecutara la otra funcion
}

//BUSQUEDA POR CLIENTE VISTA 1
function setPedidosCliente()
{
    var type = filtro ? 1 : 2;
    servidor("https://empaquessyrgdl.000webhostapp.com/empaquesSyR/lista_pedidos/selectCliente.php?type="+type,getPedidosCliente)
}
function getPedidosCliente(respuesta)
{
    var resultado = respuesta.responseText;//respuesta del servidor
    var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'
    var cantidadDeDatos = arrayJson[arrayJson.length-1];
    resultado = enlistarPedidosCliente(arrayJson);
    
    $('#clientesPedidos').attr("badge", cantidadDeDatos);
    $('#datosPedidosClientes').empty();    
    setDataPage('#datosPedidosClientes','#datosPedidosClientesLoading',resultado);
}

//BUQUEDA POR TODOS VISTA 2
function setBusquedaPendiente()
{
    var type = filtro ? 1 : 2;
    servidor("https://empaquessyrgdl.000webhostapp.com/empaquesSyR/lista_pedidos/selectAll.php?type="+type,getBusquedaPendiente);
}
function getBusquedaPendiente(respuesta)
{
    var resultado = respuesta.responseText;//respuesta del servidor
    var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'
    var cantidadDeDatos = arrayJson[arrayJson.length-1];
    resultado = enlistarPedidos(arrayJson);
    
    $('#todoPedidos').attr("badge", cantidadDeDatos);
    $('#datosPedidos').empty();  
    setDataPage('#datosPedidos',0,resultado);
}

//PEDIDOS FILTRADO POR CLIENTE
function setPedidosClienteFiltrado(codigo)
{
    var type = filtro ? 1 : 2;
    cliente = codigo;
    servidor("https://empaquessyrgdl.000webhostapp.com/empaquesSyR/lista_pedidos/selectAll.php?type="+type+"&cliente="+agregarCeros(codigo),getPedidosClienteFiltrado);
}
function getPedidosClienteFiltrado(respuesta)
{
    var resultado = respuesta.responseText;//respuesta del servidor
    var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'
    
    resultado = enlistarPedidos(arrayJson);
    
   
    $('#datosPedidosClienteFiltrado').empty();  
    setDataPage('#datosPedidosClienteFiltrado','#datosPedidosClientesLoadingFiltroLoading',resultado);
}

//funcion para barra de busqueda pedidos
function setSearchPedidos(search,e)
{
   // if(busqueda=="") setProductos();

    tecla = (document.all) ? e.keyCode : e.which;
    if (tecla==13) 
    {
        var type = filtro ? 1 : 2;
        servidor("https://empaquessyrgdl.000webhostapp.com/empaquesSyR/lista_pedidos/selectAll.php?type="+type+"&search="+search,getSearchPedidos);
    }
    else if(search == "") setBusquedaPendiente();
}

function getSearchPedidos(respuesta)
{
    var resultado = respuesta.responseText;//respuesta del servidor
    var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'
    resultado = enlistarPedidos(arrayJson);
    
    $('#datosPedidos').empty();  
    setDataPage('#datosPedidos',0,resultado);
}

// function para barra de busqueda pedidos por cliente

function setSearchPedidosCliente(search,e)
{
    tecla = (document.all) ? e.keyCode : e.which;
    if (tecla==13) 
    {
        var type = filtro ? 1 : 2;
        servidor("https://empaquessyrgdl.000webhostapp.com/empaquesSyR/lista_pedidos/selectAll.php?type="+type+"&search="+search,getSearchPedidosCliente);
    }
    else if(search == "") setBusquedaPendiente();
}

function getSearchPedidosCliente(respuesta)
{
    var resultado = respuesta.responseText;//respuesta del servidor
    var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'
    resultado = enlistarPedidos(arrayJson);
    
    $('#datosPedidos').empty();  
    setDataPage('#datosPedidos',0,resultado);
}

//funcion paran agregar pedidos
function setAgregarPedido()
{
    var id = $("#pedidoId").val();
    var codigo = $("#pedidoCodigo").val();
    var cantidad =  $("#pedidoCantidad").val();
    var oc = $("#pedidoOc").val();
    var fecha_oc = $("#pedidoFechaOc").val();
    var resistencia = $("#pedidoResistencia").val();
   
    
    if(datoVacio(id) && datoVacio(codigo) && datoVacio(cantidad) && datoVacio(oc) && datoVacio(fecha_oc) && datoVacio(resistencia))
    {
        servidor('https://empaquessyrgdl.000webhostapp.com/empaquesSyR/lista_pedidos/add.php?id='+id+'&codigo='+codigo+'&cantidad='+cantidad+'&resistencia='+resistencia+'&oc='+oc+'&fecha_oc='+fecha_oc,getAgregarPedido);
    }
    else
    {
        alerta("Espacios vacios!");
    }
        
}
function getAgregarPedido(respuesta)
{
    
    if(respuesta.responseText=="1") 
    {
        alertaConfirmSiNo("Registro Insertado, Deseas insertar otro?",limpiarRegistrosPedidos,resetearPilaFunction,buscarDtospedidos)
    }
    else alerta('hubo un error al insertar!');
    
}

function setBuscarProductoCliente(codigo,e)
{
    
    tecla = (document.all) ? e.keyCode : e.which;
    if (codigo.length == 7 || tecla == 13) 
    {
        $("#pedidoClienteProgress").empty();
        $("#pedidoProductoProgress").empty();

        $("#pedidoClienteProgress").append("<ons-progress-circular indeterminate></ons-progress-circular>");
        $("#pedidoProductoProgress").append("<ons-progress-circular indeterminate></ons-progress-circular>");

        $("#pedidoProducto").val("Buscando...");
        $("#pedidoCliente").val("Buscando...");
        $("#botonAgregarPedido").attr('disabled', true);
        
        servidor("https://empaquessyrgdl.000webhostapp.com/empaquesSyR/lista_pedidos/selectProductoCliente.php?search="+codigo,getBuscarProductoCliente);
    }
    else
    {
        limpiarRegistrosPedidos2();
    }
}
function getBuscarProductoCliente(respuesta)
{
    var resultado = respuesta.responseText;//respuesta del servidor
    if(resultado == "")
    {
        $("#pedidoProducto").val("sin resultados...");
        $("#pedidoCliente").val("sin resultados...");
    }
    else
    {
        
        var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'
        arrayJson[0] = JSON.parse(arrayJson[0]);
        $("#pedidoProducto").val(reducirTexto(arrayJson[0].producto));
        $("#pedidoCliente").val(arrayJson[0].cliente);

        let cantidad = arrayJson[0].cantidad == "" ? 1 : parseInt(arrayJson[0].cantidad) + 1;
        $('#pedidoId').val("2022"+agregarCeros(arrayJson[0].codigo)+"-"+cantidad);
        //activar boton agregar
        $("#botonAgregarPedido").attr('disabled', false);
    }
    $("#pedidoClienteProgress").empty();
    $("#pedidoProductoProgress").empty();
   
}
//eliminar pedido
function setEliminarPedido(id)
{
    servidor("https://empaquessyrgdl.000webhostapp.com/empaquesSyR/lista_pedidos/delete.php?id="+id,getEliminarpedido);
}
function getEliminarpedido(respuesta)
{
    if(respuesta.responseText == 1) 
    {  
        alerta("Pedido Eliminado");
        buscarDtospedidos();
    }
    else alerta("Hubo un error al tratar de eliminar el Pedido...")
}


//ENLISTAR DATOS CLIENTES
function enlistarPedidosCliente(arrayJson)
{
    if(arrayJson=="" || arrayJson == "0") return "<ons-card> <center> <h2>Sin resultados...</h2> </center> </ons-card>";

    let html1;
    html1 = '<ons-card>';

    for(var i=0;i<arrayJson.length-1;i++) 
    {
        arrayJson[i] = JSON.parse(arrayJson[i]); //convertimos los jsonText en un objeto json

        html1 += '<ons-list-item modifier="chevron" tappable onclick="nextPageFunctionData(\'pedidosFiltroCliente.html\',setPedidosClienteFiltrado,\''+arrayJson[i].codigo+'\')">';
        //html1 += '<ons-list-item modifier="chevron" tappable onclick="crearObjetMensajePedido()">';
        html1 += '    <div class="left">';
        html1 += '        <strong>';
        html1 += agregarCeros(arrayJson[i].codigo);
        html1 += '        </strong>';
        html1 += '    </div>';
        html1 += '    <div class="center">';
        html1 += arrayJson[i].cliente;
        html1 += '    </div>';
        html1 += '    <div class="right">';
        html1 += '        <span class="notification">'+arrayJson[i].contador+'</span>';
        html1 += '    </div>';
        html1 += '</ons-list-item>';
    }
    html1 += '</ons-card><br><br><br>';

    return html1
}
//ENLISTAR PEDIDOS
function enlistarPedidos(arrayJson)
{
    if(arrayJson=="" || arrayJson == "0") return "<ons-card> <center> <h2>Sin resultados...</h2> </center> </ons-card>";

    let html1;
    html1 = '<ons-card>';

    for(var i=0;i<arrayJson.length-1;i++) 
    {
        arrayJson[i] = JSON.parse(arrayJson[i]); //convertimos los jsonText en un objeto json
        
        
        html1 += '<ons-list-header>';
        html1 += arrayJson[i].id;
        html1 += '    &emsp;&emsp;&emsp;';
        html1 += '    <b style="color: rgb(61, 121, 75);">';
        html1 += '        Entrega: '+sumarDias(arrayJson[i].fecha_oc,20); //aqui ira una fecha 
        html1 += '    </b>';
        html1 += '</ons-list-header>';
        html1 += '<ons-list-item tappable onclick="crearObjetMensajePedido(\''+arrayJson[i].oc+'\',\''+arrayJson[i].id+'\')">'; //preubaAlerta(\''+arrayJson[i].oc+'\')
        html1 += '    <div class="left">';
        html1 += '        <strong>'+arrayJson[i].codigo+'</strong>';
        html1 += '    </div>';
        html1 += '    <div class="center romperTexto">';
        html1 += '        <span class="list-item__title">'+arrayJson[i].producto+'</span>'; 
        html1 += '        <span class="list-item__subtitle">';
        html1 += arrayJson[i].cliente;
        html1 += '        </span>';
        html1 += '    </div>';
        html1 += '    <div class="right">';
        html1 += '         <div class="centrar">';
        html1 += arrayJson[i].resistencia;               
        html1 += '               <br>';                    
        html1 += '               <b>'+separator(arrayJson[i].cantidad)+' pzas</b>';
        html1 += '         </div>';
        html1 += '    </div>';
        html1 += '</ons-list-item>';
        

    }
    html1 += '</ons-card><br><br><br>';

    return html1
}



function reiniciarFilter()
{
    filtro = false;
}

function limpiarRegistrosPedidos()
{
    $("#pedidoId").val('');
    $("#pedidoCodigo").val('');
    $("#pedidoProducto").val('');
    $("#pedidoCliente").val('');
    $("#pedidoCantidad").val('');
    $("#pedidoOc").val('');
    $("#pedidoFechaOc").val('');
}

function limpiarRegistrosPedidos2()
{
    $("#pedidoId").val('');
    $("#pedidoProducto").val('');
    $("#pedidoCliente").val('');
    $("#botonAgregarPedido").attr('disabled', true);
}

