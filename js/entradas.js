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
        <ons-card style="padding:0px;" class="botonPrograma" ${accion}>
            <ons-list-header style="background: white">
                ${arrayJson.id_lp} &nbsp;&nbsp;<b style="color: rgb(61, 174, 80);">Terminado: ${sumarDias(arrayJson.fecha, 0)}</b>
            </ons-list-header>
            <ons-list-item modifier="nodivider">
                <div class="left">
                    <i class="fa-solid fa-box fa-2x"></i>
                </div>
                <div class="center">
                    <span class="list-item__title"><b>${arrayJson.codigo}</b>&nbsp;${arrayJson.producto}</span>
                    <span class="list-item__subtitle">
                    ${arrayJson.nombre}
                    ${observaciones}
                    </span>
        
                </div>
                <div class="right">
                    <span class="notification" style="background: rgb(61, 174, 80);">
                        ${separator(arrayJson.cantidad)} <font size="2px">pza(s)</font>
                    </span>
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
    var observaciones = arrayJson.observaciones == "" ? "" : '<i style="color: rgb(115, 168, 115)" class="fa-solid fa-comment-dots fa-2x"></i>&nbsp;<font size="2pt">' + arrayJson.observaciones + "</font>";
    let perfil = validarPerfil();
    let accion;
    if (perfil != "produccion") accion = `onclick="opcionesEntradasInserto(${arrayJson.id})"`;
    let html1 = `
        <ons-card style="padding:0px;" class="botonPrograma" >
            <ons-list-header style="background: white">
                ${arrayJson.id_lp} &nbsp;&nbsp;<b style="color: rgb(61, 174, 80);">Terminado: ${sumarDias(arrayJson.fecha, 0)}</b>
            </ons-list-header>
            <ons-list-item modifier="nodivider">
                <div class="left">
                    <i class="fa-solid fa-box-open fa-2x"></i>
                </div>
                <div class="center">
                    
                    <span class="list-item__subtitle">
                        <b>${arrayJson.codigo}</b>&nbsp;${arrayJson.producto} - ${arrayJson.nombre}
                        <br>
                        ${observaciones}
                    </span>
                    <span class="list-item__title">
                        <b>${arrayJson.inserto}</b> | ${arrayJson.resistencia}
                    </span>
                </div>
                <div class="right">
                    <span class="notification" style="background: rgb(61, 174, 80);">
                        ${separator(arrayJson.cantidad)} <font size="2px">pza(s)</font>
                    </span>
                </div>
            </ons-list-item>
        </ons-card>
    `;


    return html1;
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
    if (cantidad > 0) {
        let link = myLink + "/php/entrada/caja/update.php?id=" + id + "&observaciones=" + obs + "&cantidad=" + cantidad;
        servidor(link,
            function (respuesta) {
                respuesta = respuesta.responseText;
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

function setEditarInsertoEntrada() {
    let id = $("#id").val();
    let obs = $("#observaciones").val().toUpperCase();
    let cantidad = $("#cantidad").val();
    if (cantidad > 0) {
        let link = myLink + "/php/entrada/inserto/update.php?id=" + id + "&observaciones=" + obs + "&cantidad=" + cantidad;
        servidor(link,
            function (respuesta) {
                respuesta = respuesta.responseText;
                if (respuesta) {
                    alerta("Entrada Editada, Correctamente!");
                    resetearPilaFunction(setMostrarEntradaInserto);
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
    let cajas = "";
    arrayJson.cajas.forEach(caja => {
        cajas += caja.codigo + ' ' + caja.producto + "<br>";
    });
    var observaciones = arrayJson.observaciones == "" ? "" : '<div><i style="color: rgb(115, 168, 115)" class="fa-solid fa-comment-dots fa-2x"></i>&nbsp;<font size="2pt">' + arrayJson.observaciones + "</font></div>";
    let perfil = validarPerfil();
    let accion;
    if (perfil != "produccion") accion = `onclick="opcionesEntradasLamina(${arrayJson.id})"`;
    let html = `
        <ons-card style="padding:0px;" class="botonPrograma" ${accion}>
            <ons-list-header style="background: white">
                ${arrayJson.id_lp} &nbsp;&nbsp;<b style="color: rgb(61, 174, 80);">Recibido: ${sumarDias(arrayJson.fecha, 0)}</b>
            </ons-list-header>
            <ons-list-item modifier="nodivider" onclick="">
                <div class="left">
                    <i class="fas fa-sheet-plastic fa-2x"></i>
                </div>
                <div class="center romperTexto">
                    <span class="list-item__title">${esEntero(arrayJson.ancho)} X ${esEntero(arrayJson.largo)} | <b>${arrayJson.resistencia} ${arrayJson.papel}</b></span>
                    <span class="list-item__subtitle">
                    ${cajas}
                    ${observaciones}
                    </span>
                </div>
                <div class="right">
                    <div class="centrar">
                    <span class="notification" style="background: rgb(61, 174, 80);"><font size="2px">${separator(arrayJson.cantidad)} pza(s)</font></span>
                    </div>
                </div>
                <div>hola</div>
            </ons-list-item>
        </ons-card>
    `;
    return html
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
