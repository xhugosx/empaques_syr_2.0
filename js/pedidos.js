//variable global para ver si filtrar o no
var filtroGlobal = 1;
var estadoGlobal = "";
var fechaActual = new Date();
var anioGlobal = fechaActual.getFullYear();
//variable global para saber que cliente se filtro
var cliente = "";
function reiniciarCliente() { cliente = "" }

function buscarDtospedidos() {
    //asignar barra carga
    $("#datosPedidosClientesLoading").empty();
    $("#datosPedidosLoading").empty();
    $("#datosPedidosClientesLoading").append("<ons-progress-bar indeterminate></ons-progress-bar>");
    $("#datosPedidosLoading").append("<ons-progress-bar indeterminate></ons-progress-bar>");

    if (cliente == "") setBusquedaPendiente();
    if (cliente == "") setPedidosCliente();
    if (cliente != "") setPedidosClienteFiltrado(cliente);

    setPedidosInsertos();

    //$("#searchPedidoCliente").val("");
    //$("#searchPedido").val("");

}
function solicitarInfoPedido(codigo, e) {
    tecla = (document.all) ? e.keyCode : e.which;
    if (codigo.length == 7 || tecla == 13) {
        //funcion para solicitarInventario
        setBuscarInventario(codigo);
        //funcion para solicitar el ultimo registrado
        setBuscarProductoCliente(codigo);
    }
    else {
        limpiarRegistrosPedidos2();
    }

}
//BUSQUEDA POR CLIENTE VISTA 1
function setPedidosCliente() {
    //var type = filtro ? 1 : 2;
    servidor("https://empaquessr.com/sistema/php/lista_pedidos/selectCliente.php?filtro=" + filtroGlobal + "&estado=" + estadoGlobal+"&anio=" + anioGlobal, getPedidosCliente);
    //alert("https://empaquessr.com/sistema/php/lista_pedidos/selectCliente.php?filtro=" + filtroGlobal + "&estado=" + estadoGlobal + "&anio=" + anioGlobal);
}
function getPedidosCliente(respuesta) {
    var resultado = respuesta.responseText;//respuesta del servidor
    var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'

    $('#clientesPedidos').attr("badge", arrayJson.length - 1);

    listaInfinita('datosPedidosClientes', 'datosPedidosClientesLoading', arrayJson, enlistarPedidosCliente);

}

//BUQUEDA POR TODOS VISTA 2
function setBusquedaPendiente() {
    //var type = filtro ? 1 : 2;
    var busqueda = $('#searchPedido').val();
    //console.log("https://empaquessr.com/sistema/php/lista_pedidos/selectAll.php?filtro=" + filtroGlobal + "&estado=" + estadoGlobal+"&anio=" + anioGlobal);
    if (busqueda == "" || busqueda == undefined) servidor("https://empaquessr.com/sistema/php/lista_pedidos/selectAll.php?filtro=" + filtroGlobal + "&estado=" + estadoGlobal+"&anio=" + anioGlobal, getBusquedaPendiente);
    else setSearchPedidos(busqueda, 13);
}
function getBusquedaPendiente(respuesta) {
    var resultado = respuesta.responseText;//respuesta del servidor
    var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'

    $('#todoPedidos').attr("badge", arrayJson.length - 1);

    listaInfinita('datosPedidos', 'datosPedidosLoading', arrayJson, enlistarPedidos);
}

//PEDIDOS FILTRADO POR CLIENTE
function setPedidosClienteFiltrado(codigo) {
    //var type = filtro ? 1 : 2;
    cliente = codigo;
    var busqueda = $('#searchPedidosClientesFiltrados').val();
    if (busqueda == "" || busqueda == undefined) servidor("https://empaquessr.com/sistema/php/lista_pedidos/selectAll.php?cliente=" + agregarCeros(codigo) + "&filtro=" + filtroGlobal + "&estado=" + estadoGlobal+"&anio=" + anioGlobal, getPedidosClienteFiltrado);
    else setsearchPedidosClienteFiltrado(busqueda, 13, cliente);
}
function getPedidosClienteFiltrado(respuesta) {
    var resultado = respuesta.responseText;//respuesta del servidor
    var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'

    listaInfinita('datosPedidosClienteFiltrado', 'datosPedidosClientesLoadingFiltroLoading', arrayJson, enlistarPedidos);
    //cliente = "";
}

