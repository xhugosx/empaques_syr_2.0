var codigoCliente = "";

//INICIALIZAR LOS PAGES
document.addEventListener('init', function (event) {
    var page = event.target;
    if (page.id === 'clientecajaInventario') {
        setMostrarInventarioClienteCajas();
        tabsCargadosP = {
            'insertoClienteInventario.html': false,
            'laminaInventario.html': false,
        };
        //VARIABLE tabsCargadosP DECLARADA EN pedidos.js
    }
});

//FUNCION PARA VERIFICAR QUE SOLO SE DIO UN CLICK AL TAB DEL PAGE
document.addEventListener('postchange', function (event) {
    const pageName = event.tabItem.getAttribute('page');
    // Solo ejecuta la función si es la primera vez que se activa este tab
    switch (pageName) {

        case 'insertoClienteInventario.html':
            if (!tabsCargadosP['insertoClienteInventario.html']) {
                setMostrarInventarioClienteInserto();
                tabsCargadosP['insertoClienteInventario.html'] = true;
            }
            break;
        case 'laminaInventario.html':
            if (!tabsCargadosP['laminaInventario.html']) {
                setMostrarInventarioLamina();
                tabsCargadosP['laminaInventario.html'] = true;
            }
            break;
    }
});


//// INICIO SECCION INVENTARIO CAJAS

function setMostrarInventarioClienteCajas() {
    let busqueda = $('#searchClienteCajaInventario').val();
    let link = myLink + '/php/inventario/caja/selectGrupoClienteCaja.php?search=' + busqueda;
    oCarga("Cargando datos...");
    servidor(link,
        function (respuesta) {
            var resultado = respuesta.responseText;
            var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'
            //console.log(arrayJson);
            listaInfinita('datosClienteCajaInventario', '', arrayJson, enlistarInventarioClienteCajas);
            cCarga();
        }
    );

}

function enlistarInventarioClienteCajas(arrayJson) {
    return `
    <ons-card class="botonPrograma card-cliente-interactivo" 
              onclick="nextPageFunction('cajaInventario.html', function() { setMostrarInventarioCajas('${arrayJson.codigo}') })">
        <ons-list-item modifier="chevron nodivider" class="lista-cliente-item">
            
            <div class="left">
                <div class="producto-icon-wrapper">
                    <i class="fas fa-clipboard-user fa-2x"></i>
                </div>
            </div>
            
            <div class="center">
                <span class="list-item__title badge-codigo">${agregarCeros(arrayJson.codigo)}</span>
                <span class="list-item__subtitle nombre-cliente">${arrayJson.cliente}</span>
            </div>
            
            <div class="right">
                <div class="contenedor-notificacion">
                    <span class="label-pedidos">Modelos</span>
                    <span class="notification-moderna">${arrayJson.cantidad_productos}</span>
                </div>
            </div>

        </ons-list-item>
    </ons-card>
    `;
}

function setMostrarInventarioCajas(cliente) {
    oCarga("Cargando datos...");
    let busqueda = $('#searchCajaInventario').val();
    let link = myLink + '/php/inventario/caja/selectGrupoCaja.php?cliente=' + cliente + '&search=' + busqueda;
    servidor(link,
        function (respuesta) {
            var resultado = respuesta.responseText;
            var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'
            //console.log(arrayJson);
            listaInfinita('datosCajaInventario', '', arrayJson, enlistarInventarioCajas);
            cCarga();
        }
    );
    codigoCliente = cliente; // Guardamos el codigo del cliente para usarlo en otras funciones
}

