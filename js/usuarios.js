document.addEventListener('init', function (event) {
    var page = event.target;
    //const pagesPermitidas = ['almacen'];

    if (page.id == "administracion" || page.id=== 'almacen')
        setTimeout(() => {
            remover();
        }, 1);

});



function remover() {
    let perfil = validarPerfil();
    if (perfil) {
        let perfiles = ["finanzas", "produccion", "administrador", "root"];
        // Recorre todos los elementos que tengan alguna clase de perfil
        perfiles.forEach(p => {
            $("." + p).each(function () {
                const clases = $(this).attr("class").split(/\s+/);

                // Si NO tiene la clase del perfil actual, se elimina
                if (!clases.includes(perfil)) {
                    $(this).remove();
                }
            });
        });
    } else {
        alerta("Perfil no válido o no encontrado.");
    }
}
function validarPerfil() {
    let perfil = localStorage.getItem("perfil");
    if (!perfil) return false;
    let perfiles = ["finanzas", "produccion", "administrador", "root"];
    return perfiles[perfil - 1];
}


function setUsuarios() {
    oCarga("Cargando usuarios...");
    let search = $('#searchUsuarios').val();
    let link = myLink + "/php/usuarios/select.php?search=" + search;
    servidor(link,
        function (respuesta) {
            let resultado = respuesta.responseText;
            var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'
            //alert("entro");

            listaInfinita('datosUsuarios', '', arrayJson, enlistarUsuarios);
            cCarga();
        }
    )
}
function setAgregarUsuario() {
    let nombre = $("#nombre").val();
    let contrasena1 = $("#contrasenaUsuario1").val();
    let contrasena = $("#contrasenaUsuario").val();
    let perfil = $("#perfil").val();

    if (contrasena1 != contrasena) {
        alerta("Las contraseñas no coinciden");
        return;
    }
    if (/\s/.test(nombre)) {
        alerta("El campo usuario no puede contener espacios");
        return;
    }

    if (vacio(nombre, contrasena1, contrasena, perfil)) {
        oCarga("Agregando usuario...");
        let link = myLink + "/php/usuarios/add.php?nombre=" + nombre + "&contrasena=" + contrasena + "&perfil=" + perfil;
        servidor(link,
            function (respuesta) {
                let resultado = respuesta.responseText;
                if (resultado == 1) {
                    alerta("Usuario Agregado...");
                    resetearPilaFunction(setUsuarios);
                }
                else alerta("Hubo un error al agregar el usuario");
                cCarga();
            }
        );
    }
    else alerta("Campos Vacios");

}
function setEditarUsuario() {
    let id = $('#id').val();
    let nombre = $("#nombre").val();
    let perfil = $("#perfil").val();
    if (/\s/.test(nombre)) {
        alerta("El campo usuario no puede contener espacios");
        return;
    }

    if (vacio(nombre, perfil)) {
        oCarga("Editando usuario...");
        let link = myLink + "/php/usuarios/update.php?nombre=" + nombre + "&perfil=" + perfil + "&id=" + id;
        //console.log(link);
        servidor(link,
            function (respuesta) {
                let resultado = respuesta.responseText;
                if (resultado == 1) {
                    alerta("Usuario Editado...");
                    resetearPilaFunction(setUsuarios);
                }
                else alerta("Hubo un error al editar el usuario");
                cCarga();
            }
        );
    }

}

function setEliminarUsuario(id) {
    let link = myLink + "/php/usuarios/delete.php?id=" + id;
    servidor(link,
        function (respuesta) {
            let resultado = respuesta.responseText;
            if (resultado) {
                alerta("Usuario eliminado");
                setUsuarios();
            }
            else alerta("Hubo un error al tratar de eliminar el usuario");
        }
    );
}

// Tiempo máximo de inactividad en milisegundos (ej: 15 min)
const INACTIVITY_LIMIT = 10 * 60 * 1000;
//const INACTIVITY_LIMIT = 5000;

// Tiempo para responder alerta antes de cerrar sesión (ej: 1 min)
const ALERT_TIMEOUT = 60 * 1000;
//const ALERT_TIMEOUT = 5000;

let inactivityTimer;
let alertaTimer;

// Inicia el contador de inactividad
function iniciarContadorInactividad() {
    // Cada vez que haya interacción, reinicia el timer
    ['mousemove', 'keydown', 'click', 'touchstart'].forEach(evt => {
        document.addEventListener(evt, reiniciarTimer);
    });

    reiniciarTimer(); // inicia al cargar
}