//funcion para barra de busqueda pedidos
function setSearchPedidos(search, e) {

    tecla = (document.all) ? e.keyCode : e.which;
    if (tecla == 13 || e == 13) {
        $("#datosPedidosLoading").empty();
        $("#datosPedidosLoading").append("<ons-progress-bar indeterminate></ons-progress-bar>");
        //var type = filtro ? 1 : 2;

        servidor("https://empaquessr.com/sistema/php/lista_pedidos/selectAll.php?search=" + search + "&filtro=" + filtroGlobal + "&estado=" + estadoGlobal+"&anio=" + anioGlobal, getSearchPedidos);
    }
    else if (search == "") setBusquedaPendiente();
}

function getSearchPedidos(respuesta) {
    var resultado = respuesta.responseText;//respuesta del servidor
    var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'
    //resultado = enlistarPedidos(arrayJson);

    listaInfinita('datosPedidos', 'datosPedidosLoading', arrayJson, enlistarPedidos);
}

// function para barra de busqueda pedidos por cliente

function setSearchPedidosCliente(search, e) {
    tecla = (document.all) ? e.keyCode : e.which;
    if (tecla == 13) {
        $("#datosPedidosClientesLoading").empty();
        $("#datosPedidosClientesLoading").append("<ons-progress-bar indeterminate></ons-progress-bar>");
        //var type = filtro ? 1 : 2;
        //console.log("https://empaquessr.com/sistema/php/lista_pedidos/selectCliente.php?type="+type+"&search="+search);
        servidor("https://empaquessr.com/sistema/php/lista_pedidos/selectCliente.php?search=" + search + "&filtro=" + filtroGlobal + "&estado=" + estadoGlobal+"&anio=" + anioGlobal, getSearchPedidosCliente);
    }
    else if (search == "") setPedidosCliente();
}

function getSearchPedidosCliente(respuesta) {
    var resultado = respuesta.responseText;//respuesta del servidor
    var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'
    listaInfinita('datosPedidosClientes', 'datosPedidosClientesLoading', arrayJson, enlistarPedidosCliente);

}

// funcion para buscar con cliente filtrado 
//PEDIDOS FILTRADO POR CLIENTE
function setsearchPedidosClienteFiltrado(search, e, codigo) {
    tecla = (document.all) ? e.keyCode : e.which;
    if (tecla == 13 || e == 13) {
        $("#datosPedidosClientesLoadingFiltroLoading").empty();
        $("#datosPedidosClientesLoadingFiltroLoading").append("<ons-progress-bar indeterminate></ons-progress-bar>");
        //var type = filtro ? 1 : 2;
        cliente = codigo;
        //console.log("https://empaquessr.com/sistema/php/lista_pedidos/selectAll.php?type="+type+"&cliente="+agregarCeros(codigo)+"&search="+search);
        servidor("https://empaquessr.com/sistema/php/lista_pedidos/selectAll.php?cliente=" + agregarCeros(codigo) + "&search=" + search + "&filtro=" + filtroGlobal + "&estado=" + estadoGlobal+"&anio=" + anioGlobal, getSearchPedidosClienteFiltrado);
    }
    else if (search == "") setPedidosClienteFiltrado(codigo);
}
function getSearchPedidosClienteFiltrado(respuesta) {
    var resultado = respuesta.responseText;//respuesta del servidor
    var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'
    listaInfinita('datosPedidosClienteFiltrado', 'datosPedidosClientesLoadingFiltroLoading', arrayJson, enlistarPedidos);
}

