document.addEventListener('init', function (event) {
    var page = event.target;
    if (page.id === 'grabados') {
        remover();
    }
});

function agregarGrabados() {
    let cantidad = $("#cantidad").val();
    let descripcion = $("#descripcion").val();
    //console.log(codigo,descripcion,uso);
    if (vacio(cantidad, descripcion)) {
        servidor(myLink + "/php/grabados/add.php?cantidad=" + cantidad + "&descripcion=" + descripcion, function (respuesta) {
            var data = respuesta.responseText;
            if (data == 1) {
                resetearPilaFunction(mostrarGrabados);
                alerta("Grabado insertado");
            }

            else alerta("No se pudo insertar");
        });
    }
    else alerta("Datos vacios");

}

function editarGrabados() {
    let id = $("#id").val();
    let cantidad = $("#cantidad").val();
    let descripcion = $("#descripcion").val();
    if (vacio(cantidad, descripcion)) {
        servidor(myLink + "/php/grabados/update.php?id=" + id + "&cantidad=" + cantidad + "&descripcion=" + descripcion, function (respuesta) {
            var data = respuesta.responseText;
            if (data == 1) {
                resetearPilaFunction(mostrarGrabados);
                alerta("Grabado editado");
            }

            else alerta("No se pudo editar" + data);
        });
    }
    else alerta("Datos vacios");

}

function opcionesGrabados(id) {
    //let datos = "";
    mensajeArriba("opciones", ["Editar", { label: 'Eliminar', modifier: 'destructive' }], function (index) {
        //console.log(index);
        if (index == 0) {
            //alerta("Editara"+id);
            nextPageFunction("editarGrabados.html", function () {
                //esto para rellenar los cuadros de texto para editar
                servidor(myLink + "/php/grabados/update.php?id=" + id, function (respuesta) {
                    let objeto = JSON.parse(respuesta.responseText);
                    $("#id").val(objeto.id);
                    $("#cantidad").val(objeto.cantidad);
                    $("#descripcion").val(objeto.descripcion);

                });
            });
        }
        else if (index == 1) {
            alertComfirm("Estas seguro de eliminar este grabado?", ["Cancelar", "Aceptar"], function (index) {
                if (index == 1) {
                    eliminarGrabados(id);
                }
            });
        }
    });
}

function eliminarGrabados(id) {
    servidor(myLink + "/php/grabados/delete.php?id=" + id, function (respuesta) {
        if (respuesta.responseText == 1) {
            alerta("Grabado eliminado");
            //para actualizar
            mostrarGrabados();
        }
        else alerta(respuesta.responseText);
    });
}


function mostrarGrabados() {
    let search = $("#searchGrabados").val() == undefined || $("#searchGrabados").val() == "" ? "" : $("#searchGrabados").val();
    //para llenar datos en uso
    //console.log(myLink + "/php/grabados/select.php?search="+search)
    servidor(myLink + "/php/grabados/select.php?search=" + search, function (respuesta) {

        var data = respuesta.responseText;
        var arrayJson = data.split('|');
        listaInfinita('datosGrabados', 'loadingGrabados', arrayJson, enlistarGrabados);

    });
}

function enlistarGrabados(objeto) {
    let perfil = validarPerfil();
    let accion;
    if (perfil != "produccion") accion = `onclick="opcionesGrabados('${objeto.id}')"`;
    var html = `
        <ons-card style="padding:0px;" class="botonPrograma" ${accion}>
            <ons-list-item modifier="nodivider">
                <div class="left">
                    <i class="fas fa-stamp fa-2x"></i>
                </div>
                <div class="center">
                    <span class="list-item__subtitle">
                        <span style="font-size: 13pt;"> ${objeto.descripcion} </span>
                    </span>
                </div>
                <div class="right"> <span class="notification"> ${objeto.cantidad} pza(s)</span> </div>
            </ons-list-item>
        </ons-card>
    `;

    return html;

}