var filtroLaminaP = false;

document.addEventListener('init', function (event) {
    var page = event.target;

    if (page.id === 'pedidosLamina') {
        //sesto para reiniciar el filtro a false
        filtroLaminaP = false;
    }
});

function asignarFiltroLamina(valor) {
    filtroLaminaP = valor.checked;
    mostrarTodoPedidosLamina()

}
function mostrarTodoPedidosLamina() {
    $('#loadingPedidosLamina').append("<ons-progress-bar indeterminate></ons-progress-bar>");
    $('#loadingPedidosLaminaPACK').append("<ons-progress-bar indeterminate></ons-progress-bar>");

    //console.log($('#searchPCM').val());
    if ($('#searchPCM').val() === "" || $('#searchPCM').val() === undefined) setMostrarPedidosLamina();
    else setMostrarBusquedaLamina($('#searchPCM').val(), 13);
    if ($('#searchPACK').val() === "" || $('#searchPACK').val() === undefined) setMostrarPedidosLaminaPACK();
    else setMostrarBusquedaLaminaPack($('#searchPACK').val(), 13);

    setBuscarAnio();
}
function setMostrarBusquedaLamina(search, e) {
    tecla = (document.all) ? e.keyCode : e.which;
    var tipo = filtroLaminaP ? 2 : 1;
    if (tecla == 13 || e == 13) {
        servidor('https://empaquessr.com/sistema/cinthya/php/lista_pedidos_lamina/select.php?proveedor=1&search=' + search + '&type=' + tipo, getMostrarPedidosLamina);
    }
    else if (search == "") setMostrarPedidosLamina();
}
function setMostrarBusquedaLaminaPack(search, e) {
    tecla = (document.all) ? e.keyCode : e.which;
    var tipo = filtroLaminaP ? 2 : 1;
    if (tecla == 13 || e == 13) {
        servidor('https://empaquessr.com/sistema/cinthya/php/lista_pedidos_lamina/select.php?proveedor=2&search=' + search + '&type=' + tipo, getMostrarPedidosLaminaPACK);
    }
    else if (search == "") setMostrarPedidosLaminaPACK();
}
function setMostrarPedidosLaminaFecha(fecha, tipo) {
    tipo = tipo ? 1 : 2;
    $('#loadingPedidosLaminaFecha').empty("");
    $('#loadingPedidosLaminaFecha').append("<ons-progress-bar indeterminate></ons-progress-bar>");
    servidor("https://empaquessr.com/sistema/cinthya/php/lista_pedidos_lamina/selectDate.php?fecha=" + fecha + "&type=" + tipo, getMostrarPedidosLaminaFecha)
}
function getMostrarPedidosLaminaFecha(respuesta) {
    var resultado = respuesta.responseText;//respuesta del servidor
    var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'

    var cantidadTotal = arrayJson[arrayJson.length - 1];
    $('#cantidadLaminas').text(new Intl.NumberFormat().format(cantidadTotal) + " Lám.");

    listaInfinita('datospedidosLaminaFecha', 'loadingPedidosLaminaFecha', arrayJson, enlistarPedidosLamina);
}
function setMostrarPedidosLamina() {
    var tipo = filtroLaminaP ? 2 : 1;
    servidor("https://empaquessr.com/sistema/cinthya/php/lista_pedidos_lamina/select.php?proveedor=1&type=" + tipo, getMostrarPedidosLamina)
}
function getMostrarPedidosLamina(respuesta) {
    var resultado = respuesta.responseText;//respuesta del servidor
    var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'
    listaInfinita('datospedidosLamina', 'loadingPedidosLamina', arrayJson, enlistarPedidosLamina);
}
function setMostrarPedidosLaminaPACK() {
    var tipo = filtroLaminaP ? 2 : 1;
    servidor("https://empaquessr.com/sistema/cinthya/php/lista_pedidos_lamina/select.php?proveedor=2&type=" + tipo, getMostrarPedidosLaminaPACK)
}
function getMostrarPedidosLaminaPACK(respuesta) {
    var resultado = respuesta.responseText;//respuesta del servidor
    var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'
    listaInfinita('datospedidosLaminaPACK', 'loadingPedidosLaminaPACK', arrayJson, enlistarPedidosLamina);
}
function setAgregarPedidoLamina() {
    var form = $('#formPedidoLamina')[0];
    var formData = new FormData(form);

    //console.log(form.children[0]);
    var o_c = $('#O_CLP').val();
    var proveedor = $('#proveedorPL').val();
    var ancho = $('#anchoPL').val();
    var largo = $('#largoPL').val();
    var p_o = $('#pzas_ordenadasPL').val();
    var resistencia = $('#resistenciaPL').val();
    var papel = $('#papelPL').val();
    //if($('#checkCaja')[0].checked) var caja = $('#cajaLP').val(); //check para tomar el valor de caja
    var fecha = $('#fechaLP').val();
    var fecha_entrega = $('#fechaLPE').val();
    //var observaciones = $('#observacionesPL').val();

    if (datoVacio(o_c) && datoVacio(ancho) && datoVacio(largo) && datoVacio(p_o) && datoVacio(resistencia) && datoVacio(fecha) && datoVacio(proveedor) && datoVacio(papel) && datoVacio(fecha_entrega))
        servidorPost("https://empaquessr.com/sistema/cinthya/php/lista_pedidos_lamina/add.php", getAgregarPedidoLamina, formData);
    else alerta("Existen datos vacios");

}
function getAgregarPedidoLamina(respuesta) {
    if (respuesta.responseText == 1) {
        alerta("Lamina agregada");
        resetearPilaFunction(mostrarTodoPedidosLamina);
    }
    else alerta("Inserta otra Orden de Compra");
    //console.log(respuesta.responseText);
}
function setActualizarEstadoPL(estado, o_c, cantidad, entrada) {
    //alert('https://empaquessr.com/sistema/cinthya/php/lista_pedidos_lamina/updateEntrada.php?id_lp='+o_c+'&cantidad='+cantidad+'&entrada='+entrada+'&estado='+estado);
    servidor('https://empaquessr.com/sistema/cinthya/php/lista_pedidos_lamina/updateEntrada.php?id_lp=' + o_c + '&cantidad=' + cantidad + '&entrada=' + entrada + '&estado=' + estado, getActualizarEstadoPL)
}
function getActualizarEstadoPL(respuesta) {
    var resultado = respuesta.responseText;
    if (resultado == 11 || resultado == 1) {
        alertToast("Estado Actualizado", 500)
        mostrarTodoPedidosLamina();
    }

    else alerta("no se pudo actualizar" + resultado);
}