//funcion paran agregar pedidos
function setAgregarPedido() {
    var id = $("#pedidoId").val();
    var codigo = $("#pedidoCodigo").val();
    var cantidad = $("#pedidoCantidad").val();
    var oc = $("#pedidoOc").val();
    var fecha_oc = $("#pedidoFechaOc").val();
    var observaciones = $("#pedidoObservaciones").val();
    var resistencia = $("#pedidoResistencia").val();
    var papel = $("#pedidoPapel").val();

    if (datoVacio(id) && datoVacio(codigo) && datoVacio(cantidad) && datoVacio(oc) && datoVacio(fecha_oc) && datoVacio(resistencia) && datoVacio(papel)) {

        if (localStorage.getItem('insertos')) {
            let bandera = true;

            for (let i = 0; i < localStorage.getItem('insertos'); i++) {
                //console.log("#inserto"+(i+1));
                if ($("#inserto" + (i + 1)).val() == "" || $("#resistencia" + (i + 1)).val() == "" || $("#cantidad" + (i + 1)).val() == "") {
                    //console.log("entro");
                    bandera = false;
                    break;

                }
            }
            if (bandera) {
                let insertos = [];
                let resistencias = [];
                let cantidades = [];
                let notas = [];
                for (let i = 0; i < localStorage.getItem('insertos'); i++) {
                    //arrayDatos
                    resistencias.push($("#resistencia" + (i + 1)).val());
                    cantidades.push($("#cantidad" + (i + 1)).val());
                    insertos.push($("#inserto" + (i + 1)).val());
                    notas.push($("#notas" + (i + 1)).val());

                }
                setAgregarPedidoInserto(codigo, resistencias, cantidades, insertos, fecha_oc, notas);
                servidor('https://empaquessr.com/sistema/php/lista_pedidos/add.php?id=' + id + '&codigo=' + codigo + '&cantidad=' + cantidad + '&resistencia=' + resistencia + '&papel=' + papel + '&oc=' + oc + '&fecha_oc=' + fecha_oc + '&observaciones=' + observaciones, getAgregarPedido);
            }
            else alerta("Espacios vacios en insertos")
        }
        else servidor('https://empaquessr.com/sistema/php/lista_pedidos/add.php?id=' + id + '&codigo=' + codigo + '&cantidad=' + cantidad + '&resistencia=' + resistencia + '&papel=' + papel + '&oc=' + oc + '&fecha_oc=' + fecha_oc + '&observaciones=' + observaciones, getAgregarPedido);
    }
    else alerta('Espacios vacios en producto! <br>(No escribir "CEROS")');
}
function getAgregarPedido(respuesta) {

    if (respuesta.responseText == "1") {
        alertaConfirmSiNo("Registro Insertado, Deseas insertar otro?", limpiarRegistrosPedidos, resetearPilaFunction, buscarDtospedidos);
    }
    else alerta('hubo un error al insertar!' + respuesta.responseText);
    //console.log(respuesta.reponseText);
}

function setBuscarProductoCliente(codigo) {

    $("#pedidoProducto").val("Buscando...");
    $("#pedidoCliente").val("Buscando...");
    $("#botonAgregarPedido").attr('disabled', true);

    servidor("https://empaquessr.com/sistema/php/lista_pedidos/selectProductoCliente.php?search=" + codigo, getBuscarProductoCliente);

}
function getBuscarProductoCliente(respuesta) {
    var resultado = respuesta.responseText;//respuesta del servidor
    if (resultado == "") {
        $("#pedidoProducto").val("sin resultados...");
        $("#pedidoCliente").val("sin resultados...");
    }
    else {

        var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'
        arrayJson[0] = JSON.parse(arrayJson[0]);
        $("#pedidoProducto").val(reducirTexto(arrayJson[0].producto));
        $("#pedidoCliente").val(arrayJson[0].cliente);

        const moonLanding = new Date();
        let anio = moonLanding.getFullYear();

        let cantidad = arrayJson[0].cantidad == "" ? 1 : parseInt(arrayJson[0].cantidad) + 1;
        $('#pedidoId').val(anio + agregarCeros(arrayJson[0].codigo) + "-" + cantidad);
        //activar boton agregar
        $("#botonAgregarPedido").attr('disabled', false);
        //console.log(arrayJson);

    }
    $("#pedidoClienteProgress").empty();
    $("#pedidoProductoProgress").empty();

}
function setBuscarInventario(codigo) {
    servidor('https://empaquessr.com/sistema/php/inventario/select.php?search=' + codigo, getBuscarInventario)
}
function getBuscarInventario(respuesta) {
    if (respuesta.responseText != "") {
        var resultado = respuesta.responseText;//respuesta del servidor
        var arrayJson = resultado.split('|');
        arrayJson = JSON.parse(arrayJson[0]);
        alerta('En existencia: <strong>' + separator(arrayJson.inventario) + '</strong> Pzas');
        //alerta(resultado);
    }
    //else alerta("Sin existencia en inventario");
}
//eliminar pedido
function setEliminarPedido(id) {
    servidor("https://empaquessr.com/sistema/php/lista_pedidos/delete.php?id=" + id, getEliminarpedido);
}
function getEliminarpedido(respuesta) {
    if (respuesta.responseText == 1) {
        alerta("Pedido Eliminado");
        buscarDtospedidos();
    }
    else alerta("Hubo un error al tratar de eliminar el Pedido...");
}

