var cantidadFacturas;
var banderaFactura = [];

document.addEventListener('init', function (event) {
    var page = event.target;

    if (page.id === 'modificarFactura') {
        banderaFactura = [];
    }
});

//BUSCAR LAS FACTURAS A MODIFICAR O ELIMINAR
function setModificarBuscarFacturas(id) {
    oCarga("Buscando Facturas...")
    servidor(myLink + "/php/facturas/select.php?id=" + id,
        function (respuesta) {
            var resultado = respuesta.responseText;
            //console.log(resultado);
            var arrayJson = resultado.split('|');
            cantidadFacturas = arrayJson.length - 1;
            //console.log(cantidadFacturas);
            listaInfinita('datosFacturas', 'progressBarFacturas', arrayJson, enlistarFacturasEditar);
            cCarga();
        }
    );
    $("#id_pedido").text(id);
}

function editarFactura(id, posicion) {
    //console.log(banderaFactura[posicion]);
    if (banderaFactura[posicion] === undefined || banderaFactura[posicion] === false) {
        var entregado = $("#entregado" + posicion).text().trim();
        var fecha = $("#fecha" + posicion).text().trim();
        var factura = $("#factura" + posicion).text().trim();

        $("#factura" + posicion).html(`
            <ons-input id="inputId${posicion}" modifier="underbar" type="text" value="${factura}" 
                style="width: 100%; font-weight: 800; color: #1e293b;">
            </ons-input>
        `);

        $("#entregado" + posicion).html(`
            <ons-input id="inputEntregado${posicion}" modifier="underbar" type="number" value="${entregado}" 
                style="width: 100%; font-weight: 800; color: #2e7d32;">
            </ons-input>
        `);

        $("#fecha" + posicion).html(`
            <ons-input id="inputFecha${posicion}" modifier="underbar" type="date" value="${fecha}" 
                style="width: 100%; color: #475569;">
            </ons-input>
        `);

        $("#editar" + posicion).css({
            "background": "rgba(61, 174, 80, 0.2)",
            "color": "#2e7d32",
            "transition": "all 0.3s ease"
        });
        $("#editar" + posicion).html('<i class="fa-solid fa-check"></i>');
        $("#editar" + posicion).closest('ons-card').css("border", "1px solid #2e7d32");

        banderaFactura[posicion] = true;
    }
    else {
        //alerta("Modificará");
        var factura = $("#inputId" + posicion).val();
        var entregado = $("#inputEntregado" + posicion).val();
        var fecha = $("#inputFecha" + posicion).val();
        if (vacio(factura, entregado, fecha)) {
            oCarga("Editando Factura");
            servidor(myLink + "/php/facturas/update.php?id=" + id + "&entregado=" + entregado + "&factura=" + factura + "&fecha=" + fecha,
                function (respuesta) {
                    cCarga();
                    var resultado = respuesta.responseText;
                    if (resultado == 1) {

                        alerta("Factura modificada");
                        setModificarBuscarFacturas($("#id_pedido").text());
                    }
                    else alerta("Hubo un error al modificar");
                    $("#editar" + posicion).html('<i class="fa-solid fa-pen"></i>');
                    banderaFactura[posicion] = false;
                }
            );
        }
        else {
            alerta("Datos vacios!");
        }
    }

}


function confirmarEliminar(id) {
    alertConfirm("Estas seguro de eliminar esta Factura?", ["SI", "NO"],
        function (index) {
            //alerta(index);
            if (index == 0) {
                if (cantidadFacturas > 1) setEliminarFactura(id);
                else alerta("No puedes eliminar la ultima factura");
            }
        });
}
function setEliminarFactura(id) {
    oCarga("Eliminando Factura...");
    servidor(myLink + "/php/facturas/delete.php?id=" + id,
        function (respuesta) {
            var resultado = respuesta.responseText;
            if (resultado == 1) {
                alerta("Factura Eliminada");
                setModificarBuscarFacturas($("#id_pedido").text());
                //buscarDtospedidos(); // esto para actualizar la informacion de los pedidos
            }
            else alerta("Hubo un error al eliminar");
            cCarga();
        }
    );
}

