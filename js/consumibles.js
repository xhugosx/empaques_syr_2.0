//funcion para refrescar todo
function refresConsumible() {
    setConsumible0();
    setConsumible();
}

//mostrar consumible search
function setMostrarConsumibleSearch(search, e) {
    tecla = (document.all) ? e.keyCode : e.which;
    if (tecla == 13 || e == 13) {
        $("#consumibleLoading").empty();
        $("#consumibleLoading").append("<ons-progress-bar indeterminate></ons-progress-bar>");
        servidor('https://empaquessr.com/sistema/php/cinthya/consumibles/select.php?search=' + search, getConsumibles);
    }
    else if (search == "") {
        $("#consumibleLoading").empty();
        $("#consumibleLoading").append("<ons-progress-bar indeterminate></ons-progress-bar>");
        setConsumible();
    }

}
//fin de mostrar consumible search
//funcion para hacer busquedad search con 0
//mostrar consumible search
function setMostrarConsumible0Search(search, e) {
    tecla = (document.all) ? e.keyCode : e.which;
    if (tecla == 13 || e == 13) {
        $("#consumible0Loading").empty();
        $("#consumible0Loading").append("<ons-progress-bar indeterminate></ons-progress-bar>");
        servidor('https://empaquessr.com/sistema/php/cinthya/consumibles/selectSinExistencia.php?search=' + search, getConsumible0);
    }
    else if (search == "") {
        $("#consumible0Loading").empty();
        $("#consumible0Loading").append("<ons-progress-bar indeterminate></ons-progress-bar>");
        setConsumible0();
    }

}

//funcion para buscar ambos consultas de consumibles
function setConsumible0() {
    var busqueda = $('#searchConsumible0').val();
    if (busqueda == "" || busqueda == undefined) servidor('https://empaquessr.com/sistema/php/cinthya/consumibles/selectSinExistencia.php', getConsumible0);
    else setMostrarConsumible0Search(busqueda, 13);
}
function getConsumible0(respuesta) {
    var resultado = respuesta.responseText;//respuesta del servidor
    var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'
    $('#sinExistencia').attr("badge", arrayJson.length - 1);
    listaInfinita('datosConsumible0', 'consumible0Loading', arrayJson, enlistarConsumible);


}

//mostrar inventario consumibles
function setConsumible() {
    var busqueda = $('#searchConsumible').val();
    if (busqueda == "" || busqueda == undefined) servidor('https://empaquessr.com/sistema/php/cinthya/consumibles/select.php', getConsumibles);
    else setMostrarConsumibleSearch(busqueda, 13);
}
function getConsumibles(respuesta) {
    var resultado = respuesta.responseText;//respuesta del servidor
    var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'
    $('#existencia').attr("badge", arrayJson.length - 1);
    listaInfinita('datosConsumible', 'consumibleLoading', arrayJson, enlistarConsumible);

}
//fin de mostrar inventario consumibles

//agregar consumible
function setAgregarConsumible() {
    let descripcion = ($('#descripcion').val()).toUpperCase();
    let cantidad = $('#cantidad').val();
    if (datoVacio(descripcion) && datoVacio(cantidad)) {
        servidor('https://empaquessr.com/sistema/php/cinthya/consumibles/add.php?&descripcion=' + descripcion + '&cantidad=' + cantidad, getAgregarConsumible);
    }
    else alerta("Espacios vacios!");


}
function getAgregarConsumible(respuesta) {
    if (respuesta.responseText == "1") {
        alerta("Consumible agregado");
        resetearPilaFunction(refresConsumible);
    }
    else alerta("No se pudo Agregar");
}
//fin de agregar consumible

//eliminar consumible
function setEliminarConsumible(id) {
    servidor('https://empaquessr.com/sistema/php/cinthya/consumibles/delete.php?id=' + id, getEliminarConsumible)
}
function getEliminarConsumible(respuesta) {
    if (respuesta.responseText == "1") {
        alerta("Consumible Eliminado");
        refresConsumible();
    }
    else alerta("No se pudo Eliminar");
}
//fin de eliminar consumible

