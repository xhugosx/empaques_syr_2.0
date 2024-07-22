//clientes
//mostrar clientes
function setClientes() {
    if ($('#busquedaCliente').val() != "") setClientesBarraBusqueda($('#busquedaCliente').val(), 13);
    else servidor(myLink+'/php/clientes/select.php?type=2', getClientes);
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
    if (tecla == 13 || e == 13) {
        servidor(myLink+'/php/clientes/select.php?type=3&search=' + busqueda, getClientesBarraBusqueda);
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
    //console.log($('#codigoCliente').val(), $('#nombreCliente').val(), $('#RFCCliente').val(), $('#contrasenaCliente').val(),vacio($('#codigoCliente').val(), $('#nombreCliente').val(), $('#RFCCliente').val(), $('#contrasena').val()),vacio);
    if (vacio($('#codigo').val(), $('#nombre').val(), $('#RFC').val(), $('#contrasena').val())) {

        servidor(myLink+'/php/clientes/add.php?codigo=' + $('#codigo').val() + '&nombre=' + $('#nombre').val() + '&rfc=' + $('#RFC').val() + '&contrasena=' + $('#contrasena').val(), getAgregarCliente)
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

//esta funcion es para autollenar la contraseña 
function contrasenaCliente() {
    var codigo = $('#codigo').val();
    var rfc = $('#RFC').val();
    if (vacio(codigo, rfc)) {
        //console.log(vacio(codigo,rfc))
        codigo = parseInt(codigo);

        rfc = rfc.length <= 4 ? rfc : rfc.substr(0, 4);
        var contrasena = codigo + rfc;
        $('#contrasena').val(contrasena);
        //console.log(contrasena)
    }
}

//fin de agregar clientes

//eliminar cliente

function setEliminarCliente(codigo, i) {
    agregarClase(i);

    setTimeout(function () {
        servidor(myLink+'/php/clientes/delete.php?codigo=' + codigo, getEliminarCliente);
    }, 1500);

}
function getEliminarCliente(respuesta) {
    //console.log(respuesta.responseText);
    if (respuesta.responseText == "1") {
        alerta("Registro eliminado");
        setClientes();
    }
    else alerta("No se pudo eliminar");
}

//fin de eliminar cliente

//buscar editar cliente
function setBuscarEditarCliente(id) {
    servidor(myLink+'/php/clientes/select.php?type=3&search=' + id, getBuscarEditarCliente);
}
function getBuscarEditarCliente(respuesta) {
    var resultado = respuesta.responseText;
    var tempJson = resultado.split('|');
    tempJson = JSON.parse(tempJson[0]);
    //alert(resultado);
    $('#codigo').val(agregarCeros(tempJson.codigo));
    $('#nombre').val(tempJson.nombre);
    $('#RFC').val(tempJson.rfc);
    $('#contrasena').val(tempJson.contraseña);
}
//fin de buscar editar cliente 


//editar proveedor
function setEditarCliente() {
    var id = $('#codigo').val();
    var nombre = $('#nombre').val();
    var rfc = $('#RFC').val();
    var contrasena = $('#contrasena').val();
    if (vacio(id, nombre)) servidor(myLink+"/php/clientes/update.php?id=" + id + "&nombre=" + nombre+ "&rfc=" + rfc + "&contrasena=" + contrasena, getEditarCliente);
    else alerta("Espacios vacios!");

    //servidor(myLink+"/php/proveedores/update.php?id="+id+"&nombre="+nombre+"&tipo="+tipo,);

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
    //onsole.log(arrayJson);
    let html1 = "";
    //html1 = '<ons-card id="contenedorPrograma">';

    for (var i = 0; i < arrayJson.length - 1; i++) {
        arrayJson[i] = JSON.parse(arrayJson[i]); //convertimos los jsonText en un objeto json
        html1 += '<ons-card class="botonPrograma" id="list-cliente' + i + '"  onclick="crearObjetMensajeCliente(' + arrayJson[i].codigo + ',' + i + ')">';
        html1 += '    <strong>' + agregarCeros(arrayJson[i].codigo) + '</strong> &nbsp;' + arrayJson[i].nombre + '<br><br>';
        html1 += '<span style="font-size:12px;color:grey"><b>RFC: </b><span id="rfc' + i + '">' + arrayJson[i].rfc + '</span>&emsp;&emsp;<b>Contraseña: </b><span id="contrasena' + i + '">' + arrayJson[i].contraseña + '</span></span>'
        html1 += '</ons-card>';
    }
    html1 += '<br><br><br>';

    return html1

}

//funcion para agregar 0 a la variable


