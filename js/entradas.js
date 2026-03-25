//var entrada;

//funcion para editar cantidad de entradas y salidas productos

document.addEventListener('init', function (event) {
    var page = event.target;
    if (page.id === 'cajaEntradas') {
        setMostrarEntradaCajas();
        tabsCargadosP = {
            'insertoEntradas.html': false,
            'laminaEntradas.html': false,
        };
        //VARIABLE tabsCargadosP DECLARADA EN pedidos.js
    }
});

//FUNCION PARA VERIFICAR QUE SOLO SE DIO UN CLICK AL TAB DEL PAGE
document.addEventListener('postchange', function (event) {
    const pageName = event.tabItem.getAttribute('page');
    // Solo ejecuta la función si es la primera vez que se activa este tab
    switch (pageName) {

        case 'insertoEntradas.html':
            if (!tabsCargadosP['insertoEntradas.html']) {
                setMostrarEntradasInserto()
                tabsCargadosP['insertoEntradas.html'] = true;
            }
            break;
        case 'laminaEntradas.html':
            if (!tabsCargadosP['laminaEntradas.html']) {
                setMostrarEntradaLaminas();
                tabsCargadosP['laminaEntradas.html'] = true;
            }
            break;
    }
});

/// NUEVAS FUNCIONES PARA ENTRADAS 

function setMostrarEntradaCajas() {
    oCarga("Cargando datos...");
    let busqueda = $("#searchEntradaCaja").val();
    let fecha = $("#fechaEntradaCaja").val();
    let link = myLink + "/php/entrada/caja/select.php?search=" + busqueda + "&fecha=" + fecha;
    //console.log(link);
    servidor(link,
        function (respuesta) {
            var resultado = respuesta.responseText;
            var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'

            listaInfinita('datosCajaEntrada', '', arrayJson, enlistarEntradasCajas);
            cCarga();
        }
    );
}

function enlistarEntradasCajas(arrayJson) {
    var observaciones = arrayJson.observaciones == "" ? "" : '<br><i style="color: rgb(115, 168, 115)" class="fa-solid fa-comment-dots fa-2x"></i>&nbsp;<font size="2pt">' + arrayJson.observaciones + "</font>";
    let perfil = validarPerfil();
    let accion;
    if (perfil != "produccion") accion = `onclick="opcionesEntradasCajas(${arrayJson.id})"`;
    let html = `
        <ons-card style="padding:0px; background: #dff3df;" class="botonPrograma" ${accion}>
            <ons-lit-header class="pedido-header" style="background: rgba(255, 255, 255, 0.7); border-radius: 20px 20px 0 0;">
                <div class="header-left">
                    <span class="pedido-id">#${arrayJson.id_lp}</span>
                </div>
                <b class="pedido-entrega-status" style="color: rgb(61, 174, 80);">
                    <i class="far fa-calendar" style="color:rgb(61, 174, 80);"></i>
                    &nbsp; ${sumarDias(arrayJson.fecha, 0)}
                    </b>
            </ons-lit-header>
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
                        <span class="pedido-cantidad-valor">${separator(arrayJson.cantidad)}</span>
                        <span class="pedido-cantidad-label">pzas</span>
                    </div>
                </div>
            </ons-list-item>
        </ons-card>
    `;

    return html;
}

function setMostrarEditarEntradaCajas(id) {
    oCarga("Cargando datos...");
    servidor(myLink + "/php/entrada/caja/select.php?id=" + id,
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
            alerta("Antes de editar una entrada asegurate de que la SALIDA sea igual o menor a la ENTRADA o que el registro en salida no exista...!!!", "IMPORTANTE");
        });
}

function setEditarCajaEntrada() {
    let id = $("#id").val();
    let obs = $("#observaciones").val().toUpperCase();
    let cantidad = $("#cantidad").val();
    if (cantidad > 0) {
        let link = myLink + "/php/entrada/caja/update.php?id=" + id + "&observaciones=" + obs + "&cantidad=" + cantidad;
        servidor(link,
            function (respuesta) {
                respuesta = respuesta.responseText;
                if (respuesta) {
                    alerta("Entrada Editada, Correctamente!");
                    resetearPilaFunction(setMostrarEntradaCajas);
                }
                else alerta("Hubo un error al editar");
            }
        );
    }
    else alerta("La cantidad tiene que ser mayor a 0");
    //console.log(id, obs, cantidad);
}

