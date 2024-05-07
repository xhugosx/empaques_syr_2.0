

//productos
//ver productos
function setProductos() {
    $('#loadingProductos').empty();
    $('#loadingProductos').append("<ons-progress-bar indeterminate></ons-progress-bar>");
    var busqueda = $('#busquedaProductos1').val();
    if (busqueda == "" || busqueda == undefined) servidor('https://empaquessr.com/sistema/cinthya/php/productos/select.php?type=2', getProductos);
    else setProductosBarraBusqueda(busqueda, 13);
    //servidor('https://empaquessr.com/sistema/cinthya/php/productos/select.php?type=2',getProductos);
}
function getProductos(respuesta) {
    var resultado = respuesta.responseText;//respuesta del servidor
    var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'
    //alert("entro");

    listaInfinita('datosProductos', 'loadingProductos', arrayJson, enlistarProductos);

}
//fin de ver productos

//eliminar productos
function setEliminarProducto(producto, i) {
    agregarClaseProducto(i);

    setTimeout(function () {
        servidor('https://empaquessr.com/sistema/cinthya/php/productos/delete.php?codigo=' + producto, getEliminarProducto)
    }, 1500);


}
function getEliminarProducto(respuesta) {
    if (respuesta.responseText == "1") {
        alerta("Registro eliminado");
        setProductos();
    }
    else alerta("No se pudo eliminar");
    //alert(respuesta.responseText);
}
//fin de eliminar productos

//agregar productos
function setAgregarProducto() {

    if (datoVacio($('#codigoProducto1').val()) && datoVacio($('#nombreProducto').val()) && datoVacio($('#precioProducto').val()) && datoVacio($('input[type=file]').val())) {
        var filename = $('input[type=file]').val().replace(/.*(\/|\\)/, '');
        var codigo = filename.split(".");
        codigo = codigo[0].replace("-", "/");

        if (codigo == $('#codigoProducto1').val()) {
            var form = $('#formProducto')[0];
            var formData = new FormData(form);

            $("#btn-producto").prop("disabled", true);
            servidorPost('https://empaquessr.com/sistema/cinthya/php/productos/add.php', getAgregarProducto, formData);
            //alerta("el archivo si coiciden");
        }
        else alerta("El Archivo no coicide con el codigo del producto");

    }
    else alerta("Espacios en blanco");
}
function getAgregarProducto(respuesta) {
    //respuesta del servidor
    if (respuesta.responseText == "1") {
        alerta("Registro insertado");
        resetearPilaFunction(setProductos);
    }
    else alerta('Ya existe un producto con ese codigo!');

    //habilitar el boton independientemente del resultado del servidor
    $("#btn-producto").prop("disabled", false);
}

//fin de agregar productos

//actualizar producto
function setActualizarProducto() {
    if (datoVacio($('#codigoProductoActualizar').val()) && datoVacio($('#nombreProductoActualizar').val())) {
        if ($('input[type=file]').val()) {
            var filename = $('input[type=file]').val().replace(/.*(\/|\\)/, '');
            var codigo = filename.split(".");
            codigo = codigo[0].replace("-", "/");
            if (codigo != $('#codigoProductoActualizar').val()) {
                alerta("El Archivo no coicide con el codigo del producto");
                return 0;
            }
        }
        $("#codigoProductoActualizar").prop('disabled', false);
        var form = $('#formProductoActualizar')[0];
        var formData = new FormData(form);
        servidorPost('https://empaquessr.com/sistema/cinthya/php/productos/update.php', getActualizarProducto, formData);
    }
    else alerta("Espacios en blanco");

}
function getActualizarProducto(respuesta) {
    //alert(respuesta.responseText);
    if (respuesta.responseText == "1") {
        alerta("Registro actualizado");
        resetearPilaFunction(setProductos);
    }
    else alerta("No se pudo actualizar");

}
function setBuscarProductoActualizar(codigo) {
    servidor('https://empaquessr.com/sistema/cinthya/php/productos/select.php?type=3&search=' + codigo, getBuscarProductoActualizar);
}
function getBuscarProductoActualizar(respuesta) {
    var resultado = respuesta.responseText;//respuesta del servidor
    var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'


    arrayJson[0] = JSON.parse(arrayJson[0]);
    var producto = (arrayJson[0].codigo).split("/"); // funcion para dividir codigo y poner nombre del archivo...
    $('#codigoProductoActualizar').val(arrayJson[0].codigo);
    $('#nombreProductoActualizar').val(arrayJson[0].producto);
    $('#precioProductoActualizar').val(arrayJson[0].precio);
    $('#pdfNombreProductoActualizar').text(arrayJson[0].file == 1 ? producto[0] + "-" + producto[1] + ".pdf" : "No tiene Plano");
    //alert(arrayJson[0].file);

}
//fin de actualizar cliente


