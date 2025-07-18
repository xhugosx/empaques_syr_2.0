var idPedido = "";

//VARIABLE GLOBAL PARA TAB DE PEDIDOS DE INSERTOS
let tabPedidoInserto;
document.addEventListener('init', function (event) {
    var page = event.target;
    if (page.id === 'programaCajas') {
        setMostrarProgramaCaja();
        tabPedidoInserto = false;
    }
});

document.addEventListener('postchange', function (event) {
    const pageName = event.tabItem.getAttribute('page');
    // Solo ejecuta la función si es la primera vez que se activa este tab
    switch (pageName) {

        case 'programaInsertos.html':
            if (!tabPedidoInserto) {
                setMostrarProgramaInserto();
                tabPedidoInserto = true;
            }
            break;
    }
});

//FUNCION NUEVA PARA MOSTRAR PEDIDOS CAJAS 
function setMostrarProgramaCaja() {
    oCarga("Cargando Datos...");
    let busqueda = $('#searchProgramaCaja').val();
    let url = myLink + "/php/programa/selectP.php?search=" + busqueda;
    servidor(url,
        function (respuesta) {
            var resultado = respuesta.responseText;//respuesta del servidor
            var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'

            listaInfinita('datosProgramaCajas', '', arrayJson, enlistarprogramaCaja);
            cCarga();
        }
    );
}

//FUNCION NUEVA PARA MOSTRAR PEDIDOS CAJAS 
function setMostrarProgramaInserto() {
    oCarga("Cargando Datos...");
    let busqueda = $('#searchProgramaInserto').val();
    let url = myLink + "/php/programa/selectPI.php?search=" + busqueda;
    servidor(url,
        function (respuesta) {
            var resultado = respuesta.responseText;//respuesta del servidor
            var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'

            listaInfinita('datosProgramaInsertos', '', arrayJson, enlistarProgramaInserto);
            cCarga();
        }
    );
}

//funcion para actualizar estado de un producto
function setActualizarEstado(id, estado) {
    oCarga("Editando Estado...");
    //console.log(myLink + '/php/programa/updateEstado.php?id=' + id + '&estado=' + estado);
    servidor(myLink + '/php/programa/updateEstado.php?id=' + id + '&estado=' + estado,
        function (respuesta) {
            cCarga();
            if (respuesta.responseText == "1") {
                alertToast('Actualizado!', 1000);
                setMostrarProgramaCaja();
                setMostrarProgramaInserto();
            }
            else alertToast('Proceso actual!', 1000);
        }
    );
}

//FUNCION PARA ELIMINAR DEL PROGRAMA
function setEliminarPrograma(id) {
    oCarga("Eliminando del programa...");
    servidor(myLink + '/php/programa/delete.php?id=' + id,
        function (respuesta) {
            cCarga();
            if (respuesta.responseText == "1") {
                alerta("Se ha eliminado del programa");
                setMostrarProgramaCaja();
                setMostrarProgramaInserto();
            }
            else alerta("No se pudo eliminar!");
        }
    );
}

//FUNCION PARA LLENAR DATOS AL DIALOGO DEL PROGRMA AY ACTUALIZAR LOS PROCESOS
function setLlenarProcesoPrograma(datos) {
    oCarga("Buscando datos a actualizar...");
    //se detiene un poco para mostrar el modal antes de dialog
    let id = datos[0];
    let tipo = datos[1];
    servidor(myLink + "/php/programa/selectProcesos.php?id=" + id,
        function (respuesta) {
            var resultado = respuesta.responseText;
            const arrayJson = resultado.split('|');

            if (tipo == 1) Abrirdialogo('my-dialog-programa', 'dialogPrograma.html', id);
            else Abrirdialogo('my-dialog-programa1', 'dialogPrograma1.html', id);

            setTimeout(() => {
                for (var i = 0; i < arrayJson.length - 2; i++) {
                    arrayJson[i] = JSON.parse(arrayJson[i]); //convertimos los jsonText en un objeto json

                    $('#check' + arrayJson[i].proceso).prop("checked", "true");
                    //alert('#check'+arrayJson[i].proceso);
                }
                if (tipo == 1) $("#botonProgramaSinproceso").prop("disabled", true); // desactivamos el boton de terminado sin procesos
                else $("#botonProgramaSinproceso1").prop("disabled", true); // desactivamos el boton de terminado sin procesos
                cCarga();
            }, 100);

        }
    );

}


