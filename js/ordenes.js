function verOrden(orden) {
    $("#loadingOrden").empty();
    oCarga("Cargando orden");
    $("#ordenArchivo").attr("src", "https://docs.google.com/gview?url=" + orden + "&embedded=true");

    setTimeout(() => {
        cCarga();
        // en caso de que no muestre nada
    }, 4000);
}

function abrirCarpeta(elemento) {
    var id = elemento.firstChild.nextElementSibling.id;

    $(".fa-folder").removeClass('fa-folder-open')
    $("#" + id).toggleClass('fa-folder-open');

    setBuscarOrden(id);
}
function asignarAnioOrden() {
    const moonLanding = new Date();
    $('#yearOrden').text(moonLanding.getFullYear());
}

function setAgregarOrden() {
    if (datoVacio($('input[type=file]').val())) {
        var form = $('#formOrdenes')[0];
        var formData = new FormData(form);
        const prov = $('input[name="prov"]:checked').val();
        var carpeta = $('#yearOrden').text() + '-' + prov;

        $('#agregarOrden').prop("disabled", true);
        oCarga("Subiendo Archivo...");
        //console.log(myLink+'/php/ordenes/add.php?year='+carpeta,michelle);
        servidorPost(myLink + '/php/ordenes/add.php?year=' + carpeta,
            function (respuesta) {
                cCarga();
                if (respuesta.responseText == "1") {
                    alerta("Registro insertado");
                    resetearPilaFunction(setBuscarAnio);
                }
                else alerta('Error al registrar!');
                $('#agregarOrden').prop("disabled", false);
            }, formData);
    }
    else alerta("Agrega un arhcivo");
}

function setBuscarAnio() {
    const $loading = $('#loadingOrdenes');
    const $ordenes = $('#ordenes');
    const $carpetas = $('#carpetasAnio');

    $loading.html("<ons-progress-bar indeterminate></ons-progress-bar>");
    oCarga("Cargando Datos...");

    servidor(`${myLink}/php/ordenes/selectAnio.php`, function (respuesta) {
        let resultado = respuesta.responseText.split(',');

        const sinResultadosHTML = `
        <ons-card id="contenedorPrograma">
            <center><h2 style="color:white">Sin resultados...</h2></center>
        </ons-card>
    `;

        if (resultado[0] === "") {
            $loading.empty();
            $ordenes.empty();
            $carpetas.html(sinResultadosHTML);
            cCarga();
            return;
        }

        let html = "";
        for (let i = 0; i < resultado.length - 1; i += 4) {
            html += `<div class="contenedor-flexbox">`;

            for (let j = i; j < i + 4 && j < resultado.length - 1; j++) {
                html += `
                <span class="ordenesLamina" onclick="abrirCarpeta(this)">
                    <i class="fa-solid fa-folder fa-3x" id="${resultado[j]}"></i>
                    <br><br>
                    <font><b>${resultado[j]}</b></font>
                </span>
            `;
            }

            html += `</div>`;
        }

        $loading.empty();
        $ordenes.empty();
        $carpetas.html(html);
        cCarga();
    });

}

function setBuscarOrden(anio) {
    oCarga("Cargando Ordenes...");
    servidor(myLink + "/php/ordenes/select.php?year=" + anio,
        function (respuesta) {
            var resultado = respuesta.responseText;
            var arrayJson = resultado.split('|');
            //console.log(respuesta.responseText);
            let perfil = validarPerfil();
            let accion;
            if (perfil == "produccion") accion = `crearObjetMensajePedido1('${arrayJson.codigo}')`;

            var html = "";

            for (let i = 0; i < arrayJson.length - 1; i += 4) {
                html += '<div class="contenedor-flexbox">';

                for (let j = i; j < i + 4 && j < arrayJson.length - 1; j++) {
                    var tempJson = JSON.parse(arrayJson[j]);
                    let perfil = validarPerfil();
                    let accion;
                    if (perfil == "produccion") accion = `mensajeOrden1(['${tempJson.id}','${tempJson.carpeta}','${tempJson.path}'])`;
                    else accion = `mensajeOrden(['${tempJson.id}','${tempJson.carpeta}','${tempJson.path}'])`;

                    html += `<span class="ordenesLamina" onclick=" ${accion} ">
                                <i class="fa-solid fa-file-pdf fa-3x"></i>
                                <br><br>
                                <font><b> ${tempJson.path} </b></font>
                            </span>`;
                }

                html += '</div>';
            }
            $('#ordenes').html("");
            $('#ordenes').html(html);
            cCarga();
        }
    )
}

function setEliminarOrden(id) {
    oCarga("Eliminando Orden...");
    servidor(myLink + "/php/ordenes/delete.php?id=" + id,
        function (respuesta) {
            cCarga();
            var resultado = respuesta.responseText;
            if (resultado == 1) {
                alerta("Orden eliminada");
                setBuscarAnio();
            }

        }
    )
}

//funciones para mostrar mensaje
function mensajeOrden(datos) {
    mensajeArriba('Opciones', ['<i class="fas fa-eye"></i>&nbsp;Ver orden', { label: '<i class="far fa-trash-alt" style="color:red"></i>&nbsp;Eliminar', modifier: 'destructive' }],
        function (index) {
            let id = datos[0];
            let anio = datos[1];
            let archivo = datos[2];

            if (index == 0) {

                //let navegador = navigator.userAgent;
                if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i)) {
                    //console.log("Estás usando un dispositivo móvil!!");
                    nextPageFunctionData('verOrden.html', verOrden, myLink + '/ordenes/' + anio + '/' + archivo);
                } else {
                    window.open(myLink + '/ordenes/' + anio + '/' + archivo, '_blank');
                }
            }
            else if (index == 1) {
                alertComfirm("Estas seguro de borrar esta orden? ", ["Aceptar", "Cancelar"],
                    function (index) {
                        if (index == 0) setEliminarOrden(id);
                    }
                );
            }
        }, datos);
}

function mensajeOrden1(datos) {
    mensajeArriba('Opciones', ['<i class="fas fa-eye"></i>&nbsp;Ver orden', { label: '<i class="far fa-times" style="color:red"></i>&nbsp;Cancelar', modifier: 'destructive' }],
        function (index) {
            let anio = datos[1];
            let archivo = datos[2];

            if (index == 0) {
                //let navegador = navigator.userAgent;
                if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i)) {
                    //console.log("Estás usando un dispositivo móvil!!");
                    nextPageFunctionData('verOrden.html', verOrden, myLink + '/ordenes/' + anio + '/' + archivo);
                } else {
                    window.open(myLink + '/ordenes/' + anio + '/' + archivo, '_blank');
                }
            }
        }
    );
}