function setBuscarActualizarPL(search) {
    var tipo = filtroLaminaP ? 2 : 1;
    servidor('https://empaquessr.com/sistema/cinthya/php/lista_pedidos_lamina/select.php?search=' + search + "&type=" + tipo, getBuscarActualizarPL);
}
function getBuscarActualizarPL(respuesta) {
    //console.log(respuesta.responseText);

    var resultado = respuesta.responseText;//respuesta del servidor
    var arrayJson = resultado.split('|');
    arrayJson = JSON.parse(arrayJson[0]);
    //variable para acceder desde otra funcion
    localStorage.setItem('o_c', arrayJson.o_c);

    $('#o_c').val(arrayJson.o_c.slice(0, -2));
    $('#proveedor').val(arrayJson.proveedor);
    $('#ancho').val(arrayJson.ancho);
    $('#largo').val(arrayJson.largo);
    $('#pzas_ordenadas').val(arrayJson.pzas_ordenadas);
    $('#resistencia').val(arrayJson.resistencia);
    $('#papel').val(arrayJson.papel);
    $('#fecha').val(arrayJson.fecha);
    $('#fecha_entrega').val(arrayJson.fecha_entrega);
    $('#observaciones').val(arrayJson.observaciones);
    if (arrayJson.caja != "") {
        $('#checkCaja')[0].checked = true;
        asignarInputCaja($('#checkCaja')[0]);
        $('#cajaLP').val(arrayJson.caja);
    }

}
function setActualizarPL() {
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
    var papel = $('#papel').val();
    var fecha = $('#fecha').val();
    var fecha_entrega = $('#fecha_entrega').val();

    if (datoVacio(o_c) && datoVacio(ancho) && datoVacio(largo) && datoVacio(p_o) && datoVacio(resistencia) && datoVacio(fecha) && datoVacio(proveedor) && datoVacio(papel) && datoVacio(fecha_entrega))
        servidorPost("https://empaquessr.com/sistema/cinthya/php/lista_pedidos_lamina/update.php?&o_c=" + o_cTemp, getActualizarPL, formData);
    else alerta("Existen datos vacios");

}
function getActualizarPL(respueta) {
    //console.log(respueta.responseText);
    var resultado = respueta.responseText;
    if (resultado == 1) {
        // en caso de que si se actualice se limpia la memoria
        localStorage.removeItem('o_c');
        alerta("Pedido Actulizado");
        resetearPilaFunction(mostrarTodoPedidosLamina);
    }
    else alerta("No se pudo actualizar debido a un error");



}
function setEliminarPL(o_c) {
    servidor('https://empaquessr.com/sistema/cinthya/php/lista_pedidos_lamina/delete.php?o_c=' + o_c, getEliminarPL);
}
function getEliminarPL(respuesta) {
    var resultado = respuesta.responseText;
    if (resultado == 1) {
        alerta("Pedido Eliminado");
        mostrarTodoPedidosLamina();
    }
    else alerta("No se pudo Eliminar debido a un error");

}

