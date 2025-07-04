
var filtroProveedor;
document.addEventListener('init', function (event) {
    var page = event.target;

    if (page.id === 'proveedor') {
        menuProveedores(); // PARA RELLENAR EL MENU DE LA PAGINA PRINCIPAL DE PEDIDOS DE PROVEEDORES
        filtroProveedor = 0;

    } 
});

//FUNCION PARA HACER MOSTRAR PROVEEDORES
function setProveedor() {
    $('#loadingProveedor').html("<ons-progress-bar indeterminate></ons-progress-bar>");
    oCarga("Cargando Datos...");
    let busqueda = $('#searchProveedor').val();
    servidor(myLink + '/php/proveedores/select.php?search=' + busqueda + '&type=' + filtroProveedor,
        function (respuesta) {
            var resultado = respuesta.responseText;//respuesta del servidor
            var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'

            listaInfinita('datosProveedor', 'loadingProveedor', arrayJson, enlistarProveedor);
            cCarga();
        }
    );
}


function setAgregarProveedor() {
    $('#agregarProveedor').prop('disabled', true);
    var nombre = $('#nombreproveedor').val().toUpperCase();
    var tipo = $('#selectTipo').val();
    //console.log(vacio(nombre,tipo));
    if (vacio(nombre, tipo)) {
        oCarga("Agregando Proveedor...");
        servidor(myLink + "/php/proveedores/add.php?nombre=" + nombre + "&tipo=" + tipo,
            function (respuesta) {
                cCarga();
                if (respuesta.responseText == "1") {
                    alerta("Proveedor Agregado");
                    resetearPilaFunction(setProveedor);
                }
                else alerta("No se pudo insertar");
                $('#agregarProveedor').prop('disabled', false);
            }
        );
    }
    else {
        alerta("Espacios vacios");
        $('#agregarProveedor').prop('disabled', false);
    }

}

function setEliminarProveedor(codigo) {
    oCarga("Eliminando Proveedor...");
    servidor(myLink + '/php/proveedores/delete.php?codigo=' + codigo,
        function (respuesta) {
            cCarga();
            if (respuesta.responseText == "1") {
                alerta("Registro eliminado");
                setProveedor();
            }
            else alerta("No se pudo eliminar");
        }
    );
}

function setBuscarEditarProveedor(id) {
    oCarga("Buscando Proveedor");
    servidor(myLink + '/php/proveedores/select.php?search=' + id + '&type=0',
        function (respuesta) {
            var resultado = respuesta.responseText;
            var tempJson = resultado.split('|');
            tempJson = JSON.parse(tempJson[0]);
            //alert(resultado);
            $('#id').val(tempJson.codigo);
            $('#nombre').val(tempJson.nombre);
            $('#selectTipo').val(tempJson.tipo);
            $('#botonModificarPedido').prop('disabled', false);
            cCarga();
        }
    );
}

//funcion para editar el proovedor
function setEditarProveedor() {
    $('#botonModificarPedido').prop('disabled', true);
    var id = $('#id').val();
    var nombre = $('#nombre').val().toUpperCase();
    var tipo = $('#selectTipo').val();
    if (vacio(id, nombre, tipo))
    {
        oCarga("Editando Proveedor...");
        servidor(myLink + "/php/proveedores/update.php?id=" + id + "&nombre=" + nombre + "&tipo=" + tipo,
            function (respuesta) {
                cCarga();
                var resultado = respuesta.responseText;
                if (resultado == "1") {
                    alerta("Proveedor Actualizado");
                    resetearPilaFunction(setProveedor);
                }
                else alerta("No se pudo Actualizar");
                $('#botonModificarPedido').prop('disabled', false);
            }
        );
    }
        
    else {
        alerta("Espacios vacios!");
        $('#botonModificarPedido').prop('disabled', false);
    }

    //servidor(myLink+"/php/proveedores/update.php?id="+id+"&nombre="+nombre+"&tipo="+tipo,);

}

//funciones para mostrar mensaje
function mensajeProveedor(codigo) {
    mensajeArriba('Opciones', ['<i class="fas fa-pen-to-square"></i>&nbsp;Editar', { label: '<i class="fas fa-trash" style="color:red"></i>&nbsp;Eliminar', modifier: 'destructive' }],
        function (index) {
            if (index == 0) nextPageFunctionData('modificarProveedor.html', setBuscarEditarProveedor, codigo);
            else if (index == 1) {
                alertComfirm("Estas seguro de borrar este proveedor?", ["Aceptar", "Cancelar"],
                    function (index) {
                        if (index == 0) setEliminarProveedor(codigo);
                    });
            }
        });
}
//function accionMensajeProveedor(index, codigo) { }

//mensajes para confirmar eliminar
//function mensajeConfirmProveedor(codigo) { }
//function accionConfirmProveedor(index, codigo) { }

function enlistarProveedor(arrayJson) {
    let html1 = `
    <ons-card class="botonPrograma" onclick="mensajeProveedor('${arrayJson.codigo}')">
        <div class="contenedor-flexboxLados">
        <div>
            <i class="fas fa-lg fa-user-tie"></i> &nbsp;
            <strong>${agregarCeros(arrayJson.codigo)}</strong> &nbsp;${arrayJson.nombre}
        </div>
        <div>
            ${tipoEgreso(arrayJson.tipo)}
        </div>
        </div>
    </ons-card>
    `;

    return html1;

}

//FUNCION PARA EL MENU DE FILTRO DE PROVEEDORES
function menuProveedores() {
    var html = `<ons-list>
        <center>
            <h4 style="color: #808fa2; font-weight: bold;">
                Filtros
            </h4>
        </center>
        
        <ons-list>
            <ons-list-header style="background-color: rgba(255, 255, 255, 0);">
                Tipo
            </ons-list-header>
            ${[
            'Consumible',
            'Lamina',
            'Servicio',
            'Suajes y Grabados',
            'Maquila',
            'Gasolina',
            'Herramienta',
            'Otros',
            'Pagos Fijos'
        ].map((texto, index) => `
                <ons-list-item tappable modifier="nodivider">
                    <label class="left">
                        <ons-radio name="tipo" input-id="${index + 1}"></ons-radio>
                    </label>
                    <label for="${index + 1}" class="center">
                        ${texto}
                    </label>
                </ons-list-item>
            `).join('')}
        </ons-list>

        <ons-list-item modifier="nodivider">
            <ons-button id="botonPrograma" onclick="aplicarFiltroProveedor()" modifier="large">
                Aplicar
            </ons-button>
        </ons-list-item>
        <br><br>
        <ons-list-item modifier="nodivider">
            <ons-button id="botonPrograma" class="btnResetear" modifier="large"
                onclick="resetearFiltroProveedor();">
                <ons-icon icon="fa-trash"></ons-icon>
                Resetear
            </ons-button>
        </ons-list-item>
    </ons-list>`;

    $("#contenidoMenu").html(html);
}

function aplicarFiltroProveedor() {
    filtroProveedor = $('input[name=tipo]:checked')[0].id;
    setProveedor();
    menu.close();
}
function resetearFiltroProveedor() {
    //console.log($('input[name=tipo]:checked').val())
    if (filtroProveedor > 0) $('input[name=tipo]:checked')[0].checked = false;

    filtroProveedor = 0;
    setProveedor();
    menu.close();
}