function setProcesosProgramaEntradaPedido(id, cantidad) {
    //id es id de lista de pedidos
    var codigo = id.split("-");
    let link = "";
    if (codigo[0].length >= 7)
        link = myLink + '/php/programa/procesosEntradaProgramaPedido.php?id=' + id + '&cantidad=' + cantidad;
    else
        link = myLink + '/php/programa/procesosEntradaProgramaPedidoInserto.php?id=' + id + '&cantidad=' + cantidad;
    oCarga("Agregando a inventario...");
    servidor(link,
        function (respuesta) {
            if (respuesta.responseText == 1) {
                alertToast("Se agrego a inventario", 1000);
                if (codigo[0].length >= 7) setMostrarProgramaCaja();
                else setMostrarProgramaInserto();
            }
            else alerta("Hubo un error");
            cCarga();
        }
    )
}

//FUNCION PARA AGREGAR PEDIDOS DE FALTANTES 
function setAgregarFaltante(id, restante) {
    var codigo = id.split("-");
    let link = "";
    if (codigo[0].length >= 7)
        link = myLink + '/php/lista_pedidos/add-f.php?id=' + id + '&cantidad=' + restante;
    else
        link = myLink + '/php/lista_pedidos_inserto/add-f.php?id=' + id + '&cantidad=' + restante;
    oCarga("Agregando faltante a Pedidos...");
    //console.log(link)
    servidor(link,
        function (respuesta) {
            cCarga();
            respuesta = respuesta.responseText;
            if (respuesta == 1) alerta("Pedido Agregado!");
            else alerta("Hubo un error!");
            //console.log(respuesta);
        }
    )
}


function agregaProgramaSinProceso() {
    var procesos = "";
    for (var i = 0; i < 11; i++) {
        if ($('#check' + (i + 1)).prop('checked')) procesos += (i + 1) + ",";
    }

    if (procesos != "") alerta("Deselecciona los procesos para TERMINAR SIN PROCESO");
    else {
        alertComfirm('Estas seguro de Mandar este pedido a "TERMINADO SIN PROCESOS" ?', ["Aceptar", "Cancelar"],
            function (index) {
                if (index == 0) {
                    setActualizarEstadoPedido([idPedido, 3]);
                    cerrarDialogo('my-dialog-programa');
                }
            }
        );

    }


}
function setagregarPrograma(id) {

    var procesos = "";
    for (var i = 0; i < 11; i++) {
        if ($('#check' + (i + 1)).prop('checked')) procesos += (i + 1) + ",";
    }

    if (procesos != "") {
        let _id = id.split("-");
        if (_id[0].length == 7) cerrarDialogo('my-dialog-programa');
        else cerrarDialogo('my-dialog-programa1');
        oCarga("Agregando al programa...");
        servidor(myLink + '/php/programa/add.php?id=' + id + '&procesos=' + procesos,
            function (respuesta) {
                if (respuesta.responseText == 1) {
                    alerta("Producto agregado al programa");
                    cCarga();
                    buscarDtospedidos();
                    //console.log(respuesta.responseText);
                }
                else alerta('Hubo un error al insertar!' + respuesta.responseText);


                limpiarSelectPrograma();
            }
        );
    }
    else alerta("No haz seleccionado nigun proceso");

    //console.log(myLink+'/php/programa/add.php?id='+id+'&procesos='+procesos);
}

function limpiarSelectPrograma() {
    for (var i = 0; i < 11; i++) {
        $('#check' + (i + 1)).val([])
    }
}