function enlistarInventarioCajas(arrayJson, i) {
    let perfil = validarPerfil();
    let accion;
    if (perfil != "produccion") accion = `expandable onclick="setMostrarInventarioCajasIndividuales('${arrayJson.codigo}',${i})"`;

    let html = `<ons-card style="padding:0 0 5px 0;" class="botonPrograma opacity100">
    <ons-list-item modifier="nodivider" ${accion}>
        <div class="left">
            <div class="producto-icon-wrapper">
                <i class="fa-solid fa-clipboard-list fa-2x"></i>
            </div>
        </div>
        <div class="center romperTexto">
            <span class="list-item__title">
                ${arrayJson.codigo}
            </span>
            <span class="list-item__subtitle">
                <span>
                    ${arrayJson.nombre}
                </span>
            </span>
        </div>
        <div class="right">
            <div class="pedido-cantidad-container">
                <span class="pedido-cantidad-valor">${separator(arrayJson.inventario)}</span>
                <span class="pedido-cantidad-label">pzas</span>
            </div>
           
            <i class="fa-solid fa-chevron-down" style="color:#c7c7cc;"></i>
        </div>
        <div class="expandable-content" style="padding: 0px; margin: 0px;">
            <ons-list style="background: rgba(76, 175, 80, 0.0) ">
                <ons-lazy-repeat id="contenidoInventarioCajas${i}">
                    <center>
                        <ons-progress-circular id="circularInventario${i}" indeterminate></ons-progress-circular>
                    </center>
                </ons-lazy-repeat>
                <ons-button modifier="large" style="width:99%" onclick="mensajeAlertaInventarioCajaTodo('${arrayJson.codigo}')">
                    <i class="fa-solid fa-truck-moving" style="color:white"></i>
                    &nbsp;Entregado
                </ons-button>
            </ons-list>    
        </div>
    </ons-list-item>
    </ons-card>
    `;

    return html;
}

function setMostrarInventarioCajasIndividuales(caja, i) {
    if ($('#circularInventario' + i).length === 0) return; // Si el circulo de carga no existe, no hacer nada
    let link = myLink + '/php/inventario/caja/selectCaja.php?producto=' + caja;
    servidor(link,
        function (respuesta) {
            var resultado = respuesta.responseText;
            var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'
            listaInfinita('contenidoInventarioCajas' + i, '', arrayJson, enlistarInventarioCajasIndividuales);
        }
    );
}

//ENLISTADOS DE CAJAS
function enlistarInventarioCajasIndividuales(arrayJson) {
    return `
    <ons-card class="botonPrograma" 
              style="padding:0; margin: 10px 10px; border-radius: 25px; border: 1px solid #a5a5a5; box-shadow: none; background: #fafafa;" 
              onclick="mensajeAlertaInventarioCaja(${arrayJson.inventario}, '${arrayJson.id}')">
        <ons-list-item modifier="nodivider" style="min-height: 38px; padding: 0 8px;">
            <div class="left">
                <i class="fas fa-box fa-lg"style="margin-left:10px"></i> &nbsp;&nbsp;
                <span style="font-size: 12px; font-weight: 800; color: #484b50;">${arrayJson.id}</span>
            </div>
            <div class="right" style="display: flex; align-items: center; gap: 4px; padding: 0;">
                <span class="notification-moderna" style="background: #16a34a; font-size: 12px; padding: 1px 6px; color: white; min-width: 30px; text-align: center;">
                    ${separator(arrayJson.entrada)}
                </span>
                <i class="fa-solid fa-minus" style="font-size: 11px; color: #cbd5e1;"></i>
                <span class="notification-moderna" style="background: #94a3b8; font-size: 11px; padding: 1px 6px; color: white; min-width: 30px; text-align: center;">
                    ${separator(arrayJson.salida)}
                </span>
                <i class="fa-solid fa-equals" style="font-size: 9px; color: #cbd5e1;"></i>
                <span class="notification-moderna" style="background: #3a7cda; font-size: 12px; padding: 1px 8px; color: white; min-width: 55px; text-align: center;">
                    ${separator(arrayJson.inventario)} <small style="font-size: 8px;">pza(s)</small>
                </span>
            </div>
        </ons-list-item>
    </ons-card>
    `;
}

function mensajeAlertaInventarioCaja(inventario, id) {
    alertComfirmDato("Generar salida: ", "number", ["Cancelar", "Aceptar"],
        function (salida) {
            if (salida && salida <= inventario && salida > 0) {
                alertConfirm('Se generará la siguiente salida: <hr><b style="font-size:20pt">' + salida + ' Pzas.</b><hr> Estas seguro?', ["Cancelar", "Aceptar"],
                    function (i) {
                        if (i) {
                            //console.log("Salida generada para la caja: " + id + " con cantidad: " + idx);
                            alertComfirm("Deseas agregar alguna <b>NOTA</b> adicional?", ["No", "Si"],
                                function (j) {
                                    if (j) {
                                        alertComfirmDato("Observaciones: ", "text", ["Cancelar", "Enviar"],
                                            function (observaciones) {
                                                if (observaciones != null)
                                                    setAgregarSalidaCaja(id, salida, observaciones); // FUNCION EJECUTADA EN EL ARCHIVO SALIDAS.JS
                                            }
                                        );
                                    }
                                    else
                                        setAgregarSalidaCaja(id, salida, ""); // FUNCION EJECUTADA EN EL ARCHIVO SALIDAS.JS
                                }
                            );
                        }
                        else alerta("Salida cancelada");
                    }
                );
            }
            else if (salida) alerta("Porfavor verifica cantidad, no puede ser menor a 0 o mayor al inventario: " + inventario + " pza(s)");
        }
    )
}