//buscar modificar pedido
function setModificarBuscarPedido(id) {
    //var type = filtro ? 1 : 2;
    //console.log("https://empaquessr.com/sistema/php/lista_pedidos/selectAll.php?type="+type+"&search="+id);
    servidor("https://empaquessr.com/sistema/php/lista_pedidos/selectAllEditar.php?id=" + id, getModificarBuscarPedido);

}
function getModificarBuscarPedido(respuesta) {
    //console.log(respuesta.responseText);
    var resultado = respuesta.responseText;//respuesta del servidor
    var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'
    arrayJson[0] = JSON.parse(arrayJson[0]);
    $("#pedidoModificarId").val(arrayJson[0].id);
    $("#pedidoModificarCodigo").val(arrayJson[0].codigo);
    $("#pedidoModificarProducto").val(arrayJson[0].producto);
    $("#pedidoModificarCliente").val(arrayJson[0].cliente);
    $("#pedidoModificarResistencia").val(arrayJson[0].resistencia);
    $("#pedidoModificarPapel").val(arrayJson[0].papel);
    $("#pedidoModificarCantidad").val(arrayJson[0].cantidad);
    $("#pedidoModificarOc").val(arrayJson[0].oc);
    $("#pedidoModificarFechaOc").val(arrayJson[0].fecha_oc);
    $("#pedidoModificarObservaciones").val(arrayJson[0].observaciones);
    //resultado = enlistarPedidos(arrayJson);

    //alert(resultado);

}


//modificar pedido
function setModificarPedido() {
    var id = $("#pedidoModificarId").val();
    var resistencia = $("#pedidoModificarResistencia").val();
    var papel = $("#pedidoModificarPapel").val();
    var cantidad = $("#pedidoModificarCantidad").val();
    var oc = $("#pedidoModificarOc").val();
    var fecha = $("#pedidoModificarFechaOc").val();
    var observaciones = $("#pedidoModificarObservaciones").val();

    if (datoVacio(resistencia) && datoVacio(cantidad) && datoVacio(oc) && datoVacio(fecha)) {
        servidor("https://empaquessr.com/sistema/php/lista_pedidos/update.php?resistencia=" + resistencia + "&papel=" + papel + "&cantidad=" + cantidad + "&oc=" + oc + "&fecha_oc=" + fecha + "&id=" + id + "&observaciones=" + observaciones, getModificarPedido)
    }
    else alerta('Espacios Vacios! <br>(No escribir "CEROS")')

}
function getModificarPedido(respuesta) {
    if (respuesta.responseText == 1) {
        alerta("Pedido Actualizado");
        resetearPilaFunction(buscarDtospedidos);
    }
    else alerta("Hubo un error al tratar de modificar el Pedido...");
}



// modificar el estado del pedido
function setActualizarEstadoPedido(datos) {
    let id = datos[0];
    let estado = datos[1];
    servidor("https://empaquessr.com/sistema/php/lista_pedidos/updateEstado.php?id=" + id + "&estado=" + estado, getActulizarestadoPedido);
}
function setActualizarEstadoPedido2(datos) {
    let id = datos[0];
    let estado = datos[1];
    let factura = datos[2];
    let cantidad = datos[3];
    let fecha = datos[4];
    servidor("https://empaquessr.com/sistema/php/lista_pedidos/updateEstado.php?id=" + id + "&estado=" + estado + "&factura=" + factura + "&cantidad=" + cantidad + "&fecha=" + fecha, getActulizarestadoPedido);

}
function getActulizarestadoPedido(respuesta) {
    if (respuesta.responseText == 1) {
        alerta("Estado Actualizado");
        buscarDtospedidos();
        $('#facturaF').val("");
        $('#cantidadF').val("");
        hideDialogo('my-dialogAgregarFactura')
    }
    else alerta("Hubo un error al tratar de modificar el Estado...");
}

