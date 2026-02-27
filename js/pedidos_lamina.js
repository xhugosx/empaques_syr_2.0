var tipoLamina;

//VARIABLES GLOBALES PARA VERIFICAR SI ESTA ACTIVO EL PAGE DE LA FUNCION
var tabsCargadosPL;

//CARGAR LA FUNCION DEL PAGE ACTUAL
document.addEventListener('init', function (event) {
    var page = event.target;

    if (page.id === 'pedidosLaminaMain') {
        menuPedidosLamina(); // PARA RELLENAR EL MENU DE LA PAGINA PRINCIPAL DE PEDIDOS DE LAMINA
        tipoLamina = [1, 2, 3, 4, 5]; // RENICIAR EL FILTRO PARA MOSTRAR TODOS LOS PEDIDOS DE LAMINA
        tabsCargadosPL = {
            'calendarioLamina.html': false,
            'ordenes.html': false
        };
        //alerta("Entro");
    }
    if (page.id === 'pedidosLamina') {
        setMostrarPedidosLamina();
        remover();  //EJECUTAR LA PRIMERA FUNCION PARA REELENAR LOS PEDIDOS DE LAMINA
    }
    if (page.id === 'ordenesPdf') remover();


});

// PARA EJECUTAR LAS FUCNIONES DE CADA SECCION Y NO TODOS LOS TAB
document.addEventListener('postchange', function (event) {
    const pageName = event.tabItem.getAttribute('page');

    // Solo ejecuta la función si es la primera vez que se activa este tab
    switch (pageName) {
        case 'calendarioLamina.html':
            if (!tabsCargadosPL['calendarioLamina.html']) {
                cargarCalendarioLamina();
                tabsCargadosPL['calendarioLamina.html'] = true;
            }
            break;

        case 'ordenes.html':
            if (!tabsCargadosPL['ordenes.html']) {
                setBuscarAnio();
                tabsCargadosPL['ordenes.html'] = true;
            }
            break;
    }
});


function setMostrarPedidosLaminaFecha(fecha, tipo) {
    tipo = tipo ? 1 : 2;
    oCarga("Buscando Pedidos...");
    servidor(myLink + "/php/lista_pedidos_lamina/selectDate.php?fecha=" + fecha + "&type=" + tipo,
        function (respuesta) {
            var resultado = respuesta.responseText;//respuesta del servidor
            var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'

            var cantidadTotal = arrayJson[arrayJson.length - 1];
            $('#cantidadLaminas').text(new Intl.NumberFormat().format(cantidadTotal) + " Lám.");

            listaInfinita('datospedidosLaminaFecha', 'loadingPedidosLaminaFecha', arrayJson, enlistarPedidosLamina);
            cCarga();
        }
    )
}


//FUNCION PARA REFRESCAR EL CONTENIDO DE LOS PEDIDOS DE LAMINA
function setMostrarPedidosLamina() {
    oCarga("Cargando Datos...");
    var search = $("#searchPCM").val();
    servidor(myLink + "/php/lista_pedidos_lamina/select.php?&search=" + search + "&type=" + tipoLamina + "&anio=" + anioGlobal,
        function (respuesta) {
            var resultado = respuesta.responseText;//respuesta del servidor
            var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'
            listaInfinita('datospedidosLamina', 'loadingPedidosLamina', arrayJson, enlistarPedidosLamina);
            cCarga();
        }
    );

}


//FUNCION PARA AGREGAR PEDIDOS DE LAMINA
function setAgregarPedidoLamina() {

    //funcion para bloquear el boton al tratar de registrar un pedido
    $('#btn_PL').prop('disabled', true);

    var form = $('#formPedidoLamina')[0];
    var formData = new FormData(form);

    var o_c = $('#O_CLP').val().toUpperCase();
    //var proveedor = $('#proveedorPL').val();
    var ancho = $('#anchoPL').val();
    var largo = $('#largoPL').val();
    var p_o = $('#pzas_ordenadasPL').val();
    var resistencia = $('#resistenciaPL').val();
    var papel = $('#papelPL').val();
    var fecha = $('#fechaLP').val();
    var fecha_entrega = $('#fechaLPE').val();

    if (vacio(o_c, ancho, largo, p_o, resistencia, fecha, papel, fecha_entrega))
    //if (datoVacio(o_c) && datoVacio(ancho) && datoVacio(largo) && datoVacio(p_o) && datoVacio(resistencia) && datoVacio(fecha) && datoVacio(proveedor) && datoVacio(papel) && datoVacio(fecha_entrega))
    {
        oCarga("Agregando Pedido...")
        servidorPost(myLink + "/php/lista_pedidos_lamina/add.php",
            function (respuesta) {
                if (respuesta.responseText == 1) {
                    alerta("Lamina agregada");
                    resetearPilaFunction(setMostrarPedidosLamina);
                }
                else alerta("Hubo un error al insertar - codigo ya registrado!");
                $('#btn_PL').prop('disabled', false);
                cCarga();
            }, formData);
    }

    else {
        alerta("Existen datos vacios");
        $('#btn_PL').prop('disabled', false);
    }

}

