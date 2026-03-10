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
        let datosHtml = '';

        // Formateamos los datos técnicos como una lista limpia
        Object.entries(act.datos).forEach(([clave, valor]) => {
            datosHtml += `
                <div style="margin-bottom: 2px;">
                    <span class="log-key">• ${clave}:</span> 
                    <span class="log-val">${valor}</span>
                </div>`;
        });

        actividades += `
            <div class="log-detalles">
                <span class="tipo-actividad-badge">${act.tipo}</span>
                <div style="margin-top: 8px;">
                    <b style="font-size: 12px; color: #475569;">Detalles técnicos:</b><br>
                    <div style="margin-top: 4px; padding-left: 5px;">
                        ${datosHtml}
                    </div>
                </div>
            </div>
            <div style="height: 8px;"></div>
        `;
    });
    

    return `
    <ons-card style="padding:0px; margin: 10px 12px; border-radius: 16px; overflow: hidden; border: 1px solid #f1f5f9;" class="botonPrograma">
        
        <ons-list-header style="background: #f8fafc; color: #64748b; font-weight: 800; font-size: 11px; padding: 8px 15px;">
            <i class="far fa-calendar-alt" style="margin-right: 5px;"></i>
            FECHA: ${arrayJson.fecha_hora}
        </ons-list-header>

        <ons-list-item modifier="nodivider" expandable style="padding: 5px 0;">
            
            <div class="left" style="margin-left: 10px;">
                <div class="badge-icon" style="background: ${accion(arrayJson.accion).background};width: 40px; height: 40px;">
                    <i class="fas ${accion(arrayJson.accion).icon}" style="color: ${accion(arrayJson.accion).color}"></i>
                </div>
            </div>

            <div class="center">
                <div style="display: flex; flex-direction: column;">
                    <span style="font-size: 15px; font-weight: 800; color: #1e293b;">
                        ${arrayJson.usuario}
                    </span>
                    <span style="font-size: 13px; color: #64748b; margin-top: 2px;">
                        <b style="color: #929292;">${arrayJson.accion}</b> 
                        <span style="color: #cbd5e1; margin: 0 4px;">•</span>
                        <span class="badge-id" style="font-size: 10px;">${arrayJson.tabla}</span>
                    </span>
                </div>
            </div>

            <div class="expandable-content" style="padding: 10px 15px; background: #ffffff;">
                <div style="border-top: 1px solid #f1f5f9; padding-top: 10px; margin-bottom: 10px;">
                    <span style="font-size: 11px; font-weight: 800; color: #94a3b8; text-transform: uppercase;">
                        Registro de cambios
                    </span>
                </div>
                ${actividades}
            </div>

        </ons-list-item>
    </ons-card>
    `;
}
function accion(tipo) {
    switch (tipo) {
        case 'INSERT': 
            return { background: '#dcfce7', color: '#15803d', icon: 'fa-plus' }; 
        case 'UPDATE': 
            return { background: '#fef9c3', color: '#a16207', icon: 'fa-edit' }; 
        case 'DELETE': 
            return { background: '#fee2e2', color: '#b91c1c', icon: 'fa-trash' }; 
        default: 
            return { background: '#f1f5f9', color: '#475569', icon: 'fa-history' }; 
    }
}