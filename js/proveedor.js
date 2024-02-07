
var tipoFilter = 0;
//FUNCION PARA HACER UNA BUSQUEDA POR NOMBRE O CODIGO
function setProveedorBarraBusqueda(busqueda, e) {
    //asignar el progress bar 
    if (busqueda == "") setProveedor();
    tecla = (document.all) ? e.keyCode : e.which;
    if (tecla == 13) {
        $("#insertoInventarioLoading").empty();
        $("#insertoInventarioLoading").append("<ons-progress-bar indeterminate></ons-progress-bar>");
        servidor('https://empaquessr.com/sistema/php/proveedores/select.php?search=' + busqueda + '&type=' + tipoFilter, getProveedor);
    }

}

function setProveedor() {
    $('#loadingProveedor').empty();
    $('#loadingProveedor').append("<ons-progress-bar indeterminate></ons-progress-bar>");
    servidor('https://empaquessr.com/sistema/php/proveedores/select.php?type=' + tipoFilter, getProveedor);
}
function getProveedor(respuesta) {
    var resultado = respuesta.responseText;//respuesta del servidor
    var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'

    listaInfinita('datosProveedor', 'loadingProveedor', arrayJson, enlistarProveedor);
    //console.log(resultado);
}

function setAgregarProveedor() {
    var nombre = $('#nombreproveedor').val();
    var tipo = $('#selectTipo').val();
    //console.log(vacio(nombre,tipo));
    if (vacio(nombre, tipo)) {
        servidor("https://empaquessr.com/sistema/php/proveedores/add.php?nombre=" + nombre + "&tipo=" + tipo, getAgregarProveedor);
    }
    else alerta("Espacios vacios");
}
function getAgregarProveedor(respuesta) {
    if (respuesta.responseText == "1") {
        alerta("Proveedor Agregado");
        resetearPilaFunction(setProveedor);
    }
    else alerta("No se pudo insertar");
}
function setEliminarProveedor(codigo) {
    servidor('https://empaquessr.com/sistema/php/proveedores/delete.php?codigo=' + codigo, getEliminarProveedor);
}
function getEliminarProveedor(respuesta) {
    //alert(respuesta.responseText);
    if (respuesta.responseText == "1") {
        alerta("Registro eliminado");
        setProveedor();
    }
    else alerta("No se pudo eliminar");
    //console.log(respuesta.responseText);
}
function setBuscarEditarProveedor(id) {
    servidor('https://empaquessr.com/sistema/php/proveedores/select.php?search=' + id + '&type=0', getBuscarEditarProveedor);
}
function getBuscarEditarProveedor(respuesta) {
    var resultado = respuesta.responseText;
    var tempJson = resultado.split('|');
    tempJson = JSON.parse(tempJson[0]);
    //alert(resultado);
    $('#id').val(tempJson.codigo);
    $('#nombre').val(tempJson.nombre);
    $('#selectTipo').val(tempJson.tipo);
}

//funcion para editar el proovedor
function setEditarProveedor() {
    var id = $('#id').val();
    var nombre = $('#nombre').val();
    var tipo = $('#selectTipo').val();
    if (vacio(id, nombre, tipo)) servidor("https://empaquessr.com/sistema/php/proveedores/update.php?id=" + id + "&nombre=" + nombre + "&tipo=" + tipo, getEditarProveedor);
    else alerta("Espacios vacios!");

    //servidor("https://empaquessr.com/sistema/php/proveedores/update.php?id="+id+"&nombre="+nombre+"&tipo="+tipo,);

}
function getEditarProveedor(respuesta) {
    var resultado = respuesta.responseText;
    if (resultado == "1") {
        alerta("Proveedor Actualizado");
        resetearPilaFunction(setProveedor);
    }
    else alerta("No se pudo Actualizar");
}


//funciones para mostrar mensaje
function mensajeProveedor(codigo) { mensajeArriba('Opciones', ['Editar', { label: 'Eliminar', modifier: 'destructive' }], accionMensajeProveedor, codigo); }
function accionMensajeProveedor(index, codigo) { if (index == 0) nextPageFunctionData('modificarProveedor.html', setBuscarEditarProveedor, codigo); else if (index == 1) mensajeConfirmProveedor(codigo); }

//mensajes para confirmar eliminar
function mensajeConfirmProveedor(codigo) { alertComfirm("Estas seguro de borrar este proveedor? (" + codigo + ")", ["Aceptar", "Cancelar"], accionConfirmProveedor, codigo) }
function accionConfirmProveedor(index, codigo) { if (index == 0) setEliminarProveedor(codigo); }

function enlistarProveedor(arrayJson) {
    let html1 = "";

    //html1 += '<ons-card class="botonPrograma" onclick="mensajeProveedor(\'' + arrayJson.codigo + '\')">';

    /*html1 += '<ons-lit-header style="background: white"><strong>' + agregarCeros(arrayJson.codigo) + '</strong></ons-list-header>';
    html1 += '<ons-list-item class="" modifier="nodivider">';
    html1 += '  <div class="left">';
    html1 += '      <i class="fa-solid fa-user-large fa-2x"></i> ';
    html1 += '  </div>';
    html1 += '  <div class="center">';
    html1 += '  <b>' + arrayJson.nombre + '</b>';
    html1 += '  </div>"';
    html1 += '  <div class="right">' + tipoEgreso(arrayJson.tipo) + '</div>';
    html1 += '</ons-list-item>';*/

    html1 += '<ons-card class="botonPrograma"  onclick="mensajeProveedor(\'' + arrayJson.codigo + '\')">';
    html1 += '<div class="contenedor-flexboxLados">'
    html1 += '    <div> <i class="fa-solid fa-user-large fa-lg"></i> <strong>' + agregarCeros(arrayJson.codigo) + '</strong> &nbsp;' + arrayJson.nombre + '</div>';
    html1 += '  <div>' + tipoEgreso(arrayJson.tipo) + '</div>';
    html1 += '</div>';
    html1 += '</ons-card>';

    //html1 += '</ons-card>';
    return html1;
}

