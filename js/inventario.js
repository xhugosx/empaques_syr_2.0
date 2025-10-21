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
    let html = `
        <ons-card style="padding:0px;" class="botonPrograma"
            onclick="nextPageFunction('cajaInventario.html', function() {
            setMostrarInventarioCajas('${arrayJson.codigo}')
            })">
            <ons-list-item modifier="chevron nodivider">
            <div class="left">
                <strong>${agregarCeros(arrayJson.codigo)}</strong>
            </div>
            <div class="center">
                ${arrayJson.cliente}
            </div>
            <div class="right">
                <span class="notification">${arrayJson.cantidad_productos}</span>
            </div>
            </ons-list-item>
        </ons-card>
    `;
    return html;
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
            <i class="fa-solid fa-box fa-2x"></i>
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
            <font size="5px"><b>
                ${separator(arrayJson.inventario)} <font size="2px">pza(s)</font>
            </b>
            </font>
            <i class="fa-solid fa-chevron-down" style="color:#c7c7cc;"></i>
        </div>
        <div class="expandable-content" style="padding: 0px; margin: 0px;">
            <ons-list style="background: rgba(76, 175, 80, 0.0) ">
                <ons-lazy-repeat id="contenidoInventarioCajas${i}">
                    <center>
                        <ons-progress-circular id="circularInventario${i}" indeterminate></ons-progress-circular>
                    </center>
                </ons-lazy-repeat>
                <ons-button modifier="large" style="width:98%" onclick="mensajeAlertaInventarioCajaTodo('${arrayJson.codigo}')">
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
    let html = `<ons-card class="botonPrograma" 
    style="padding:0; margin-bottom: 5px; border: 1px solid black;" onclick="mensajeAlertaInventarioCaja(${arrayJson.inventario}, '${arrayJson.id}')">
        <ons-list-item modifier="nodivider">
            <div class="center">
                <b>${arrayJson.id}</b>
            </div>
            <div class="right" style="padding: 0px 12px 0px 0px;">
            <span class="notification" style="background: rgb(61, 174, 80)" >
                ${separator(arrayJson.entrada)}
            </span>
            <i class="fa-solid fa-minus"></i>
            <span class="notification">
                ${separator(arrayJson.salida)}
            </span>
            <i class="fa-solid fa-equals"></i>
            <span class="notification" style="background: rgb(8, 136, 205);">
                ${separator(arrayJson.inventario)} <font size="2px">pza(s)</font>
            </span>
            </div>
        </ons-list-item>
        </ons-card>
    `;
    return html;
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
                <strong>${agregarCeros(arrayJson.codigo)}</strong>
            </div>
            <div class="center">
                ${arrayJson.cliente}
            </div>
            <div class="right">
                <span class="notification">${arrayJson.cantidad_productos}</span>
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
            <ons-list-item modifier="nodivider" onclick="//setMostrarInventarioCajasIndividuales('${arrayJson.codigo}',${i})">
                <div class="left">
                    <i class="fa-solid fa-box fa-2x"></i>
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
                style="padding:0; margin-bottom: 2px; border: 1px solid black;">
                <ons-list-item modifier="nodivider" ${accion} >
                    <div class="left">
                        <i class="fa-solid fa-box-open fa-1x"></i>
                    </div>
                    <div class="center">
                        <b>${inserto.tipo_inserto}</b> &nbsp;|&nbsp; <span style="font-size:9pt">${inserto.resistencia}</span>   
                    </div>
                    <div class="right" style="white-space: nowrap;">
                        <font size="5px">
                            <b>
                                ${separator(inserto.inventario)} <font size="2px">pza(s)</font>
                            </b>
                        </font>
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
    let html = `
        <ons-card class="botonPrograma" 
        style="padding:0; margin-bottom: 5px; border: 1px solid black;" onclick="mensajeAlertaInventarioInserto(${arrayJson.inventario}, '${arrayJson.id}')">
            <ons-list-item modifier="nodivider">
                <div class="center">
                    <b>${arrayJson.id}</b>
                </div>
                <div class="right" style="padding: 0px 12px 0px 0px;">
                    <span class="notification" style="background: rgb(61, 174, 80)" >
                        ${separator(arrayJson.entrada)}
                    </span>
                    <i class="fa-solid fa-minus"></i>
                    <span class="notification">
                        ${separator(arrayJson.salida)}
                    </span>
                    <i class="fa-solid fa-equals"></i>
                    <span class="notification" style="background: rgb(8, 136, 205);">
                        ${separator(arrayJson.inventario)} <font size="2px">pza(s)</font>
                    </span>
                </div>
            </ons-list-item>
        </ons-card>
    `;
    return html;
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

function enlistarInventarioLamina(arrayJson) {
    let cajas = "";
    arrayJson.cajas.forEach(caja => {
        cajas += caja.codigo + ' ' + caja.producto + "<br>";
    });
    let perfil = validarPerfil();
    let accion;
    if (perfil != "produccion") accion = `onclick="mensajeAlertaInventarioLamina('${arrayJson.id}', ${arrayJson.inventario})"`;
    let html = `
        <ons-card style="padding:0px;" class="botonPrograma" ${accion}>
            <ons-list-item modifier="nodivider" >
                <div class="left">
                    <strong>${arrayJson.id}</strong>
                </div>
                <div class="center romperTexto">
                    <span class="list-item__title">${esEntero(arrayJson.ancho)} X ${esEntero(arrayJson.largo)} | <b>${arrayJson.resistencia} ${arrayJson.papel}</b></span>
                    <span class="list-item__subtitle">
                    ${cajas}
                    </span>
                </div>
                <div class="right">
                    <div class="centrar">
                    <span class="notification"><font size="2px">${separator(arrayJson.inventario)} pza(s)</font></span>
                    </div>
                </div>
                <div>hola</div>
            </ons-list-item>
        </ons-card>
    `;
    return html
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
