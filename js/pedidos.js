//variable global para ver si filtrar o no
var filtroGlobal = 1;
var estadoGlobal = "";
var fechaActual = new Date();
var anioGlobal = fechaActual.getFullYear();
var cliente = "";
function reiniciarCliente() { cliente = "" }

//VARIABLES GLOBALES PARA VERIFICAR SI ESTA ACTIVO EL PAGE DE LA FUNCION
var tabsCargadosP;

//CARGAR LA FUNCION DEL PAGE ACTUAL
document.addEventListener('init', function (event) {
    var page = event.target;
    if (page.id === 'pedidosMain') {
        menuPedidos();
        tabsCargadosP = {
            'pedidosClientes.html': false,
            'pedidos.html': false,
            'pedidosInsertos.html': false,
        };
        filtroGlobal = 1; //REINICIAR FILTRO GLOBAL
        estadoGlobal = ""; // REINICIAR ESTADO GLOBAL
        remover();
    }
    else if (page.id === 'pedidos') setBusquedaPendiente(); //EJECUTAR LA PRIMERA FUNCION PARA REELENAR LOS PEDIDOS DE LAMINA

    //PAGE QUE SE ENCUENTRA DENTRO DE PEDIDO DEL CLIENTE 
    else if (page.id == 'pedidosFiltroClienteTodo') {
        setPedidosClienteFiltradoTodo(cliente);
        setPedidosClienteFiltradoOC(cliente);
    }

});

// PARA EJECUTAR LAS FUCNIONES DE CADA SECCION Y NO TODOS LOS TAB
document.addEventListener('postchange', function (event) {
    const pageName = event.tabItem.getAttribute('page');
    // Solo ejecuta la función si es la primera vez que se activa este tab
    switch (pageName) {

        case 'pedidosClientes.html':
            if (!tabsCargadosP['pedidosClientes.html']) {
                setPedidosCliente();
                tabsCargadosP['pedidosClientes.html'] = true;
            }
            break;
        case 'pedidosInsertos.html':
            if (!tabsCargadosP['pedidosInsertos.html']) {
                setPedidosInsertos();
                tabsCargadosP['pedidosInsertos.html'] = true;
            }
            break;
    }
});


function buscarDtospedidos() {

    //ESTO PARA QUE EJECUTE SOLO LAS FUNCIONES DE LOS PAGE ACTIVOS 
    if (cliente == "") {
        //FUERA DE 
        setBusquedaPendiente();
        setPedidosCliente();
        setPedidosInsertos();
    }
    else {
        //DENTRO DE 
        setPedidosClienteFiltradoTodo(cliente);
        setPedidosClienteFiltradoOC(cliente);
    }

}


function solicitarInfoPedido(codigo, e) {
    tecla = (document.all) ? e.keyCode : e.which;

    if (codigo.length >= 7 || tecla == 13) {
        //funcion para solicitarInventario
        setBuscarInventario(codigo);
        //funcion para solicitar el ultimo registrado
        setBuscarProductoCliente(codigo);

    }
    else {
        limpiarRegistrosPedidos2();
        $("#insertosPedidos").css("visibility", "hidden");
    }

}

//BUSQUEDA POR CLIENTE VISTA 1
function setPedidosCliente() {
    $("#datosPedidosClientesLoading").empty().append("<ons-progress-bar indeterminate></ons-progress-bar>");
    oCarga("Cargando Datos...");
    var busqueda = $('#searchPedidoCliente').val();

    let url = myLink + "/php/lista_pedidos/selectCliente.php?search=" + busqueda + "&filtro=" + filtroGlobal + "&estado=" + estadoGlobal + "&anio=" + anioGlobal;
    servidor(url, function (respuesta) {
        var resultado = respuesta.responseText;//respuesta del servidor
        var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'

        $('#clientesPedidos').attr("badge", arrayJson.length - 1);
        listaInfinita('datosPedidosClientes', 'datosPedidosClientesLoading', arrayJson, enlistarPedidosCliente);
        cCarga();
    });
}

//BUSQUEDA POR TODOS VISTA 2
function setBusquedaPendiente() {
    $("#datosPedidosLoading").empty().append("<ons-progress-bar indeterminate></ons-progress-bar>");
    oCarga("Cargando Datos...");
    var busqueda = $('#searchPedido').val();

    let url = myLink + "/php/lista_pedidos/selectAll.php?search=" + busqueda + "&filtro=" + filtroGlobal + "&estado=" + estadoGlobal + "&anio=" + anioGlobal;
    servidor(url, function (respuesta) {
        var resultado = respuesta.responseText;//respuesta del servidor
        var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'

        $('#todoPedidos').attr("badge", arrayJson.length - 1);
        listaInfinita('datosPedidos', 'datosPedidosLoading', arrayJson, enlistarPedidos);
        cCarga();

    });


}