//ENLISTAR DATOS CLIENTES
function enlistarFacturasEditar(arrayJson, i) {
    // Estructura limpia usando Template Literals
    let html1 = `
        <ons-card style="padding:0px; background: white; margin-bottom: 15px;" class="botonPrograma opacity100"> 
            
            <ons-lit-header class="pedido-header" style="background: #f4f4f4; border-radius: 20px 20px 0 0; display: flex; justify-content: space-between; padding: 8px 15px;">
                <div class="header-left">
                    <span class="pedido-id" style="color: #64748b;">ID: ${arrayJson.id}</span>
                </div>
                <b style="color: #1e293b; font-size: 12px;">
                    <i class="fas fa-hashtag"></i> Pedido: ${arrayJson.id_pedido}
                </b>
            </ons-lit-header>

            <ons-list-item modifier="nodivider">
                <div class="center" style="padding: 10px 0;">
                    <div style="display: flex; flex-direction: column; gap: 6px;">
                        
                        <div style="display: flex; align-items: center;">
                            <span style="width: 85px; font-weight: bold; color: #64748b; font-size: 13px;">FACTURA:</span>
                            <span id="factura${i}" style="color: #1e293b; font-weight: 800;">${arrayJson.factura}</span>
                        </div>

                        <div style="display: flex; align-items: center;">
                            <span style="width: 85px; font-weight: bold; color: #64748b; font-size: 13px;">ENTREGADO:</span>
                            <span id="entregado${i}" style="color: #2e7d32; font-weight: 800;">${arrayJson.entregado}</span>
                        </div>

                        <div style="display: flex; align-items: center;">
                            <span style="width: 85px; font-weight: bold; color: #64748b; font-size: 13px;">FECHA:</span>
                            <span id="fecha${i}" style="color: #475569;">${arrayJson.fecha}</span>
                        </div>

                        <div id="button${i}" style="margin-top: 5px;"></div>
                    </div>
                </div>

                <div class="right" style="display: flex; gap: 10px; align-items: center;">
                    <div id="editar${i}" class="accionFactura" 
                         style="background: #e2e8f0; color: #475569; width: 35px; height: 35px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer;"
                         onclick="editarFactura(${arrayJson.id}, ${i})">
                        <i class="fa-solid fa-pen" style="font-size: 14px;"></i>
                    </div>

                    <div class="accionFactura" 
                         style="background: rgba(225, 29, 72, 0.1); color: #e11d48; width: 35px; height: 35px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer;"
                         onclick="confirmarEliminar(${arrayJson.id})">
                        <i class="fa-solid fa-trash" style="font-size: 14px;"></i>
                    </div>
                </div>
            </ons-list-item>
        </ons-card>
    `;

    return html1;
}


// NUEVO
function actualizarFacturas() {
    var anio = $("#currentYear").val(); //tomar anio del filtro
    var search = $("#searchFacturas").val(); //tomar datos de barra de busqueda
    var factura = document.querySelector('input[name=facturaRadio]:checked').value;

    //console.log(myLink + "/php/facturas/busqueda.php?year="+anio+"&search="+search+"&factura="+factura,anio,search,factura);
    oCarga("Buscando Facturas...");
    servidor(myLink + "/php/facturas/busqueda.php?year=" + anio + "&search=" + search + "&factura=" + factura, function (respuesta) {

        var data = respuesta.responseText;
        //console.log(data);
        var arrayJson = data.split('|');
        //console.log(arrayJson);
        listaInfinita('datosFacturasRemision', 'loadingFacturas', arrayJson, enlistarFacturasRemisiones);
        cCarga();
    });
}

function mostrarFacturas() {
    oCarga("Cargando Facturas...");
    servidor(myLink + "/php/facturas/busqueda.php", function (respuesta) {
        var data = respuesta.responseText;
        //console.log(data);
        var arrayJson = data.split('|');
        //console.log(arrayJson);
        listaInfinita('datosFacturasRemision', 'loadingFacturas', arrayJson, enlistarFacturasRemisiones);
        cCarga();
    });

}