function mensajeAlertaInventarioCajaTodo(caja) {
    alertComfirm('<font size="3pt">Se generará la SALIDA DE TODO el inventario de la caja!</font> <br> Estas seguro?', ["Cancelar", "Aceptar"],
        function (idx) {
            if (idx) {
                // FUNCION EJECUTADA EN EL ARCHIVO SALIDAS.JS
                alertComfirm("Deseas agregar alguna <b>NOTA</b> adicional?", ["No", "Si"],
                    function (j) {
                        if (j) {
                            alertComfirmDato("Observaciones: ", "text", ["Cancelar", "Enviar"],
                                function (observaciones) {
                                    if (observaciones != null)
                                        setGeneraraSalidaCajaTodo(caja, observaciones); // FUNCION EJECUTADA EN EL ARCHIVO SALIDAS.JS
                                }
                            );
                        }
                        else
                            setGeneraraSalidaCajaTodo(caja, ""); // FUNCION EJECUTADA EN EL ARCHIVO SALIDAS.JS

                    }
                );
            }
        }
    );
}

function exportarInventarioCajas(cliente) {

    alertComfirm('¿Deseas exportar el inventario de cajas del cliente <b>' + cliente + '</b>?', ['No', 'Si'],
        function (idx) {
            if (idx) {
                let busqueda = $('#searchCajaInventario').val();
                let link = myLink + '/php/inventario/caja/selectGrupoCaja.php?cliente=' + cliente + '&search=' + busqueda;
                oCarga("Creando archivo Excel...");
                servidor(link,
                    function (respuesta) {
                        var resultado = respuesta.responseText;
                        //separamos los json en un arreglo, su delimitador siendo un '|', y eliminamos entradas vacías
                        const arrayJson = convertJson(resultado); // FUNCION EJECUTADA EN MAIN.JS

                        let nombreArchivo = cliente + "_Inventario_" + obtenerFechaActual();
                        crearExcel(nombreArchivo, arrayJson); // FUNCION EJECUTADA EN EL ARCHIVO MAIN.JS
                        //let responseArray = JSON.parse(arrayJson);
                        cCarga();
                    }
                );
            }

        }
    );
}

//// FIN SECCION INVENTARIO CAJAS



//// INICIO SECCION INVENTARIO INSERTOS

function setMostrarInventarioClienteInserto() {
    let busqueda = $('#searchClienteInsertoInventario').val();
    let link = myLink + '/php/inventario/inserto/selectGrupoClienteInserto.php?search=' + busqueda;
    oCarga("Cargando datos...");
    servidor(link,
        function (respuesta) {
            var resultado = respuesta.responseText;
            var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'
            //console.log(arrayJson);
            listaInfinita('datosClienteInsertoInventario', '', arrayJson, enlistarInventarioClienteInserto);
            cCarga();
        }
    );

}

function enlistarInventarioClienteInserto(arrayJson) {
    let html = `
        <ons-card style="padding:0px;" class="botonPrograma"
            onclick="nextPageFunction('insertoInventario.html', 
            function() {setMostrarInventarioInserto('${arrayJson.codigo}')})">
            <ons-list-item modifier="chevron nodivider">
            <div class="left">
                <div class="producto-icon-wrapper">
                    <i class="fa-solid fa-clipboard-user fa-2x"></i>
                </div>
            </div>
            <div class="center">
                <span class="list-item__title badge-codigo">
                    ${agregarCeros(arrayJson.codigo)}
                </span>
                <span class="list-item__subtitle">
                    <span>
                        ${arrayJson.cliente}
                    </span>
                </span>
            </div>
            <div class="right">
                <div class="contenedor-notificacion">
                    <span class="label-pedidos">Modelos</span>
                    <span class="notification-moderna">${arrayJson.cantidad_productos}</span>
                </div>
            </div>
            </ons-list-item>
        </ons-card>
    `;
    return html;
}

