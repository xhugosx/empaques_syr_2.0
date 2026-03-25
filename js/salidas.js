//var Salida;

//funcion para editar cantidad de Salidas y salidas productos

document.addEventListener('init', function (event) {
    var page = event.target;
    if (page.id === 'cajaSalidas') {
        setMostrarSalidaCajas();
        tabsCargadosP = {
            'insertoSalidas.html': false,
            'laminaSalidas.html': false,
        };
        //VARIABLE tabsCargadosP DECLARADA EN pedidos.js
    }
});

//FUNCION PARA VERIFICAR QUE SOLO SE DIO UN CLICK AL TAB DEL PAGE
document.addEventListener('postchange', function (event) {
    const pageName = event.tabItem.getAttribute('page');
    // Solo ejecuta la función si es la primera vez que se activa este tab
    switch (pageName) {

        case 'insertoSalidas.html':
            if (!tabsCargadosP['insertoSalidas.html']) {
                setMostrarSalidasInserto()
                tabsCargadosP['insertoSalidas.html'] = true;
            }
            break;
        case 'laminaSalidas.html':
            if (!tabsCargadosP['laminaSalidas.html']) {
                setMostrarSalidaLaminas();
                tabsCargadosP['laminaSalidas.html'] = true;
            }
            break;
    }
});

/// NUEVAS FUNCIONES PARA SalidaS 

function setMostrarSalidaCajas() {
    oCarga("Cargando datos...");
    let busqueda = $("#searchSalidaCaja").val();
    let fecha = $("#fechaSalidaCaja").val();
    let link = myLink + "/php/salida/caja/select.php?search=" + busqueda + "&fecha=" + fecha;
    servidor(link,
        function (respuesta) {
            var resultado = respuesta.responseText;
            var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'

            listaInfinita('datosCajaSalida', '', arrayJson, enlistarSalidasCajas);
            cCarga();
        }
    );
}

function enlistarSalidasCajas(arrayJson) {
    // Mantenemos tu formato de observaciones
    var observaciones = arrayJson.observaciones == "" ? "" : '<br><i style="color: #ef4444" class="fa-solid fa-comment-dots fa-2x"></i>&nbsp;<font size="2pt">' + arrayJson.observaciones + "</font>";

    let perfil = validarPerfil();
    let accion;
    if (perfil != "produccion") accion = `onclick="opcionesSalidasCajas(${arrayJson.id})"`;

    let html = `
        <ons-card style="padding:0px; background: #fee2e2;" class="botonPrograma" ${accion}>
            <ons-list-header class="pedido-header" style="background: rgba(255, 255, 255, 0.7); border-radius: 20px 20px 0 0; display: flex; justify-content: space-between;">
                <div class="header-left">
                    <span class="pedido-id">#${arrayJson.id_lp}</span>
                </div>
                <b class="pedido-entrega-status" style="color: #dc2626;">
                    <i class="far fa-calendar-check" style="color: #dc2626;"></i>
                    &nbsp; Terminado: ${sumarDias(arrayJson.fecha, 0)}
                </b>
            </ons-list-header>

            <ons-list-item modifier="nodivider">
                <div class="left">
                    <div class="producto-icon-wrapper">
                        <i class="fas fa-box fa-2x"></i>
                    </div>
                </div>
                <div class="center">
                    <span class="list-item__title">
                        <b class="badge-codigo" style="margin: 0;">${arrayJson.codigo}</b>
                        &nbsp;${arrayJson.producto}
                    </span>
                    <span class="list-item__subtitle" style="margin-top: 5px;">
                        ${arrayJson.nombre}
                        ${observaciones}
                    </span>
                </div>
                <div class="right">
                    <div class="pedido-cantidad-container">
                        <span class="pedido-cantidad-valor" style="color: #b91c1c;">${separator(arrayJson.cantidad)}</span>
                        <span class="pedido-cantidad-label">pzas</span>
                    </div>
                </div>
            </ons-list-item>
        </ons-card>
    `;

    return html;
}

function setMostrarEditarSalidaCajas(id) {
    oCarga("Cargando datos...");
    servidor(myLink + "/php/salida/caja/select.php?id=" + id,
        function (respuesta) {
            var resultado = respuesta.responseText;
            var arrayJson = convertJson(resultado); //separamos los json en un arreglo, su delimitador siendo un '|'
            arrayJson = arrayJson[0];
            //const arrayJson = resultado.split('|').filter(c => c.trim() !== '').map(c => JSON.parse(c.trim()));
            $("#id").val(arrayJson.id);
            $("#codigo").val(arrayJson.id_lp);
            $("#caja").val(arrayJson.codigo + " " + arrayJson.producto);
            $("#observaciones").val(arrayJson.observaciones);
            $("#cantidad").val(arrayJson.cantidad);

            cCarga();
            alerta("Antes de editar una Salida asegurate de que la SALIDA no sea mayor a la ENTRADA", "IMPORTANTE");
        });
}