//PEDIDOS FILTRADO POR CLIENTE 

//TODO
function setPedidosClienteFiltradoTodo(codigo) {
    oCarga("Cargando Datos...");
    $("#datosPedidosClientesLoadingFiltroLoading").empty().append("<ons-progress-bar indeterminate></ons-progress-bar>");
    cliente = codigo;
    var busqueda = $('#searchPedidosClientesFiltrados').val();
    let url = myLink + "/php/lista_pedidos/selectAll.php?search=" + busqueda + "&cliente=" + agregarCeros(codigo) + "&filtro=" + filtroGlobal + "&estado=" + estadoGlobal + "&anio=" + anioGlobal;

    servidor(url, function (respuesta) {
        var resultado = respuesta.responseText;//respuesta del servidor
        var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'

        listaInfinita('datosPedidosClienteFiltrado', 'datosPedidosClientesLoadingFiltroLoading', arrayJson, enlistarPedidos);
        cCarga();
    });

}
// POR ORDEN DE COMPRA
function setPedidosClienteFiltradoOC(codigo) {
    oCarga("Cargando Datos...");
    $("#datosPedidosClientesLoadingFiltroLoading").empty().append("<ons-progress-bar indeterminate></ons-progress-bar>");
    cliente = codigo;
    let url = myLink + "/php/lista_pedidos/selectOC.php?&codigo=" + agregarCeros(codigo) + "&filtro=" + filtroGlobal + "&estado=" + estadoGlobal + "&anio=" + anioGlobal;
    servidor(url, function (respuesta) {
        var resultado = respuesta.responseText;//respuesta del servidor
        var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'

        listaInfinita('datosPedidosClienteFiltradoOC', 'datosPedidosClientesLoadingFiltroLoadingOC', arrayJson, enlistarpedidosOC);
        cCarga();
    });
}


//funcion para buscar por orden de compra especifico
function setBuscarPedidosOc(fecha, orden, j) {

    $(".ocBoton" + j).toggleClass("ocBotonSinColor");

    let url = myLink + "/php/lista_pedidos/selectAll.php?cliente=" + agregarCeros(cliente) + "&estado=" + estadoGlobal + "&anio=" + anioGlobal + "&oc=" + orden + "&fecha_oc=" + fecha;
    //console.log(url);
    servidor(url, function (respuesta) {
        var resultado = respuesta.responseText;//respuesta del servidor
        var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'

        var html = "";
        //se llenara atraves de un for ya que no seran muchos datos
        for (var i = 0; i < arrayJson.length - 1; i++) {
            var json = JSON.parse(arrayJson[i]);
            html += enlistarPedidos(json);
        }
        $("#contenidoPedidos" + j).html(html);

    });
}

//funcion paran agregar pedidos
function setAgregarPedido() {
    const campos = [
        "pedidoId", "pedidoCodigo", "pedidoCantidad", "pedidoOc",
        "pedidoFechaOc", "pedidoFechaEntrega", "pedidoObservaciones",
        "pedidoResistencia", "pedidoPapel"
    ];

    const datos = {};
    campos.forEach(campo => {
        datos[campo] = $(`#${campo}`).val().toUpperCase();
    });

    const {
        pedidoId: id,
        pedidoCodigo: codigo,
        pedidoCantidad: cantidad,
        pedidoOc: oc,
        pedidoFechaOc: fecha_oc,
        pedidoFechaEntrega: fecha_entrega,
        pedidoObservaciones: observaciones,
        pedidoResistencia: resistencia,
        pedidoPapel: papel
    } = datos;

    if (!vacio(id, codigo, cantidad, oc, fecha_oc, resistencia, papel)) {
        alerta('Espacios vacíos en producto! <br>(No escribir "CEROS")');
        //console.log(id, codigo, cantidad, oc, fecha_oc, resistencia, papel);
        return;
    }

    const insertaInsertos = () => {
        const totalInsertos = parseInt(localStorage.getItem('insertos') || 0);

        if (totalInsertos > 0) {
            let ids = [], insertos = [], resistencias = [], cantidades = [], notas = [];
            for (let i = 1; i <= totalInsertos; i++) {
                const id = $(`#id${i}`).val();
                const inserto = $(`#inserto${i}`).val();
                const res = $(`#resistencia${i}`).val();
                const cant = $(`#cantidad${i}`).val();
                const nota = $(`#notas${i}`).val().toUpperCase();

                if (!inserto || !res || !cant) {
                    alerta("Espacios vacíos en insertos");
                    $("#botonAgregarPedido").prop("disabled", false);
                    return;
                }
                ids.push(id);
                insertos.push(inserto);
                resistencias.push(res);
                cantidades.push(cant);
                notas.push(nota);
            }
            setAgregarPedidoInserto(codigo, resistencias, cantidades, insertos, fecha_oc, notas, id, ids);
        }
    }


    $("#botonAgregarPedido").prop("disabled", true);
    oCarga("Insertando Productos...");
    const url = `${myLink}/php/lista_pedidos/add.php?id=${id}&codigo=${codigo}&cantidad=${cantidad}&resistencia=${resistencia}&papel=${papel}&oc=${oc}&fecha_oc=${fecha_oc}&observaciones=${observaciones}&fecha_entrega=${fecha_entrega}`;
    servidor(url,
        function (respuesta) {
            if (respuesta.responseText == "1")
                alertaConfirmSiNo("Registro Insertado, Deseas insertar otro?", limpiarRegistrosPedidos, resetearPilaFunction, setBusquedaPendiente);
            else
                alerta('hubo un error al insertar!' + respuesta.responseText);

            $("#botonAgregarPedido").prop("disabled", false);
            insertaInsertos(); // insertar despues de insertar el pedido de caja
            cCarga();
        }

    );

}

