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
    var observaciones = arrayJson.observaciones == "" ? "" : '<br><i style="color: rgb(115, 168, 115)" class="fa-solid fa-comment-dots fa-2x"></i>&nbsp;<font size="2pt">' + arrayJson.observaciones + "</font>";
    let perfil = validarPerfil();
    let accion;
    if (perfil != "produccion") accion = `onclick="opcionesSalidasCajas(${arrayJson.id})"`;
    let html = `
        <ons-card style="padding:0px;" class="botonPrograma" ${accion} >
            <ons-list-header style="background: white">
                ${arrayJson.id_lp} &nbsp;&nbsp;<b style="color: red;">Terminado: ${sumarDias(arrayJson.fecha, 0)}</b>
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
                    <span class="notification" >
                        ${separator(arrayJson.cantidad)} <font size="2px">pza(s)</font>
                    </span>
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
            else if (opc == 1) setEliminarSalidaCaja(id);
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
    var observaciones = arrayJson.observaciones == "" ? "" : '<i style="color: rgb(115, 168, 115)" class="fa-solid fa-comment-dots fa-2x"></i>&nbsp;<font size="2pt">' + arrayJson.observaciones + "</font>";
    let perfil = validarPerfil();
    let accion;
    if (perfil != "produccion") accion = `onclick="opcionesSalidasInserto(${arrayJson.id})"`;
    let html1 = `
        <ons-card style="padding:0px;" class="botonPrograma" ${accion} >
            <ons-list-header style="background: white">
                ${arrayJson.id_lp} &nbsp;&nbsp;<b style="color: red;">Terminado: ${sumarDias(arrayJson.fecha, 0)}</b>
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
                    <span class="notification" >
                        ${separator(arrayJson.cantidad)} <font size="2px">pza(s)</font>
                    </span>
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
        let link = myLink + "/php/salida/caja/update.php?id=" + id + "&observaciones=" + obs + "&cantidad=" + cantidad;
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
                    resetearPilaFunction(setMostrarSalidaInserto);
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
            else if (opc == 1) setEliminarSalidaInserto(id);
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
    let cajas = "";
    arrayJson.cajas.forEach(caja => {
        cajas += caja.codigo + ' ' + caja.producto + "<br>";
    });
    var observaciones = arrayJson.observaciones == "" ? "" : '<div><i style="color: rgb(115, 168, 115)" class="fa-solid fa-comment-dots fa-2x"></i>&nbsp;<font size="2pt">' + arrayJson.observaciones + "</font></div>";
    let perfil = validarPerfil();
    let accion;
    if (perfil != "produccion") accion = `onclick="opcionesSalidasLamina(${arrayJson.id})"`;
    let html = `
        <ons-card style="padding:0px;" class="botonPrograma" ${accion} >
            <ons-list-header style="background: white">
                ${arrayJson.id_lp} &nbsp;&nbsp;<b style="color: red;">Recibido: ${sumarDias(arrayJson.fecha, 0)}</b>
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
                    <span class="notification" ><font size="2px">${separator(arrayJson.cantidad)} pza(s)</font></span>
                    </div>
                </div>
                <div>hola</div>
            </ons-list-item>
        </ons-card>
    `;
    return html
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