//validar datos de factura

function validarFacturaPedido(id, estado) {
    var factura = $('#facturaF').val();
    var cantidad = $('#cantidadF').val();
    var fecha = $('#fechaFactura').val();
    if (factura == "" || cantidad == "" || fecha == "") alerta("Espacios vacios!");
    else if (cantidad == 0) alerta("Escribe un numero mayor a 0");
    else setActualizarEstadoPedido2([id, estado, factura, cantidad, fecha]);

}



//ENLISTAR DATOS CLIENTES
function enlistarPedidosCliente(arrayJson) {
    let html1 = "";

    html1 += '<ons-card style="padding:0px;" class="botonPrograma" onclick="nextPageFunctionData(\'pedidosFiltroCliente.html\',setPedidosClienteFiltrado,\'' + arrayJson.codigo + '\')">'
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
    html1 += '        <span class="notification">' + arrayJson.contador + '</span>';
    html1 += '    </div>';
    html1 += '</ons-list-item>';
    html1 += '</ons-card>';

    return html1;
}
//ENLISTAR PEDIDOS
var estadoTemp = "";
function enlistarPedidos(arrayJson, i) {
    //alerta(""+arrayJson)
    let html1 = "";
    var color = "";
    var entregado = "";
    var estado = "";
    if (arrayJson.oc == "FALTANTE") {
        color = "#a01a1a";
        entregado = "Faltante";
    }
    else if (arrayJson.fechaSalida != "") {
        color = "rgb(8, 136, 205)";
        entregado = "Entregado: " + sumarDias(arrayJson.fechaSalida, 0);
    }
    else {
        entregado = 'Entrega: ' + sumarDias(arrayJson.fecha_oc, 20);
        color = "rgb(61, 121, 75)";
    }
    if (arrayJson.estado == 0) estado = '⚪';
    else if (arrayJson.estado == 1) estado = '🟠';
    else if (arrayJson.estado == 2) estado = '🟢';
    else if (arrayJson.estado == 3) estado = '🟩';
    else if (arrayJson.estado == 6) estado = '⚫';
    else if (arrayJson.estado == 4) estado = '🔵';
    else if (arrayJson.estado == 5) estado = '🟣';

    var color1 = arrayJson.observaciones == "" ? "gray" : "rgb(115, 168, 115)";

    html1 += '<ons-card  style="padding:0px;" class="botonPrograma" onclick="crearObjetMensajePedido(\'' + arrayJson.oc + '\',\'' + arrayJson.id + '\',\'' + arrayJson.codigo + '\',\'' + arrayJson.estado + '\',\'' + arrayJson.observaciones + '\',\'' + sumarDias(arrayJson.fecha_oc, 0) + '\')">'
    html1 += '<ons-list-header style="background-color: rgba(255, 255, 255, 0)">' + estado + '&emsp;';
    html1 += arrayJson.id;
    html1 += '    &emsp;';
    html1 += '    <b style="color: ' + color + ';">';
    html1 += entregado; //aqui ira una fecha 
    html1 += '    </b>';
    html1 += '</ons-list-header>';
    html1 += '<ons-list-item modifier="nodivider">';
    html1 += '    <div class="left">';
    html1 += '        <strong>' + arrayJson.codigo + '</strong>';
    html1 += '    </div>';
    html1 += '    <div class="center romperTexto">';
    html1 += '        <span class="list-item__title">' + arrayJson.producto + '&nbsp;|&nbsp;<b style="color:#404040">' + arrayJson.resistencia + ' ' + arrayJson.papel + '</b></span>';
    html1 += '        <span class="list-item__subtitle">';
    html1 += '<span>' + arrayJson.cliente + '</span><br> <b>O. C: ' + arrayJson.oc + '&emsp;Fecha: ' + sumarDias(arrayJson.fecha_oc, 0) + '</b>';
    html1 += enlistarFacturas(arrayJson);
    html1 += '        </span>';
    html1 += '    </div>';
    html1 += '    <div class="right">';
    html1 += '         <div class="centrar">';
    html1 += '               <b style="font-size:16px">' + separator(arrayJson.cantidad) + ' <span style="font-size:14px">pzas</span></b>';
    html1 += '         </div>';
    html1 += '            <div style="position: absolute;bottom:85%; right: 10px;" ><i style="color: ' + color1 + '" class="fa-solid fa-comment-dots fa-2x"></i></div>';
    html1 += '    </div>';
    html1 += '</ons-list-item>';
    html1 += '</ons-card>';
    //console.log(arrayJson);
    return html1;
}
function enlistarFacturas(registro) {
    var html = "";
    if (registro.estado != 4 && registro.estado != 5) return "";
    else {
        var facturas = (registro.facturas).split(",");
        var entregas = (registro.entregado).split(",");
        var fechas = (registro.fecha_factura).split(",");
        var suma = 0;

        html += "<span><table>";
        html += '<tr>';
        html += '    <th>Factura</th>';
        html += '    <th>Entregado</th>';
        html += '    <th>Fecha</th>';
        html += '</tr>';
        for (let j = 0; j < entregas.length; j++) {

            html += '<tr>';
            html += '    <td>' + facturas[j] + '</td>';
            html += '    <td>' + separator(entregas[j]) + ' pzas.</td>';
            html += '    <td>' + fechas[j] + '</td>';
            html += '</tr>';
            suma += parseInt(entregas[j]);
        }
        html += '<tr>';
        html += '    <td></td>';
        html += '    <td><b>Total: </b></td>';
        html += '    <td><b>' + separator(suma) + ' pzas.</b></td>';
        html += '</tr>';
        html += "</table></span>";
        //console.log(html);
        return html;
    }

}

