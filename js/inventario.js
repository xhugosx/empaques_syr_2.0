var codigoCliente = "";
var insertoGlobal = "";
function mostrarTodoInventario() {

    setMostrarInventario();
    setMostrarInventarioPedidosLamina();
    setMostrarInventarioInserto();
    //aqui iran las otras dos funciones mostrar insertos y lamina
}

//BUSQUEDA INVENTARIO INSERTO
function setMostrarInventarioInsertoSearch(search, e) {
    tecla = (document.all) ? e.keyCode : e.which;
    if (tecla == 13 || e == 13) {
        $("#insertoInventarioLoading").empty();
        $("#insertoInventarioLoading").append("<ons-progress-bar indeterminate></ons-progress-bar>");
        servidor("https://empaquessr.com/sistema/php/cinthya/inventario/selectInsertoAll.php?search=" + search, getMostrarInventarioInserto);
    }
    else if (search == "") setMostrarInventarioInserto();
}

//MOSTRAR INVENTARIO DE INSERTOS GRUPO
function setMostrarInventarioInserto() {
    $("#insertoInventarioLoading").empty();
    $("#insertoInventarioLoading").append("<ons-progress-bar indeterminate></ons-progress-bar>");
    var busqueda = $('#searchInsertoInventario').val();
    if (busqueda == "" || busqueda == undefined) servidor("https://empaquessr.com/sistema/php/cinthya/inventario/selectInsertoAll.php", getMostrarInventarioInserto);
    else {
        //alerta("entro");
        setMostrarInventarioInsertoSearch(busqueda, 13);
    }

    //console.log(busqueda);
}
function getMostrarInventarioInserto(respuesta) {
    //console.log(respuesta.responseText);
    var resultado = respuesta.responseText;
    var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'
    listaInfinita('datosInsertoInventario', 'insertoInventarioLoading', arrayJson, enlistarInventarioInserto);

}

//MOSTRAR INVENTARIO DE INSERTOS INDIVIDUALES
function setMostrarInventarioPedidosInserto(array) {
    codigoCliente = array[0];
    insertoGlobal = array[1];
    servidor('https://empaquessr.com/sistema/php/cinthya/inventario/selectCodigoInserto.php?codigo=' + array[0] + '&inserto=' + array[1], getMostrarInventarioPedidosInserto);
}

function getMostrarInventarioPedidosInserto(respuesta) {
    var resultado = respuesta.responseText;
    var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'
    listaInfinita('datosInventarioPedidosInserto', 'InventarioPedidosInsertoLoading', arrayJson, enlistarInventarioCodigoInserto);
}

//BUSQUEDA DE INVENTARIO
function setMostrarInventarioSearch(search, e) {
    tecla = (document.all) ? e.keyCode : e.which;
    if (tecla == 13 || e == 13) {
        $("#cajaInventarioLoading").empty();
        $("#cajaInventarioLoading").append("<ons-progress-bar indeterminate></ons-progress-bar>");
        servidor("https://empaquessr.com/sistema/php/cinthya/inventario/select.php?search=" + search, getMostrarInventario);
    }
    else if (search == "") setMostrarInventario();
}

//MOSTRAR INVENTARIO DE CAJAS
function setMostrarInventario() {
    var busqueda = $('#searchCajaInventario').val();
    if (busqueda == "") servidor("https://empaquessr.com/sistema/php/cinthya/inventario/select.php", getMostrarInventario);
    else setMostrarInventarioSearch(busqueda, 13);
}
function getMostrarInventario(respuesta) {
    var resultado = respuesta.responseText;
    var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'
    listaInfinita('datosCajaInventario', 'cajaInventarioLoading', arrayJson, enlistarInventario);
}

//ACTUALIZAR INVENTARIO DE CAJAS
function setActualizarSalida(salida, cantidad, id) {
    var codigo = id.split("-");
    if (codigo[0].length >= 7)
        servidor("https://empaquessr.com/sistema/php/cinthya/inventario/updateSalida.php?cantidad=" + cantidad + "&id_lp=" + id + "&salida=" + salida, getActualizarSalida);
    else servidor("https://empaquessr.com/sistema/php/cinthya/inventario/updateSalidaInserto.php?cantidad=" + cantidad + "&id_lp=" + id + "&salida=" + salida, getActualizarSalida);
    //console.log("entro aqui",codigo,cantidad);
}
function getActualizarSalida(respuesta) {
    //alert(respuesta.responseText)
    if (respuesta.responseText == 1) {
        alerta("Salida Generada");
        resetearPilaFunction(mostrarTodoInventario);
    }
    else alerta("no se pudo actualizar");
    //console.log(respuesta.responseText);

}

