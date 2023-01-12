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
    if(cliente != "") setPedidosClienteFiltrado(cliente);

    $("#searchPedidoCliente").val("");
    $("#searchPedido").val("");

}
function solicitarInfoPedido(codigo,e)
{
    tecla = (document.all) ? e.keyCode : e.which;
    if(codigo.length == 7 || tecla == 13)
    {
        
        //funcion para solicitarInventario
        setBuscarInventario(codigo)
        //funcion para solicitar el ultimo registrado
        setBuscarProductoCliente(codigo);   
    }
    else
    {
        limpiarRegistrosPedidos2();
    }
    
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
    
    $('#clientesPedidos').attr("badge", arrayJson.length-1);

    listaInfinita('datosPedidosClientes','datosPedidosClientesLoading',arrayJson,enlistarPedidosCliente);
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

    $('#todoPedidos').attr("badge", arrayJson.length-1);

    listaInfinita('datosPedidos','',arrayJson,enlistarPedidos);
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

    listaInfinita('datosPedidosClienteFiltrado','datosPedidosClientesLoadingFiltroLoading',arrayJson,enlistarPedidos);
    cliente = "";
}

//funcion para barra de busqueda pedidos
function setSearchPedidos(search,e)
{
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
        servidor("https://empaquessyrgdl.000webhostapp.com/empaquesSyR/lista_pedidos/selectCliente.php?type="+type+"&search="+search,getSearchPedidosCliente);
    }
    else if(search == "") setPedidosCliente();
}

function getSearchPedidosCliente(respuesta)
{
    var resultado = respuesta.responseText;//respuesta del servidor
    var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'
    listaInfinita('datosPedidosClientes','',arrayJson,enlistarPedidosCliente);

}

// funcion para buscar con cliente filtrado 
//PEDIDOS FILTRADO POR CLIENTE
function setsearchPedidosClienteFiltrado(search,e,codigo)
{
    tecla = (document.all) ? e.keyCode : e.which;
    if (tecla==13) 
    {
        var type = filtro ? 1 : 2;
        cliente = codigo;
        servidor("https://empaquessyrgdl.000webhostapp.com/empaquesSyR/lista_pedidos/selectAll.php?type="+type+"&cliente="+agregarCeros(codigo)+"&search="+search,getSearchPedidosClienteFiltrado);
    }
    else if(search == "") setPedidosClienteFiltrado(codigo);
}
function getSearchPedidosClienteFiltrado(respuesta)
{
    var resultado = respuesta.responseText;//respuesta del servidor
    var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'
    listaInfinita('datosPedidos','',arrayJson,enlistarPedidos);
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
        //alert('https://empaquessyrgdl.000webhostapp.com/empaquesSyR/lista_pedidos/add.php?id='+id+'&codigo='+codigo+'&cantidad='+cantidad+'&resistencia='+resistencia+'&oc='+oc+'&fecha_oc='+fecha_oc);
    }
    else
    {
        alerta('Espacios vacios! <br>(No escribir "CEROS")');
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

function setBuscarProductoCliente(codigo)
{
    
    $("#pedidoProducto").val("Buscando...");
    $("#pedidoCliente").val("Buscando...");
    $("#botonAgregarPedido").attr('disabled', true);
    
    servidor("https://empaquessyrgdl.000webhostapp.com/empaquesSyR/lista_pedidos/selectProductoCliente.php?search="+codigo,getBuscarProductoCliente);
   
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

        const moonLanding = new Date();
        let anio = moonLanding.getFullYear();

        let cantidad = arrayJson[0].cantidad == "" ? 1 : parseInt(arrayJson[0].cantidad) + 1;
        $('#pedidoId').val(anio+agregarCeros(arrayJson[0].codigo)+"-"+cantidad);
        //activar boton agregar
        $("#botonAgregarPedido").attr('disabled', false);
    }
    $("#pedidoClienteProgress").empty();
    $("#pedidoProductoProgress").empty();
   
}
function setBuscarInventario(codigo)
{
    servidor('https://empaquessyrgdl.000webhostapp.com/empaquesSyR/inventario/select.php?search='+codigo,getBuscarInventario)
}
function getBuscarInventario(respuesta)
{
    if(respuesta.responseText != "")
    {
        var resultado = respuesta.responseText;//respuesta del servidor
        var arrayJson = resultado.split('|');
        arrayJson = JSON.parse(arrayJson[0]);
        alerta('En existencia: <strong>'+separator(arrayJson.inventario)+'</strong> Pzas');
        //alerta(resultado);
    } 
    //else alerta("Sin existencia en inventario");
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
    else alerta("Hubo un error al tratar de eliminar el Pedido...");
}

