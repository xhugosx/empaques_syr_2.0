//var filtro = false;
function agregarHtmlInserto() {
    if (localStorage.getItem('insertos')) {
        let i = localStorage.getItem('insertos');
        localStorage.setItem('insertos', (parseInt(i) + 1));
    } else {
        localStorage.setItem('insertos', 1);
    }

    let i = localStorage.getItem('insertos');
    let codigoCaja = $("#pedidoCodigo").val();
    let link = myLink + "/php/lista_pedidos_inserto/idAutomatico.php?i=" + (i - 1) + "&codigo=" + codigoCaja;

    servidor(link, function (respuesta) {
        let id = respuesta.responseText;

        // Estructura dinámica con las mismas clases del formulario principal
        let html = `
            <div id="agregarInserto${i}" class="bloque-inserto">
                <ons-card class="card-sub">
                    <div class="card-sub-header"> 
                        <i class="fa-solid fa-box-open"></i> CONFIGURACIÓN DE INSERTO #${i}
                    </div>

                    <ons-card class="contenedorInputSub gris">
                        <ons-list-item modifier="nodivider">
                            <div class="left"><i class="fa-regular fa-key"></i></div>
                            <div class="center">
                                <ons-input id="id${i}" class="input-100" placeholder="ID" disabled value="${id}"></ons-input>
                            </div>
                        </ons-list-item>
                    </ons-card>

                    <ons-card class="contenedorInputSub">
                        <ons-list-item modifier="nodivider">
                            <div class="left"><i class="fa-solid fa-puzzle-piece"></i></div>
                            <div class="center">
                                <ons-select class="input-100" id="inserto${i}">
                                    <option value="">TIPO DE INSERTO</option>
                                    <option value="JUEGO DIV.">JUEGO DIV.</option>
                                    <option value="DIV. UNICA">DIV. UNICA</option>
                                    <option value="DIV. CORTA">DIV. CORTA</option>
                                    <option value="DIV. LARGA">DIV. LARGA</option>
                                    <option value="CAMA">CAMA</option>
                                    <option value="SUAJADO">SUAJADO</option>
                                    <option value="BASE">BASE</option>
                                    <option value="SEPARADOR">SEPARADOR</option>
                                </ons-select>
                            </div>
                        </ons-list-item>
                    </ons-card>

                    <ons-card class="contenedorInputSub">
                        <ons-list-item modifier="nodivider">
                            <div class="left"><i class="fa-solid fa-shield-halved"></i></div>
                            <div class="center">
                                <ons-select class="input-100" id="resistencia${i}">
                                    <option value="">RESISTENCIA</option>
                                    <option value="MICRO">MICRO</option>
                                    <option value="S/G">S/G</option>
                                    <option value="21 ECT">21 ECT</option>
                                    <option value="32 ECT">32 ECT</option>
                                    <option value="42 ECT">42 ECT</option>
                                </ons-select>
                            </div>
                        </ons-list-item>
                    </ons-card>

                    <ons-card class="contenedorInputSub">
                        <ons-list-item modifier="nodivider">
                            <div class="left"><i class="fa-solid fa-hashtag"></i></div>
                            <div class="center">
                                <ons-input id="cantidad${i}" type="number" class="input-100" placeholder="CANTIDAD"></ons-input>
                            </div>
                        </ons-list-item>
                    </ons-card>

                    <ons-card class="contenedorInputSub">
                        <ons-list-item modifier="nodivider">
                            <div class="left"><i class="fa-solid fa-pen-to-square"></i></div>
                            <div class="center">
                                <ons-input id="notas${i}" class="input-100" placeholder="Notas (opcional)"></ons-input>
                            </div>
                        </ons-list-item>
                    </ons-card>
                </ons-card>
            </div>
        `;

        $("#insertos").append(html);
    });
}

function retrocederInserto() {
    if (localStorage.getItem('insertos')) {
        let i = localStorage.getItem('insertos');
        localStorage.setItem('insertos', (parseInt(i) - 1));

        if (localStorage.getItem('insertos') == 0) localStorage.removeItem('insertos');

        $("#agregarInserto" + i).remove();

    }
}
function limpiarLocalStorage() {
    localStorage.removeItem('insertos');
}


