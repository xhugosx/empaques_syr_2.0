//clientes
//mostrar clientes
function setClientes() {
    servidor('https://empaquessyrgdl.000webhostapp.com/empaquesSyR/clientes/select.php?type=2', getClientes);
}
function getClientes(respuesta) {

    var resultado = respuesta.responseText;//respuesta del servidor
    var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'

    resultado = enlistarClientes(arrayJson);

    $('#datosClientes').empty();
    setDataPage('#datosClientes', '#loadingClientes', resultado);

}
//fin de mostrar clientes

//buscar clientes
function setClientesBarraBusqueda(busqueda, e) {
    if (busqueda == "") setClientes()

    tecla = (document.all) ? e.keyCode : e.which;
    if (tecla == 13) {
        servidor('https://empaquessyrgdl.000webhostapp.com/empaquesSyR/clientes/select.php?type=3&search=' + busqueda, getClientesBarraBusqueda);
    }

}
function getClientesBarraBusqueda(respuesta) {
    var resultado = respuesta.responseText;//respuesta del servidor
    var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'

    resultado = enlistarClientes(arrayJson);

    $('#datosClientes').empty();
    setDataPage('#datosClientes', 0, resultado);
}
//fin de buscar clintes
//agregar clientes
function setAgregarCliente() {

    if (datoVacio($('#codigoCliente').val()) && datoVacio($('#nombreCliente').val())) {
        servidor('https://empaquessyrgdl.000webhostapp.com/empaquesSyR/clientes/add.php?codigo=' + $('#codigoCliente').val() + '&nombre=' + $('#nombreCliente').val(), getAgregarCliente)
    }
    else alerta("Espacios en blanco");
    //validar si codigo y nombre tiene datos

}
function getAgregarCliente(respuesta) {
    //alert(respuesta.responseText);
    //respuesta del servidor
    if (respuesta.responseText == "1") {
        alerta("Registro insertado");
        resetearPilaFunction(setClientes);
    }
    else alerta('Ya existe un cliente con ese codigo, "No se pudo insertar"');
}

//fin de agregar clientes

//eliminar cliente

function setEliminarCliente(codigo, i) {
    agregarClase(i);

    setTimeout(function () {
        servidor('https://empaquessyrgdl.000webhostapp.com/empaquesSyR/clientes/delete.php?codigo=' + codigo, getEliminarCliente);
    }, 1500);

}
function getEliminarCliente(respuesta) {
    //alert(respuesta.responseText);
    if (respuesta.responseText == "1") {
        alerta("Registro eliminado");
        setClientes();
    }
    else alerta("No se pudo eliminar");
}

//fin de eliminar cliente

//buscar editar cliente
function setBuscarEditarCliente(id) {
    servidor('https://empaquessyrgdl.000webhostapp.com/empaquesSyR/clientes/select.php?type=3&search=' + id, getBuscarEditarCliente);
}
function getBuscarEditarCliente(respuesta) {
    var resultado = respuesta.responseText;
    var tempJson = resultado.split('|');
    tempJson = JSON.parse(tempJson[0]);
    //alert(resultado);
    $('#id').val(agregarCeros(tempJson.codigo));
    $('#nombre').val(tempJson.nombre);
}
//fin de buscar editar cliente 


//editar proveedor
function setEditarCliente() {
    var id = $('#id').val();
    var nombre = $('#nombre').val();
    if (vacio(id, nombre)) servidor("https://empaquessyrgdl.000webhostapp.com/empaquesSyR/clientes/update.php?id=" + id + "&nombre=" + nombre, getEditarCliente);
    else alerta("Espacios vacios!");

    //servidor("https://empaquessyrgdl.000webhostapp.com/empaquesSyR/proveedores/update.php?id="+id+"&nombre="+nombre+"&tipo="+tipo,);

}
function getEditarCliente(respuesta) {
    var resultado = respuesta.responseText;
    if (resultado == "1") {
        alerta("Cliente Actualizado");
        resetearPilaFunction(setClientes);
    }
    else alerta("No se pudo Actualizar");
}



//fin de Clientes

//funcion para enlistar clientes
function enlistarClientes(arrayJson) {
    if (arrayJson == "") return '<ons-card id="contenedorPrograma"> <center> <h2>Sin resultados...</h2> </center> </ons-card>';

    let html1 = "";
    //html1 = '<ons-card id="contenedorPrograma">';

    for (var i = 0; i < arrayJson.length - 1; i++) {
        arrayJson[i] = JSON.parse(arrayJson[i]); //convertimos los jsonText en un objeto json
        html1 += '<ons-card class="botonPrograma" id="list-cliente' + i + '" onclick="crearObjetMensajeCliente(' + arrayJson[i].codigo + ',' + i + ')">';
        html1 += '    <i class="fa-solid fa-user-large fa-lg"></i> <strong>' + agregarCeros(arrayJson[i].codigo) + '</strong> &nbsp;' + arrayJson[i].nombre + '';
        html1 += '</ons-card>';
    }
    html1 += '<br><br><br>';

    return html1

}

//funcion para agregar 0 a la variable