function enlistarFacturasRemisiones(objeto, i) {
    var html = `
        <ons-card style="padding:0px; background: white; border-radius: 20px; overflow: hidden; margin-bottom: 15px;" 
                  class="botonPrograma" 
                  onclick="buscarFacturasEspecificas('${objeto.factura}', ${i})">
            
            <ons-lit-header class="pedido-header" style="background: #f4f4f4; border-radius: 20px 20px 0 0; display: flex; justify-content: space-between; padding: 10px 15px;">
                <b style="color: #1e293b; font-size: 12px;">
                    <i class="far fa-calendar-alt"></i>&nbsp; ${sumarDias(objeto.fecha, 0)}
                </b>
            </ons-lit-header>

            <ons-list-item modifier="nodivider" expandable style="padding: 5px 0;">
                
                <div class="left">
                    <div class="producto-icon-wrapper" style="margin-left:15px;">
                        <i class="fas fa-file-invoice fa-2x"></i>
                    </div>
                </div>

                <div class="center romperTexto">
                    <span class="list-item__title" style="font-size: 18px; font-weight: 800; color: #1e293b;">
                        Folio: ${objeto.factura}
                    </span>
                    <span class="list-item__subtitle" style="color: #64748b; margin-top: 3px; font-size: 13px;">
                        <i class="fas fa-user-tag" style="font-size: 11px;"></i> <b>${objeto.codigo_cliente}</b> ${objeto.cliente}
                    </span>
                </div>

                <div class="expandable-content expandProductos" id="contenidoFacturas${i}" style="background: #fdfdfd; padding: 15px 0;">
                    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px;">
                        <ons-progress-circular indeterminate style="width: 24px; height: 24px;"></ons-progress-circular>
                        <span style="font-size: 12px; color: #94a3b8; font-weight: 600;">Cargando productos...</span>
                    </div>
                </div>

            </ons-list-item>
        </ons-card>
    `;

    return html;
}