function opcionesEntradasCajas(id) {

    mensajeArriba("Opciones",
        [
            '<i class="fas fa-pen-to-square"></i>&nbsp;Editar',
            {
                label: '<i class="fas fa-times" style="color:red"></i>&nbsp;Cancelar',
                modifier: 'destructive'
            }
        ],
        function (opc) {
            if (opc == 0)
                nextPageFunction("cajaEditarEntradas.html",
                    function () {
                        setMostrarEditarEntradaCajas(id);
                    }
                );
        }
    );
}


//// INICIO DE FUNCIONES PARA ENTRADAS INSERTOS

function setMostrarEntradasInserto() {
    oCarga("Cargando datos...");
    let busqueda = $("#searchEntradaInserto").val();
    let fecha = $("#fechaEntradInserto").val();
    servidor(myLink + "/php/entrada/inserto/select.php?search=" + busqueda + "&fecha=" + fecha,
        function (respuesta) {
            var resultado = respuesta.responseText;
            var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'

            listaInfinita('datosInsertoEntrada', '', arrayJson, enlistarEntradasInserto);
            cCarga();
        }
    );
}

function enlistarEntradasInserto(arrayJson) {
    // Usamos el mismo formato de observaciones que te gusta
    var observaciones = arrayJson.observaciones == "" ? "" : '<br><i style="color: rgb(115, 168, 115)" class="fa-solid fa-comment-dots fa-2x"></i>&nbsp;<font size="2pt">' + arrayJson.observaciones + "</font>";

    let perfil = validarPerfil();
    let accion;
    if (perfil != "produccion") accion = `onclick="opcionesEntradasInserto(${arrayJson.id})"`;

    let html = `
        <ons-card style="padding:0px; background: #dff3df;" class="botonPrograma" ${accion}>
            <ons-list-header class="pedido-header" style="background: rgba(255, 255, 255, 0.7); border-radius: 20px 20px 0 0; display: flex; justify-content: space-between;">
                <div class="header-left">
                    <span class="pedido-id">#${arrayJson.id_lp}</span>
                </div>
                <b class="pedido-entrega-status" style="color: rgb(61, 174, 80);">
                    <i class="far fa-calendar" style="color:rgb(61, 174, 80);"></i>
                    &nbsp;${sumarDias(arrayJson.fecha, 0)}
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
                        <div style="color: rgb(61, 174, 80); font-weight: bold;">Resistencia: ${arrayJson.resistencia}</div>
                        ${observaciones}
                    </span>
                </div>
                </div>
                <div class="right">
                    <div class="pedido-cantidad-container">
                        <span class="pedido-cantidad-valor">${separator(arrayJson.cantidad)}</span>
                        <span class="pedido-cantidad-label">pzas</span>
                    </div>
                </div>
            </ons-list-item>
        </ons-card>
    `;

    return html;
}

function setMostrarEditarEntradaInserto(id) {
    oCarga("Cargando datos...");
    servidor(myLink + "/php/entrada/inserto/select.php?id=" + id,
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
            alerta("Antes de editar una entrada asegurate de que la SALIDA sea igual o menor a la ENTRADA o que el registro en salida no exista...!!!", "IMPORTANTE");
        });
}

function setEditarInsertoEntrada() {
    let id = $("#id").val();
    let obs = $("#observaciones").val().toUpperCase();
    let cantidad = $("#cantidad").val();
    //console.log(setMostrarEntradasInserto);
    if (cantidad > 0) {
        let link = myLink + "/php/entrada/inserto/update.php?id=" + id + "&observaciones=" + obs + "&cantidad=" + cantidad;
        servidor(link,
            function (respuesta) {
                respuesta = respuesta.responseText;
                //cons
                if (respuesta) {
                    alerta("Entrada Editada, Correctamente!");
                    resetearPilaFunction(setMostrarEntradasInserto);
                }
                else alerta("Hubo un error al editar");
            }
        );
    }
    else alerta("La cantidad tiene que ser mayor a 0");
    //console.log(id, obs, cantidad);
}

function opcionesEntradasInserto(id) {

    mensajeArriba("Opciones",
        [
            '<i class="fas fa-pen-to-square"></i>&nbsp;Editar',
            {
                label: '<i class="fas fa-times" style="color:red"></i>&nbsp;Cancelar',
                modifier: 'destructive'
            }
        ],
        function (opc) {
            if (opc == 0)
                nextPageFunction("insertoEditarEntradas.html",
                    function () {
                        setMostrarEditarEntradaInserto(id);
                    }
                );
        }
    );
}