function reiniciarFilter() {
    filtro = false;
}

function limpiarRegistrosPedidos() {
    $("#pedidoId").val('');
    $("#pedidoCodigo").val('');
    $("#pedidoProducto").val('');
    $("#pedidoCliente").val('');
    $("#pedidoCantidad").val('');
    $("#pedidoOc").val('');
    $("#pedidoOc").val('');
    $("#pedidoObservaciones").val('');
    $("#pedidoResistencia").val('');
    $("#pedidoPapel").val('');

    $("#insertos").empty();
    limpiarLocalStorage();
    $("#botonAgregarPedido").attr('disabled', true);
    //$("#pedidoFechaOc").val('');
}

function limpiarRegistrosPedidos2() {
    $("#pedidoId").val('');
    $("#pedidoProducto").val('');
    $("#pedidoCliente").val('');
    $("#botonAgregarPedido").attr('disabled', true);
}
function aplicarFiltro() {
    let activoFijo = document.querySelector('input[name=pedidoRadio]:checked').value;
    var ids = document.querySelectorAll("input[name='estado']:checked");
    var a = [];
    for (var i = 0; i < ids.length; i++) {
        a += ids[i].value + ",";
    }
    //console.log(activoFijo,a);
    anioGlobal = $('#currentYear').val();
    filtroGlobal = activoFijo;
    estadoGlobal = a;
    buscarDtospedidos();
    menu.close();
    //$('#splitter-page').hide();
}

function resetearFiltroPedidos() {
    //document.querySelector('input[name=pedidoRadio]:checked').value = ;
    $('input[name=pedidoRadio]').prop('checked', false);
    $('#Actuales').prop('checked', true);
    $('input[type=checkbox]').prop('checked', false);
    anioGlobal = fechaActual.getFullYear();
    $('#currentYear').val(anioGlobal);

    filtroGlobal = 1;
    estadoGlobal = "";
    buscarDtospedidos();

    menu.close();
}



function llenarAnio() {
    document.getElementById('currentYear').value = anioGlobal;
   
   
}
function sumarAnioFiltro()
{
    anioGlobal++;
    document.getElementById('currentYear').value = anioGlobal; //console.log(anioGlobal);
}
function restarAnioFiltro()
{
    anioGlobal--;
    document.getElementById('currentYear').value = anioGlobal; //console.log(anioGlobal);
}