//FUNCION PARA ACTUALIZAR EL ESTADO DEL PEDIDO
function setActualizarEstadoPL(estado, o_c, cantidad, entrada) {
    oCarga("Actualizando Estado...");
    servidor(myLink + '/php/lista_pedidos_lamina/updateEntrada.php?id_lp=' + o_c + '&cantidad=' + cantidad + '&entrada=' + entrada + '&estado=' + estado,
        function (respuesta) {
            var resultado = respuesta.responseText;
            cCarga();
            if (resultado == 11 || resultado == 1) {
                alertToast("Estado Actualizado", 1000)
                setMostrarPedidosLamina();
            }
            else alerta("no se pudo actualizar" + resultado);

        }
    )
}

//PARA BUSCAR EL PEDIDO QUE SE VA A EDITAR
function setBuscarActualizarPL(search) {
    oCarga("Buscando Pedido...");
    servidor(myLink + '/php/lista_pedidos_lamina/select.php?search=' + search,
        function (respuesta) {
            var resultado = respuesta.responseText;//respuesta del servidor
            var arrayJson = resultado.split('|');
            arrayJson = JSON.parse(arrayJson[0]);
            //variable para acceder desde otra funcion
            localStorage.setItem('o_c', arrayJson.o_c);

            $('#o_c').val(arrayJson.o_c);
            //$('#proveedor').val(arrayJson.proveedor);
            $('#ancho').val(arrayJson.ancho);
            $('#largo').val(arrayJson.largo);
            $('#pzas_ordenadas').val(arrayJson.pzas_ordenadas);
            $('#resistencia').val(arrayJson.resistencia);
            $('#papel').val(arrayJson.papel);
            $('#fecha').val(arrayJson.fecha);
            $('#fecha_entrega').val(arrayJson.fecha_entrega);
            $('#observaciones').val(arrayJson.observaciones);
            if (arrayJson.caja != "") {
                $('#checkCaja')[0].checked = true;
                asignarInputCaja($('#checkCaja')[0]);
                $('#cajaLP').val(arrayJson.caja);
            }

            $('#btn_PL').prop('disabled', false);  //activar boton parapoder actualizar
            cCarga();
        }
    );
}

//PARA EDIATR LOS DATOS ACTUALES MODIFICADOS
function setActualizarPL() {

    //bloqueamos el boton para que no se ejecute dos veces, hasta que se ejecute termine de ejcutar servidor
    $('#btn_PL').prop('disabled', true);


    var form = $('#formPedidoLamina')[0];
    var formData = new FormData(form);

    //se obtiene la memoria del codigo anterio en caso de modificar el la o_c
    var o_cTemp = localStorage.getItem('o_c');

    var o_c = $('#o_c').val();
    //var proveedor = $('#proveedor').val();
    var ancho = $('#ancho').val();
    var largo = $('#largo').val();
    var p_o = $('#pzas_ordenadas').val();
    var resistencia = $('#resistencia').val();
    var papel = $('#papel').val();
    var fecha = $('#fecha').val();
    var fecha_entrega = $('#fecha_entrega').val();

    if (vacio(o_c, ancho, largo, p_o, resistencia, fecha, papel, fecha_entrega)) {
        oCarga("Editando Pedido...")
        servidorPost(myLink + "/php/lista_pedidos_lamina/update.php?&o_c=" + o_cTemp,
            function (respuesta) {
                cCarga();
                var resultado = respuesta.responseText;
                if (resultado == 1) {
                    // en caso de que si se actualice se limpia la memoria
                    localStorage.removeItem('o_c');
                    alerta("Pedido Actulizado");
                    resetearPilaFunction(setMostrarPedidosLamina);
                }
                else alerta("No se pudo actualizar debido a un error");
                $('#btn_PL').prop('disabled', false);
            }, formData);
    }

    else {
        alerta("Existen datos vacios");
        $('#btn_PL').prop('disabled', false);
    }

}