function setBuscarProductoCliente(codigo) {

    $("#pedidoProducto").val("Buscando...");
    $("#pedidoCliente").val("Buscando...");
    $("#botonAgregarPedido").attr('disabled', true);
    $("#insertosPedidos").css("visibility", "hidden");
    oCarga("Buscando Producto...");
    //console.log(myLink + "/php/lista_pedidos/selectProductoCliente.php?search=" + codigo);
    servidor(myLink + "/php/lista_pedidos/selectProductoCliente.php?search=" + codigo,
        function (respuesta) {
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
                $("#insertosPedidos").css("visibility", "visible");
                //console.log(arrayJson);

            }
            $("#pedidoClienteProgress").empty();
            $("#pedidoProductoProgress").empty();
            cCarga();
        }
    );

}

// FUNCION PARA BUSCAR EL INVENTARIO SI EXISTE DEL PEDIDO A AGREGAR
function setBuscarInventario(codigo) {
    servidor(myLink + '/php/inventario/select.php?search=' + codigo,
        function (respuesta) {
            if (respuesta.responseText != "") {
                var resultado = respuesta.responseText;//respuesta del servidor
                var arrayJson = resultado.split('|');
                arrayJson = JSON.parse(arrayJson[0]);
                alerta('En existencia: <strong>' + separator(arrayJson.inventario) + '</strong> Pzas');
                //alerta(resultado);
            }
        }
    )
}


//eliminar pedido
function setEliminarPedido(id) {
    oCarga("Eliminando Pedido...");
    servidor(myLink + "/php/lista_pedidos/delete.php?id=" + id,
        function (respuesta) {
            cCarga();
            if (respuesta.responseText == 1) {
                alerta("Pedido Eliminado");
                buscarDtospedidos();
            }
            else alerta("Hubo un error al tratar de eliminar el Pedido...");

        }
    );
}

//buscar modificar pedido
function setModificarBuscarPedido(id) {
    oCarga("Buscando Producto...");
    servidor(myLink + "/php/lista_pedidos/selectAll.php?search=" + id + "&filtro=" + filtroGlobal,
        function (respuesta) {
            var resultado = respuesta.responseText;//respuesta del servidor
            var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'
            //console.log(myLink + "/php/lista_pedidos/selectAll.php?search=" + id);
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

            $('#botonModificarPedido').prop('disabled', false); // ACTIVAR EL BOTON DE EDITAR CUANDO SE TERMINE CARGAR LA INF
            cCarga();
        });

}