//fin de productos


//busqueda por barra de busqueda

function setProductosBarraBusqueda(busqueda, e) {
    //asignar el progress bar 

    if (busqueda == "") setProductos();

    tecla = (document.all) ? e.keyCode : e.which;
    if (tecla == 13 || e == 13) {
        $('#loadingProductos').append("<ons-progress-bar indeterminate></ons-progress-bar>");
        servidor('https://empaquessr.com/sistema/cinthya/php/productos/select.php?type=3&search=' + busqueda, getProductosBarraBusqueda);
    }

}
function getProductosBarraBusqueda(respuesta) {
    var resultado = respuesta.responseText;//respuesta del servidor
    var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'

    listaInfinita('datosProductos', 'loadingProductos', arrayJson, enlistarProductos);
}


//sirve para enlistar todos los productos
function enlistarProductos(arrayJson, i) {
    //console.log(arrayJson);
    let html1 = "";
    html1 += '<ons-card style="padding:0px;" class="botonPrograma" id="list-cliente' + i + '" onclick="crearObjetMensaje(\'' + arrayJson.codigo + '\',' + i + ')">';
    html1 += '<ons-list-item class="" modifier="nodivider">';
    html1 += '  <div class="left">';
    html1 += '      <i class="fa-solid fa-box fa-2x"></i>';
    html1 += '  </div>';
    html1 += '  <div class="center">';
    html1 += '    <span class="list-item__title romperTexto"><b>' + arrayJson.codigo + '</b> </span>';
    html1 += '    <span class="list-item__subtitle">' + arrayJson.producto + '</span>';
    html1 += '  </div>"';
    html1 += '  <div class="right">' + ExistePlano(arrayJson.file) + '$' + arrayJson.precio + '</div>';
    html1 += '</ons-list-item>';
    html1 += '</ons-card>';

    return html1;
}

function agregarClaseProducto(i) {

    $("#list-producto" + i).addClass("list-producto-animation");
    setTimeout(function () {
        $('.list-cliente-animation').remove();
    }, 1500);
}

function cargarArchivoProducto() {
    //alert(""+);
    var filename = $('input[type=file]').val().replace(/.*(\/|\\)/, '');
    //alert(filename);
    var extension = filename.split(".");
    if (extension[1] === "pdf") $('#pdfNombreProducto').text(filename);
    else {
        alerta("Archivo no valido");
        $('#pdfNombreProducto').text('Selecciona un archivo "PDF"');
        $('input[type=file]').val("");
    }

}

function cargarArchivoProductoActualizar() {
    //alert(""+);
    var filename = $('input[type=file]').val().replace(/.*(\/|\\)/, '');
    //alert(filename);
    var extension = filename.split(".");
    if (extension[1] === "pdf") $('#pdfNombreProductoActualizar').text(filename);
    else {
        alerta("Archivo no valido");
        //$('#pdfNombreProductoActualizar').text('Selecciona un archivo "PDF"');
        $('input[type=file]').val("");
    }

}