////  INICIO PARA ENTRADAS DE LAMINA

function setMostrarEntradaLaminas() {
    oCarga("Cargando datos...");
    let busqueda = $("#searchLaminaInventario").val();
    servidor(myLink + "/php/entrada/lamina/select.php?search=" + busqueda,
        function (respuesta) {
            var resultado = respuesta.responseText;
            var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'

            listaInfinita('datosLaminaInventario', '', arrayJson, enlistarEntradasLamina);
            cCarga();
        }
    );
}

function enlistarEntradasLamina(arrayJson) {
    // Generamos la lista de cajas con un estilo más limpio
    let cajasHtml = "";
    arrayJson.cajas.forEach(caja => {
        cajasHtml += `<div style="font-size: 11px; color: #475569; margin-bottom: 2px;">
                        <i class="fas fa-caret-right" style="font-size: 10px; opacity: 0.5;"></i> 
                        <b>${caja.codigo}</b> ${caja.producto}
                      </div>`;
    });

    var observaciones = arrayJson.observaciones == "" ? "" :
        `<div style="margin-top: 8px; border-top: 1px dashed rgba(61, 174, 80, 0.3); padding-top: 6px;">
            <i style="color: rgb(115, 168, 115)" class="fa-solid fa-comment-dots fa-2x"></i>&nbsp;
            <span style="font-size: 11px; color: #2e7d32;">${arrayJson.observaciones}</span>
        </div>`;

    let perfil = validarPerfil();
    let accion = (perfil != "produccion") ? `onclick="opcionesEntradasLamina(${arrayJson.id})"` : "";

    return `
        <ons-card style="padding:0px; background: #dff3df;" class="botonPrograma" ${accion}>
            <ons-list-header class="pedido-header" style="background: rgba(255, 255, 255, 0.7); border-radius: 20px 20px 0 0; display: flex; justify-content: space-between;">
                <div class="header-left">
                    <span class="pedido-id">#${arrayJson.id_lp}</span>
                </div>
                <b class="pedido-entrega-status" style="color: rgb(61, 174, 80);">
                    <i class="far fa-calendar" style="color:rgb(61, 174, 80);"></i>
                    &nbsp; Recibido: ${sumarDias(arrayJson.fecha, 0)}
                </b>
            </ons-list-header>

            <ons-list-item modifier="nodivider">
                <div class="left">
                    <div class="producto-icon-wrapper">
                        <i class="fas fa-sheet-plastic fa-2x"></i>
                    </div>
                </div>

                <div class="center" style="padding: 6px 0;">
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
                        <span class="pedido-cantidad-valor">${separator(arrayJson.cantidad)}</span>
                        <span class="pedido-cantidad-label">pzas</span>
                    </div>
                </div>
            </ons-list-item>
        </ons-card>
    `;
}

function setMostrarEditarEntradaLamina(id) {
    oCarga("Cargando datos...");
    servidor(myLink + "/php/entrada/lamina/select.php?id=" + id,
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
            alerta("Antes de editar una entrada asegurate de que la SALIDA sea igual o menor a la ENTRADA o que el registro en salida no exista...!!!", "IMPORTANTE");
        });
}

function setEditarLaminaEntrada() {
    let id = $("#id").val();
    let obs = $("#observaciones").val().toUpperCase();
    let cantidad = $("#cantidad").val();
    if (cantidad > 0) {
        let link = myLink + "/php/entrada/lamina/update.php?id=" + id + "&observaciones=" + obs + "&cantidad=" + cantidad;
        servidor(link,
            function (respuesta) {
                respuesta = respuesta.responseText;
                if (respuesta) {
                    alerta("Entrada Editada, Correctamente!");
                    resetearPilaFunction(setMostrarEntradaLaminas);
                }
                else alerta("Hubo un error al editar");
            }
        );
    }
    else alerta("La cantidad tiene que ser mayor a 0");
    //console.log(id, obs, cantidad);
}

function opcionesEntradasLamina(id) {

    mensajeArriba("Opciones",
        [
            '<i class="fas fa-pen-to-square"></i>&nbsp;Editar',
            {
                label: '<i class="fas fa-times" style="color:red"></i>&nbsp;Cancelar',
                modifier: 'destructive'
            }
        ],
        function (opc) {
            if (opc == 0)
                nextPageFunction("laminaEditarEntradas.html",
                    function () {
                        setMostrarEditarEntradaLamina(id);
                    }
                );
        }
    );
}

/// FIN FUNCIONES NUEVAS ENTRADAS