function setEditarCajaSalida() {
    let id = $("#id").val();
    let obs = $("#observaciones").val().toUpperCase();
    let cantidad = $("#cantidad").val();
    if (cantidad > 0) {
        let link = myLink + "/php/salida/caja/update.php?id=" + id + "&observaciones=" + obs + "&cantidad=" + cantidad;
        servidor(link,
            function (respuesta) {
                respuesta = respuesta.responseText;
                if (respuesta) {
                    alerta("Salida Editada, Correctamente!");
                    resetearPilaFunction(setMostrarSalidaCajas);
                }
                else alerta("Hubo un error al editar");
            }
        );
    }
    else alerta("La cantidad tiene que ser mayor a 0");
    //console.log(id, obs, cantidad);
}

function setEliminarSalidaCaja(id) {
    oCarga("Eliminando...");
    servidor(myLink + "/php/salida/caja/delete.php?id=" + id,
        function (respuesta) {
            cCarga();
            respuesta = respuesta.responseText;
            if (respuesta) {
                alerta("Salida Eliminada, Correctamente!");
                setMostrarSalidaCajas();
            }
            else alerta("Hubo un error al eliminar");
        }
    );
}

function opcionesSalidasCajas(id) {

    mensajeArriba("Opciones",
        [
            '<i class="fas fa-pen-to-square"></i>&nbsp;Editar',
            {
                label: '<i class="fas fa-trash" style="color:red"></i>&nbsp;Eliminar',
                modifier: 'destructive'
            }
        ],
        function (opc) {
            if (opc == 0)
                nextPageFunction("cajaEditarSalidas.html",
                    function () {
                        setMostrarEditarSalidaCajas(id);
                    }
                );
            else if (opc == 1) {
                alertConfirm("Estas seguro de eliminar esta salida?", ["Cancelar", "Aceptar"],
                    function (idx) {
                        if (idx) setEliminarSalidaCaja(id);
                    }
                );

            }
        }
    );
}


//// INICIO DE FUNCIONES PARA SalidaS INSERTOS

function setMostrarSalidasInserto() {
    oCarga("Cargando datos...");
    let busqueda = $("#searchSalidaInserto").val();
    let fecha = $("#fechaSalidaInserto").val();
    let link = myLink + "/php/salida/inserto/select.php?search=" + busqueda + "&fecha=" + fecha;
    servidor(link,
        function (respuesta) {
            var resultado = respuesta.responseText;
            var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'

            listaInfinita('datosInsertoSalida', '', arrayJson, enlistarSalidasInserto);
            cCarga();
        }
    );
}

function enlistarSalidasInserto(arrayJson) {
    // Mantenemos tu formato de observaciones con un toque rojizo
    var observaciones = arrayJson.observaciones == "" ? "" : '<br><i style="color: #ef4444" class="fa-solid fa-comment-dots fa-2x"></i>&nbsp;<font size="2pt">' + arrayJson.observaciones + "</font>";

    let perfil = validarPerfil();
    let accion;
    if (perfil != "produccion") accion = `onclick="opcionesSalidasInserto(${arrayJson.id})"`;

    let html1 = `
        <ons-card style="padding:0px; background: #fee2e2;" class="botonPrograma" ${accion}>
            <ons-list-header class="pedido-header" style="background: rgba(255, 255, 255, 0.7); border-radius: 20px 20px 0 0; display: flex; justify-content: space-between;">
                <div class="header-left">
                    <span class="pedido-id">#${arrayJson.id_lp}</span>
                </div>
                <b class="pedido-entrega-status" style="color: #dc2626;">
                    <i class="far fa-calendar-check" style="color: #dc2626;"></i>
                    &nbsp; Terminado: ${sumarDias(arrayJson.fecha, 0)}
                </b>
            </ons-list-header>

            <ons-list-item modifier="nodivider">
                <div class="left">
                    <div class="producto-icon-wrapper">
                        <i class="fa-solid fa-box-open fa-2x"></i>
                    </div>
                </div>
                <div class="center">
                    <span class="list-item__title">
                        <b class="badge-codigo" style="margin: 0;">${arrayJson.codigo}</b>
                        &nbsp;${arrayJson.inserto}
                    </span>
                    
                    <span class="list-item__subtitle" style="margin-top: 5px; display: block;">
                        <div style="margin-bottom: 2px;">${arrayJson.producto} - ${arrayJson.nombre}</div>
                        <div style="color: #b91c1c; font-weight: bold;">Resistencia: ${arrayJson.resistencia}</div>
                        ${observaciones}
                    </span>
                </div>
                <div class="right">
                    <div class="pedido-cantidad-container">
                        <span class="pedido-cantidad-valor" style="color: #b91c1c;">${separator(arrayJson.cantidad)}</span>
                        <span class="pedido-cantidad-label">pzas</span>
                    </div>
                </div>
            </ons-list-item>
        </ons-card>
    `;

    return html1;
}

