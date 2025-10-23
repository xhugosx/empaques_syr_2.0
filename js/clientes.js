//clientes

//mostrar clientes
function setClientes() {
    oCarga("Cargando Datos...");
    $("#loadingClientes").html("<ons-progress-bar indeterminate></ons-progress-bar>");
    let busqueda = $("#busquedaCliente").val();
    servidor(myLink + '/php/clientes/select.php?search=' + busqueda,
        function (respuesta) {
            var resultado = respuesta.responseText;//respuesta del servidor
            var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'
            listaInfinita('datosClientes', 'loadingClientes', arrayJson, enlistarClientes);
            cCarga();
        }
    );
}
//fin de mostrar clientes

//agregar clientes
function setAgregarCliente() {
    const codigo = $('#codigo').val();
    const nombre = $('#nombre').val().toUpperCase();
    const domicilio = $('#domicilio').val();
    const rfc = $('#RFC').val().toUpperCase();
    const contrasena = $('#contrasenaC').val().toUpperCase();

    // Validar si hay campos vacíos
    if (vacio(codigo, nombre, rfc, contrasena)) {
        $("#botonAgregarCliente").prop("disabled", true);
        oCarga("Registrando Cliente...");
        const url = `${myLink}/php/clientes/add.php?codigo=${codigo}&nombre=${nombre}&rfc=${rfc}&contrasena=${contrasena}&domicilio=${domicilio}`;
        servidor(url,
            function (respuesta) {
                cCarga();
                if (respuesta.responseText == "1") {
                    alerta("Registro insertado");
                    resetearPilaFunction(setClientes);
                }
                else alerta('Ya existe un cliente con ese codigo, "No se pudo insertar"');
                $("#botonAgregarCliente").prop("disabled", false);

            }
        );
    } else {
        alerta("Espacios en blanco");
    }

    //validar si codigo y nombre tiene datos

}

//esta funcion es para autollenar la contraseña 
function contrasenaCliente() {
    //console.log("entro");
    var codigo = $('#codigo').val();
    var rfc = $('#RFC').val().toUpperCase();
    if (vacio(codigo, rfc)) {
        //console.log(vacio(codigo,rfc))
        codigo = parseInt(codigo);

        rfc = rfc.length <= 4 ? rfc : rfc.substr(0, 4);
        var contrasena = codigo + rfc;
        $('#contrasenaC').val(contrasena);
        //console.log(contrasena)
    }
}

//fin de agregar clientes

//eliminar cliente

function setEliminarCliente(codigo, i) {
    agregarClase(i);
    oCarga("Eliminando Cliente...");
    setTimeout(function () {
        servidor(myLink + '/php/clientes/delete.php?codigo=' + codigo,
            function (respuesta) {
                cCarga();
                if (respuesta.responseText == "1") {
                    alerta("Registro eliminado");
                    setClientes();
                }
                else alerta("No se pudo eliminar");
            }
        );
    }, 1500);

}

//fin de eliminar cliente

//buscar editar cliente
function setBuscarEditarCliente(id) {
    oCarga("Buscando Cliente...");
    servidor(myLink + '/php/clientes/select.php?search=' + id,
        function (respuesta) {
            var resultado = respuesta.responseText;
            var tempJson = resultado.split('|');
            tempJson = JSON.parse(tempJson[0]);
            //alert(resultado);
            $('#codigo').val(agregarCeros(tempJson.codigo));
            $('#nombre').val(tempJson.nombre);
            $('#RFC').val(tempJson.rfc);
            $('#domicilio').val(tempJson.domicilio);
            $('#contrasenaC').val(tempJson.contraseña);
            $("#botonModificarCliente").prop("disabled", false);
            cCarga();
        }
    );
}
//fin de buscar editar cliente 


//editar proveedor
function setEditarCliente() {
    var id = $('#codigo').val();
    var nombre = $('#nombre').val().toUpperCase();
    var rfc = $('#RFC').val().toUpperCase();
    var domicilio = $('#domicilio').val().toUpperCase();
    var contrasena = $('#contrasenaC').val().toUpperCase();
    //console.log(id, rfc, nombre, contrasena);
    if (vacio(id, rfc, nombre, contrasena)) {
        $("#botonModificarCliente").prop("disabled", true);
        oCarga("Editando Cliente...");
        servidor(myLink + "/php/clientes/update.php?id=" + id + "&nombre=" + nombre + "&rfc=" + rfc + "&contrasena=" + contrasena + "&domicilio=" + domicilio,
            function (respuesta) {
                cCarga();
                var resultado = respuesta.responseText;
                if (resultado == "1") {
                    alerta("Cliente Actualizado");
                    resetearPilaFunction(setClientes);
                }
                else alerta("No se pudo Actualizar");
                $("#botonModificarCliente").prop("disabled", false);
            });
    }

    else {
        alerta("Espacios vacios!");
    }


    //servidor(myLink+"/php/proveedores/update.php?id="+id+"&nombre="+nombre+"&tipo="+tipo,);

}

//fin de Clientes

//funcion para enlistar clientes
function enlistarClientes(arrayJson, i) {

    let html = `
    <ons-card class="botonPrograma" id="list-cliente${i}" onclick="crearObjetMensajeCliente(${arrayJson.codigo}, ${i}, '${arrayJson.nombre}','${arrayJson.domicilio}')">

    <div style="display: flex; align-items: center; gap: 10px;">
        <i class="fa-solid fa-user-large fa-lg"></i>
        <strong>${agregarCeros(arrayJson.codigo)}</strong>&nbsp;${arrayJson.nombre}
    </div>
    <br>
    <span>
    <b>Domicilio: </b> ${arrayJson.domicilio}
    </span>
    <br>
    <span style="font-size:12px; color:grey;">
        <b>RFC:</b> <span id="rfc${i}">${arrayJson.rfc}</span>&emsp;&emsp;
        <b>Contraseña:</b> <span id="contrasena${i}">${arrayJson.contraseña}</span>
    </span>
    
    </ons-card>

    `;

    return html;


}

function crearObjetMensajeCliente(id, i, nombre, domicilio) {
    domicilio = encodeURIComponent(domicilio);
    let botones = [
        { label: "Copiar RFC", icon: "fa-copy" },
        { label: "Copiar Contraseña", icon: "fa-copy" },
        { label: "ver mapa", icon: "fa-map" },
        { label: "Editar", icon: "fa-pen-to-square" },
        { label: "Eliminar", icon: "fa-trash", modifier: "destructive" }
    ];
    mensajeArriba("OPCIONES - " + id + " " + nombre, botones,
        function (index) {
            if (index == 0) { copyToClipboard('#rfc' + i); alertToast("Copiado al portapapeles!", 2000); }
            else if (index == 1) { copyToClipboard('#contrasena' + i); alertToast("Copiado al portapapeles!", 2000); }
            else if (index == 2) alerta('<iframe loading="lazy" allowfullscreen src="https://www.google.com/maps?q=' + domicilio + '&output=embed"></iframe>');
            else if (index == 3) nextPageFunctionData('editarClientes.html', setBuscarEditarCliente, id);
            else if (index == 4) {
                let contenido = 'Estas seguro de eliminar el cliente: <br>' + agregarCeros(id) + ' ' + nombre + '?<br><br><font color="red"><b>ADVERTENCIA</b><br><br>(Recuerda que esto eliminara todos lo enlazado Archivos, Pedidos, Inventario)</font>';
                alertaConfirm(contenido, setEliminarCliente, id, i);
            }

        }
    )
}

//funcion para agregar 0 a la variable


