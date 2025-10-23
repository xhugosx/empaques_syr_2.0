//var filtro = false;
function agregarHtmlInserto() {
    //validar si existe la variable de cantidad de insertos si no crearla
    //localStorage.setItem('insertos', 2);

    if (localStorage.getItem('insertos')) {
        let i = localStorage.getItem('insertos');
        localStorage.setItem('insertos', (parseInt(i) + 1));
    }
    else localStorage.setItem('insertos', 1);
    //console.log(localStorage.getItem('insertos'));

    let i = localStorage.getItem('insertos');

    //tomar el valor del la variable y concatenar id
    let codigoCaja = $("#pedidoCodigo").val();
    let link = myLink + "/php/lista_pedidos_inserto/idAutomatico.php?i=" + (i - 1) + "&codigo=" + codigoCaja;
    var id = null;
    servidor(link,
        function (respuesta) {
            id = respuesta.responseText;
            let html = `
                <div id="agregarInserto${i}">
                    <ons-card style="padding:0px;" class="botonPrograma">
                        <ons-list-item modifier="nodivider">
                            <div class="center">
                                <ons-input id="id${i}" type="text" class="input-100" cols="30" rows="1" placeholder="ID" disabled value="${id}"></ons-input>
                                <ons-select class="input-100" id="inserto${i}" autofocus>
                                    <option value="">Inserto</option>
                                    <option value="DIV. UNICA">DIV. UNICA</option>
                                    <option value="DIV. CORTA">DIV. CORTA</option>
                                    <option value="DIV. LARGA">DIV. LARGA</option>
                                    <option value="CAMA">CAMA</option>
                                    <option value="SUAJADO">SUAJADO</option>
                                    <option value="BASE">BASE</option>
                                    <option value="SEPARADOR">SEPARADOR</option>
                                </ons-select>

                                <ons-select class="input-100" id="resistencia${i}">
                                    <option value="" style="color: #ccc;">Resistencia</option>
                                    <option value="MICRO">MICRO</option>
                                    <option value="S/G">S/G</option>
                                    <option value="21 ECT ESP">21 ECT ESP</option>
                                    <option value="21 ECT">21 ECT</option>
                                    <option value="23 ECT">23 ECT</option>
                                    <option value="26 ECT">26 ECT</option>
                                    <option value="32 ECT">32 ECT</option>
                                    <option value="38 ECT">38 ECT</option>
                                    <option value="42 ECT">42 ECT</option>
                                    <option value="51 ECT">51 ECT</option>
                                    <option value="61 ECT">61 ECT</option>
                                    <option value="71 ECT">71 ECT</option>
                                </ons-select>
                                <br><br>

                                <ons-input id="cantidad${i}" type="number" class="input-100" cols="30" rows="1" placeholder="Cantidad"></ons-input>
                                <br><br><br>

                                <ons-input id="notas${i}" type="text" class="input-100" cols="30" rows="1" placeholder="Notas (opcional)"></ons-input>
                            </div>
                        </ons-list-item>
                    </ons-card>
                </div>
            `;

            $("#insertos").append(html);
        }
    );

    //mandar html al div
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

    let html = `<ons-card style="padding:0 0 5px 0;" class="botonPrograma opacity100" onclick="">
    <ons-list-header style="background-color: white;">
        ${arrayJson.id_caja}&emsp; <b style="color: green;">${sumarDias(arrayJson.fecha_entrega, 0)}</b>
    </ons-list-header>
    <ons-list-item modifier="nodivider">
        <div class="left">
            <strong>${arrayJson.codigo_caja}</strong>
        </div>
        <div class="center romperTexto">
            <span class="list-item__title">
                ${arrayJson.nombre_producto}
            </span>
            <span class="list-item__subtitle">
                <span>
                    ${arrayJson.nombre_cliente}
                </span>
            </span>
        </div>
    </ons-list-item>
    <hr>`;
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
