document.addEventListener('init', function (event) {
    var page = event.target;
    if (page.id === 'suajes') remover();
});
function agregarSuajes() {
    let codigo = $("#codigo").val();
    let descripcion = $("#descripcion").val();
    let uso = $('#switch').prop('checked') == true ? 1 : 0;
    //console.log(codigo,descripcion,uso);
    if (vacio(codigo, descripcion)) {
        servidor(myLink + "/php/suajes/add.php?codigo=" + codigo + "&descripcion=" + descripcion + "&uso=" + uso, function (respuesta) {
            var data = respuesta.responseText;
            if (data==1) {
                resetearPilaFunction(mostrarSuajes);
                alerta("Suaje insertado");
            }

            else alerta("No se pudo insertar");
        });
    }
    else alerta("Datos vacios");

}

function editarSuajes() {
    let id = $("#id").val();
    let codigo = $("#codigo").val();
    let descripcion = $("#descripcion").val();
    let uso = $('#switch').prop('checked') == true ? 1 : 0;
    //console.log(id,codigo,descripcion,uso);
    if (vacio(codigo, descripcion)) {
        //console.log(myLink + "/php/suajes/update.php?id="+id+"&codigo=" + codigo + "&descripcion=" + descripcion + "&uso=" + uso);
        servidor(myLink + "/php/suajes/update.php?id="+id+"&codigo=" + codigo + "&descripcion=" + descripcion + "&uso=" + uso, function (respuesta) {
            var data = respuesta.responseText;
            if (data==1) {
                resetearPilaFunction(mostrarSuajes);
                alerta("Suaje editado");
            }

            else alerta("No se pudo editar"+data);
        });
    }
    else alerta("Datos vacios");

}

function opcionesSuajes(id) {
    //let datos = "";
    mensajeArriba("opciones", ["Editar", {label: 'Eliminar',modifier: 'destructive'}], function (index) {
        //console.log(index);
        if (index == 0) {
            //alerta("Editara"+id);
            nextPageFunction("editarSuaje.html",function(){
                //esto para rellenar los cuadros de texto para editar
                servidor(myLink + "/php/suajes/update.php?id="+id,function(respuesta){
                    let objeto = JSON.parse(respuesta.responseText);
                    $("#id").val(objeto.id);
                    $("#codigo").val(objeto.codigo);
                    $("#descripcion").val(objeto.descripcion);
                    $('#switch').prop('checked', objeto.uso == 1 ? true : false);

                });
            });
        }
        else if(index == 1) {
            alertComfirm("Estas seguro de eliminar este suaje?", ["Cancelar","Aceptar"], function(index){
                if(index==1)
                {
                    eliminarSuaje(id);
                }
            });
        }
    });
}

function eliminarSuaje(id)
{
    servidor(myLink+"/php/suajes/delete.php?id="+id,function(respuesta){
        if(respuesta.responseText == 1) {
            alerta("Suaje eliminado");
            //para actualizar
            mostrarSuajes();
        }
        else alerta(respuesta.responseText);
    });
}


function mostrarSuajes() {

    let search = $("#searchSuajes").val() == undefined || $("#searchSuajes").val() == ""? "" : $("#searchSuajes").val();
    let search0 = $("#searchSuajes0").val() == undefined || $("#searchSuajes0").val() == "" ? "" : $("#searchSuajes0").val();

    //para llenar datos en uso
    servidor(myLink + "/php/suajes/select.php?search="+search, function (respuesta) {

        var data = respuesta.responseText;
        var arrayJson = data.split('|');
        listaInfinita('datosSuajes', 'loadingSuajes', arrayJson, enlistarSuajes);
    });

    //para llenar datos en no uso
    servidor(myLink + "/php/suajes/select.php?uso=0&search="+search0, function (respuesta) {

        var data = respuesta.responseText;
        //console.log(data);
        var arrayJson = data.split('|');
        //console.log(arrayJson);
        listaInfinita('datosSuajes0', 'loadingSuajes0', arrayJson, enlistarSuajes);
    });

}

function enlistarSuajes(objeto, i) {
    let perfil = validarPerfil();
    let accion;
    if (perfil != "produccion") accion = `onclick="opcionesSuajes('${objeto.id}')"`;
    var html = `
        <ons-card style="padding:0px;" class="botonPrograma" ${accion}>
                <ons-list-item modifier="nodivider" >
                    <div class="left">
                        <i class="fas fa-scissors fa-2x"></i>
                    </div>
                    <div class="center romperTexto">
                        <b><span class="list-item__title" style="font-size: 14px">
                            ${objeto.codigo}
                        </span></b>
                        <span class="list-item__subtitle">
                            <span style="font-size: 13pt;"> ${objeto.descripcion} </span>
                        </span>
                    </div>
                </ons-list-item>
            </ons-card>
    `;

    return html;

}