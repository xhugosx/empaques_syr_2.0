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
    var span = "";
    if (arrayJson.producto != "") {
        var cajas = (arrayJson.caja).split(",");
        var productos = (arrayJson.producto).split(",");
        var clientes = (arrayJson.cliente).split(",");
        for (var i = 0; i < cajas.length; i++) {
            span += "<hr>" + cajas[i] + ' ' + productos[i] + ' - <b>' + clientes[i] + '</b> <br>';
        }
    }

    const o_c = arrayJson.o_c;
    let perfil = validarPerfil();
    let accion = "";
    if (perfil == "produccion") accion = `crearMensajePL1('${arrayJson.estado}','${arrayJson.entrada}','${arrayJson.pzas_ordenadas}','${arrayJson.o_c}')`;
    else accion = `crearMensajePL('${arrayJson.estado}','${arrayJson.entrada}','${arrayJson.pzas_ordenadas}','${arrayJson.o_c}','${arrayJson.observaciones}')`;
    const html1 = `
  <ons-card style="padding:0px;" class="botonPrograma" onclick="${accion}">
    <ons-list-header style="background:${colorEstado(arrayJson.estado)}; color:white;">
      ${arrayJson.entrada !== '' ? `<div class="contenedorHead" style="color:${colorEstado(arrayJson.estado)};">llego: ${separator(arrayJson.entrada)} pzas ${arrayJson.estado == 2 ? ` - faltan: ${separator(arrayJson.pzas_ordenadas - arrayJson.entrada)} pzas` : ""} </div>` : `<div class="contenedorHeadFecha" style="color:white;">Estimado: ${sumarDias(arrayJson.fecha_entrega, 0)}</div>`}
      
      ${estadoLamina(arrayJson.estado)} |
      ${sumarDias(arrayJson.fecha, 0)}
    </ons-list-header>
    <ons-list-item modifier="nodivider">
      <div class="left">
        <strong>${o_c}</strong>
      </div>
      <div class="center">
        <span class="list-item__title">${esEntero(arrayJson.ancho)} X ${esEntero(arrayJson.largo)} | <b>${arrayJson.resistencia} ${arrayJson.papel}</b></span>
        <span class="list-item__subtitle">
            ${arrayJson.producto !== "" ? span : ""}
            ${arrayJson.observaciones !== "" ? '<hr><div style="font-size:14px"><strong> Observaciones: </strong>&nbsp;' + arrayJson.observaciones + '</div>' : ''}
        </span>
      </div>
      <div class="right">
        <div class="centrar">
          <span class="notification"><font size="2px">${separator(arrayJson.pzas_ordenadas)} pza(s)</font></span>
        </div>
      </div>
      <div>hola</div>
      </ons-list-item>
      </ons-card>
      
`;

    return html1;

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
    var html = `<ons-list>
                    <center>
                        <h4 style="color: #808fa2; font-weight: bold;">
                            Filtros
                        </h4>
                    </center>
                    <ons-list>
                        <ons-list-item>
                            <div class="left">
                                <h4 style="color: #808fa2;">

                                    Año
                                </h4>
                            </div>
                            <div class="center">
                                <div class="year-input">

                                    <button id="prevYear" onclick="restarAnioFiltro()">&lt;</button>
                                    <input type="text" id="currentYear" readonly>
                                    <button id="nextYear" onclick="sumarAnioFiltro()">&gt;</button>
                                </div>
                            </div>
                        </ons-list-item>
                    </ons-list>
                    <ons-list>
                        <ons-list-item tappable>
                            <label class="left">
                                <ons-checkbox input-id="check-1" value="1" name="estadoLamina"></ons-checkbox>
                            </label>
                            <label for="check-1" class="center">
                                🟠 BACKORDER
                            </label>
                        </ons-list-item>
                        <ons-list-item tappable>
                            <label class="left">
                                <ons-checkbox input-id="check-2" value="2" name="estadoLamina"></ons-checkbox>
                            </label>
                            <label for="check-2" class="center">
                                🟣 PARCIAL
                            </label>
                        </ons-list-item>
                        <ons-list-item tappable>
                            <label class="left">
                                <ons-checkbox input-id="check-3" value="3" name="estadoLamina"></ons-checkbox>
                            </label>
                            <label for="check-3" class="center">
                                🟢 COMPLETO
                            </label>
                        </ons-list-item>
                        <ons-list-item tappable>
                            <label class="left">
                                <ons-checkbox input-id="check-4" value="4" name="estadoLamina"></ons-checkbox>
                            </label>
                            <label for="check-4" class="center">
                                ⚫ CANCELADO
                            </label>
                        </ons-list-item>
                        <ons-list-item tappable>
                            <label class="left">
                                <ons-checkbox input-id="check-5" value="5" name="estadoLamina"></ons-checkbox>
                            </label>
                            <label for="check-5" class="center">
                                🔴 POR ENTREGAR
                            </label>
                        </ons-list-item>
                    </ons-list>
                    <ons-list-item modifier="nodivider">
                        <ons-button id="botonPrograma" onclick="aplicarFiltroLamina()" modifier="large">
                            Aplicar
                        </ons-button>
                    </ons-list-item>
                    <br><br><ons-list-item modifier="nodivider">
                        <ons-button id="botonPrograma" class="btnResetear" modifier="large"
                            onclick="resetearFiltroPedidosLamina();">
                            <ons-icon icon="fa-trash"></ons-icon>
                            Resetear
                        </ons-button>
                    </ons-list-item>


                </ons-list>
            `;
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