// FUNCION PARA AGREGAR EL PEDIDO DE INSERTO DESDE EL PEDIDO DE CAJA 
function setAgregarPedidoInserto(...datos) {
    //console.log(myLink + "/php/lista_pedidos_inserto/add.php?codigo=" + datos[0] + "&resistencia=" + datos[1] + "&cantidad=" + datos[2] + "&observaciones=" + datos[3] + "&fecha_oc=" + datos[4] + "&notas=" + datos[5] + "&idCaja=" + datos[6]+"&ids="+datos[7]);
    servidor(myLink + "/php/lista_pedidos_inserto/add.php?codigo=" + datos[0] + "&resistencia=" + datos[1] + "&cantidad=" + datos[2] + "&observaciones=" + datos[3] + "&fecha_oc=" + datos[4] + "&notas=" + datos[5] + "&idCaja=" + datos[6] + "&ids=" + datos[7],
        function (respuesta) {
            var resultado = respuesta.responseText;
            if (resultado != 1) alerta("no se pudo inserto");
        }
    );
}

//FUNCION PARA NUEVO CONSULTA DE PEDIDOS INSERTOS
function setPedidosInsertos() {
    oCarga("Cargando Datos...");
    //$("#datosPedidosInsertosLoading").empty().append("<ons-progress-bar indeterminate></ons-progress-bar>");
    var busqueda = $('#searchPedidoInserto').val();
    //console.log(myLink + "/php/lista_pedidos_inserto/select.php?search=" + busqueda + "&filtro=" + filtroGlobal + "&estado=" + estadoGlobal + "&anio=" + anioGlobal);
    servidor(myLink + "/php/lista_pedidos_inserto/select.php?search=" + busqueda + "&filtro=" + filtroGlobal + "&estado=" + estadoGlobal + "&anio=" + anioGlobal,
        function (respuesta) {
            var resultado = respuesta.responseText;//respuesta del servidor
            var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'

            $('#todoPedidosInsertos').attr("badge", arrayJson.length - 1);

            listaInfinita('datosPedidosInsertos', 'datosPedidosInsertosLoading', arrayJson, enlistarPedidosInsertos);
            cCarga();
        }
    );
}


// FUNCION PARA ELIMINAR EL PEDIDO DEL INSERTO
function setEliminarPedidoInserto(id) {
    oCarga("Eliminado Inserto...");
    servidor(myLink + "/php/lista_pedidos_inserto/delete.php?id=" + id,
        function (respuesta) {
            cCarga();
            if (respuesta.responseText == 1) {
                alerta("Pedido Eliminado");
                setPedidosInsertos();
            }
            else alerta("Hubo un error al tratar de eliminar el Pedido...");
        }
    );
}

// FUNCION PARA BUSCAR EL PEDIDO DE INSERTO QUE SE VA A MODIFICAR
function setModificarBuscarPedidoInserto(id) {
    oCarga("Buscando Inserto...");
    servidor(myLink + "/php/lista_pedidos_inserto/selectAllEditar.php?id=" + id,
        function (respuesta) {
            var resultado = respuesta.responseText;//respuesta del servidor
            var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'
            arrayJson[0] = JSON.parse(arrayJson[0]);

            //asignar datos encontrados a inputs de insertos
            $('#id').val(arrayJson[0].id);
            $("#inserto").val(arrayJson[0].observaciones);
            $("#resistencia").val(arrayJson[0].resistencia);
            $("#cantidad").val(arrayJson[0].cantidad);
            $("#notas").val(arrayJson[0].notas);
            cCarga();
        }
    );

}

//FUNCION PARA MODIFICAR EL PEDIDO INSERTO
function setModificarPedidoInserto() {
    var id = $("#id").val();
    var observaciones = $("#inserto").val();
    var resistencia = $("#resistencia").val();
    var cantidad = $("#cantidad").val();
    var notas = $("#notas").val().toUpperCase();

    if (vacio(resistencia, cantidad, observaciones)) {
        oCarga("Editando Inserto...");
        servidor(myLink + "/php/lista_pedidos_inserto/update.php?resistencia=" + resistencia + "&cantidad=" + cantidad + "&id=" + id + "&observaciones=" + observaciones + "&notas=" + notas,
            function (respuesta) {
                cCarga();
                if (respuesta.responseText == 1) {
                    alerta("Pedido Actualizado");
                    resetearPilaFunction(setPedidosInsertos);
                }
                else alerta("Hubo un error al tratar de modificar el Pedido...");
            }
        )
    }
    else alerta('Espacios Vacios! <br>(No escribir "CEROS")')

}