function setMostrarEditarSalidaInserto(id) {
    oCarga("Cargando datos...");
    servidor(myLink + "/php/salida/inserto/select.php?id=" + id,
        function (respuesta) {
            var resultado = respuesta.responseText;
            var arrayJson = convertJson(resultado); //separamos los json en un arreglo, su delimitador siendo un '|'
            arrayJson = arrayJson[0];
            //const arrayJson = resultado.split('|').filter(c => c.trim() !== '').map(c => JSON.parse(c.trim()));
            $("#id").val(arrayJson.id);
            $("#codigo").val(arrayJson.id_lp);
            $("#caja").val(arrayJson.codigo + " " + arrayJson.producto);
            $("#observaciones").val(arrayJson.observaciones);
            $("#cantidad").val(arrayJson.cantidad);

            cCarga();
            alerta("Antes de editar una Salida asegurate de que la SALIDA no sea mayor a la ENTRADA", "IMPORTANTE");
        });
}

function setEditarInsertoSalida() {
    let id = $("#id").val();
    let obs = $("#observaciones").val().toUpperCase();
    let cantidad = $("#cantidad").val();
    if (cantidad > 0) {
        let link = myLink + "/php/salida/inserto/update.php?id=" + id + "&observaciones=" + obs + "&cantidad=" + cantidad;
        servidor(link,
            function (respuesta) {
                respuesta = respuesta.responseText;
                if (respuesta) {
                    alerta("Salida Editada, Correctamente!");
                    resetearPilaFunction(setMostrarSalidasInserto);
                }
                else alerta("Hubo un error al editar");
            }
        );
    }
    else alerta("La cantidad tiene que ser mayor a 0");
    //console.log(id, obs, cantidad);
}

function setEliminarSalidaInserto(id) {
    oCarga("Eliminando...");
    servidor(myLink + "/php/salida/inserto/delete.php?id=" + id,
        function (respuesta) {
            cCarga();
            respuesta = respuesta.responseText;
            if (respuesta) {
                alerta("Salida Eliminada, Correctamente!");
                setMostrarSalidasInserto();
            }
            else alerta("Hubo un error al eliminar");
        }
    );
}

function opcionesSalidasInserto(id) {

    mensajeArriba("Opciones",
        [
            '<i class="fas fa-pen-to-square"></i>&nbsp;Editar',
            {
                label: '<i class="fas fa-trash" style="color:red"></i>&nbsp;Eliminar',
                modifier: 'destructive'
            }
        ],
        function (opc) {
            if (opc == 0)
                nextPageFunction("insertoEditarSalidas.html",
                    function () {
                        setMostrarEditarSalidaInserto(id);
                    }
                );
            else if (opc == 1) {
                alertConfirm("Estas seguro de eliminar esta salida?", ["Cancelar", "Aceptar"],
                    function (idx) {
                        if (idx) setEliminarSalidaInserto(id);
                    }
                );
            }
        }
    );
}

////  INICIO PARA SalidaS DE LAMINA

function setMostrarSalidaLaminas() {
    oCarga("Cargando datos...");
    let busqueda = $("#searchLaminaInventario").val();
    servidor(myLink + "/php/salida/lamina/select.php?search=" + busqueda,
        function (respuesta) {
            var resultado = respuesta.responseText;
            var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'

            listaInfinita('datosLaminaInventario', '', arrayJson, enlistarSalidasLamina);
            cCarga();
        }
    );
}