//actualizar consumible

function setActualizarConsumible(id) {
    let cantidad = $('#salidaConsumible').val();
    if (cantidad >= 0) servidor('https://empaquessr.com/sistema/php/cinthya/consumibles/update.php?id=' + id + '&cantidad=' + cantidad, getActualizarConsumible);
    else alerta("No puede ser menor a 0");
}
function getActualizarConsumible(respuesta) {
    if (respuesta.responseText == "1") {
        alertToast("Piezas Actualizadas!", 2000)
        refresConsumible();
        hideDialogo('my-dialogConsumible');
    }
    else alerta("No se pudo Actualizar");
}
//fin de actualizar de consumible

//actualizar consumible descripcion

function setActualizarConsumibleDes(id) {
    let descripcion = $('#salidaConsumibleDes').val().toUpperCase();
    if (vacio(descripcion)) servidor('https://empaquessr.com/sistema/php/cinthya/consumibles/updateDes.php?id=' + id + '&descripcion=' + descripcion, getActualizarConsumibleDes);
    else alerta("No puede estar vacio");
}
function getActualizarConsumibleDes(respuesta) {
    if (respuesta.responseText == "1") {
        alertToast("Descripcion Actualizada!", 2000)
        refresConsumible();
        hideDialogo('my-dialogConsumibleDes');
    }
    else alerta("No se pudo Actualizar");
}
//fin de actualizar de consumible descripcion

function enlistarConsumible(json) {
    let html1 = "";
    html1 += '<ons-card style="padding:0px;" class="botonPrograma" onclick="alertaConsumible(\'' + conversionJsonArray(json) + '\')">';
    html1 += '<ons-list-item class="" modifier="nodivider">';
    html1 += '  <div class="left">';
    html1 += '      <i class="fa-solid fa-toolbox fa-2x"></i>';
    html1 += '  </div>';
    html1 += '  <div class="center">';
    html1 += '    <span class="list-item__title"><b>' + json.descripcion + '</b></span>';
    html1 += '    <span class="list-item__subtitle"><b>' + sumarDias(json.fecha, 0) + ' </b></span>';
    html1 += '  </div>"';
    html1 += '  <div class="right"><span class="notification">' + json.cantidad + ' pza(s)</span></div>';
    html1 += '</ons-list-item>';
    html1 += '</ons-card>';
    return html1
}
var idConsumible = "";
function alertaConsumible(array) {
    array = array.split(",");
    var json = conversionArrayJson(array);
    mensajeArriba("Opciones", ["Modificar Descripcion", "<b>Piezas disponibles</b>", { label: 'Eliminar', modifier: 'destructive' }], mensajeAccion, json);
}
function mensajeAccion(index, json) {
    if (index == 0) {
        showDialogo("my-dialogConsumibleDes", "dialogConsumibleDes.html");
        setTimeout(() => {
            $('#salidaConsumibleDes').val(json.descripcion);
            idConsumible = json.id;
        }, 1);
    }
    else if (index == 1) {
        showDialogo("my-dialogConsumible", "dialogConsumibleSalida.html");
        setTimeout(() => {
            $('#salidaConsumible').val(json.cantidad);
            idConsumible = json.id;
        }, 1);

    }
    else if (index == 2) alertComfirm("Estas seguro de eliminar este consumible?", ["Aceptar", "Cancelar"], alertaEliminar, json)
}

function alertaEliminar(index, json) {
    if (index == 0) setEliminarConsumible(json.id);
}
function incrementar() {
    let cantidad = $('#salidaConsumible').val();
    $('#salidaConsumible').val(parseInt(cantidad) + 1);
}

function decrementar() {
    let cantidad = $('#salidaConsumible').val();
    if (cantidad > 0) $('#salidaConsumible').val(parseInt(cantidad) - 1);
}