function setMostrarInventarioInserto(cliente) {
    oCarga("Cargando datos...");
    let busqueda = $('#searchInsertoInventario').val();
    let link = myLink + '/php/inventario/inserto/selectGrupoInserto.php?cliente=' + cliente + '&search=' + busqueda;
    servidor(link,
        function (respuesta) {
            var resultado = respuesta.responseText;
            var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'
            //console.log(arrayJson);
            listaInfinita('datosInsertoInventario', '', arrayJson, enlistarInventarioInserto);
            cCarga();
        }
    );
    codigoCliente = cliente; // Guardamos el codigo del cliente para usarlo en otras funciones
}
function enlistarInventarioInserto(arrayJson, i) {
    let html = `
        <ons-card style="padding:0 0 5px 0;" class="botonPrograma opacity100">
            <ons-list-item modifier="nodivider">
                <div class="left">
                    <div class="producto-icon-wrapper">
                        <i class="fa-solid fa-box fa-2x"></i>
                    </div>
                </div>
                <div class="center romperTexto">
                    <span class="list-item__title badge-codigo">
                        ${arrayJson.codigo}
                    </span>
                    <span class="list-item__subtitle">
                        <span>
                            ${arrayJson.nombre}
                        </span>
                    </span>
                </div>  
            </ons-list-item>
            <hr>
    `;

    arrayJson.insertos.forEach(inserto => {
        let id = arrayJson.codigo.replace(/\//g, "") + inserto.tipo_inserto.replace(/[ .]/g, '');
        let perfil = validarPerfil();
        let accion;
        if (perfil != "produccion") accion = `expandable onclick="setMostrarInventarioInsertoIndividuales('${id}', '${arrayJson.codigo}','${inserto.tipo_inserto}')"`;

        html += `
            <ons-card class="botonPrograma" onclick=""
                style="padding:0; margin-bottom: 2px; border: 1px solid grey;">
                <ons-list-item modifier="nodivider" ${accion} >
                    <div class="left">
                        <i class="fa-solid fa-clipboard-list fa-lg"></i>
                    </div>
                    <div class="center">
                        <b>${inserto.tipo_inserto}</b> &nbsp;|&nbsp; <span style="font-size:9pt">${inserto.resistencia}</span>   
                    </div>
                    <div class="right" style="white-space: nowrap;">
                    <div class="pedido-cantidad-container">
                        <span class="pedido-cantidad-valor">${separator(inserto.inventario)}</span>
                            <span class="pedido-cantidad-label">pzas</span>
                        </div>
                        <i class="fa-solid fa-chevron-down" style="color:#c7c7cc; margin-left: 8px;"></i>
                    </div>
                    <div class="expandable-content">
                         <ons-list style="background: rgba(76, 175, 80, 0.0) ">
                            <ons-lazy-repeat id="contenidoInventarioInsertos${id}">
                                <center>
                                    <ons-progress-circular id="circularInventario${id}" indeterminate></ons-progress-circular>
                                </center>
                            </ons-lazy-repeat>
                            <ons-button modifier="large" style="width:98%" onclick="mensajeAlertaInventarioInsertoTodo('${inserto.tipo_inserto}','${arrayJson.codigo}')">
                                <i class="fa-solid fa-truck-moving" style="color:white"></i>
                                &nbsp;Entregado
                            </ons-button>
                        </ons-list>    
                    </div>
                </ons-list-item>
            </ons-card>
        `;
    });

    html += `        
        </ons-card>
    `;
    return html;

}

function setMostrarInventarioInsertoIndividuales(id, codigo, inserto) {
    //console.log($('#circularInventario' + id),$('#circularInventario' + id).length);
    if ($('#circularInventario' + id).length === 0) return; // Si el circulo de carga no existe, no hacer nada
    let link = myLink + '/php/inventario/inserto/selectInserto.php?producto=' + codigo + '&inserto=' + inserto;
    servidor(link,
        function (respuesta) {
            var resultado = respuesta.responseText;
            var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'
            listaInfinita('contenidoInventarioInsertos' + id, '', arrayJson, enlistarInventarioInsertosIndividuales);
        }
    );
}

function enlistarInventarioInsertosIndividuales(arrayJson) {
    return `
    <ons-card class="botonPrograma" 
              style="padding:0; border-radius: 25px; border: 1px solid #a5a5a5; box-shadow: none; background: #fafafa;" 
              onclick="mensajeAlertaInventarioInserto(${arrayJson.inventario}, '${arrayJson.id}')">
        <ons-list-item modifier="nodivider" style="min-height: 38px; padding: 0 8px;">
            <div class="left">
                <i class="fas fa-box-open fa-lg" style="margin-left:10px;"></i> &nbsp;&nbsp;
                <span style="font-size: 12px; font-weight: 800; color: #484b50;">${arrayJson.id}</span>
            </div>
            <div class="right" style="display: flex; align-items: center; gap: 4px; padding: 0;">
                <span class="notification-moderna" style="background: #16a34a; font-size: 12px; padding: 1px 6px; color: white; min-width: 30px; text-align: center;">
                    ${separator(arrayJson.entrada)}
                </span>
                <i class="fa-solid fa-minus" style="font-size: 11px; color: #cbd5e1;"></i>
                <span class="notification-moderna" style="background: #94a3b8; font-size: 11px; padding: 1px 6px; color: white; min-width: 30px; text-align: center;">
                    ${separator(arrayJson.salida)}
                </span>
                <i class="fa-solid fa-equals" style="font-size: 9px; color: #cbd5e1;"></i>
                <span class="notification-moderna" style="background: #3a7cda; font-size: 12px; padding: 1px 8px; color: white; min-width: 55px; text-align: center;">
                    ${separator(arrayJson.inventario)} <small style="font-size: 8px;">pza(s)</small>
                </span>
            </div>
        </ons-list-item>
    </ons-card>
    `;
}

function mensajeAlertaInventarioInserto(inventario, id) {
    alertComfirmDato("Generar salida: ", "number", ["Cancelar", "Aceptar"],
        function (salida) {
            if (salida && salida <= inventario && salida > 0) {
                alertConfirm('Se generará la siguiente salida: <hr><b style="font-size:20pt">' + salida + ' Pzas.</b><hr> Estas seguro?', ["Cancelar", "Aceptar"],
                    function (i) {
                        if (i) {
                            //console.log("Salida generada para la caja: " + id + " con cantidad: " + idx);
                            alertComfirm("Deseas agregar alguna <b>NOTA</b> adicional?", ["No", "Si"],
                                function (j) {
                                    if (j) {
                                        alertComfirmDato("Observaciones: ", "text", ["Cancelar", "Enviar"],
                                            function (observaciones) {
                                                if (observaciones != null)
                                                    setAgregarSalidaInserto(id, salida, observaciones); // FUNCION EJECUTADA EN EL ARCHIVO SALIDAS.JS
                                            }
                                        );
                                    }
                                    else
                                        setAgregarSalidaInserto(id, salida, ""); // FUNCION EJECUTADA EN EL ARCHIVO SALIDAS.JS

                                }
                            );
                        }
                    }
                );
            }
            else if (salida) alerta("Porfavor verifica cantidad, no puede ser menor a 0 o mayor al inventario: " + inventario + " pza(s)");
        }
    )
}

function mensajeAlertaInventarioInsertoTodo(inserto, caja) {
    alertComfirm('<font size="3pt">Se generará la SALIDA DE TODO el inventario del Inserto!</font> <br> Estas seguro?', ["Cancelar", "Aceptar"],
        function (i) {
            if (i) {
                // FUNCION EJECUTADA EN EL ARCHIVO SALIDAS.JS
                alertComfirm("Deseas agregar alguna <b>NOTA</b> adicional?", ["No", "Si"],
                    function (j) {
                        if (j) {
                            alertComfirmDato("Observaciones: ", "text", ["Cancelar", "Enviar"],
                                function (observaciones) {
                                    if (observaciones != null)
                                        setGeneraraSalidaInsertoTodo(inserto, caja, observaciones); // FUNCION EJECUTADA EN EL ARCHIVO SALIDAS.JS
                                }
                            );
                        }
                        else
                            setGeneraraSalidaInsertoTodo(inserto, caja, ""); // FUNCION EJECUTADA EN EL ARCHIVO SALIDAS.JS

                    }
                );

            }
        }
    );
}


//// FIN SECCION INVENTARIO INSERTOS




//// INICIO SECCION INVENTARIO LAMINAS


function setMostrarInventarioLamina() {
    let busqueda = $('#searchLaminaInventario').val();
    let link = myLink + '/php/inventario/lamina/select.php?search=' + busqueda;
    oCarga("Cargando datos...");
    servidor(link,
        function (respuesta) {
            var resultado = respuesta.responseText;
            var arrayJson = resultado.split('|');
            //console.log(resultado);
            listaInfinita('datosLaminaInventario', '', arrayJson, enlistarInventarioLamina);
            cCarga();
        }
    );
}

function enlistarInventarioLamina(data) {
    // Estilizamos la lista de cajas para que no sea solo texto plano con <br>
    const cajas = data.cajas
        .map(caja => `
            <div style="font-size: 11px; color: #64748b; margin-top: 2px; display: flex; align-items: center; gap: 4px;">
                <i class="fa-solid fa-box "></i>
                <b style="color: #475569;">${caja.codigo}</b> ${caja.producto}
            </div>`)
        .join('');

    const perfil = validarPerfil();
    const accion = perfil !== "produccion"
        ? `onclick="mensajeAlertaInventarioLamina('${data.id}', ${data.inventario})"`
        : '';

    return `
    <ons-card class="botonPrograma" style="padding: 0; margin: 10px 12px; border-radius: 16px; border: 1px solid #f1f5f9; box-shadow: 0 4px 10px rgba(0,0,0,0.05); background: white;" ${accion}>
        <ons-list-header>
            <div class="badge-codigo" style="min-width: 45px; text-align: center; font-weight: 900;">
                ${data.id}
            </div>
        </ons-list-header>
        <ons-list-item modifier="nodivider" style="padding: 10px 0;">
            <div class="left" style="align-self: flex-start; margin-left: 12px;">
                <div class="producto-icon-wrapper">
                    <i class="fa-solid fa-clipboard-list fa-2x"></i>
                </div>
            </div>
            <div class="center romperTexto">
                <div style="display: flex; flex-direction: column; width: 100%;">
                    
                    <span style="font-size: 15px; color: #1e293b; line-height: 1.2; margin-bottom: 4px;">
                        <span style="font-weight: 800; color: #334155;">
                            ${esEntero(data.ancho)} X ${esEntero(data.largo)}
                        </span>
                        <span style="color: #94a3b8; margin: 0 4px;">|</span>
                        <b style="color: #64748b; font-size: 13px;">${data.resistencia} ${data.papel}</b>
                    </span>

                    <div style="height: 1px; background: #f1f5f9; margin: 6px 0;"></div>

                    <div style="display: flex; flex-direction: column;">
                        ${cajas}
                    </div>
                </div>
            </div>

            <div class="right" style="min-width: fit-content; align-self: center; padding-right: 10px;">
                <div class="pedido-cantidad-container">
                    <span class="pedido-cantidad-valor">${separator(data.inventario)}</span>
                    <span class="pedido-cantidad-label">pzas</span>
                </div>
            </div>

        </ons-list-item>
    </ons-card>
    `;
}
function mensajeAlertaInventarioLamina(id, inventario) {
    alertComfirmDato("Generar salida: ", "number", ["Cancelar", "Aceptar"],
        function (salida) {
            if (salida && salida <= inventario && salida > 0) {
                alertConfirm('Se generará la siguiente salida: <hr><b style="font-size:20pt">' + salida + ' Pzas.</b><hr> Estas seguro?', ["Cancelar", "Aceptar"],
                    function (i) {
                        if (i) {
                            //console.log("Salida generada para la caja: " + id + " con cantidad: " + idx);
                            alertComfirm("Deseas agregar alguna <b>NOTA</b> adicional?", ["No", "Si"],
                                function (j) {
                                    if (j) {
                                        alertComfirmDato("Observaciones: ", "text", ["Cancelar", "Enviar"],
                                            function (observaciones) {
                                                if (observaciones != null)
                                                    setAgregarSalidaLamina(id, salida, observaciones); // FUNCION EJECUTADA EN EL ARCHIVO SALIDAS.JS
                                            }
                                        );
                                    }
                                    else
                                        setAgregarSalidaLamina(id, salida, ""); // FUNCION EJECUTADA EN EL ARCHIVO SALIDAS.JS

                                }
                            );
                        }
                    }
                );
            }
            else if (salida) alerta("Porfavor verifica cantidad, no puede ser menor a 0 o mayor al inventario: " + inventario + " pza(s)");
        }
    )

}


//// FIN SECCION INVENTARIO LAMINAS
