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
        var entregado = $("#entregado" + posicion).text();
        var fecha = $("#fecha" + posicion).text();
        var factura = $("#factura" + posicion).text();
        //alerta(entregado + " " + fecha + " " + id + " " + posicion)
        //var boton;

        //$("#entregado"+posicion).html("");
        $("#factura" + posicion).html('<ons-input id="inputId' + posicion + '" type="text" value="' + factura + '">');
        $("#entregado" + posicion).html('<ons-input id="inputEntregado' + posicion + '" type="number" value="' + entregado + '">');
        $("#fecha" + posicion).html('<ons-input id="inputFecha' + posicion + '" type="date" value="' + fecha + '">');
        $("#editar" + posicion).html('<i class="fa-solid fa-check"></i>');

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


function setEditarFactura(id, posicion) {


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
    // { "id": "418", "id_pedido": "2023019-20", "entregado": "600", "factura": "A-7935", "fecha": "2023-06-26" }
    let html1 = "";
    html1 += '<ons-card style="padding:0px;" class="botonPrograma opacity100"> ';

    html1 += '    <ons-list-item modifier="nodivider">';
    html1 += '        <div class="left">';
    html1 += '            <strong>ID:&nbsp; </strong>' + arrayJson.id;
    html1 += '        </div>';
    html1 += '        <div class="center">';
    html1 += '            <table>';
    html1 += '                <tr>';
    html1 += '                    <td style="font-weight: bold;">Factura: </td>';
    html1 += '                    <td id="factura' + i + '">' + arrayJson.factura + '</td>';
    html1 += '                </tr>';
    html1 += '                <tr>';
    html1 += '                    <td style="font-weight: bold;">Entregado: </td>';
    html1 += '                    <td id="entregado' + i + '">' + arrayJson.entregado + '</td>';
    html1 += '                </tr>';
    html1 += '                <tr>';
    html1 += '                    <td style="font-weight: bold;">Fecha: </td>';
    html1 += '                    <td id="fecha' + i + '">' + arrayJson.fecha + '</td>';
    html1 += '                </tr>';
    html1 += '                <tr>';
    html1 += '                    <td id="button' + i + '"></td>';
    html1 += '                </tr>';

    html1 += '            </table>';

    html1 += '        </div>';
    html1 += '        <div class="right">';
    html1 += '            <span id="editar' + i + '" class="accionFactura" onclick="editarFactura(' + arrayJson.id + ',' + i + ')"><i';
    html1 += '                class="fa-solid fa-pen"></i></span>';
    html1 += '            <span class="accionFactura" onclick="confirmarEliminar(' + arrayJson.id + ')"><i class="fa-solid fa-trash"></i></span>';
    html1 += '        </div>';

    html1 += '    </ons-list-item>';
    html1 += '</ons-card>';

    return html1;
}


// NUEVO
function actualizarFacturas() {
    var anio = $("#currentYear").val(); //tomar anio del filtro
    var search = $("#searchFacturas").val(); //tomar datos de barra de busqueda
    var factura = document.querySelector('input[name=facturaRadio]:checked').value;

    //console.log(myLink + "/php/facturas/busqueda.php?year="+anio+"&search="+search+"&factura="+factura,anio,search,factura);

    servidor(myLink + "/php/facturas/busqueda.php?year=" + anio + "&search=" + search + "&factura=" + factura, function (respuesta) {

        var data = respuesta.responseText;
        //console.log(data);
        var arrayJson = data.split('|');
        //console.log(arrayJson);
        listaInfinita('datosFacturasRemision', 'loadingFacturas', arrayJson, enlistarFacturasRemisiones);
    });
}

function mostrarFacturas() {

    servidor(myLink + "/php/facturas/busqueda.php", function (respuesta) {

        var data = respuesta.responseText;
        //console.log(data);
        var arrayJson = data.split('|');
        //console.log(arrayJson);
        listaInfinita('datosFacturasRemision', 'loadingFacturas', arrayJson, enlistarFacturasRemisiones);
    });

}