function enlistarSalidasLamina(arrayJson) {
    // Generamos la lista de cajas vinculadas con un estilo limpio
    let cajasHtml = "";
    arrayJson.cajas.forEach(caja => {
        cajasHtml += `<div style="font-size: 11px; color: #475569; margin-bottom: 2px;">
                        <i class="fas fa-caret-right" style="font-size: 10px; opacity: 0.5; color: #dc2626;"></i> 
                        <b>${caja.codigo}</b> ${caja.producto}
                      </div>`;
    });

    // Observaciones con el estilo de icono de comentario que prefieres
    var observaciones = arrayJson.observaciones == "" ? "" :
        `<div style="margin-top: 8px; border-top: 1px dashed rgba(220, 38, 38, 0.2); padding-top: 6px;">
            <i style="color: #ef4444" class="fa-solid fa-comment-dots fa-2x"></i>&nbsp;
            <span style="font-size: 11px; color: #b91c1c;">${arrayJson.observaciones}</span>
        </div>`;

    let perfil = validarPerfil();
    let accion = (perfil != "produccion") ? `onclick="opcionesSalidasLamina(${arrayJson.id})"` : "";

    return `
        <ons-card style="padding:0px; background: #fee2e2;" class="botonPrograma" ${accion}>
            <ons-list-header class="pedido-header" style="background: rgba(255, 255, 255, 0.7); border-radius: 20px 20px 0 0; display: flex; justify-content: space-between;">
                <div class="header-left">
                    <span class="pedido-id">#${arrayJson.id_lp}</span>
                </div>
                <b class="pedido-entrega-status" style="color: #dc2626;">
                    <i class="far fa-calendar-check" style="color: #dc2626;"></i>
                    &nbsp; Recibido: ${sumarDias(arrayJson.fecha, 0)}
                </b>
            </ons-list-header>

            <ons-list-item modifier="nodivider">
                <div class="left">
                    <div class="producto-icon-wrapper">
                        <i class="fas fa-sheet-plastic fa-2x"></i>
                    </div>
                </div>

                <div class="center romperTexto" style="padding: 6px 0;">
                    <div class="list-item__title" style="margin-bottom: 6px;">
                        <span style="font-size: 15px; font-weight: 800; color: #1e293b;">
                            ${esEntero(arrayJson.ancho)} X ${esEntero(arrayJson.largo)}
                        </span>
                        <span style="font-size: 12px; color: #64748b; margin-left: 5px;">
                            | <b>${arrayJson.resistencia} ${arrayJson.papel}</b>
                        </span>
                    </div>

                    <div class="list-item__subtitle" style="margin-bottom: 4px;">
                        ${cajasHtml}
                    </div>

                    ${observaciones}
                </div>

                <div class="right">
                    <div class="pedido-cantidad-container">
                        <span class="pedido-cantidad-valor" style="color: #b91c1c;">${separator(arrayJson.cantidad)}</span>
                        <span class="pedido-cantidad-label">pzas</span>
                    </div>
                </div>
            </ons-list-item>
        </ons-card>
    `;
}

function setMostrarEditarSalidaLamina(id) {
    oCarga("Cargando datos...");
    servidor(myLink + "/php/salida/lamina/select.php?id=" + id,
        function (respuesta) {
            var resultado = respuesta.responseText;
            var arrayJson = convertJson(resultado); //separamos los json en un arreglo, su delimitador siendo un '|'
            arrayJson = arrayJson[0];
            //const arrayJson = resultado.split('|').filter(c => c.trim() !== '').map(c => JSON.parse(c.trim()));
            $("#id").val(arrayJson.id);
            $("#codigo").val(arrayJson.id_lp);
            $("#observaciones").val(arrayJson.observaciones);
            $("#medidas").val(esEntero(arrayJson.largo) + " X " + esEntero(arrayJson.ancho));
            $("#cantidad").val(arrayJson.cantidad);

            cCarga();
            alerta("Antes de editar una Salida asegurate de que la SALIDA no sea mayor a la ENTRADA", "IMPORTANTE");
        });
}

function setEditarLaminaSalida() {
    let id = $("#id").val();
    let obs = $("#observaciones").val().toUpperCase();
    let cantidad = $("#cantidad").val();
    if (cantidad > 0) {
        let link = myLink + "/php/salida/lamina/update.php?id=" + id + "&observaciones=" + obs + "&cantidad=" + cantidad;
        servidor(link,
            function (respuesta) {
                respuesta = respuesta.responseText;
                if (respuesta) {
                    alerta("Salida Editada, Correctamente!");
                    resetearPilaFunction(setMostrarSalidaLaminas);
                }
                else alerta("Hubo un error al editar");
            }
        );
    }
    else alerta("La cantidad tiene que ser mayor a 0");
    //console.log(id, obs, cantidad);
}

function setEliminarSalidaLamina(id) {
    oCarga("Eliminando...");
    servidor(myLink + "/php/salida/lamina/delete.php?id=" + id,
        function (respuesta) {
            cCarga();
            respuesta = respuesta.responseText;
            if (respuesta) {
                alerta("Salida Eliminada, Correctamente!");
                setMostrarSalidaLaminas();
            }
            else alerta("Hubo un error al eliminar");
        }
    );
}

