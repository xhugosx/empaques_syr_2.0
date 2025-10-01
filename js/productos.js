

//productos
//ver productos
function setProductos() {

    $('#loadingProductos').html("<ons-progress-bar indeterminate></ons-progress-bar>");
    oCarga("Cargando Datos...");
    var busqueda = $('#busquedaProductos1').val();
    servidor(myLink + '/php/productos/select.php?search=' + busqueda,
        function (respuesta) {
            var resultado = respuesta.responseText;//respuesta del servidor
            var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'
            //alert("entro");

            listaInfinita('datosProductos', 'loadingProductos', arrayJson, enlistarProductos);
            cCarga();
        }
    );
}
//fin de ver productos


//eliminar productos
function setEliminarProducto(producto, i) {
    agregarClaseProducto(i);
    oCarga("Eliminando Producto...");
    setTimeout(function () {
        servidor(myLink + '/php/productos/delete.php?codigo=' + producto,
            function (respuesta) {
                cCarga();
                if (respuesta.responseText == "1") {
                    alerta("Registro eliminado");
                    setProductos();
                }
                else alerta("No se pudo eliminar");
            }
        )
    }, 1500);


}
//fin de eliminar productos


//agregar productos
function setAgregarProducto() {

    let codigo = $('#codigoProducto1').val();
    let nombre = $('#nombreProducto').val();
    let precio = $('#precioProducto').val();
    let m2 = $('#m2Producto').val();
    let archivo = $('input[type=file]').val();

    if (vacio(codigo, nombre, precio, archivo, m2)) {
        let filename = $('input[type=file]').val().replace(/.*(\/|\\)/, '');
        let codigoF = filename.split(".");
        codigoF = codigoF[0].replace("-", "/");

        if (codigoF === codigo) {
            var form = $('#formProducto')[0];
            var formData = new FormData(form); 0

            $("#btn-producto").prop("disabled", true);
            oCarga("Agregando Producto...");
            servidorPost(myLink + '/php/productos/add.php',
                function (respuesta) {
                    cCarga();
                    if (respuesta.responseText == "1") {
                        alerta("Registro insertado");
                        resetearPilaFunction(setProductos);
                    }
                    else alerta('Ya existe un producto con ese codigo!');

                    //habilitar el boton independientemente del resultado del servidor
                    $("#btn-producto").prop("disabled", false);
                }
                , formData);
            //alerta("el archivo si coiciden");
        }
        else alerta("El Archivo no coicide con el codigo del producto");

    }
    else alerta("Espacios en blanco");
}

//fin de agregar productos

//actualizar producto
function setActualizarProducto() {
    let codigo = $('#codigoProductoActualizar').val();
    let producto = $('#nombreProductoActualizar').val();
    let m2 = $('#m2ProductoActualizar').val();
    if (vacio(codigo, producto, m2)) {
        $("#btnActualizarProducto").prop('disabled', true); // bloquear boton
        oCarga("Agregando Producto...");
        if ($('input[type=file]').val()) {
            var filename = $('input[type=file]').val().replace(/.*(\/|\\)/, '');
            var codigoF = filename.split(".");
            codigoF = codigoF[0].replace("-", "/");
            if (codigoF != codigo) {
                alerta("El Archivo no coicide con el codigo del producto");
                $("#btnActualizarProducto").prop('disabled', false);
                cCarga();
                return 0;
            }
        }
        $("#codigoProductoActualizar").prop('disabled', false);
        var form = $('#formProductoActualizar')[0];
        var formData = new FormData(form);
        servidorPost(myLink + '/php/productos/update.php',
            function (respuesta) {
                cCarga();
                if (respuesta.responseText == "1") {
                    alerta("Registro actualizado");
                    resetearPilaFunction(setProductos);
                }
                else alerta("No se pudo actualizar");
                $("#btnActualizarProducto").prop('disabled', false);

            }, formData);
    }
    else alerta("Espacios en blanco");

}