//DAR SALIDA DE TOTAL DE CAJAS
function setSalidaTotal(codigo) {
    ons.notification.confirm({
        title: '',
        message: "Se dará salida a todo el inventario",
        buttonLabels: ['SI', 'NO'],
        callback: function (idx) {
            if (idx == 0) servidor("https://empaquessr.com/sistema/php/cinthya/inventario/updateSalidaTodo.php?codigo=" + codigo, getActualizarSalida);;
        }
    });

}

// DAR SALIDA TOTAL DE INSERTOS
function setSalidaTotalInserto(codigo, inserto) {
    ons.notification.confirm({
        title: '',
        message: "Se dará salida a todo el inventario",
        buttonLabels: ['SI', 'NO'],
        callback: function (idx) {
            if (idx == 0) servidor("https://empaquessr.com/sistema/php/cinthya/inventario/updateSalidaTodoInserto.php?codigo=" + codigo + "&inserto=" + inserto, getActualizarSalida);;
        }
    });

}
//MOSTRAR INVENTARIO DE PEDIDOS DE CAJAS ESPECIFICOS
function setMostrarInventarioPedidos(codigo) {
    codigoCliente = codigo;
    servidor('https://empaquessr.com/sistema/php/cinthya/inventario/selectCodigo.php?codigo=' + codigo, getMostrarInventarioPedidos);
}

function getMostrarInventarioPedidos(respuesta) {
    var resultado = respuesta.responseText;
    var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'

    listaInfinita('datosInventarioPedidos', 'InventarioPedidosLoading', arrayJson, enlistarInventarioCodigo);
}

//MOSTRAR PEDIDOS DE LAMINAS POR BUSQUEDA
function setMostrarInventarioPedidosLaminaSearch(search, e) {
    tecla = (document.all) ? e.keyCode : e.which;
    if (tecla == 13 || e == 13) {
        $("#laminaInventarioLoading").empty();
        $("#laminaInventarioLoading").append("<ons-progress-bar indeterminate></ons-progress-bar>");
        servidor('https://empaquessr.com/sistema/php/cinthya/inventario/selectLamina.php?search=' + search, getMostrarInventarioPedidosLamina);
    }
    else if (search == "") setMostrarInventarioPedidosLamina();
}

//MOSTRAR PEDIDOS DE LAMINAS TODO
function setMostrarInventarioPedidosLamina() {
    //codigoCliente = codigo;
    var busqueda = $('#searchLaminaInventario').val();
    if (busqueda == "" || busqueda == undefined) servidor('https://empaquessr.com/sistema/php/cinthya/inventario/selectLamina.php', getMostrarInventarioPedidosLamina);
    else setMostrarInventarioPedidosLaminaSearch(busqueda, 13);
    //console.log(busqueda);
}

function getMostrarInventarioPedidosLamina(respuesta) {
    var resultado = respuesta.responseText;
    var proveedores = resultado.split('*');
    var proveedor1 = proveedores[0].split('|');
    var proveedor2 = proveedores[1].split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'
    //localStorage.setItem("separador",false);
    listaInfinita('datosLaminaInventario1', 'laminaInventarioLoading', proveedor1, enlistarInventarioLamina);
    listaInfinita('datosLaminaInventario2', 'laminaInventarioLoading', proveedor2, enlistarInventarioLamina);
}

//ACTUALIZAR SALIDAS DE LAMINA
function setActualizarSalidaLamina(json) {
    servidor("https://empaquessr.com/sistema/php/cinthya/inventario/updateSalidaLamina.php?id_lp=" + json.codigo + "&cantidad=" + json.inventario + "&salida=" + json.salida, getActualizarSalidaLamina)
}
function getActualizarSalidaLamina(respuesta) {
    if (respuesta.responseText == 1) {
        alerta("Salida Generada");
        setMostrarInventarioPedidosLamina();
    }
    else alerta("Hubo un error al generar la salida");
    //alerta(responseText);
}

