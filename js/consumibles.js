document.addEventListener('init', function (event) {
    var page = event.target;
    if (page.id === 'consumible') remover();
});
//funcion para refrescar todo
function refresConsumible() {
    setConsumible0();
    setConsumible();
}

//funcion para buscar ambos consultas de consumibles
function setConsumible0() {
    oCarga("Cargando Datos...");
    var busqueda = $('#searchConsumible0').val();
    servidor(myLink + '/php/consumibles/selectSinExistencia.php?search=' + busqueda, function (respuesta) {
        var resultado = respuesta.responseText;//respuesta del servidor
        var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'
        $('#sinExistencia').attr("badge", arrayJson.length - 1);
        listaInfinita('datosConsumible0', 'consumible0Loading', arrayJson, enlistarConsumible);
        cCarga();
    });
}

//mostrar inventario consumibles

function setConsumible() {
    oCarga("Cargando Datos...");
    var busqueda = $('#searchConsumible').val();
    servidor(myLink + '/php/consumibles/select.php?search=' + busqueda, function (respuesta) {
        var resultado = respuesta.responseText;//respuesta del servidor
        var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'
        $('#existencia').attr("badge", arrayJson.length - 1);
        listaInfinita('datosConsumible', 'consumibleLoading', arrayJson, enlistarConsumible);
        cCarga();
    });
}
//fin de mostrar inventario consumibles

//agregar consumible
function setAgregarConsumible() {

    let descripcion = ($('#descripcion').val()).toUpperCase();
    let cantidad = $('#cantidad').val();
    if (datoVacio(descripcion) && datoVacio(cantidad)) {
        oCarga("Agregando Consumible...");
        servidor(myLink + '/php/consumibles/add.php?&descripcion=' + descripcion + '&cantidad=' + cantidad,
            function (respuesta) {
                if (respuesta.responseText == "1") {
                    alerta("Consumible agregado");
                    resetearPilaFunction(refresConsumible);
                }
                else alerta("No se pudo Agregar");
                cCarga();
            }
        );
    }
    else alerta("Espacios vacios!");
}
//fin de agregar consumible

//eliminar consumible
function setEliminarConsumible(id) {
    servidor(myLink + '/php/consumibles/delete.php?id=' + id, function (respuesta) {
        if (respuesta.responseText == "1") {
            alerta("Consumible Eliminado");
            refresConsumible();
        }
        else alerta("No se pudo Eliminar");
    });
}
//fin de eliminar consumible

//actualizar consumible

function setActualizarConsumible(id) {
    let cantidad = $('#salidaConsumible').val();
    if (cantidad >= 0) servidor(myLink + '/php/consumibles/update.php?id=' + id + '&cantidad=' + cantidad, getActualizarConsumible);
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
    if (vacio(descripcion)) servidor(myLink + '/php/consumibles/updateDes.php?id=' + id + '&descripcion=' + descripcion, getActualizarConsumibleDes);
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
    let perfil = validarPerfil();
    let accion;
    if (perfil != "produccion") accion = `onclick="alertaConsumible('${conversionJsonArray(json)}')"`;
    return `
    <ons-card style="padding:0px;" class="botonPrograma" ${accion}>
        <ons-list-item class="" modifier="nodivider">
            <div class="left">
                <i class="fa-solid fa-toolbox fa-2x"></i>
            </div>
            <div class="center">
                <span class="list-item__title"><b>${json.descripcion}</b></span>
                <span class="list-item__subtitle"><b>${sumarDias(json.fecha, 0)}</b></span>
            </div>
            <div class="right">
                <span class="notification">${json.cantidad} pza(s)</span>
            </div>
        </ons-list-item>
    </ons-card>
    `;
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
    else if (index == 2) alertComfirm("Estas seguro de eliminar este consumible?", ["Cancelar", "Aceptar"],
        function (i) {
            if (i == 1) setEliminarConsumible(json.id);
        });
}


function incrementar() {
    let cantidad = $('#salidaConsumible').val();
    $('#salidaConsumible').val(parseInt(cantidad) + 1);
}

function decrementar() {
    let cantidad = $('#salidaConsumible').val();
    if (cantidad > 0) $('#salidaConsumible').val(parseInt(cantidad) - 1);
}