//ELIMINA EL PEDIDO Y REFRESCA LA INFORMACION
function setEliminarPL(o_c) {
    oCarga("Eliminando Pedido...")
    servidor(myLink + '/php/lista_pedidos_lamina/delete.php?o_c=' + o_c,
        function (respuesta) {
            var resultado = respuesta.responseText;
            if (resultado == 1) {
                alerta("Pedido Eliminado");
                setMostrarPedidosLamina();
            }
            else alerta("No se pudo Eliminar debido a un error");
        }
    );
}

//FUNCION PARA AGREGAR UN INPUT SI ESTA RELACIONADA A CAJAS
function asignarInputCaja(value) {
    const llenarInputCaja = $('#llenarInputCaja');

    if (value.checked) {
        // alerta("entro");
        const html = `
            <ons-card class="contenedorInputSub agrandar">
                <ons-list-item modifier="nodivider">
                    <div class="left">
                        <i class="fa-solid fa-box"></i>
                    </div>
                    <div class="center">
                        <ons-input name="caja" id="cajaLP" class="input-100" type="text" placeholder="Codigo Caja (separa por comas)" onkeyup="javascript:this.value=this.value.toUpperCase();"></ons-input>
                    </div>
                </ons-list-item>
            </ons-card>
        `;

        llenarInputCaja.html(html);
    } else {
        llenarInputCaja.empty();
        cajaGlobal = "";
    }
}


//FUNCION PARA LA LISTA INFINITA
function enlistarPedidosLamina(arrayJson) {
    let span = "";
    if (arrayJson.producto != "") {
        let cajas = (arrayJson.caja).split(",");
        let productos = (arrayJson.producto).split(",");
        let clientes = (arrayJson.cliente).split(",");

        for (let i = 0; i < cajas.length; i++) {
            span += `
                <div style="margin-top: 8px; font-size: 13px; color: #475569;">
                    <i class="fa-solid fa-box-open" style="font-size: 10px; opacity: 0.6;"></i> 
                    ${cajas[i]} ${productos[i]} - <b style="color: #1e293b;">${clientes[i]}</b>
                </div>`;
        }
    }

    const o_c = arrayJson.o_c;
    let perfil = validarPerfil();
    let accion = (perfil == "produccion")
        ? `crearMensajePL1('${arrayJson.estado}','${arrayJson.entrada}','${arrayJson.pzas_ordenadas}','${arrayJson.o_c}')`
        : `crearMensajePL('${arrayJson.estado}','${arrayJson.entrada}','${arrayJson.pzas_ordenadas}','${arrayJson.o_c}','${arrayJson.observaciones}')`;

    // Modernización del HTML
    const html1 = `
    <ons-card class="tarjeta-moderna botonPrograma" onclick="${accion}" style="padding: 15px; margin: 10px; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); border: none; cursor:pointer;">
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <div style="display: flex; align-items: center; gap: 10px;">
                ${estadosColorLamina(arrayJson.estado)} 
                <div>
                    <div style="font-size: 12px; color: #94a3b8; font-weight: bold; text-transform: uppercase;">O.C.</div>
                    <div style="font-size: 15px; font-weight: 800; color: #1e293b;">${o_c}</div>
                </div>
            </div>
            <div style="text-align: right;">
                <div style="font-size: 11px; color: #94a3b8; font-weight: 600;">FECHA</div>
                <div style="font-size: 13px; color: #475569;">${sumarDias(arrayJson.fecha, 0)}</div>
            </div>
        </div>

        <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 10px 0;">

        <div style="margin-bottom: 10px;">
            <div style="font-size: 16px; font-weight: 700; color: #334155;">
                ${esEntero(arrayJson.ancho)} X ${esEntero(arrayJson.largo)} 
                <span style="font-size: 13px; color: #64748b; font-weight: 400; margin-left: 5px;">
                    | ${arrayJson.resistencia} ${arrayJson.papel}
                </span>
            </div>
            ${span}
        </div>

        <div style="background: #f5f5f5; border-radius: 12px; padding: 10px; margin-top: 10px; display: flex; justify-content: space-between; align-items: center;">
            <div>
                ${arrayJson.entrada !== ''
            ? `<span style="font-size: 13px; color: #64748b;">Llegó: <b style="color: #0f172a;">${separator(arrayJson.entrada)}</b></span>`
            : `<span style="font-size: 13px; color: #64748b;">Entrega Est.: <b style="color: #3b82f6;">${sumarDias(arrayJson.fecha_entrega, 0)}</b></span>`
        }
                ${arrayJson.estado == 2 ? `<span style="font-size: 12px; color: #ef4444;">Faltan: ${separator(arrayJson.pzas_ordenadas - arrayJson.entrada)}</span>` : ""}
            </div>
            <div style="text-align: right;">
                <span style="background: #e2e8f0; color: #475569; padding: 4px 10px; border-radius: 20px; font-size: 15px; font-weight: 800;">
                    ${separator(arrayJson.pzas_ordenadas)} pzas
                </span>
            </div>
        </div>

        ${arrayJson.observaciones !== "" ? `
            <div style="margin-top: 12px; padding-top: 10px; border-top: 1px dashed #e2e8f0; font-size: 13px; color: #64748b;">
                <i class="fa-solid fa-comment-dots" style="margin-right: 5px; opacity: 0.5;"></i>
                <strong>Obs:</strong> ${arrayJson.observaciones}
            </div>` : ''}
    </ons-card>
    `;

    return html1;
}
function estadosColorLamina(estado) {
    // Definimos la misma configuración que en el menú para mantener coherencia
    const config = {
        1: { ico: 'fa-clock', col: '#ffa500', txt: 'BACKORDER' },
        2: { ico: 'fa-boxes-stacked', col: '#a020f0', txt: 'PARCIAL' },
        3: { ico: 'fa-check', col: '#008000', txt: 'COMPLETO' },
        4: { ico: 'fa-ban', col: '#000000', txt: 'CANCELADO' },
        5: { ico: 'fa-truck-ramp-box', col: '#ff0000', txt: 'POR ENTREGAR' }
    };

    // Buscamos el estado, si no existe ponemos uno por defecto (gris)
    const item = config[estado] || { ico: 'fa-question', col: '#cbd5e1', txt: 'S/E' };

    // Retornamos el diseño circular usando la clase badge-icon
    return `
        <div class="badge-icon" 
             style="background-color: ${item.col}; border: 1.5px solid white;" 
             title="${item.txt}">
            <i class="fa-solid ${item.ico}" style="color: white; font-size: 12px;"></i>
        </div>
    `;
}
function estadoLamina(d) {
    const estadoMap = {
        1: "BACKORDER",
        2: "PARCIAL",
        3: "COMPLETO",
        4: "CANCELADA",
        5: "POR ENTREGAR"
    };

    return estadoMap[d] || "Desconocido";
}
//te quedaste en el color 
function colorEstado(d) {
    const colorMap = {
        1: "#E8C07C",
        2: "#CE84DA",
        3: "#00A514",
        4: "#000000",
        5: "#E41926"
    };

    return colorMap[d] || "#FFFFFF"; // Color por defecto si el valor no está mapeado
}

