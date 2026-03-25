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

function enlistarProgramaInserto(arrayJson) {
    // 1. CABECERA DE LA TARJETA PRINCIPAL (Datos de la Caja Madre)
    let html = `
    <ons-card class="botonPrograma" style="padding:0; margin: 10px 12px; border-radius: 16px; border: 1px solid #f1f5f9; box-shadow: 0 4px 10px rgba(0,0,0,0.05); background: #ffffff;">
        
        <ons-list-header class="programa-header">
            <span style="color: #64748b; font-weight: 800;"># ${arrayJson.id_caja}</span>
            <span class="fecha-verde">
                <i class="far fa-calendar-check"></i> <b>Entrega:</b> ${sumarDias(arrayJson.fecha_entrega, 0)}
            </span>
        </ons-list-header>

        <ons-list-item modifier="nodivider">
            <div class="left" >
                <div class="badge-codigo">
                    <strong>${arrayJson.codigo_caja}</strong>
                </div>
            </div>
            <div class="center">
                <div style="display: flex; flex-direction: column;">
                    <span style="font-size: 15px; font-weight: 800; color: #1e293b;">${arrayJson.nombre_producto}</span>
                    <span style="font-size: 12px; color: #64748b; margin-top: 2px;">
                        <i class="far fa-user" style="font-size: 10px;"></i> ${arrayJson.nombre_cliente}
                    </span>
                </div>
            </div>
        </ons-list-item>

        <div style="padding: 10px; background: #f8fafc; border-radius: 0 0 16px 16px;">
            <div style="font-size: 10px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">
                Contenido de Insertos:
            </div>`;

    // 2. ITERACIÓN DE LOS INSERTOS (Sub-tarjetas)
    arrayJson.insertos.forEach(inserto => {
        let procesos = "";
        let opcionesProcesos = "";
        let idsProcesos = "";

        inserto.programa.forEach(programa => {
            procesos += `
                <span class="proceso proceso-${procesoProgramaEstado(programa.estado)}" style="margin-bottom: 0;">
                    ${procesoProgramaEstadoIcon(programa.estado)} ${procesosPrograma(programa.proceso)}
                </span>`;
            opcionesProcesos += `${programa.proceso},`;
            idsProcesos += `${programa.id},`;
        });

        let perfil = validarPerfil();
        let accion = (perfil == "produccion")
            ? `opcionesPrograma1([${idsProcesos}],[${opcionesProcesos}],'${arrayJson.codigo_caja}')`
            : `opcionesPrograma('${inserto.id}',[${idsProcesos}],[${opcionesProcesos}],${inserto.cantidad})`;

        html += `
        <div class="botonPrograma" onclick="${accion}" 
             style="background: white; border-radius: 12px; border: 1px solid #e2e8f0; padding: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
            
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div style="display: flex; flex-direction: column; gap: 2px;">
                    <span style="font-size: 13px; color: #1e293b;">
                        <b>${inserto.observaciones}</b> <span style="color: #94a3b8; margin: 0 4px;">|</span> <small style="color: #64748b;">${inserto.resistencia}</small>
                    </span>
                    <small style="font-size: 10px; color: #cbd5e1; font-weight: 800;">ID: ${inserto.id}</small>
                </div>
                <div style="background: #f1f5f9; padding: 4px 8px; border-radius: 8px; text-align: right; ">
                    <b style="font-size: 13px; color: #334155; display: block;">${separator(inserto.cantidad)}</b>
                    <span style="font-size: 8px; color: #94a3b8; font-weight: 800; text-transform: uppercase;">pzas</span>
                </div>
            </div>

            ${inserto.notas ? `
            <div style="background: #fffbeb; border-left: 3px solid #f59e0b; padding: 4px 8px; border-radius: 4px; margin-bottom: 8px;">
                <span style="font-size: 11px; color: #b45309;">
                    <i class="fa-solid fa-comment-dots"></i> <b>Nota:</b> ${inserto.notas}
                </span>
            </div>` : ''}

            <div style="display: flex; flex-wrap: wrap; gap: 5px;">
                ${procesos}
            </div>
        </div>`;
    });

    html += `</div></ons-card>`;
    return html;
}

