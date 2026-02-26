
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
    if (vacio(id, nombre, tipo)) {
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
    <ons-card class="botonPrograma" onclick="mensajeProveedor('${arrayJson.codigo}')" style="margin: 8px 10px; padding: 12px 15px; background:white">
        <div class="contenedor-flexboxLados">
            <div style="display: flex; align-items: center;">
                <div class="margen-icon">
                    <i class="fa fa-user-tie"></i>
                </div>
                <div>
                    <span class="badge-codigo">${agregarCeros(arrayJson.codigo)}</span>
                    <span class="nombre-principal" style="margin-top: 4px;">${arrayJson.nombre}</span>
                </div>
            </div>

            <div style="text-align: right;">
                ${tipoEgreso(arrayJson.tipo)}
            </div>
        </div>
    </ons-card>
    `;

    return html1;
}
function tipoEgreso(idTipo) {
    // El objeto ahora usa los números como referencia
    const config = {
        1: { nombre: 'CONSUMIBLE', clase: 'tipo-consumible', icono: 'fa-box-open' },
        2: { nombre: 'LAMINA', clase: 'tipo-lamina', icono: 'fa-layer-group' },
        3: { nombre: 'SERVICIO', clase: 'tipo-servicio', icono: 'fa-handshake' },
        4: { nombre: 'SUAJES Y GRABADOS', clase: 'tipo-suajes', icono: 'fa-stamp' },
        5: { nombre: 'MAQUILA', clase: 'tipo-maquila', icono: 'fa-industry' },
        6: { nombre: 'GASOLINA', clase: 'tipo-gasolina', icono: 'fa-gas-pump' },
        7: { nombre: 'HERRAMIENTA', clase: 'tipo-herramienta', icono: 'fa-tools' },
        8: { nombre: 'OTROS', clase: 'tipo-otros', icono: 'fa-ellipsis-h' },
        9: { nombre: 'PAGOS FIJOS', clase: 'tipo-pagos', icono: 'fa-file-invoice-dollar' }
    };

    // Buscamos por el número que llega. Si no existe (ej. llega un 10), usamos el 8 (OTROS)
    const item = config[idTipo] || config[8];

    return `
        <span class="badge-tipo ${item.clase}">
            <i class="fas ${item.icono}"></i> ${item.nombre}
        </span>
    `;
}

//FUNCION PARA EL MENU DE FILTRO DE PROVEEDORES
function menuProveedores() {
    // Definimos el mismo objeto de configuración (puedes tenerlo global)
    const config = {
        1: { nombre: 'CONSUMIBLE', clase: 'tipo-consumible', icono: 'fa-box-open' },
        2: { nombre: 'LAMINA', clase: 'tipo-lamina', icono: 'fa-layer-group' },
        3: { nombre: 'SERVICIO', clase: 'tipo-servicio', icono: 'fa-handshake' },
        4: { nombre: 'SUAJES Y GRABADOS', clase: 'tipo-suajes', icono: 'fa-stamp' },
        5: { nombre: 'MAQUILA', clase: 'tipo-maquila', icono: 'fa-industry' },
        6: { nombre: 'GASOLINA', clase: 'tipo-gasolina', icono: 'fa-gas-pump' },
        7: { nombre: 'HERRAMIENTA', clase: 'tipo-herramienta', icono: 'fa-tools' },
        8: { nombre: 'OTROS', clase: 'tipo-otros', icono: 'fa-ellipsis-h' },
        9: { nombre: 'PAGOS FIJOS', clase: 'tipo-pagos', icono: 'fa-file-invoice-dollar' }
    };

    var html = `
    <ons-list>
        <div style="text-align: center; padding: 10px 0;">
            <h4 style="color: #455A64; font-weight: bold; margin: 0;">
                <i class="fa-solid fa-filter"></i> Filtros de Proveedor
            </h4>
        </div>
        
        <ons-list-header style="background-color: transparent; font-size: 12px; font-weight: bold; color: #808fa2;">
            SELECCIONAR CATEGORÍA
        </ons-list-header>

        ${Object.keys(config).map(id => {
        const item = config[id];
        return `
            <ons-list-item tappable modifier="nodivider" class="item-filtro-proveedor">
                <label class="left">
                    <ons-radio name="tipo" input-id="${id}" value="${id}"></ons-radio>
                </label>
                <label for="${id}" class="center">
                    <div class="badge-tipo ${item.clase}" style="width: 100%; border: none; justify-content: flex-start;">
                        <i class="fas ${item.icono}" style="width: 25px; text-align: center;"></i> 
                        ${item.nombre}
                    </div>
                </label>
            </ons-list-item>
            `;
    }).join('')}

        <ons-list-item modifier="nodivider" style="margin-top: 15px;">
            <ons-button id="botonPrograma" onclick="aplicarFiltroProveedor()" modifier="large" >
                Aplicar Filtros
            </ons-button>
        </ons-list-item>

        <ons-list-item modifier="nodivider">
            <ons-button class="btnResetear" modifier="large quiet" 
                onclick="resetearFiltroProveedor();" style="color:white">
                <ons-icon icon="fa-trash"></ons-icon> Resetear
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