//modificar pedido
function setModificarPedido() {
    var id = $("#pedidoModificarId").val();
    var resistencia = $("#pedidoModificarResistencia").val();
    var papel = $("#pedidoModificarPapel").val();
    var cantidad = $("#pedidoModificarCantidad").val();
    var oc = $("#pedidoModificarOc").val().toUpperCase();
    var fecha = $("#pedidoModificarFechaOc").val();
    var fecha_entrega = $("#pedidoModificarFechaEntrega").val();
    var observaciones = $("#pedidoModificarObservaciones").val().toUpperCase();

    if (vacio(resistencia, cantidad, oc, fecha)) {
        $('#botonModificarPedido').prop('disabled', true);
        oCarga("Editando Producto...");
        servidor(myLink + "/php/lista_pedidos/update.php?resistencia=" + resistencia + "&papel=" + papel + "&cantidad=" + cantidad + "&oc=" + oc + "&fecha_oc=" + fecha + "&fecha_entrega=" + fecha_entrega + "&id=" + id + "&observaciones=" + observaciones,
            function (respuesta) {
                if (respuesta.responseText == 1) {
                    alerta("Pedido Actualizado");
                    resetearPilaFunction(buscarDtospedidos);
                }
                else alerta("Hubo un error al tratar de modificar el Pedido...");
                $('#botonModificarPedido').prop('disabled', false);
                cCarga();
            }
        );
    }
    else alerta('Espacios Vacios! <br>(No escribir "CEROS")')

}


//ESTA FUNCION ES PARA ACTUALIZAR EL ESTADO DEL PEDIDOA CUALQUIERA QUE NO SEA FACTURA NI ENTREGADO PARCIAL
function setActualizarEstadoPedido(datos) {
    let id = datos[0];
    let estado = datos[1];
    oCarga("Actualizando estado...");
    servidor(myLink + "/php/lista_pedidos/updateEstado.php?id=" + id + "&estado=" + estado,
        function (respuesta) {
            if (respuesta.responseText == 1) {
                alerta("Estado Actualizado");
                setBusquedaPendiente();
            }
            else alerta("Hubo un error al tratar de modificar el Estado...");
            cCarga();
        }
    );
}

//validar datos de factura
function validarFacturaPedido(id, estado) {
    var factura = $('#facturaF').val().toUpperCase();
    var cantidad = $('#cantidadF').val();
    var fecha = $('#fechaFactura').val();
    if (vacio(factura, cantidad, fecha)) {
        hideDialogo('my-dialogAgregarFactura');
        oCarga("Agregando Factura...");
        servidor(myLink + "/php/lista_pedidos/updateEstado.php?id=" + id + "&estado=" + estado + "&factura=" + factura + "&cantidad=" + cantidad + "&fecha=" + fecha,
            function (respuesta) {
                if (respuesta.responseText == 1) {
                    cCarga();
                    alerta("Estado Actualizado");
                    setBusquedaPendiente();
                    $('#facturaF').val("");
                    $('#cantidadF').val("");

                }
                else alerta("Hubo un error al tratar de modificar el Estado...");
            }
        );
    }
    //setActualizarEstadoPedido2([id, estado, factura, cantidad, fecha]);
    else alerta("Espacios vacios o quitar ceros!");
}