function verPlano(plano) {
    $("#loadingPlano").empty();
    $("#plano").attr("src", "https://docs.google.com/gview?url=" + plano + "&embedded=true");
    $("#actualizarPlano").attr("onclick", "verPlano(\'" + plano + "\')");
    //$("#plano").attr("data",plano);
}

function ExistePlano(file) {
    return file == 1 ? '<i class="fa-solid fa-file-circle-check fa-lg" style="color:#00bb2d"></i>' : '<i class="fa-solid fa-file-circle-xmark fa-lg" style="color:#ff6961"></i>';
}

function setDescargarProductosExcel() {
    let botones = ["Cancelar", "Aceptar"];
    //let busqueda = $("#busquedaProductos1").val() == undefined || $("#busquedaProductos1").val() == "" ? "" : $("#busquedaProductos1").val();
    let mensaje = "Escribe el codigo del cliente que deseas descargar";
    //console.log(mensaje,botones,$("#busquedaProductos1").val());
    //alertComfirm(mensaje, botones, getDescargarProductosExcel, busqueda); 

    alertComfirmDato(mensaje, "text", botones, getDescargarProductosExcel, '');
}
function getDescargarProductosExcel(dato) {

    if (dato === null) alerta("Espacio vacio! / Cancelado");
    else {
        //alert(dato.length);
        if (dato.length < 3) alerta("Codigo escrito incorrectamente (Asegurate de que sean mas de 3 digitos)");
        else servidor('https://empaquessr.com/sistema/cinthya/php/productos/selectSheets.php?&search=' + dato, getProductosExcel);

    }
}

// Función para exportar datos a un archivo de Excel
function exportarExcel(cliente, datos) {
    // Truncar el nombre del cliente si excede los 31 caracteres
    if (cliente.length > 31) {
        cliente = cliente.substring(0, 31);
    }
    
    // Convertir los datos a una hoja de cálculo de Excel
    const hojaDeCalculo = XLSX.utils.json_to_sheet(datos);

    // Convertir y formatear las celdas A1, B1 y C1
    ['A1', 'B1', 'C1'].forEach((celda) => {
        // Convertir el contenido de la celda a mayúsculas
        hojaDeCalculo[celda].v = hojaDeCalculo[celda].v.toUpperCase();
        // Establecer el tipo de celda como 's' (cadena)
        hojaDeCalculo[celda].t = 's';
    });

    // Crear un nuevo libro de Excel
    const libroDeExcel = XLSX.utils.book_new();

    // Adjuntar la hoja de cálculo al libro
    XLSX.utils.book_append_sheet(libroDeExcel, hojaDeCalculo, cliente);

    // Generar un nombre de archivo con el cliente, la palabra "productos" y la fecha actual
    const nombreArchivo = cliente + "_productos_" + obtenerFechaActual() + ".xlsx";

    // Descargar el archivo de Excel
    XLSX.writeFile(libroDeExcel, nombreArchivo);
}


function getProductosExcel(respuesta) {

    let responseArray = JSON.parse(respuesta.response);

    if (responseArray.mensaje !== undefined) {
        // La clave 'mensaje' está presente en la respuesta JSON
        alerta(responseArray.mensaje + " con el codigo escrito!");
    } else {
        //OBTENER EL NOMBRE DEL CLIENTE
        let cliente = responseArray[0].cliente;

        // ELIMINAR TODOS LAS VARIABLES DEL JSON LLAMADO CLIENTE
        for (var i = 0; i < responseArray.length; i++) {
            delete responseArray[i].cliente;
        }

        exportarExcel(cliente, responseArray);
    }

}

//OBTENER FECHA PARA ASIGNARSELO AL NOMBRE DEL ARCHIVO DESCARGADO
function obtenerFechaActual() {
    const fecha = new Date();
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // El mes es de 0 a 11, por eso se suma 1
    const año = fecha.getFullYear();

    return `${dia}-${mes}-${año}`;
}