function esEntero(numero) {
    numero = parseFloat(numero);
    return Number.isInteger(numero) ? numero + ".0" : numero;
}

//LLENAR MENU DEL FILTRO PEDIDOS LAMINA
function menuPedidosLamina() {
    // 1. Definimos la configuración de los estados en un Array
    const estados = [
        { id: 1, val: 1, txt: 'BACKORDER', col: '#ffa500', ico: 'fa-clock' },
        { id: 2, val: 2, txt: 'PARCIAL', col: '#a020f0', ico: 'fa-boxes-stacked' },
        { id: 3, val: 3, txt: 'COMPLETO', col: '#008000', ico: 'fa-check' },
        { id: 4, val: 4, txt: 'CANCELADO', col: '#000000', ico: 'fa-ban' },
        { id: 5, val: 5, txt: 'POR ENTREGAR', col: '#ff0000', ico: 'fa-truck-ramp-box' }
    ];

    // 2. Construimos el HTML base
    var html = `
    <ons-list >
        <center>
            <h4 style="color: #808fa2; font-weight: bold; margin-top: 20px;">Filtros</h4>
        </center>

        <ons-list-item>
            <div class="left"><h4 style="color: #808fa2;">Año</h4></div>
            <div class="center">
                <div class="year-input">
                    <button id="prevYear" onclick="restarAnioFiltro()">&lt;</button>
                    <input type="text" id="currentYear" readonly value="${new Date().getFullYear()}">
                    <button id="nextYear" onclick="sumarAnioFiltro()">&gt;</button>
                </div>
            </div>
        </ons-list-item>

        ${estados.map(item => `
            <ons-list-item tappable>
                <label class="left">
                    <ons-checkbox input-id="check-lamina-${item.id}" value="${item.val}" name="estadoLamina"></ons-checkbox>
                </label>
                <label for="check-lamina-${item.id}" class="center" style="display: flex; align-items: center;">
                    <div class="badge-icon" style="background: ${item.col};">
                        <i class="fa-solid ${item.ico}" style="color: white; font-size: 12px;"></i>
                    </div>
                    <span style="font-size: 14px; font-weight: 500; color: #475569;">${item.txt}</span>
                </label>
            </ons-list-item>
        `).join('')}

        <div style="padding: 20px 15px;">
            <ons-button id="botonPrograma" onclick="aplicarFiltroLamina()" modifier="large" >
                Aplicar
            </ons-button>
            
            <ons-button class="btnResetear" modifier="large quiet" onclick="resetearFiltroPedidosLamina();" 
                style="color:white; margin-top: 10px; font-weight: bold;">
                <ons-icon icon="fa-trash"></ons-icon> Resetear
            </ons-button>
        </div>
    </ons-list>`;

    $("#contenidoMenu").html(html);
}