function setBuscarProductoActualizar(codigo) {
    oCarga("Buscando Producto...");
    servidor(myLink + '/php/productos/select.php?search=' + codigo,
        function (respuesta) {
            var resultado = respuesta.responseText;//respuesta del servidor
            var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'

            arrayJson[0] = JSON.parse(arrayJson[0]);
            var producto = (arrayJson[0].codigo).split("/"); // funcion para dividir codigo y poner nombre del archivo...
            $('#codigoProductoActualizar').val(arrayJson[0].codigo);
            $('#nombreProductoActualizar').val(arrayJson[0].producto);
            $('#precioProductoActualizar').val(arrayJson[0].precio);
            $('#m2ProductoActualizar').val(arrayJson[0].m2);
            $('#pdfNombreProductoActualizar').text(arrayJson[0].file == 1 ? producto[0] + "-" + producto[1] + ".pdf" : "No tiene Plano");
            $('#btnActualizarProducto').prop('disabled', false);
            cCarga();
        }
    );
}
//fin de actualizar cliente

//sirve para enlistar todos los productos
function enlistarProductos(arrayJson, i) {
    const html = `
    <ons-card style="padding:0px;" class="botonPrograma" id="list-cliente${i}" 
              onclick="crearObjetMensaje('${arrayJson.codigo}', ${i})">
        <ons-list-item modifier="nodivider">
            
            <div class="left">
               <span style="position: relative; display: inline-block;">
                    <i class="fas fa-box fa-2x"></i>
                    ${ExistePlano(arrayJson.file)}
                </span>
            </div>
            
            <div class="center">
                <span class="list-item__title"><b>${arrayJson.codigo}</b></span>
                <span class="list-item__subtitle" style="font-size:14px">${arrayJson.producto}</span>
            </div>
            
            <div class="right" style="display:flex; flex-direction:column; align-items:flex-end; gap:4px;">
                <span class="list-item__title"><b><b>M²: ${arrayJson.m2}</b></b></span>
                <span class="list-item__subtitle" style="font-size:14px"><b>$ ${separator(arrayJson.precio)}</b></span>  
            </div>
            
        </ons-list-item>
    </ons-card>
    `;
    return html;
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
    return file == 1 ? '<i class="fa-solid fa-file-circle-check fa-lg bordeIcon" style="color:#00bb2d; right:-10px; font-size:15px"></i>' : '<i class="fa-solid fa-file-circle-xmark fa-lg bordeIcon" style="color:#ff6961; right:-10px; font-size:15px"></i>';
}

function setDescargarProductosExcel() {
    let botones = ["Cancelar", "Aceptar"];
    let mensaje = "Escribe el codigo del cliente que deseas descargar";
    alertComfirmDato(mensaje, "text", botones,
        function (index) {
            if (index == "") alerta("Espacios Vacios!");
            else if (index !== null) {
                if (index.length < 3) alerta("Codigo escrito incorrectamente (Asegurate de que sean mas de 3 digitos)");
                else {
                    oCarga("Creando Tabla de productos de (" + index + ")...")
                    servidor(myLink + '/php/productos/selectSheets.php?&search=' + index,
                        function (respuesta) {
                            let responseArray = JSON.parse(respuesta.response);

                            if (responseArray.mensaje !== undefined) {
                                // La clave 'mensaje' está presente en la respuesta JSON
                                alerta(responseArray.mensaje + " con el codigo escrito!");
                            } else {
                                //OBTENER EL NOMBRE DEL CLIENTE
                                let cliente = responseArray[0].cliente;
                                let codigo = responseArray[0].codigo.substring(0, 3);

                                // ELIMINAR TODOS LAS VARIABLES DEL JSON LLAMADO CLIENTE
                                for (var i = 0; i < responseArray.length; i++) {
                                    delete responseArray[i].cliente;
                                }

                                exportarExcel(codigo, cliente, responseArray);
                                cCarga();
                            }
                        }
                    );
                }

            }
        });
}

// Función para exportar datos a un archivo de Excel
function exportarExcel(codigo, cliente, datos) {
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
    const nombreArchivo = codigo + "_" + cliente + "_productos_" + obtenerFechaActual() + ".xlsx";

    // Descargar el archivo de Excel
    XLSX.writeFile(libroDeExcel, nombreArchivo);
}