// Reinicia el timer de inactividad
function reiniciarTimer() {
    if (inactivityTimer) clearTimeout(inactivityTimer);
    if (alertaTimer) clearTimeout(alertaTimer);

    // Programar alerta después de tiempo límite
    inactivityTimer = setTimeout(() => {
        preguntarSiActivo();
    }, INACTIVITY_LIMIT);
}

// Pregunta al usuario si sigue activo
function preguntarSiActivo() {
    // Llamamos a tu función de alerta, que debe ser bloqueante o prometer respuesta

    if (!localStorage.getItem("usuario")) {
        // Si ya no hay usuario, cancelar alerta y limpiar timers
        clearTimeout(alertaTimer);
        return;
    }

    alertaFunction("¿Sigues activo en el sistema?", '',
        function () {
            reiniciarTimer();
            clearTimeout(alertaTimer);
        }
    );

    // Esperar respuesta del usuario con timeout
    alertaTimer = setTimeout(() => {
        // Si no responde a tiempo, cerrar sesión automáticamente
        localStorage.clear(); // borramos el local storage
        resetarInicio(); // mandamos al primer page
        $('ons-alert-dialog').remove(); // forzamos eliminar el alert
        alertaActiva = false; //reiniciamos la variable para que muestre mas alert

    }, ALERT_TIMEOUT);


}

function cerrarSesion() {
    let b = ['<i class="fas fa-times"></i>&nbsp;Cancelar', 'Aceptar&nbsp;<i class="fa fa-check"></i>'];
    alertConfirm('<i class="fa-solid fa-triangle-exclamation"></i><hr>Estas seguro de Cerrar sesion?', b,
        function (index) {
            if (index) {
                localStorage.clear();
                resetarInicio(); //FUNCION QUE ME REGRESA AL INICIO DE LA PILA
            }
        }
    );

}

function setInicio() {
    let usuario = $('#usuario').val();
    let contrasena = $('#contrasena').val();

    if (vacio(usuario, contrasena)) {
        oCarga("Iniciando Sesion...");
        var form = $('#formSesion')[0];
        var formData = new FormData(form);
        let link = myLink + "/php/usuarios/inicioSesion.php";
        servidorPost(link,
            function (respuesta) {
                let resultado = respuesta.responseText;
                let json = JSON.parse(resultado);
                //console.log(json);
                if (json.estatus == 1) {
                    nextPage("home.html");
                    alerta('Bienvenido: <hr><h4>' + tipoPerfil(json.perfil) + '</h4><h3>' + json.nombre + '</h3>');
                    localStorage.setItem("usuario", json.nombre);
                    localStorage.setItem("id", json.id);
                    localStorage.setItem("perfil", json.perfil);
                    //localStorage.setItem("perfil", json.perfil);
                }
                else if (json.error) alerta(json.error);
                else alerta("Usuario bloqueado, solicite al encargado Desbloquear...", '<i class="fa-solid fa-triangle-exclamation"></i>');
                cCarga();
            }
            , formData);
    }
    else alerta("Datos Vacios!");
}

function enlistarUsuarios(arrayJson) {
    let estatus = arrayJson.estatus == 1 ? "checked" : "";
    let root = arrayJson.perfil == 4 ? "disabled" : "";
    const html = `
        <ons-card style="padding:0px;" class="botonPrograma">
            <ons-list-header>
                ${tipoPerfil(arrayJson.perfil)}
            </ons-list-header>
            <ons-list-item modifier="nodivider">


                <div class="left">
                    <span style="position: relative; display: inline-block;">
                        <i class="fas fa-user fa-2x"></i>
                    </span>
                </div>

                <div class="center" onclick="opcionesUsuaio(${arrayJson.id},'${arrayJson.nombre}')">
                    <span class="list-item__title"><b>[ ${arrayJson.id} ] ${arrayJson.nombre} </b></span>
                    <span class="list-item__subtitle" style="font-size:14px">
                        Contraseña: ******
                    </span>
                </div>

                <div class="right"
                    style="display:flex; flex-direction:column; align-items:flex-end; gap:4px; white-space: nowrap;">
                    <span class="list-item__title">
                        Estatus
                    </span>
                    <span class="list-item_subtitle">
                        <ons-switch id="estatus${arrayJson.id}" onclick="switchsUsuario( ${arrayJson.id})" ${estatus} ${root}></ons-switch>
                    </span>
                </div>

            </ons-list-item>
        </ons-card>
    `;
    return html;
}
function tipoPerfil(perfil) {
    let perfiles = ["📈 Finanzas", "⚙️ Produccion", "👨‍💼 Administrador", "🔑 Root"];
    return perfiles[perfil - 1];
}