//buscar modificar pedido
function setModificarBuscarPedido(id)
{
    servidor("https://empaquessyrgdl.000webhostapp.com/empaquesSyR/lista_pedidos/selectAll.php?type=2&search="+id,getModificarBuscarPedido);
    
}
function getModificarBuscarPedido(respuesta)
{
    var resultado = respuesta.responseText;//respuesta del servidor
    var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'
    arrayJson[0] = JSON.parse(arrayJson[0]);
    $("#pedidoModificarId").val(arrayJson[0].id);
    $("#pedidoModificarCodigo").val(arrayJson[0].codigo);
    $("#pedidoModificarProducto").val(arrayJson[0].producto);
    $("#pedidoModificarCliente").val(arrayJson[0].cliente);
    $("#pedidoModificarResistencia").val(arrayJson[0].resistencia);
    $("#pedidoModificarCantidad").val(arrayJson[0].cantidad);
    $("#pedidoModificarOc").val(arrayJson[0].oc);
    $("#pedidoModificarFechaOc").val(arrayJson[0].fecha_oc);
    //resultado = enlistarPedidos(arrayJson);
    
   //alert(resultado);
    
}


//modificar pedido
function setModificarPedido()
{
    var id = $("#pedidoModificarId").val();
    var resistencia = $("#pedidoModificarResistencia").val();
    var cantidad = $("#pedidoModificarCantidad").val();
    var oc = $("#pedidoModificarOc").val();
    var fecha = $("#pedidoModificarFechaOc").val();

    if(datoVacio(resistencia) && datoVacio(cantidad) && datoVacio(oc) && datoVacio(fecha))
    {
        servidor("https://empaquessyrgdl.000webhostapp.com/empaquesSyR/lista_pedidos/update.php?resistencia="+resistencia+"&cantidad="+cantidad+"&oc="+oc+"&fecha_oc="+fecha+"&id="+id,getModificarPedido)
    }
    else alerta('Espacios Vacios! <br>(No escribir "CEROS")')
    
}
function getModificarPedido(respuesta)
{
    if(respuesta.responseText == 1) 
    {  
        alerta("Pedido Actualizado");
        resetearPilaFunction(buscarDtospedidos);
    }
    else alerta("Hubo un error al tratar de modificar el Pedido...");
}


//ENLISTAR DATOS CLIENTES
function enlistarPedidosCliente(arrayJson)
{
    let html1 = "";

    html1 += '<ons-card style="padding:0px;" class="botonPrograma" onclick="nextPageFunctionData(\'pedidosFiltroCliente.html\',setPedidosClienteFiltrado,\''+arrayJson.codigo+'\')">'
    html1 += '<ons-list-item modifier="chevron nodivider" >';
    //html1 += '<ons-list-item modifier="chevron" tappable onclick="crearObjetMensajePedido()">';
    html1 += '    <div class="left">';
    html1 += '        <strong>';
    html1 += agregarCeros(arrayJson.codigo);
    html1 += '        </strong>';
    html1 += '    </div>';
    html1 += '    <div class="center">';
    html1 += arrayJson.cliente;
    html1 += '    </div>';
    html1 += '    <div class="right">';
    html1 += '        <span class="notification">'+arrayJson.contador+'</span>';
    html1 += '    </div>';
    html1 += '</ons-list-item>';
    html1 += '</ons-card>';
    
    return html1;
}
//ENLISTAR PEDIDOS
var estadoTemp = "";
function enlistarPedidos(arrayJson,i)
{
    //alerta(""+arrayJson)
    let html1 = "";
    var color = "";
    var entregado = "";
    var estado = "";
    if(arrayJson.oc == "FALTANTE") 
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
    
    if (arrayJson.estado == 1)estado = '<i class="fa-solid fa-circle" style="color: #EC641A;"></i>'; 
    else if(arrayJson.estado == 2) estado = '<i class="fa-solid fa-circle" style="color: rgba(35, 154, 75, 0.933);"></i>'; 
    else estado = '<i class="fa-solid fa-circle" style="color: #F2F2F2;"></i>'; 
    

    html1 += '<ons-card  style="padding:0px;" class="botonPrograma" onclick="crearObjetMensajePedido(\''+arrayJson.oc+'\',\''+arrayJson.id+'\',\''+arrayJson.codigo+'\',\''+arrayJson.estado+'\')">'
    html1 += '<ons-list-header>'+estado+'&emsp;';
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
    html1 += '        <span class="list-item__title">'+arrayJson.producto+'</span>'; 
    html1 += '        <span class="list-item__subtitle">';
    html1 += '<span>'+arrayJson.cliente+'</span>';
    html1 += '        </span>';
    html1 += '    </div>';
    html1 += '    <div class="right">';
    html1 += '         <div class="centrar">';
    html1 += arrayJson.resistencia;               
    html1 += '               <br>';                    
    html1 += '               <b>'+separator(arrayJson.cantidad)+' <span style="font-size:10px">pzas</span></b>';
    html1 += '         </div>';
    html1 += '    </div>';
    html1 += '</ons-list-item>';
    html1 += '</ons-card>';
    
    return html1;
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