//FUNCIONES NUEVA PARA MOSTRAR PROGRAMA CAJAS
function enlistarprogramaCaja(arrayJson) {
    let procesos = "";
    let opcionesProcesos = "";
    let idsProcesos = "";

    arrayJson.programa.forEach(programa => {
        // Mantengo tus clases originales (.proceso y .proceso-estado)
        procesos += `
            <span class="proceso proceso-${procesoProgramaEstado(programa.estado)}">
                ${procesoProgramaEstadoIcon(programa.estado)} ${procesosPrograma(programa.proceso)}
            </span>
        `;
        opcionesProcesos += `${programa.proceso},`;
        idsProcesos += `${programa.id},`;
    });

    let perfil = validarPerfil();
    let accion = (perfil == "produccion")
        ? `opcionesPrograma1([${idsProcesos}],[${opcionesProcesos}],'${arrayJson.codigo}')`
        : `opcionesPrograma('${arrayJson.id}',[${idsProcesos}],[${opcionesProcesos}],${arrayJson.cantidad})`;

    return `
    <ons-card class="botonPrograma" onclick="${accion}" 
              style="padding:0px; margin: 10px 12px; border-radius: 16px; border: 1px solid #f1f5f9; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
        
        <ons-list-header class="programa-header">
            <span style="color: #64748b; font-weight: 800;"># ${arrayJson.id}</span>
            <span class="fecha-verde">
                <i class="far fa-calendar-check"></i> <b>Entrega:</b> ${sumarDias(arrayJson.fecha_entrega, 0)}
            </span>
        </ons-list-header>

        <ons-list-item modifier="nodivider">
            
            <div class="left">
                <div class="badge-codigo">
                    <strong>${arrayJson.codigo}</strong>
                </div>
            </div>

            <div class="center">
                <div style="display: flex; flex-direction: column; width: 100%;">
                    <span style="font-size: 15px; color: #1e293b; line-height: 1.3;">
                        <b>${arrayJson.producto}</b> 
                        <b style="color: #475569; font-size: 13px; margin-left:10px;">${arrayJson.resistencia}</b>
                    </span>

                    <span style="font-size: 12px; color: #64748b; margin-top: 4px;">
                        <i class="far fa-user" style="font-size: 10px;"></i> ${arrayJson.cliente}
                    </span>

                    <div style="height: 1px; background: #f1f5f9; margin: 8px 0;"></div>

                    <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                        ${procesos}
                    </div>
                </div>
            </div>

            <div class="right" style="min-width: fit-content; margin-left: 10px; align-self: center;">
                <div style="text-align: right; background: #f8fafc; padding: 5px 10px; border-radius: 10px; border: 1px solid #f1f5f9;">
                    <b style="font-size: 16px; color: #1e293b; display: block;">
                        ${separator(arrayJson.cantidad)}
                    </b>
                    <span style="font-size: 10px; color: #94a3b8; font-weight: 800; text-transform: uppercase;">pzas</span>
                </div>
            </div>
            
        </ons-list-item>
    </ons-card>`;
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
function opcionesPrograma1(id, procesos, codigo) {
    //console.log(procesos,id_lp,id,piezas);
    let botones = [];

    procesos.forEach(proceso => {
        botones.push(procesosProgramaIcon(proceso) + procesosPrograma(proceso));
    });
    botones.push(
        '<span style="color: green !important"><i class="fas fa-drafting-compass" style="color: green"></i>&nbsp;Ver plano</span>',
        {
            label: '<i class="fas fa-times" style="color:red"></i>&nbsp;Cancelar',
            modifier: 'destructive'
        }
    );
    let cantidad = botones.length - 1; // se saca la cantidad de botones, para mandar dicha funcion
    mensajeArriba("Modificar Proceso", botones,
        function (i) {
            //console.log(index, cantidad);

            if (i == cantidad - 1) {
                var timestamp = new Date().getTime();
                let codigos = codigo.split("/");
                let codigo1 = codigos[0];
                let codigo2 = codigos[1];
                var url = myLink + '/planos/' + codigo1 + '/' + codigo1 + '-' + codigo2 + '.pdf?timestamp=' + timestamp;
                if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i)) {
                    //console.log("Estás usando un dispositivo móvil!!");
                    nextPageFunctionData('verPlano.html', verPlano, url);
                } else {
                    window.open(url, '_blank');
                }
            }
            else if (i == cantidad) return;
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

    arrayJson.programa.forEach(programa => {
        // Usamos la misma lógica de estilos para mantener consistencia visual
        procesos += `
            <span class="proceso estado-${programa.hoy}">
                ${estadoProgramaIcon(programa.hoy)} ${procesosPrograma(programa.proceso)}
            </span>
        `;
    });

    return `
    <ons-card class="botonPrograma" 
              style="padding:0px; margin: 10px 12px; border-radius: 16px; border: 1px solid #f1f5f9; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
        
        <ons-list-header class="programa-header">
            <span style="color: #64748b; font-weight: 800;"># ${arrayJson.id}</span>
            <span class="fecha-verde">
                <i class="far fa-calendar-check"></i> <b>Entrega:</b> ${sumarDias(arrayJson.fecha_entrega, 0)}
            </span>
        </ons-list-header>

        <ons-list-item modifier="nodivider">
            
            <div class="left" style="margin-right: 12px;">
                <div class="badge-codigo" style="margin-left:10px;">
                    <strong>${arrayJson.codigo}</strong>
                </div>
            </div>

            <div class="center romperTexto">
                <div style="display: flex; flex-direction: column; width: 100%;">
                    <span style="font-size: 15px; color: #1e293b; line-height: 1.3;">
                        <b>${arrayJson.producto}</b> 
                        <b style="color: #475569; font-size: 13px; margin-left:10px;">${arrayJson.resistencia}</b>
                    </span>

                    <span style="font-size: 12px; color: #64748b; margin-top: 4px;">
                        <i class="far fa-user" style="font-size: 10px;"></i> ${arrayJson.cliente}
                    </span>

                    <div style="height: 1px; background: #f1f5f9; margin: 8px 0;"></div>

                    <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                        ${procesos}
                    </div>
                </div>
            </div>

            <div class="right" style="min-width: fit-content; margin-left: 10px; align-self: center;">
                <div style="text-align: right; background: #f8fafc; padding: 5px 10px; border-radius: 10px; border: 1px solid #f1f5f9;">
                    <b style="font-size: 16px; color: #1e293b; display: block;">
                        ${separator(arrayJson.cantidad)}
                    </b>
                    <span style="font-size: 10px; color: #94a3b8; font-weight: 800; text-transform: uppercase;">pzas</span>
                </div>
            </div>
            
        </ons-list-item>
    </ons-card>`;
}

function enlistarProgramaHistorialInserto(arrayJson) {
    // 1. CABECERA DE LA TARJETA PRINCIPAL (Datos de la Caja Madre)
    let html = `
    <ons-card class="botonPrograma" style="padding:0; margin: 10px 12px; border-radius: 16px; border: 1px solid #f1f5f9; box-shadow: 0 4px 10px rgba(0,0,0,0.05); background: #ffffff;">
        
        <ons-list-header class="programa-header">
            <span style="color: #64748b; font-weight: 800;"># ${arrayJson.id_caja}</span>
            <span class="fecha-verde">
                <i class="far fa-calendar-check"></i> <b>Entrega:</b> ${sumarDias(arrayJson.fecha_entrega, 0)}
            </span>
        </ons-list-header>

        <ons-list-item modifier="nodivider">
            <div class="left" >
                <div class="badge-codigo">
                    <strong>${arrayJson.codigo_caja}</strong>
                </div>
            </div>
            <div class="center">
                <div style="display: flex; flex-direction: column;">
                    <span style="font-size: 15px; font-weight: 800; color: #1e293b;">${arrayJson.nombre_producto}</span>
                    <span style="font-size: 12px; color: #64748b; margin-top: 2px;">
                        <i class="far fa-user" style="font-size: 10px;"></i> ${arrayJson.nombre_cliente}
                    </span>
                </div>
            </div>
        </ons-list-item>

        <div style="padding: 10px; background: #f8fafc; border-radius: 0 0 16px 16px;">
            <div style="font-size: 10px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">
                Historial de Insertos:
            </div>`;

    // 2. ITERACIÓN DE LOS INSERTOS (Sub-tarjetas de Historial)
    arrayJson.insertos.forEach(inserto => {
        let procesos = "";

        inserto.programa.forEach(programa => {
            procesos += `
                <span class="proceso estado-${programa.hoy}" style="margin-bottom: 0;">
                    ${estadoProgramaIcon(programa.hoy)} ${procesosPrograma(programa.proceso)}
                </span>`;
        });

        // Aplicamos el diseño limpio sin los min-width y con los márgenes corregidos
        html += `
        <div class="botonPrograma" 
             style="background: white; border-radius: 12px; border: 1px solid #e2e8f0; padding: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.02); margin-top: 8px;">
            
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div style="display: flex; flex-direction: column; gap: 2px;">
                    <span style="font-size: 13px; color: #1e293b;">
                        <b>${inserto.observaciones}</b> <span style="color: #94a3b8; margin: 0 4px;">|</span> <small style="color: #64748b;">${inserto.resistencia}</small>
                    </span>
                    <small style="font-size: 10px; color: #cbd5e1; font-weight: 800;">ID: ${inserto.id}</small>
                </div>
                <div style="background: #f1f5f9; padding: 4px 8px; border-radius: 8px; text-align: right;">
                    <b style="font-size: 13px; color: #334155; display: block;">${separator(inserto.cantidad)}</b>
                    <span style="font-size: 8px; color: #94a3b8; font-weight: 800; text-transform: uppercase;">pzas</span>
                </div>
            </div>

            ${inserto.notas ? `
            <div style="background: #fffbeb; border-left: 3px solid #f59e0b; padding: 4px 8px; border-radius: 4px; margin-top: 8px;">
                <span style="font-size: 11px; color: #b45309;">
                    <i class="fa-solid fa-comment-dots"></i> <b>Nota:</b> ${inserto.notas}
                </span>
            </div>` : ''}

            <div style="display: flex; flex-wrap: wrap; gap: 5px; margin-top: 8px;">
                ${procesos}
            </div>
        </div>`;
    });

    html += `</div></ons-card>`;
    return html;
}