//FUNCIONES NUEVAS PARA MOSTRAR PROGRAMA DE INSERTOS
function enlistarProgramaInserto(arrayJson) {
    //console.log(arrayJson);

    let html = `<ons-card style="padding:0 0 5px 0;" class="botonPrograma opacity100">
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
        let procesos = "";
        let opcionesProcesos = "";
        let idsProcesos = "";
        inserto.programa.forEach(programa => {
            procesos += `<div style="padding:0; margin-bottom: 5px;"><span class="proceso proceso-${procesoProgramaEstado(programa.estado)}">
                            ${procesoProgramaEstadoIcon(programa.estado)} ${procesosPrograma(programa.proceso)}
                    </span></div>`;
            opcionesProcesos += `${programa.proceso},`;
            idsProcesos += `${programa.id},`;
        });

        html += `
        <ons-card class="botonPrograma opacity50" onclick="opcionesPrograma('${inserto.id}', [${idsProcesos}], [${opcionesProcesos}], ${inserto.cantidad})"
            style="padding:0; margin-bottom: 5px; border: 1px solid black;">
            <ons-list-item modifier="nodivider">
                <div class="left" style="font-size:8pt">
                    ${inserto.id}
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
            <hr>
                <div style="margin: 5px 6px 0 6px; display: flex; flex-wrap: wrap; gap: 5px;">
                ${procesos}
                </div>
        </ons-card>`;
    });
    html += `</ons-card>`;


    return html;

}

//FUNCIONES NUEVA PARA MOSTRAR PROGRAMA CAJAS
function enlistarprogramaCaja(arrayJson) {
    let procesos = "";
    let opcionesProcesos = "";
    let idsProcesos = "";
    arrayJson.programa.forEach(programa => {
        procesos += `
            <span class="proceso proceso-${procesoProgramaEstado(programa.estado)}">
            ${procesoProgramaEstadoIcon(programa.estado)} ${procesosPrograma(programa.proceso)}
            </span>
        `;
        opcionesProcesos += `${programa.proceso},`;
        idsProcesos += `${programa.id},`;
    });

    let html = `
            <ons-card style="padding:0px;" class="botonPrograma" onclick="opcionesPrograma('${arrayJson.id}',[${idsProcesos}],[${opcionesProcesos}],${arrayJson.cantidad})">

                <ons-list-header style="background-color: rgba(255, 255, 255, 0);">
                    ${arrayJson.id} &emsp;
                    <span style="color: rgb(115, 168, 115)">&emsp;<b>Fecha Entrega:</b> ${sumarDias(arrayJson.fecha_entrega, 0)}</span>
                </ons-list-header>

                <ons-list-item modifier="nodivider">
                    <div class="left">
                        <strong>${arrayJson.codigo}</strong>
                    </div>

                    <div class="center romperTexto">
                        <span class="list-item__title">
                            ${arrayJson.producto}&nbsp;|&nbsp;<b style="color:#404040">${arrayJson.resistencia}</b>
                        </span>

                        <span class="list-item__subtitle">
                            <span>${arrayJson.cliente}</span><br>
                            <hr>
                            <!-- 🧩 PROCESOS -->
                            <div style="margin-top: 5px; display: flex; flex-wrap: wrap; gap: 5px;">
                                ${procesos}
                            </div>
                        </span>
                    </div>

                    <div class="right">
                        <div class="centrar">
                            <b style="font-size:16px; white-space: nowrap;">
                                ${arrayJson.cantidad} <span style="font-size:14px;">pzas</span>
                            </b>

                        </div>
                    </div>
                </ons-list-item>
            </ons-card>`;

    return html
}

//NUEVO CODIGO, DEL PROGRAMA NUEVO
function opcionesPrograma(id_lp, id, procesos, piezas) {
    //console.log(procesos,id_lp,id,piezas);
    let botones = [];

    procesos.forEach(proceso => {
        botones.push(procesosProgramaIcon(proceso) + procesosPrograma(proceso));
    });
    botones.push(
        '<span style="color: green !important"><i class="fas fa-check-circle" style="color: green"></i>&nbsp;Finalizar</span>',
        {
            label: '<i class="fas fa-trash" style="color:red"></i>&nbsp;Eliminar',
            modifier: 'destructive'
        }
    );
    let cantidad = botones.length - 1; // se saca la cantidad de botones, para mandar dicha funcion
    mensajeArriba("Modificar Proceso", botones,
        function (i) {
            //console.log(index, cantidad);

            if (i == cantidad - 1) {
                alertComfirmDato("Cantidad total hechas (pzs)", "number", ["Cancelar", "Agregar"],
                    function (dato) {
                        if (dato && dato != "" && dato != 0) {
                            alertConfirm('Estas Seguro de mandar <hr><b style="font-size:20pt">' + dato + ' Pzas.</b>', ["Cancelar", "Aceptar"],
                                function (i) {
                                    if (i)
                                        if (dato < piezas)
                                            alertConfirm("La cantidad es menor a la del pedido, deseas crear un pedido de faltante?", ["NO", "SI"],
                                                function (j) {
                                                    //if (j) alerta("Se mandara pedido a faltantes...");

                                                    if (j) {
                                                        let restante = piezas - dato;
                                                        setAgregarFaltante(id_lp, restante);
                                                    }
                                                    setProcesosProgramaEntradaPedido(id_lp, dato);
                                                    //else alerta("No se mando nada");
                                                });
                                        else if (i != -1) setProcesosProgramaEntradaPedido(id_lp, dato);
                                    //console.log(index);
                                })
                        }
                        else if (dato == "" || dato == 0) alerta("Agrega un inventario valido!...", "No se envio nada");
                        //alerta("DATO: " + input);
                    });
            }
            else if (i == cantidad)
                alertConfirm("Esta seguro de eliminar este pedido del programa?",
                    ["NO", "SI"],
                    function (k) {
                        if (k) setEliminarPrograma(id_lp);
                    }
                );
            else if (i != -1)
                mensajeArriba("Editar Estado", [
                    '🕓 Pendiente',
                    '👷 Proceso',
                    '✅ Terminado',
                    {
                        label: '<i class="fas fa-times" style="color:red"></i>&nbsp;Cancelar',
                        modifier: 'destructive'
                    }],
                    function (j) {
                        if (j != 3 && j != -1) setActualizarEstado(id[i], j);
                    }
                );
        }
    )
}

function procesosPrograma(estado) {
    let proceso = [
        "Flexo",
        "Pegado",
        "Impresión",
        "Suajado",
        "Cortadora",
        "Caiman",
        "Cortadora (2)",
        "Ranuradora",
        "Armado",
        "Suajado (2)",
        "Proveedor"
    ];
    return proceso[estado - 1];
}
function procesosProgramaIcon(estado) {
    let proceso = [
        '<i class="fas fa-gear"></i>&nbsp;',
        '<i class="fas fa-droplet"></i>&nbsp;',
        '<i class="fas fa-bucket"></i>&nbsp;',
        '<i class="fas fa-scissors"></i>&nbsp;',
        '<i class="fas fa-screwdriver-wrench"></i>&nbsp;',
        '<i class="fas fa-grip-lines"></i>&nbsp;',
        '<i class="fas fa-screwdriver-wrench"></i>&nbsp;',
        '<i class="fas fa-grip-lines"></i>&nbsp;',
        '<i class="fas fa-list-ol"></i>&nbsp;',
        '<i class="fas fa-scissors"></i>&nbsp;',
        '<i class="fas fa-user-tie"></i>&nbsp;'
    ];
    return proceso[estado - 1];
}
//AQUI TERMINA LAS FUNCIONES DE CAJA

function procesoProgramaEstadoIcon(dato) {
    let estado = [
        '🕓',
        '👷',
        '✅'
    ]
    return estado[dato];
}
function procesoProgramaEstado(dato) {
    let estado = [
        'pendiente',
        'proceso',
        'terminado'
    ]
    return estado[dato];
}

function estadoProgramaIcon(dato) {
    let estado = [
        '🚫',
        '✅'
    ]
    return estado[dato];
}


function enlistarProgramaHistorialCaja(arrayJson) {
    let procesos = "";
    //console.log(arrayJson);
    arrayJson.programa.forEach(programa => {
        procesos += `
            <span class="proceso estado-${programa.hoy}">
            ${estadoProgramaIcon(programa.hoy)} ${procesosPrograma(programa.proceso)}
            </span>
        `;
    });

    let html = `
            <ons-card style="padding:0px;" class="botonPrograma">

                <ons-list-header style="background-color: rgba(255, 255, 255, 0);">
                    ${arrayJson.id} &emsp;
                    <span style="color: rgb(115, 168, 115)">&emsp;<b>Fecha Entrega:</b> ${sumarDias(arrayJson.fecha_entrega, 0)}</span>
                </ons-list-header>

                <ons-list-item modifier="nodivider">
                    <div class="left">
                        <strong>${arrayJson.codigo}</strong>
                    </div>

                    <div class="center romperTexto">
                        <span class="list-item__title">
                            ${arrayJson.producto}&nbsp;|&nbsp;<b style="color:#404040">${arrayJson.resistencia}</b>
                        </span>

                        <span class="list-item__subtitle">
                            <span>${arrayJson.cliente}</span><br>
                            <hr>
                            <!-- 🧩 PROCESOS -->
                            <div style="margin-top: 5px; display: flex; flex-wrap: wrap; gap: 5px;">
                                ${procesos}
                            </div>
                        </span>
                    </div>

                    <div class="right">
                        <div class="centrar">
                            <b style="font-size:16px; white-space: nowrap;">
                                ${arrayJson.cantidad} <span style="font-size:14px;">pzas</span>
                            </b>

                        </div>
                    </div>
                </ons-list-item>
            </ons-card>`;

    return html
}

function enlistarProgramaHistorialInserto(arrayJson) {
    //console.log(arrayJson);

    let html = `<ons-card style="padding:0 0 5px 0;" class="botonPrograma opacity100">
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
        let procesos = "";
        inserto.programa.forEach(programa => {
            procesos += `<div style="padding:0; margin-bottom: 5px;"><span class="proceso estado-${programa.hoy}">
                            ${estadoProgramaIcon(programa.hoy)} ${procesosPrograma(programa.proceso)}
                    </span></div>`;
        });

        html += `
        <ons-card class="botonPrograma opacity50" 
            style="padding:0; margin-bottom: 5px; border: 1px solid black;">
            <ons-list-item modifier="nodivider">
                <div class="left" style="font-size:8pt">
                    ${inserto.id}
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
            <hr>
                <div style="margin: 5px 6px 0 6px; display: flex; flex-wrap: wrap; gap: 5px;">
                ${procesos}
                </div>
        </ons-card>`;
    });
    html += `</ons-card>`;


    return html;

}