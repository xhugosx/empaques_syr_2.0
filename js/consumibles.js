document.addEventListener('init', function (event) {
    var page = event.target;
    if (page.id === 'consumible') {
        menuConsumibles();
        remover();
        filtroGlobal = "";
    }
});
//funcion para refrescar todo
function refresConsumible() {
    setConsumible();
}

//mostrar inventario consumibles

function setConsumible() {
    oCarga("Cargando Datos...");
    var busqueda = $('#searchConsumible').val();
    servidor(myLink + '/php/consumibles/select.php?search=' + busqueda + "&filtro=" + filtroGlobal, function (respuesta) {
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
    var tipo = $('#selectTipo').val();
    if (vacio(descripcion, cantidad, tipo)) {
        oCarga("Agregando Consumible...");
        servidor(myLink + '/php/consumibles/add.php?&descripcion=' + descripcion + '&cantidad=' + cantidad + "&tipo=" + tipo,
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
function setEditarConsumible() {
    let id = $('#id').val();
    let des = $('#descripcion').val().toUpperCase();
    let tipo = $('#selectTipo').val();
    //console.log(id, des, tipo);
    if (vacio(id, des, tipo))
        servidor(myLink + '/php/consumibles/update.php?id=' + id + '&descripcion=' + des + '&tipo=' + tipo,
            function (respuesta) {
                //console.log(respuesta.responseText);
                if (respuesta.responseText == "1") {
                    resetearPilaFunction(setConsumible);
                }
                else alerta("No se pudo Actualizar");
            }
        );
    else alerta("Datos vacios!!");
}
//fin de actualizar de consumible

//actualizar consumible descripcion

function setActualizarConsumible(id) {
    let cantidad = $('#salidaConsumible').val();
    if (cantidad >= 0) {
        servidor(myLink + '/php/consumibles/updateCant.php?id=' + id + '&cantidad=' + cantidad,
            function (respuesta) {
                if (respuesta.responseText == "1") {
                    alertToast("Piezas Actualizadas!", 2000);
                    refresConsumible();
                    hideDialogo('my-dialogConsumible');
                }
                else alerta("No se pudo Actualizar");
            }
        );

    }
    else alerta("La cantidad no puede ser menor a 0");
}
//fin de actualizar de consumible descripcion

function enlistarConsumible(json) {
    let perfil = validarPerfil();
    let accion;
    if (perfil != "produccion") accion = `onclick="alertaConsumible('${conversionJsonArray(json)}')"`;
    return `
    <ons-card style="padding:0px;" class="botonPrograma" ${accion}>
        <ons-list-header class="pedido-header">
            <span style="color: #475569; font-weight: 800; font-size: 11px; text-transform: uppercase;">${consumible(json.tipo)} </span>
            <b style="color: #3b82f6; font-size: 11px;">
                <i class="far fa-calendar-alt"></i> ${sumarDias(json.fecha, 0)}
            </b>
        </ons-list-header>
        <ons-list-item class="" modifier="nodivider">
            <div class="left">
                <div class="producto-icon-wrapper">
                    ${tipoConsumible(json.tipo)}
                </div>
            </div>
            
            <div class="center">
                <b>${json.descripcion}</b>
            </div>
            <div class="right" >
                <div class="pedido-cantidad-container">
                    <span class="pedido-cantidad-valor" style="color: #1e40af;">${separator(json.cantidad)}</span>
                    <span class="pedido-cantidad-label">Pzas</span>
                </div>
            </div>
        </ons-list-item>
    </ons-card>
    `;
}

var idConsumible = "";
function alertaConsumible(array) {
    array = array.split(",");
    var json = conversionArrayJson(array);
    let botones = [
        { label: "Modificar", icon: "fa-edit" },
        { label: "Piezas", icon: "fa-calculator" },
        { label: 'Eliminar', modifier: 'destructive', icon: "fa-trash" }
    ];
    mensajeArriba("Opciones", botones,
        function (index) {
            if (index == 0) {
                nextPageFunction("editarConsumible.html", function () {
                    $("#id").val(json.id);
                    $("#descripcion").val(json.descripcion);
                    $("#selectTipo").val(json.tipo);
                });
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
    );
}


function incrementar() {
    let cantidad = $('#salidaConsumible').val();
    $('#salidaConsumible').val(parseInt(cantidad) + 1);
}

function decrementar() {
    let cantidad = $('#salidaConsumible').val();
    if (cantidad > 0) $('#salidaConsumible').val(parseInt(cantidad) - 1);
}

function aplicarFiltroConsumible() {
    var ids = document.querySelectorAll("input[name='tipo']:checked");
    var a = "";
    for (var i = 0; i < ids.length; i++) {
        a += ids[i].value + ",";
    }
    filtroGlobal = a.slice(0, -1);
    setConsumible();
    menu.close();
}
function resetearFiltroConsumibles() {
    $('input[type=checkbox]').prop('checked', false);
    filtroGlobal = "";
    menu.close();
}
function tipoConsumible(tipo) {
    let tipos = [
        '<i class="fa-solid fa-paperclip fa-2x"></i>',
        '<i class="fa-solid fa-screwdriver-wrench fa-2x"></i>',
        '<i class="fa-solid fa-soap fa-2x"></i>',
        '<i class="fa-solid fa-toolbox fa-2x"></i>',
    ];
    return tipos[tipo - 1] || '<i class="fas fa-question fa-2x"></i>';
}
function consumible(tipo) {
    let tipos = [
        'PAPELERIA',
        'HERRAMIENTA',
        'LIMPIEZA',
        'PRODUCCION',
    ];
    return tipos[tipo - 1] || 'TIPO DESCONOCIDO';
}
function menuConsumibles() {
    var html = `
        <div style="padding: 16px 8px; background: #f8fafc;">
            <h4 style="color: #475569; font-weight: 800; text-align: center; margin-bottom: 20px; text-transform: uppercase; font-size: 14px; letter-spacing: 1px;">
                Filtros de Búsqueda
            </h4>

            <ons-list style="background: none; border: none;">
                <ons-list-item tappable modifier="nodivider" style="background: white; border-radius: 12px; margin-bottom: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.03);">
                    <label class="left" style="padding-left: 10px;">
                        <ons-checkbox input-id="check-1" value="1" name="tipo"></ons-checkbox>
                    </label>
                    <label for="check-1" class="center" style="font-size: 14px; color: #1e293b; font-weight: 500;">
                        <i class="fa-solid fa-paperclip"></i> &nbsp; Papelería
                    </label>
                </ons-list-item>

                <ons-list-item tappable modifier="nodivider" style="background: white; border-radius: 12px; margin-bottom: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.03);">
                    <label class="left" style="padding-left: 10px;">
                        <ons-checkbox input-id="check-2" value="2" name="tipo"></ons-checkbox>
                    </label>
                    <label for="check-2" class="center" style="font-size: 14px; color: #1e293b; font-weight: 500;">
                        <i class="fa-solid fa-screwdriver-wrench"></i>&nbsp; Herramienta
                    </label>
                </ons-list-item>

                <ons-list-item tappable modifier="nodivider" style="background: white; border-radius: 12px; margin-bottom: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.03);">
                    <label class="left" style="padding-left: 10px;">
                        <ons-checkbox input-id="check-3" value="3" name="tipo"></ons-checkbox>
                    </label>
                    <label for="check-3" class="center" style="font-size: 14px; color: #1e293b; font-weight: 500;">
                        <i class="fa-solid fa-soap"></i>&nbsp; Limpieza
                    </label>
                </ons-list-item>

                <ons-list-item tappable modifier="nodivider" style="background: white; border-radius: 12px; margin-bottom: 15px; box-shadow: 0 2px 4px rgba(0,0,0,0.03);">
                    <label class="left" style="padding-left: 10px;">
                        <ons-checkbox input-id="check-4" value="4" name="tipo"></ons-checkbox>
                    </label>
                    <label for="check-4" class="center" style="font-size: 14px; color: #1e293b; font-weight: 500;">
                        <i class="fa-solid fa-toolbox"></i>&nbsp; Producción
                    </label>
                </ons-list-item>
            </ons-list>

            <div style="padding: 10px 15px;">
                <ons-button id="botonPrograma" onclick="aplicarFiltroConsumible()" modifier="large" 
                    style="background: #3b82f6; box-shadow: 0 4px 10px rgba(59, 130, 246, 0.3); font-weight: bold; border-radius: 10px;">
                    Aplicar Filtros
                </ons-button>

                <div style="height: 12px;"></div>

                <ons-button class="btnResetear" onclick="resetearFiltroConsumibles()" modifier="large"
                    style="background: #f1f5f9; font-weight: 600; border-radius: 10px; border: 1px solid #e2e8f0;">
                    <ons-icon icon="fa-trash" style="font-size: 12px;"></ons-icon> Resetear
                </ons-button>
            </div>
        </div>
    `;
    $("#contenidoMenu").html(html);
}