//APLICAR FILTRO DEL MENU
function aplicarFiltroLamina() {
    var ids = document.querySelectorAll("input[name='estadoLamina']:checked");
    var a = [];
    for (var i = 0; i < ids.length; i++) {
        a += ids[i].value + ",";
    }
    tipoLamina = a.slice(0, -1); // para eliminar la ultima coma
    tipoLamina = tipoLamina.length == 0 ? [1, 2, 3, 4, 5] : tipoLamina;
    setMostrarPedidosLamina();
    menu.close();
}

//RESETEAR FILTRO DEL MENU
function resetearFiltroPedidosLamina() {

    $('input[type=checkbox]').prop('checked', false); //REINICIAR EL CHECKBOX EN FALSE
    anioGlobal = fechaActual.getFullYear(); // ASIGNAR A LA MEMORIA GLOBAL EL AÑO ACTUAL
    $('#currentYear').val(anioGlobal); // ASIGNAR AL INPUT EL AÑO ACTUAL
    tipoLamina = [1, 2, 3, 4, 5]; //REINICIAR VALORES PARA QUE BUSQUE EN TODOS
    setMostrarPedidosLamina(); //ACTUALIZAR DATOS RESETEADOS DEL FILTRO

    menu.close(); // CERRAR EL MENU LATERAL
}

function crearMensajePL1(estado, entrada, pzas_ordenadas, o_c) {
    let botones = [
        '<i class="fa-solid fa-circle" style="color: #E8C07C"></i> BACKORDER ',
        '<i class="fa-solid fa-circle" style="color: #CE84DA"></i> PARCIAL ',
        '<i class="fa-solid fa-circle" style="color: #00A514"></i> COMPLETO',
        {
            label: '<i class="fas fa-times" style="color:red"></i>&nbsp;Cancelar',
            modifier: 'destructive'
        }
    ];

    mensajeArriba('ESTADO', botones,
        function (index) {
            //console.log("Botón seleccionado:", index);
            entrada = entrada == "" ? 0 : entrada;

            // Si cancela o no selecciona nada
            if (index == 3 || index == -1) return;

            // Si el pedido está cancelado
            if (estado == 4) {
                alerta("Pedido cancelado. No se puede cambiar el estado!");
                return;
            }

            // Si está parcial o completo y quiere volver a backorder
            if ((estado == 2 || estado == 3) && index == 0) {
                alerta("No se puede regresar a Backorder desde Parcial o Completo.");
                return;
            }

            // Si el estado actual es parcial o completo (2 o 3)
            if (estado == 2 || estado == 3 || estado == 1) {
                let mensaje = `Existencia en inventario: ${entrada} de ${pzas_ordenadas}`;
                alertComfirmDato(mensaje, 'number', ['Cancelar', 'Enviar'],
                    function (inputIndex) {
                        if (inputIndex) {
                            let mess = `Se generará la siguiente Entrada:<br><br><font size="8px">${inputIndex} pza(s)</font>`;
                            alertComfirm(mess, ['Cancelar', 'Aceptar'], function (confirmIndex) {
                                if (confirmIndex) {
                                    var suma = parseInt(inputIndex) + parseInt(entrada);
                                    setActualizarEstadoPL(index + 1, o_c, suma, entrada);
                                }
                            });
                        }
                    }
                );
            }
        }
    );
}