function opcionesSalidasLamina(id) {

    mensajeArriba("Opciones",
        [
            '<i class="fas fa-pen-to-square"></i>&nbsp;Editar',
            {
                label: '<i class="fas fa-trash" style="color:red"></i>&nbsp;Eliminar',
                modifier: 'destructive'
            }
        ],
        function (opc) {
            if (opc == 0)
                nextPageFunction("laminaEditarSalidas.html",
                    function () {
                        setMostrarEditarSalidaLamina(id);
                    }
                );
            else if (opc == 1) setEliminarSalidaLamina(id);
        }
    );
}

/// FIN FUNCIONES NUEVAS Salida




//// INICIO SECCIONES DE FUNCIONES NUEVAS ACTUALIZADAS

//// INICIO SECCION DE FUNCIONES PARA SALIDAS DE CAJA

function setAgregarSalidaCaja(id, cantidad, observaciones) {
    oCarga("Generando salida de inventario");
    observaciones = observaciones.toUpperCase();

    let link = myLink + "/php/salida/caja/add.php?id=" + id + "&cantidad=" + cantidad + "&observaciones=" + observaciones;
    servidor(link,
        function (respuesta) {
            if (respuesta.responseText == 1) {
                alerta("Salida generada correctamente");
                setMostrarInventarioCajas(codigoCliente); // FUNCION EJECUTADA EN EL ARCHIVO inventario.j
            }
            else alerta("No se pudo generar la salida, Hubo un error");
            cCarga();
        }
    );
}

function setGeneraraSalidaCajaTodo(caja, observaciones) {
    oCarga("Generando salida...");
    observaciones = observaciones.toUpperCase();
    let link = myLink + '/php/salida/caja/addAll.php?producto=' + caja + '&observaciones=' + observaciones;
    servidor(link,
        function (respuesta) {
            if (respuesta.responseText == 1) {
                alerta("Salida generada correctamente");
                setMostrarInventarioCajas(codigoCliente);
            }
            else alerta("No se pudo generar la salida");
            cCarga();
        }
    );
}

//// FIN SECCION DE FUNCIONES PARA SALIDAS DE CAJA


//// INICIO SECCION DE FUNCIONES PARA SALIDAS DE INSERTO

function setAgregarSalidaInserto(id, cantidad, observaciones) {
    oCarga("Generando salida de inventario...");
    observaciones = observaciones.toUpperCase();

    let link = myLink + "/php/salida/inserto/add.php?id=" + id + "&cantidad=" + cantidad + "&observaciones=" + observaciones;
    servidor(link,
        function (respuesta) {
            if (respuesta.responseText == 1) {
                alerta("Salida generada correctamente");
                setMostrarInventarioInserto(codigoCliente); // FUNCION EJECUTADA EN EL ARCHIVO inventario.j
            }
            else alerta("No se pudo generar la salida, Hubo un error: ");
            cCarga();
        }
    );
}

function setGeneraraSalidaInsertoTodo(inserto, caja, observaciones) {
    oCarga("Generando salida de inventario...");
    observaciones = observaciones.toUpperCase();
    let link = myLink + '/php/salida/inserto/addAll.php?producto=' + caja + '&inserto=' + inserto + '&observaciones=' + observaciones;
    servidor(link,
        function (respuesta) {
            if (respuesta.responseText == 1) {
                alerta("Salida generada correctamente");
                setMostrarInventarioInserto(codigoCliente);
            }
            else alerta("No se pudo generar la salida");
            cCarga();
        }
    );
}

//// FIN SECCION DE FUNCIONES PARA SALIDAS DE INSERTO

//// INICIO SECCION DE FUNCIONES PARA SALIDAS DE LAMINA

function setAgregarSalidaLamina(id, cantidad, observaciones) {
    oCarga("Generando salida de inventario...");
    observaciones = observaciones.toUpperCase();
    let link = myLink + "/php/salida/lamina/add.php?id=" + id + "&cantidad=" + cantidad + "&observaciones=" + observaciones
    servidor(link,
        function (respuesta) {
            if (respuesta.responseText == 1) {
                alerta("Salida generada correctamente");
                setMostrarInventarioLamina(); // FUNCION EJECUTADA EN EL ARCHIVO inventario.js
            }
            else alerta("No se pudo generar la salida, Hubo un error: ");
            cCarga();
        }
    );
}

//// FIN SECCION DE FUNCIONES PARA SALIDAS DE LAMINA



//// FIN SECCIONES DE FUNCIONES NUEVAS ACTUALIZADAS