function switchsUsuario(id) {
    let estatus = $('#estatus' + id)[0].checked;
    estatus = estatus ? 1 : 0;
    let link = myLink + "/php/usuarios/estatus.php?id=" + id + "&estatus=" + estatus;
    //console.log(id, estatus);
    oCarga("Cambiando estatus...");
    servidor(link,
        function (respuesta) {
            let resultado = respuesta.responseText;
            if (resultado == 0) {
                $('#estatus')[0].checked = estatus ? false : true;
                alerta("Hubo un error al cambiar el estatus");
            }
            cCarga();
        }
    );
}



function opcionesUsuaio(id, nombre) {
    let botones = [
        '<i class="fas fa-eye"></i>&nbsp;Ver Contraseña',
        '<i class="fas fa-pen-to-square"></i>&nbsp;Editar',
        {
            label: '<i class="fas fa-trash" style="color:red"></i>&nbsp;Eliminar',
            modifier: 'destructive'
        }
    ]

    mensajeArriba("Opciones para: " + nombre, botones,
        function (index) {
            if (index == 0) {
                oCarga("Cargando contraseña...");
                let link = myLink + "/php/usuarios/pass.php?id=" + id + "&nombre=" + nombre;

                servidor(link,
                    function (respuesta) {
                        let resultado = respuesta.responseText;
                        //console.log("resultado: " + resultado);
                        let objeto = JSON.parse(resultado);
                        cCarga();

                        let mensaje = "La contraseña de <b>" + nombre + "</b> es: <hr><h2>" + objeto.contrasena + "</h2>";
                        let bot = ['<i class="fa fa-times"></i>&nbsp;Cerrar', 'Editar&nbsp;<i class="fas fa-pen-to-square"></i>'];
                        alertComfirm(mensaje, bot,
                            function (index) {
                                if (index == 1) {
                                    let bo = ['<i class="fas fa-times"></i>&nbsp;Cancelar', 'Continuar&nbsp;<i class="fa fa-arrow-right"></i>'];
                                    alertComfirmDato("Editar Contraseña:", "text", bo,
                                        function (index) {
                                            if (index != null && index != "") {
                                                let b = ['<i class="fas fa-times"></i>&nbsp;Cancelar', 'Aceptar&nbsp;<i class="fa fa-check"></i>'];
                                                alertComfirmDato("Vuelve a introducir la contraseña:", "text", b,
                                                    function (index1) {
                                                        if (index1 != null && index1 != "") {
                                                            if (index == index1) {
                                                                oCarga("Actualizando Contraseña...");
                                                                let link = myLink + "/php/usuarios/updatePass.php?id=" + id + "&contrasena=" + index;
                                                                servidor(link,
                                                                    function (respuesta) {
                                                                        let resultado = respuesta.responseText;
                                                                        if (resultado == 1) {
                                                                            alerta("Contraseña Actualizada");
                                                                            //setUsuarios();
                                                                        }
                                                                        else alerta("Hubo un error al Actualizar...");
                                                                        cCarga();
                                                                    }
                                                                )
                                                            }

                                                            else alerta("Cancelado <hr><h4>Las contraseñas no coincidieron...</h4>")
                                                        }
                                                        else alerta("Cancelado o no ingreso una contraseña...");
                                                    }
                                                );
                                            }
                                            else alerta("Cancelado o no ingreso una contraseña...");
                                        }
                                    );
                                }
                            }
                        )

                    }
                )
            }
            else if (index == 1) {
                nextPageFunction('editarUsuario.html',
                    function () {
                        oCarga("Cargando usuario...");
                        let link = myLink + "/php/usuarios/select.php?id=" + id;
                        //console.log(link);
                        servidor(link,
                            function (respuesta) {
                                let resultado = respuesta.responseText;
                                var arrayJson = convertJson(resultado)[0]; // ESTO POR QUE DEVULEVE UN ARREGLO Y SOLO NECESITO EL PRIMERO
                                //console.log(arrayJson.nombre, arrayJson.perfil);
                                $('#nombre').val(arrayJson.nombre);
                                $('#perfil').val(arrayJson.perfil);
                                $('#id').val(arrayJson.id);
                                cCarga();
                            }
                        )
                    }
                );
            }
            else if (index == 2) {
                let b = ['<i class="fas fa-times"></i>&nbsp;Cancelar', 'Aceptar&nbsp;<i class="fa fa-trash"></i>'];
                alertComfirm("Estas seguro de eliminar el usuario?", b,
                    function () {
                        setEliminarUsuario(id);
                    }
                );

            }
        }
    );

}