function enlistarFacturasRemisiones(objeto, i) {
    var html = `
        <ons-card style="padding:0px;" class="botonPrograma" onclick="buscarFacturasEspecificas('${objeto.factura}',${i})">
                <ons-list-header style="background-color: rgba(255, 255, 255, 0)">
                    <b> ${sumarDias(objeto.fecha, 0)} </b>
                </ons-list-header>
                <ons-list-item modifier="nodivider" expandable>
                    <div class="left">
                        <i class="fas fa-file-invoice fa-2x"></i>
                    </div>
                    <div class="center romperTexto">
                        <span class="list-item__title" style="font-size: 18px">
                            ${objeto.factura}
                        </span>
                        <span class="list-item__subtitle">
                            <span>${objeto.codigo_cliente} ${objeto.cliente}</span><br>
                        </span>
                    </div>
                    <div class="expandable-content expandProductos" id="contenidoFacturas${i}">
                        <center>
                            <ons-progress-circular indeterminate></ons-progress-circular>
                        </center>
                         
                    </div>
                </ons-list-item>
            </ons-card>
    `;

    return html;

}

function buscarFacturasEspecificas(factura, i) {
    servidor(myLink + "/php/facturas/busquedaEspecifica.php?factura=" + factura, function (respuesta) {
        var data = respuesta.responseText;
        //console.log(data);
        var arrayJson = data.split('|');
        var html = `<ons-list modifier="inset">`;
        for (var j = 0; j < arrayJson.length - 1; j++) {
            var json = JSON.parse(arrayJson[j]);
            html += `
                <ons-list-item modifier="longdivider" style="margin:0px">
                    <div class="left">
                        <b style="font-size:12px">${json.id_pedido}</b>
                    </div>
                    <div class="center">
                        <b style="color:grey; font-size:13px">(${json.codigo})</b> &nbsp; <span> ${json.producto}</span>
                    </div>
                    <div class="right">
                       <span class="notification">${separator(json.entregado)} pzas.</span>
                    </div>
                </ons-list-item>
            `;
        }
        html += `</ons-list>`;
        $("#contenidoFacturas" + i).html(html);
    });
}

function menuFacturas() {
    var html = `<ons-list>
                    <center>
                        <h4 style="color: #808fa2; font-weight: bold;">
                            Filtros
                        </h4>
                    </center>
                    <ons-list>
                        <ons-list-item>
                            <label class="left">
                                <h4 style="color: #808fa2;">
                                    Año
                                </h4>
                            </label>
                            <label class="center">
                                <div class="year-input">

                                    <button id="prevYear" onclick="restarAnioFiltro()">&lt;</button>
                                    <input type="text" id="currentYear" readonly>
                                    <button id="nextYear" onclick="sumarAnioFiltro()">&gt;</button>
                                </div>
                            </label>
                        </ons-list-item>
                        <ons-list-item tappable>
                            <label class="left">
                                <ons-radio name="facturaRadio" input-id="cinthya" checked value="A-"></ons-radio>
                            </label>
                            <label for="cinthya" class="center">
                                (A) CINTHYA 
                            </label>
                        </ons-list-item>
                        <ons-list-item tappable>
                            <label class="left">
                                <ons-radio name="facturaRadio" input-id="michelle" value="F-"></ons-radio>
                            </label>
                            <label for="michelle" class="center">
                                (F) MICHELLE
                            </label>
                        </ons-list-item>
                         <ons-list-item tappable>
                            <label class="left">
                                <ons-radio name="facturaRadio" input-id="remisiones" value="R-"></ons-radio>
                            </label>
                            <label for="remisiones" class="center">
                                (R) REMISIONES
                            </label>
                        </ons-list-item>
                         <ons-list-item modifier="nodivider">
                        <ons-button id="botonPrograma" onclick="actualizarFacturas();$('#menu')[0].close();" modifier="large">
                            Aplicar
                        </ons-button>
                    </ons-list-item>
                        
                    </ons-list>


                </ons-list>
            `;
    $("#contenidoMenu").html(html);
    llenarAnio();
}
//FIN DE NUEVO

