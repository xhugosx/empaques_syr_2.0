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

}
function solicitarInfoPedido(codigo, e) {
    tecla = (document.all) ? e.keyCode : e.which;
    if (codigo.length >= 7 || tecla == 13) {
        //funcion para solicitarInventario
        //alerta(codigo)
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
    let url = myLink + "/php/lista_pedidos/selectCliente.php?filtro=" + filtroGlobal + "&estado=" + estadoGlobal + "&anio=" + anioGlobal;
    servidor(url, function (respuesta) {
        var resultado = respuesta.responseText;//respuesta del servidor
        var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'

        $('#clientesPedidos').attr("badge", arrayJson.length - 1);

        listaInfinita('datosPedidosClientes', 'datosPedidosClientesLoading', arrayJson, enlistarPedidosCliente);
    });

}

//BUSQUEDA POR TODOS VISTA 2
function setBusquedaPendiente() {

    var busqueda = $('#searchPedido').val();
    if (busqueda == "" || busqueda == undefined) {
        let url = myLink + "/php/lista_pedidos/selectAll.php?filtro=" + filtroGlobal + "&estado=" + estadoGlobal + "&anio=" + anioGlobal;
        servidor(url, function (respuesta) {
            var resultado = respuesta.responseText;//respuesta del servidor
            var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'

            $('#todoPedidos').attr("badge", arrayJson.length - 1);

            listaInfinita('datosPedidos', 'datosPedidosLoading', arrayJson, enlistarPedidos);
        });
    }
    else setSearchPedidos(busqueda, 13);

}

//PEDIDOS FILTRADO POR CLIENTE 
// (PRINCIPAL)
function setPedidosClienteFiltrado(codigo) {
    setPedidosClienteFiltradoTodo(codigo);
    setPedidosClienteFiltradoOC(codigo);
}
//TODO
function setPedidosClienteFiltradoTodo(codigo) {
    //var type = filtro ? 1 : 2;
    cliente = codigo;
    var busqueda = $('#searchPedidosClientesFiltrados').val();
    if (busqueda == "" || busqueda == undefined) {

        let url = myLink + "/php/lista_pedidos/selectAll.php?cliente=" + agregarCeros(codigo) + "&filtro=" + filtroGlobal + "&estado=" + estadoGlobal + "&anio=" + anioGlobal;

        //console.log(url);

        servidor(url, function (respuesta) {
            var resultado = respuesta.responseText;//respuesta del servidor
            var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'

            listaInfinita('datosPedidosClienteFiltrado', 'datosPedidosClientesLoadingFiltroLoading', arrayJson, enlistarPedidos);
        });
    }
    else setsearchPedidosClienteFiltrado(busqueda, 13, cliente);
}
// POR ORDEN DE COMPRA
function setPedidosClienteFiltradoOC(codigo) {
    //var type = filtro ? 1 : 2;
    cliente = codigo;
    //var busqueda = $('#searchPedidosClientesFiltradosOC').val();
    //if (busqueda == "" || busqueda == undefined) {

    let url = myLink + "/php/lista_pedidos/selectOC.php?codigo=" + agregarCeros(codigo) + "&filtro=" + filtroGlobal + "&estado=" + estadoGlobal + "&anio=" + anioGlobal;

    //console.log(url);

    servidor(url, function (respuesta) {
        var resultado = respuesta.responseText;//respuesta del servidor
        var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'

        listaInfinita('datosPedidosClienteFiltradoOC', 'datosPedidosClientesLoadingFiltroLoadingOC', arrayJson, enlistarpedidosOC);
    });

    //}
    //else setsearchPedidosClienteFiltrado(busqueda, 13, cliente);
}


//funcion para buscar por orden de compra especifico
function setBuscarPedidosOc(fecha,orden, j) {

    $(".ocBoton"+j).toggleClass("ocBotonSinColor");

    let url = myLink + "/php/lista_pedidos/selectAll.php?cliente=" + agregarCeros(cliente) + "&estado=" + estadoGlobal + "&anio=" + anioGlobal + "&oc=" + orden +"&fecha_oc="+fecha;
    //console.log(url);
    servidor(url, function (respuesta) {
        var resultado = respuesta.responseText;//respuesta del servidor
        var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'

        var html = "";
        //se llenara atraves de un for ya que no seran muchos datos
        for(var i=0; i<arrayJson.length-1;i++)
        {
            var json = JSON.parse(arrayJson[i]);
            html+=enlistarPedidos(json);
        }
        $("#contenidoPedidos"+j).html(html);
        
    });
}

//funcion para barra de busqueda pedidos
function setSearchPedidos(search, e) {

    tecla = (document.all) ? e.keyCode : e.which;
    if (tecla == 13 || e == 13) {
        $("#datosPedidosLoading").empty();
        $("#datosPedidosLoading").append("<ons-progress-bar indeterminate></ons-progress-bar>");
        //var type = filtro ? 1 : 2;
        let url = myLink + "/php/lista_pedidos/selectAll.php?search=" + search + "&filtro=" + filtroGlobal + "&estado=" + estadoGlobal + "&anio=" + anioGlobal;
        servidor(url, function (respuesta) {
            var resultado = respuesta.responseText;//respuesta del servidor
            var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'


            listaInfinita('datosPedidos', 'datosPedidosLoading', arrayJson, enlistarPedidos);
        });

    }
    else if (search == "") setBusquedaPendiente();
}


// function para barra de busqueda pedidos por cliente

function setSearchPedidosCliente(search, e) {
    tecla = (document.all) ? e.keyCode : e.which;
    if (tecla == 13) {
        $("#datosPedidosClientesLoading").empty();
        $("#datosPedidosClientesLoading").append("<ons-progress-bar indeterminate></ons-progress-bar>");
        let url = myLink + "/php/lista_pedidos/selectCliente.php?search=" + search + "&filtro=" + filtroGlobal + "&estado=" + estadoGlobal + "&anio=" + anioGlobal;
        servidor(url, function (respuesta) {
            var resultado = respuesta.responseText;//respuesta del servidor
            var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'
            listaInfinita('datosPedidosClientes', 'datosPedidosClientesLoading', arrayJson, enlistarPedidosCliente);
        });
    }
    else if (search == "") setPedidosCliente();
}



// funcion para buscar con cliente filtrado 
//PEDIDOS FILTRADO POR CLIENTE
function setsearchPedidosClienteFiltrado(search, e, codigo) {
    tecla = (document.all) ? e.keyCode : e.which;
    if (tecla == 13 || e == 13) {
        $("#datosPedidosClientesLoadingFiltroLoading").empty();
        $("#datosPedidosClientesLoadingFiltroLoading").append("<ons-progress-bar indeterminate></ons-progress-bar>");
        cliente = codigo;
        servidor(myLink + "/php/lista_pedidos/selectAll.php?cliente=" + agregarCeros(codigo) + "&search=" + search + "&filtro=" + filtroGlobal + "&estado=" + estadoGlobal + "&anio=" + anioGlobal, getSearchPedidosClienteFiltrado);
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
    var fecha_entrega = $("#pedidoFechaEntrega").val();
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
                servidor(myLink + '/php/lista_pedidos/add.php?id=' + id + '&codigo=' + codigo + '&cantidad=' + cantidad + '&resistencia=' + resistencia + '&papel=' + papel + '&oc=' + oc + '&fecha_oc=' + fecha_oc + '&observaciones=' + observaciones + '&fecha_entrega=' + fecha_entrega, getAgregarPedido);
            }
            else alerta("Espacios vacios en insertos")
        }
        else servidor(myLink + '/php/lista_pedidos/add.php?id=' + id + '&codigo=' + codigo + '&cantidad=' + cantidad + '&resistencia=' + resistencia + '&papel=' + papel + '&oc=' + oc + '&fecha_oc=' + fecha_oc + '&observaciones=' + observaciones + '&fecha_entrega=' + fecha_entrega, getAgregarPedido);
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

    servidor(myLink + "/php/lista_pedidos/selectProductoCliente.php?search=" + codigo, getBuscarProductoCliente);

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
    servidor(myLink + '/php/inventario/select.php?search=' + codigo, getBuscarInventario)
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
    servidor(myLink + "/php/lista_pedidos/delete.php?id=" + id, getEliminarpedido);
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
    //console.log(myLink+"/php/lista_pedidos/selectAll.php?type="+type+"&search="+id);
    servidor(myLink + "/php/lista_pedidos/selectAllEditar.php?id=" + id, getModificarBuscarPedido);

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
    $("#pedidoModificarFechaEntrega").val(arrayJson[0].fecha_entrega);
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
    var fecha_entrega = $("#pedidoModificarFechaEntrega").val();
    var observaciones = $("#pedidoModificarObservaciones").val();

    if (datoVacio(resistencia) && datoVacio(cantidad) && datoVacio(oc) && datoVacio(fecha)) {
        servidor(myLink + "/php/lista_pedidos/update.php?resistencia=" + resistencia + "&papel=" + papel + "&cantidad=" + cantidad + "&oc=" + oc + "&fecha_oc=" + fecha + "&fecha_entrega=" + fecha_entrega + "&id=" + id + "&observaciones=" + observaciones, getModificarPedido)
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
    servidor(myLink + "/php/lista_pedidos/updateEstado.php?id=" + id + "&estado=" + estado, getActulizarestadoPedido);
}
function setActualizarEstadoPedido2(datos) {
    let id = datos[0];
    let estado = datos[1];
    let factura = datos[2];
    let cantidad = datos[3];
    let fecha = datos[4];
    servidor(myLink + "/php/lista_pedidos/updateEstado.php?id=" + id + "&estado=" + estado + "&factura=" + factura + "&cantidad=" + cantidad + "&fecha=" + fecha, getActulizarestadoPedido);

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

//ENLISTAR PEDIDO POR ORDEN DE COMPRA
function enlistarpedidosOC(arrayJson, i) {
    let html = `
        <ons-card style="padding:0px;" class="botonPrograma ocBoton${i}">
            <ons-list-header style="background:rgba(0,0,0,0); margin:0">
                <b>${sumarDias(arrayJson.agrupado_por_fecha, 0)}</b>  
            </ons-list-header>
            <ons-list-item modifier="nodivider" expandable onclick="setBuscarPedidosOc('${arrayJson.agrupado_por_fecha}','${arrayJson.orden_compra}',${i})">
                <div class="left">
                    <i class="fas fa-lg fa-folder-open"></i>
                </div>
                
                <div class="center" style="display: flex; justify-content: space-between;">  
                    <span style="font-size:17px">
                       <b>O.C.:</b> ${arrayJson.orden_compra}
                    </span>
                    <span class="notification">
                        ${arrayJson.contador} pedido(s) 
                    </span>
                </div>
                <div class="expandable-content expandProductos" id="contenidoPedidos${i}">
                    <center>
                        <ons-progress-circular indeterminate></ons-progress-circular>
                    </center>
                </div>

                
            </ons-list-item>
        </ons-card>
    `;
    return html;
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
        entregado = 'Entrega: ' + sumarDias(arrayJson.fecha_entrega, 0);
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
    var inventario = arrayJson.estado != 2 ? '' : '<hr><span style="color:#48AC33;font-size:15px">' + separator(arrayJson.inventario) + ' pza(s) hechas</span>';

    html1 += '<ons-card  style="padding:0px;" class="botonPrograma" onclick="event.stopPropagation(); crearObjetMensajePedido(\'' + arrayJson.oc + '\',\'' + arrayJson.id + '\',\'' + arrayJson.codigo + '\',\'' + arrayJson.estado + '\',\'' + arrayJson.observaciones + '\',\'' + sumarDias(arrayJson.fecha_oc, 0) + '\')">'
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
    html1 += inventario;
    html1 += arrayJson.observaciones == "" ? "" : '<br><span><b><i style="color: rgb(115, 168, 115)" class="fa-solid fa-comment-dots fa-2x"></i>&nbsp;&nbsp;</b>' + arrayJson.observaciones + '</span>';
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

        html += '<hr style="margin:0"><span><table>';
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
    //console.log(activoFijo);
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
function sumarAnioFiltro() {
    anioGlobal++;
    document.getElementById('currentYear').value = anioGlobal; //console.log(anioGlobal);
}
function restarAnioFiltro() {
    anioGlobal--;
    document.getElementById('currentYear').value = anioGlobal; //console.log(anioGlobal);
}
function menuPedidos() {
    var html = `<ons-list>
                    <center>
                        <h4 style="color: #808fa2; font-weight: bold;">
                            Filtros
                        </h4>
                    </center>
                    <ons-list>
                        <ons-list-item>
                            <label class="left">
                                <h4 style="color: #808fa2;">

                                    Año
                                </h4>
                            </label>
                            <label class="center">
                                <div class="year-input">

                                    <button id="prevYear" onclick="restarAnioFiltro()">&lt;</button>
                                    <input type="text" id="currentYear" readonly>
                                    <button id="nextYear" onclick="sumarAnioFiltro()">&gt;</button>
                                </div>
                            </label>
                        </ons-list-item>
                        <ons-list-item tappable>
                            <label class="left">
                                <ons-radio name="pedidoRadio" input-id="Actuales" checked value="1"></ons-radio>
                            </label>
                            <label for="Actuales" class="center">
                                Actuales
                            </label>
                        </ons-list-item>
                        <ons-list-item tappable>
                            <label class="left">
                                <ons-radio name="pedidoRadio" input-id="Faltantes" value="2"></ons-radio>
                            </label>
                            <label for="Faltantes" class="center">
                                Faltantes
                            </label>
                        </ons-list-item>
                    </ons-list>
                    <ons-list>
                        <ons-list-item tappable>
                            <label class="left">
                                <ons-checkbox input-id="check-1" value="0" name="estado"></ons-checkbox>
                            </label>
                            <label for="check-1" class="center">
                                ⚪ Pendiente
                            </label>
                        </ons-list-item>
                        <ons-list-item tappable>
                            <label class="left">
                                <ons-checkbox input-id="check-2" value="1" name="estado"></ons-checkbox>
                            </label>
                            <label for="check-2" class="center">
                                🟠 Proceso
                            </label>
                        </ons-list-item>
                        <ons-list-item tappable>
                            <label class="left">
                                <ons-checkbox input-id="check-3" value="2" name="estado"></ons-checkbox>
                            </label>
                            <label for="check-3" class="center">
                                🟢 Terminado
                            </label>
                        </ons-list-item>
                        <ons-list-item tappable>
                            <label class="left">
                                <ons-checkbox input-id="check-4" value="3" name="estado"></ons-checkbox>
                            </label>
                            <label for="check-4" class="center">
                                🟩 Terminado sin procesos
                            </label>
                        </ons-list-item>
                        <ons-list-item tappable>
                            <label class="left">
                                <ons-checkbox input-id="check-5" value="4" name="estado"></ons-checkbox>
                            </label>
                            <label for="check-5" class="center">
                                🔵 Entregado
                            </label>
                        </ons-list-item>
                        <ons-list-item tappable>
                            <label class="left">
                                <ons-checkbox input-id="check-6" value="5" name="estado"></ons-checkbox>
                            </label>
                            <label for="check-6" class="center">
                                🟣 E. Parcial
                            </label>
                        </ons-list-item>
                        <ons-list-item tappable>
                            <label class="left">
                                <ons-checkbox input-id="check-7" value="6" name="estado"></ons-checkbox>
                            </label>
                            <label for="check-7" class="center">
                                ⚫ Cancelado
                            </label>
                        </ons-list-item>
                    </ons-list>
                    <ons-list-item modifier="nodivider">
                        <ons-button id="botonPrograma" onclick="aplicarFiltro()" modifier="large">
                            Aplicar
                        </ons-button>
                    </ons-list-item>
                    <br><br><ons-list-item modifier="nodivider">
                        <ons-button id="botonPrograma" class="btnResetear" modifier="large"
                            onclick="resetearFiltroPedidos();">
                            <ons-icon icon="fa-trash"></ons-icon>
                            Resetear
                        </ons-button>
                    </ons-list-item>


                </ons-list>
            `;
    $("#contenidoMenu").html(html);

}