//ENLISTADOS DE GRUPO DE CAJAS
function enlistarInventario(arrayJson) {
    let html1 = "";
    //console.log(arrayJson);
    html1 += '<ons-card  style="padding:0px;" class="botonPrograma" onclick="nextPageFunctionData(\'InventarioPedidos.html\',setMostrarInventarioPedidos,\'' + arrayJson.codigo + '\')">';
    html1 += '<ons-list-item modifier="nodivider chevron">';
    html1 += '        <div class="left">';
    html1 += '<i class="fa-solid fa-box fa-2x"></i>';
    html1 += '        </div>';
    html1 += '        <div class="center">';
    html1 += '            <span class="list-item__title"><b>' + arrayJson.codigo + '</b>&nbsp;' + arrayJson.producto + '</span>';
    html1 += '            <span class="list-item__subtitle">' + arrayJson.cliente + '</span>';
    html1 += '        </div>';
    html1 += '        <div class="right">';
    html1 += '            <span class="notification" style="background: rgb(8, 136, 205);">' + separator(arrayJson.inventario) + ' <font size="2px">pza(s)</font> </span>';
    html1 += '        </div>';
    html1 += '</ons-list-item>';
    html1 += '</ons-card>';

    return html1;
}

//ENLISTADOS DE CAJAS
function enlistarInventarioCodigo(arrayJson) {
    let html = "";
    //console.log(arrayJson);
    var inventario = arrayJson.entrada - arrayJson.salida
    html += '<ons-card  style="padding:0px;" class="botonPrograma" onclick="alertPromptInventario(\'' + arrayJson.id_lp + '\',\'' + arrayJson.salida + '\',\'' + inventario + '\')">';
    html += '    <ons-list-header style="background: white">' + arrayJson.id_lp + '&ensp; &ensp;<b style="color:green">FECHA: ' + sumarDias(arrayJson.fecha,0) + '</b></ons-list-header>';
    html += '    <ons-list-item modifier="nodivider"> ';
    html += '        <div class="left">';
    html += '            <i class="fa-solid fa-box fa-2x"></i>';
    html += '        </div>';
    html += '        <div class="center">';
    html += '            <span class="list-item__title"><b>' + arrayJson.codigo + '</b>&nbsp;' + arrayJson.producto + '</span>';
    html += '            <span class="list-item__subtitle">' + arrayJson.cliente + '</span>';
    html += '        </div>';
    html += '        <div class="right">';
    html += '            <span class="notification" style="background: rgb(61, 174, 80);">' + separator(arrayJson.entrada) + ' </span>';
    html += '            <i class="fa-solid fa-minus"></i>';
    html += '            <span class="notification">' + separator(arrayJson.salida) + ' </span>';
    html += '            <i class="fa-solid fa-equals"></i>';
    html += '            <span class="notification" style="background: rgb(8, 136, 205);">  ' + separator(inventario) + ' <font size="2px">pza(s)</font> </span>';
    html += '        </div>';
    html += '    </ons-list-item>';
    html += '</ons-card>';
    return html;
}

//ENLISTADOS DE PEDIDOS DE LAMINAS
function enlistarInventarioLamina(arrayJson) {
    let html1 = '';
    var o_c = arrayJson.codigo;
    o_c = o_c.slice(0, -2);

    var span = "";
    var cajas = (arrayJson.caja).split("@");
    var productos = (arrayJson.producto).split("@");
    var clientes = (arrayJson.cliente).split("@");
    for (var i = 0; i < cajas.length - 1 && cajas[i] != ""; i++) span += '<span class="list-item__subtitle">' + cajas[i] + ' ' + productos[i] + ' - <b>' + clientes[i] + '</b></span>';

    //console.log(arrayJson);
    //console.log(arrayJson);
    html1 += '<ons-card  style="padding:0px;" class="botonPrograma" onclick="mensajeAlertaDato([\'codigo\',\'' + arrayJson.codigo + '\',\'inventario\',\'' + arrayJson.inventario + '\',\'salida\',\'' + arrayJson.salida + '\'])">'
    html1 += ' <ons-list-header style="background:white">' + o_c + '</ons-list-header>';
    html1 += '<ons-list-item modifier="nodivider">';
    html1 += '        <div class="left">';
    html1 += '<i class="fa-solid fa-stop fa-2x"></i>';
    html1 += '        </div>';
    html1 += '        <div class="center romperTexto">';
    html1 += '        <span class="list-item__title">' + esEntero(arrayJson.ancho) + ' X ' + esEntero(arrayJson.largo) + ' - <b>' + arrayJson.resistencia + '</b></span>';
    html1 += span;
    html1 += '        </div>';
    html1 += '        <div class="right">';
    html1 += '            <span class="notification" style="background: rgb(8, 136, 205);">' + separator(arrayJson.inventario) + ' <font size="2px">pza(s)</font></span>';
    //html1 += '            <div style="position: absolute;bottom:60px; right: 10px;" ><i style="color: '+color+';filter: drop-shadow(0 2px 5px rgba(0, 0, 0, 0.3))" class="fa-solid fa-comment-dots fa-2x"></i></div>';
    html1 += '        </div>';
    html1 += '</ons-list-item>';
    html1 += '</ons-card>';

    return html1;
}
//ENLISTAR GRUPOS DE INSERTOS
function enlistarInventarioInserto(arrayJson) {
    let html1 = "";
    //console.log(arrayJson);
    html1 += '<ons-card  style="padding:0px;" class="botonPrograma" onclick="nextPageFunctionData(\'inventarioPedidosInsertos.html\',setMostrarInventarioPedidosInserto,[\'' + arrayJson.codigo + '\',\'' + arrayJson.inserto + '\'])">';
    html1 += '<ons-list-item modifier="nodivider chevron">';
    html1 += '        <div class="left">';
    html1 += '<i class="fa-solid fa-box-open fa-2x"></i>';
    html1 += '        </div>';
    html1 += '        <div class="center">';
    html1 += '            <span class="list-item__title"><b>' + arrayJson.inserto + '</b> - ' + arrayJson.resistencia + '</span>';
    html1 += '            <span class="list-item__subtitle"><b>' + arrayJson.codigo + '</b> - ' + arrayJson.producto + '<br>' + arrayJson.cliente + '</span>';
    html1 += '        </div>';
    html1 += '        <div class="right">';
    html1 += '            <span class="notification" style="background: rgb(8, 136, 205);">' + separator(arrayJson.inventario) + ' <font size="2px">pza(s)</font> </span>';
    html1 += '        </div>';
    html1 += '</ons-list-item>';
    html1 += '</ons-card>';

    return html1;
}