//ENLISTAR PEDIDO POR ORDEN DE COMPRA
function enlistarpedidosOC(arrayJson, i) {
    let html = `
        <ons-card style="padding:0px;" class="botonPrograma ocBoton${i}">
            <ons-list-item modifier="nodivider" expandable onclick="setBuscarPedidosOc('${arrayJson.agrupado_por_fecha}','${arrayJson.orden_compra}',${i})">
                <div class="left">
                    <i class="fas fa-lg fa-folder-open"></i>
                </div>
                
                <div class="center" style="display: flex; justify-content: space-between;">
                    <span class="list-item__title" style="font-size:17px">
                        <b>O.C.:</b> ${arrayJson.orden_compra}
                    </span>  
                    <span class="list-item__subtitle">
                        <b>${sumarDias(arrayJson.agrupado_por_fecha, 0)}</b> 
                    </span>
                    
                </div>
                <div class="right">
                    <span class="notification">
                        ${arrayJson.contador}
                    </span>
                    <i class="fa-solid fa-chevron-down" style="color:#c7c7cc;"></i>
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
    return `
    <ons-card style="padding:0px;" class="botonPrograma" onclick="nextPageFunction('pedidosFiltroCliente.html', function(){ cliente = '${arrayJson.codigo}' })">
        <ons-list-item modifier="chevron nodivider">
            <div class="left">
                <strong>${agregarCeros(arrayJson.codigo)}</strong>
            </div>
            <div class="center">
                ${arrayJson.cliente}
            </div>
            <div class="right">
                <span class="notification">${arrayJson.contador}</span>
            </div>
        </ons-list-item>
    </ons-card>
    `;
}

//ENLISTAR PEDIDOS
var estadoTemp = "";
function enlistarPedidos(arrayJson, i) {
    let color = "";
    let entregado = "";

    if (arrayJson.oc == "FALTANTE") {
        color = "#a01a1a";
        entregado = "Faltante";
    } else if (arrayJson.fechaSalida != "") {
        color = "rgb(8, 136, 205)";
        entregado = `Entregado: ${sumarDias(arrayJson.fechaSalida, 0)}`;
    } else {
        color = "rgb(61, 121, 75)";
        entregado = `Entrega: ${sumarDias(arrayJson.fecha_entrega, 0)}`;
    }

    const color1 = arrayJson.observaciones == "" ? "gray" : "rgb(115, 168, 115)";
    const inventario = arrayJson.estado != 2
        ? ""
        : `<hr><span style="color:#48AC33;font-size:15px">
            ${separator(arrayJson.inventario)} pza(s) hechas - ${sumarDias(arrayJson.fecha_entrada, 0)}
           </span>`;

    let perfil = validarPerfil();
    let accion;
    if (perfil == "produccion") accion = `crearObjetMensajePedido1('${arrayJson.codigo}')`;
    else accion = `
            crearObjetMensajePedido(
                    '${arrayJson.oc}',
                    '${arrayJson.id}',
                    '${arrayJson.codigo}',
                    '${arrayJson.estado}',
                    '${arrayJson.observaciones}',
                    '${sumarDias(arrayJson.fecha_oc, 0)}',
                    '${arrayJson.producto}',
                    '${arrayJson.cliente}',
                    '${sumarDias(arrayJson.fecha_entrega, 0)}'
                 )
        `;

    const html = `
    <ons-card style="padding:0px;" class="botonPrograma"
        onclick="event.stopPropagation(); ${accion}">

        <ons-list-header style="background-color: rgba(255, 255, 255, 0)">
            ${estadosColor(arrayJson.estado)}&emsp;${arrayJson.id}&emsp;
            <b style="color:${color};">${entregado}</b>
        </ons-list-header>

        <ons-list-item modifier="nodivider">
            <div class="left">
                <strong>${arrayJson.codigo}</strong>
            </div>

            <div class="center">
                <span class="list-item__title">
                    ${arrayJson.producto}&nbsp;|&nbsp;
                    <b style="color:#404040">${arrayJson.resistencia} ${arrayJson.papel}</b>
                </span>

                <span class="list-item__subtitle">
                    <span>${arrayJson.cliente}</span><br>
                    <b>O. C: ${arrayJson.oc}&emsp;Fecha: ${sumarDias(arrayJson.fecha_oc, 0)}</b>
                    ${enlistarFacturas(arrayJson)}
                    ${inventario}
                    ${arrayJson.observaciones == ""
            ? ""
            : `<hr><span><b><i style="color: rgb(115, 168, 115)" 
                           class="fa-solid fa-comment-dots fa-2x"></i>&nbsp;&nbsp;</b>${arrayJson.observaciones}</span>`}
                </span>
            </div>

            <div class="right">
                <div class="centrar">
                    <b style="font-size:16px; white-space: nowrap;">
                        ${separator(arrayJson.cantidad)} <span style="font-size:14px">pzas</span>
                    </b>
                </div>
                <div style="position: absolute; bottom:85%; right: 10px;">
                    <i style="color:${color1}" class="fa-solid fa-comment-dots fa-2x"></i>
                </div>
            </div>
        </ons-list-item>
    </ons-card>
    `;

    return html;
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

//APLICAR FILTRO
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
    setPedidosInsertos();

    menu.close();
    //$('#splitter-page').hide();
}

//RESETEAR EL FILTRO DEL MENU 
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
    setPedidosInsertos();
    menu.close();
}

//FUNCIONES PARA EL MENU EXTRAS
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

function estadosColor(estado) {
    const colores = {
        0: '⚪',
        1: '🟠',
        2: '🟢',
        3: '🟩',
        4: '🔵',
        5: '🟣',
        6: '⚫'
    };
    return colores[estado];
}

function crearObjetMensajePedido1(codigo) {
    mensajeArriba("OPCIONES",
        ['<i class="fas fa-drafting-compass"></i>&nbsp;Ver Plano',
            {
                label: '<i class="fas fa-times" style="color:red"></i>&nbsp;Cancelar',
                modifier: 'destructive'
            }
        ],
        function (index) {
            if (index == 0) {
                var timestamp = new Date().getTime();
                let codigos = codigo.split("/");
                let codigo1 = codigos[0];
                let codigo2 = codigos[1];
                var url = myLink + '/planos/' + codigo1 + '/' + codigo1 + '-' + codigo2 + '.pdf?timestamp=' + timestamp;
                if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i)) {
                    //console.log("Estás usando un dispositivo móvil!!");
                    nextPageFunctionData('verPlano.html', verPlano, url);
                } else {
                    window.open(url, '_blank');
                }
            }
        });

}