//funcion para actualizar el estado del pedido de los insertos
function setActualizarEstadoPedidoInserto(datos) {
    var procesos = "";
    for (var i = 0; i < 11; i++) {
        if ($('#check' + (i + 1)).prop('checked')) procesos += (i + 1) + ",";
    }

    if (procesos != "") alerta("Deselecciona los procesos para TERMINAR SIN PROCESO");
    else {
        alertComfirm('Estas seguro de Mandar este pedido a "TERMINADO SIN PROCESOS" ?', ["Aceptar", "Cancelar"],
            function (index) {
                if (index == 0) {
                    cerrarDialogo('my-dialog-programa1');
                    oCarga("Actualizando Estado...")
                    let id = datos[0];
                    let estado = datos[1];

                    servidor(myLink + "/php/lista_pedidos_inserto/updateEstado.php?id=" + id + "&estado=" + estado,
                        function (respuesta) {
                            if (respuesta.responseText == 1) {
                                alerta("Estado Actualizado");
                                buscarDtospedidos();
                                cCarga();
                                //$('#facturaF').val("");
                                //$('#cantidadF').val("");
                                //hideDialogo('my-dialogAgregarFactura')
                            }
                            else alerta("Hubo un error al tratar de modificar el Estado...");
                        }
                    );
                }
            }
        );

    }

}

//nueva funcion para enlistar de una nueva forma...
function enlistarPedidosInsertos(arrayJson) {

    let html = `
    <ons-card class="botonPrograma pedido-card opacity100" style="padding:0 0 8px 0;">
        <div class="pedido-header">
            <div class="header-left">
                <span class="pedido-id">ID Caja: #${arrayJson.id_caja}</span>
            </div>
            <b class="pedido-entrega-status" style="color: #3d794b;">
                Entrega: ${sumarDias(arrayJson.fecha_entrega, 0)}
            </b>
        </div>

        <ons-list-item modifier="nodivider" class="pedido-item">
            <div class="left">
                <span class="badge-codigo">${arrayJson.codigo_caja}</span>
            </div>
            <div class="center">
                <div class="pedido-info-principal">
                    <span class="pedido-titulo">${arrayJson.nombre_producto}</span>
                    <span class="pedido-cliente-nombre">${arrayJson.nombre_cliente}</span>
                </div>
            </div>
        </ons-list-item>

        <div class="divisor-insertos">Insertos relacionados</div>
    `;
    arrayJson.insertos.forEach(inserto => {
        let perfil = validarPerfil();
        let accion = "";
        if (perfil != "produccion") accion = `crearObjetMensajePedidoInserto('${inserto.id}','${inserto.estado}')`;
        html += `
        <ons-card class="botonPrograma opacity50" onclick="${accion}"
            style="padding:0; margin-bottom: 5px; border: 1px solid black;">
            <ons-list-item modifier="nodivider">
                <div class="left" style="font-size:8pt">
                    ${estadosColor(inserto.estado)} ${inserto.id}
                </div>
                <div class="center">
                    <span class="list-item__title">
                        <b>${inserto.observaciones}</b> | <span style="font-size:9pt">${inserto.resistencia}</span>
                    </span>
                    ${inserto.notas == "" ? `` : `
                        <span class="list-item__subtitle">
                            <i style="color: rgb(115, 168, 115)" class="fa-solid fa-comment-dots"></i>
                            <b>${inserto.notas}</b>
                        </span>`
            }
                </div>
                <div class="right" style="white-space: nowrap;"><b>${separator(inserto.cantidad)} pzas</b></div>
            </ons-list-item>
        </ons-card>`;
    });
    html += `</ons-card>`;


    return html;
}
