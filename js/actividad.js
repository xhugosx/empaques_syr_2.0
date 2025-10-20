let fechaActividad;
function setActividad() {
    oCarga("Cargando Datos...");
    let busqueda = $("#busquedaActividad").val();
    let link = myLink + "/php/actividad/select.php?fecha=" + fechaActividad + "&search=" + busqueda;
    servidor(link, function (respuesta) {

        var resultado = respuesta.responseText;
        var arrayJson = resultado.split('|');
        //console.log(arrayJson,link);
        listaInfinita('datosActividad', '', arrayJson, enlistarActividad);
        cCarga();
    });
}
function enlistarActividad(arrayJson) {
    let actividades = '';

    arrayJson.detalles_actividad.forEach(act => {
        actividades += `
        <b>Tipo:</b> ${act.tipo.toUpperCase()}
        <br>
        <b>Detalles:</b><br>
    `;
        // Recorremos act.datos con forEach
        Object.entries(act.datos).forEach(([clave, valor]) => {
            actividades += `&nbsp;&nbsp;&nbsp;<b>*&nbsp;${clave}:</b>&nbsp;${valor}<br>`;
            //console.log(clave, valor);
        });
        actividades += `<hr>`;
    });


    return `
     <ons-card style="padding:0px;" class="botonPrograma">
                <ons-list-header>
                    <b>Fecha:</b> ${arrayJson.fecha_hora}
                </ons-list-header>

                <ons-list-item modifier="nodivider" expandable>

                    <div class="left">
                        <i class="fas fa-edit fa-2x"></i>
                    </div>

                    <div class="center">
                        <span class="list-item__title">
                            <b> ${arrayJson.usuario} </b>
                        </span>
                        <span class="list-item__subtitle">
                            <b> ${arrayJson.accion} </b> - ${arrayJson.tabla}
                        </span>
                    </div>

                    <div class="expandable-content">
                        <hr>
                        ${actividades}
                    </div>
                </ons-list-item>
            </ons-card>
            `;
}