//ENLISTADOS DE INSERTOS
function enlistarInventarioCodigoInserto(arrayJson) {
    let html = "";
    //console.log(arrayJson);
    var inventario = arrayJson.entrada - arrayJson.salida
    html += '<ons-card  style="padding:0px;" class="botonPrograma" onclick="alertPromptInventario(\'' + arrayJson.id_lp + '\',\'' + arrayJson.salida + '\',\'' + inventario + '\')">';
    html += '    <ons-list-header style="background: white">' + arrayJson.id_lp + '</ons-list-header>';
    html += '    <ons-list-item modifier="nodivider"> ';
    html += '        <div class="left">';
    html += '            <i class="fa-solid fa-box-open fa-2x"></i>';
    html += '        </div>';
    html += '        <div class="center">';
    html += '            <span class="list-item__title"><b>' + arrayJson.inserto + '</b> - ' + arrayJson.resistencia + '</span>';
    html += '            <span class="list-item__subtitle"><b>' + arrayJson.codigo + '</b>&nbsp;' + arrayJson.producto + '<br>' + arrayJson.cliente + '</span>';
    html += '        </div>';
    html += '        <div class="right">';
    html += '            <span class="notification" style="background: rgb(61, 174, 80);">' + separator(arrayJson.entrada) + ' </span>';
    html += '            <i class="fa-solid fa-minus"></i>';
    html += '            <span class="notification">' + separator(arrayJson.salida) + ' </span>';
    html += '            <i class="fa-solid fa-equals"></i>';
    html += '            <span class="notification" style="background: rgb(8, 136, 205);">  ' + separator(inventario) + ' <font size="2px">pza(s)</font> </span>';
    html += '        </div>';
    html += '    </ons-list-item>';
    html += '</ons-card>';
    return html;
}

//EXTRAS
function mensajeAlertaDato(array) {
    var json = conversionArrayJson(array);
    alertComfirmDato("Agrega salida menor o igual a: " + json.inventario + " pza(s)", "number", ["Cancelar", "Enviar"], validacionInventarioLP, json);
}
function validacionInventarioLP(input, json) {

    if (input == null || input <= 0) return 0;
    else {
        //alert(json.inventario);
        if (input <= parseInt(json.inventario)) {
            var salida = parseInt(input) + parseInt(json.salida == "" ? "0" : json.salida);
            json.inventario = salida.toString();
            alertComfirm('Se generá la siguiente salida:<br><br> <font size="8px">' + input + ' pza(s)</font>', ["Aceptar", "Cancelar"], function (idx, json) {
                if (idx == 0) setActualizarSalidaLamina(json);
            }, json)
        }
        else {
            alerta("No puedes generar salidas mayores al las del inventario!");
        }

    }
}

/*function validarConfirm(idx,json)
{
    if(idx == 0) setActualizarSalidaLamina(json);
}*/