function buscarFacturasEspecificas(factura, i) {
    servidor(myLink + "/php/facturas/busquedaEspecifica.php?factura=" + factura, function (respuesta) {
        var data = respuesta.responseText;
        var arrayJson = data.split('|');

        // Estructura de Tabla Premium (Igual a la de pedidos)
        var html = `
            <div style="padding: 10px; background: #ffffff;">
                <table style="width: 100%; border-collapse: collapse; font-family: sans-serif; font-size: 13px;">
                    <thead>
                        <tr style="border-bottom: 2px solid #edf2f7; text-align: left;">
                            <th style="padding: 10px 5px; color: #64748b; font-weight: 800; font-size: 11px; text-transform: uppercase;">Pedido</th>
                            <th style="padding: 10px 5px; color: #64748b; font-weight: 800; font-size: 11px; text-transform: uppercase;">Producto</th>
                            <th style="padding: 10px 5px; color: #64748b; font-weight: 800; font-size: 11px; text-transform: uppercase; text-align: right;">Cant.</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        for (var j = 0; j < arrayJson.length - 1; j++) {
            var json = JSON.parse(arrayJson[j]);
            html += `
                <tr style="border-bottom: 1px solid #f1f5f9;">
                    <td style="padding: 12px 5px; color: #475569; font-weight: bold;">
                        ${json.id_pedido}
                    </td>
                    <td style="padding: 12px 5px; color: #1e293b; line-height: 1.4;">
                        <span style="color: #94a3b8; font-size: 11px; display: block; font-weight: bold;">[${json.codigo}]</span>
                        ${json.producto}
                    </td>
                    <td style="padding: 12px 5px; text-align: right;">
                        <span style="background: #f1f5f9; color: #1e293b; padding: 4px 8px; border-radius: 6px; font-weight: 800; font-size: 12px;">
                            ${separator(json.entregado)}
                        </span>
                    </td>
                </tr>
            `;
        }

        html += `
                    </tbody>
                </table>
            </div>
        `;

        $("#contenidoFacturas" + i).html(html);
    });
}

function menuFacturas() {
    var html = `
        <div style="padding: 25px 18px; background: white; min-height: 100vh;">
            
            <div style="text-align: center; margin-bottom: 30px;">
                <div style="background: #f1f5f9; width: 60px; height: 60px; border-radius: 20px; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px;">
                    <i class="fa-solid fa-sliders fa-2x" style="color: #1e293b;"></i>
                </div>
                <h3 style="color: #1e293b; font-weight: 800; margin: 0; font-size: 22px; letter-spacing: -0.5px;">Panel de Filtros</h3>
                <p style="color: #94a3b8; font-size: 13px; margin-top: 5px;">Personaliza tu vista de facturación</p>
            </div>

            <div style="margin-bottom: 25px;">
                <label style="display: block; color: #64748b; font-weight: 800; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; margin-left: 5px;">
                    <i class="far fa-calendar-alt"></i> Periodo Anual
                </label>
                
                <div style="background: #f8fafc; border-radius: 18px; padding: 10px; display: flex; align-items: center; justify-content: space-between; border: 1px solid #e2e8f0;">
                    <ons-button modifier="quiet" onclick="restarAnioFiltro()" style="background: white; border-radius: 12px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); color: #1e293b;">
                        <i class="fas fa-chevron-left"></i>
                    </ons-button>
                    
                    <input type="text" id="currentYear" readonly 
                        style="width: 100px; text-align: center; border: none; font-size: 22px; font-weight: 800; color: #1e293b; background: transparent; outline: none;">
                    
                    <ons-button modifier="quiet" onclick="sumarAnioFiltro()" style="background: white; border-radius: 12px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); color: #1e293b;">
                        <i class="fas fa-chevron-right"></i>
                    </ons-button>
                </div>
            </div>

            <div style="margin-bottom: 35px;">
                <label style="display: block; color: #64748b; font-weight: 800; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; margin-left: 5px;">
                    <i class="fas fa-tags"></i> Tipo de Documento
                </label>

                <div style="background: #f8fafc; border-radius: 20px; overflow: hidden; border: 1px solid #e2e8f0;">
                    <ons-list style="background: transparent;">
                        ${crearItemRadio("todo", "", "MOSTRAR TODO", "fa-border-all")}
                        ${crearItemRadio("cinthya", "A-", "(A) CINTHYA", "fa-user-tie")}
                        ${crearItemRadio("cinthya2", "B-", "(B) CINTHYA", "fa-user-tie")}
                        ${crearItemRadio("michelle", "F-", "(F) MICHELLE", "fa-user-nurse")}
                        ${crearItemRadio("remisiones", "R-", "(R) REMISIONES", "fa-receipt")}
                    </ons-list>
                </div>
            </div>
            <ons-button id="botonPrograma" onclick="actualizarFacturas(); $('#menu')[0].close();" modifier="large" 
                style=" box-shadow: 0 4px 12px rgba(126, 104, 191, 0.3);">
                Aplicar Filtros
            </ons-button>
        </div>
    `;

    $("#contenidoMenu").html(html);
    llenarAnio();
}

// Función auxiliar para mantener el código limpio y profesional
function crearItemRadio(id, valor, label, icono) {
    return `
        <ons-list-item tappable style="background: transparent; border-bottom: 1px solid #f1f5f9;">
            <label class="left" style="padding-right: 15px;">
                <ons-radio name="facturaRadio" input-id="${id}" value="${valor}" ${id === 'todo' ? 'checked' : ''}></ons-radio>
            </label>
            <label for="${id}" class="center" style="font-weight: 600; color: #475569; font-size: 14px;">
                <i class="fas ${icono}" style="margin-right: 10px; opacity: 0.5;"></i> ${label}
            </label>
        </ons-list-item>
    `;
}
//FIN DE NUEVO