function asignarInputCaja(value) {
    const llenarInputCaja = $('#llenarInputCaja');

    if (value.checked) {
        // alerta("entro");
        const html = `
            <ons-card class="contenedorInputSub agrandar">
                <ons-list-item modifier="nodivider">
                    <div class="left">
                        <i class="fa-solid fa-box"></i>
                    </div>
                    <div class="center">
                        <ons-input name="caja" id="cajaLP" class="input-100" type="text" placeholder="Codigo Caja (separa por comas)" onkeyup="javascript:this.value=this.value.toUpperCase();"></ons-input>
                    </div>
                </ons-list-item>
            </ons-card>
        `;

        llenarInputCaja.html(html);
    } else {
        llenarInputCaja.empty();
        cajaGlobal = "";
    }
}



function enlistarPedidosLamina(arrayJson) {
    var span = "";
    if (arrayJson.producto != "") {
        var cajas = (arrayJson.caja).split(",");
        var productos = (arrayJson.producto).split(",");
        var clientes = (arrayJson.cliente).split(",");
        for (var i = 0; i < cajas.length; i++) {
            span += '<span class="list-item__subtitle">' + cajas[i] + ' ' + productos[i] + ' - <b>' + clientes[i] + '</b></span>';
        }
    }

    const o_c = arrayJson.o_c.slice(0, -2);

    const html1 = `
  <ons-card style="padding:0px;" class="botonPrograma" onclick="crearMensajePL('${arrayJson.estado}','${arrayJson.entrada}','${arrayJson.pzas_ordenadas}','${arrayJson.o_c}','${arrayJson.observaciones}')">
    <ons-list-header style="background:${colorEstado(arrayJson.estado)}; color:white;">
      ${arrayJson.entrada !== '' ? `<div class="contenedorHead" style="color:${colorEstado(arrayJson.estado)};">llego: ${separator(arrayJson.entrada)} pzas ${arrayJson.estado == 2 ? ` - faltan: ${separator(arrayJson.pzas_ordenadas - arrayJson.entrada)} pzas` : ""} </div>` : `<div class="contenedorHeadFecha" style="color:white;">Estimado: ${sumarDias(arrayJson.fecha_entrega, 0)}</div>`}
      
      ${estadoLamina(arrayJson.estado)} |
      ${sumarDias(arrayJson.fecha, 0)}
    </ons-list-header>
    <ons-list-item modifier="nodivider">
      <div class="left">
        <strong>${o_c}</strong>
      </div>
      <div class="center romperTexto">
        <span class="list-item__title">${esEntero(arrayJson.ancho)} X ${esEntero(arrayJson.largo)} | <b>${arrayJson.resistencia} ${arrayJson.papel}</b></span>
        ${arrayJson.producto !== "" ? span : ""}
        ${arrayJson.observaciones !== "" ? " <strong> Observaciones: </strong>&nbsp;" + arrayJson.observaciones : ""}
      </div>
      <div class="right">
        <div class="centrar">
          <span class="notification"><font size="2px">${separator(arrayJson.pzas_ordenadas)} pza(s)</font></span>
        </div>
      </div>
      <div>hola</div>
      </ons-list-item>
      </ons-card>
      
`;

    return html1;

}
function estadoLamina(d) {
    const estadoMap = {
        1: "BACKORDER",
        2: "PARCIAL",
        3: "COMPLETO",
        4: "CANCELADA",
        5: "PROGRAMADO"
    };

    return estadoMap[d] || "Desconocido";
}
//te quedaste en el color 
function colorEstado(d) {
    const colorMap = {
        1: "#E8C07C",
        2: "#CE84DA",
        3: "#00A514",
        4: "#000000",
        5: "#E1D000"
    };

    return colorMap[d] || "#FFFFFF"; // Color por defecto si el valor no está mapeado
}

function esEntero(numero) {
    //
    numero = parseFloat(numero);
    return Number.isInteger(numero) ? numero + ".0" : numero;
}