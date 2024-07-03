
//BUSCAR LAS FACTURAS A MODIFICAR O ELIMINAR
function setModificarBuscarFacturas(id) {
    servidor("https://empaquessr.com/sistema/cinthya/php/facturas/select.php?id=" + id, getModificarBuscarFacturas);
    $("#id_pedido").text(id);
}
function getModificarBuscarFacturas(respuesta) {
    var resultado = respuesta.responseText;
    //console.log(resultado);
    var arrayJson = resultado.split('|');
    listaInfinita('datosFacturas', 'progressBarFacturas', arrayJson, enlistarFacturasEditar);

}

var banderaFactura = [];

document.addEventListener('init', function (event) {
    var page = event.target;

    if (page.id === 'modificarFactura') {
        banderaFactura = [];
    }
});

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
        $("#editar" + posicion).html('<i class="fa-solid fa-check"></i> Listo');

        banderaFactura[posicion] = true;
    }
    else {
        //alerta("Modificará");
        $("#editar" + posicion).html('<i class="fa-solid fa-pen"></i>');
        banderaFactura[posicion] = false;
        setEditarFactura(id, posicion)
    }

}


function setEditarFactura(id, posicion) {
    var factura = $("#inputId" + posicion).val();
    var entregado = $("#inputEntregado" + posicion).val();
    var fecha = $("#inputFecha" + posicion).val();
    servidor("https://empaquessr.com/sistema/cinthya/php/facturas/update.php?id=" + id + "&entregado=" + entregado + "&factura=" + factura + "&fecha=" + fecha, getEditarFactura);
}
function getEditarFactura(respuesta) {
    var resultado = respuesta.responseText;
    if (resultado == 1) {

        alerta("Factura modificada");
        setModificarBuscarFacturas($("#id_pedido").text());
        //buscarDtospedidos(); // esto para actualizar los pedidos completos
    }
    else alerta("Hubo un error al modificar");
}

function setEliminarFactura(id) {
    servidor("https://empaquessr.com/sistema/cinthya/php/facturas/delete.php?id=" + id, getEliminarFactura);
}
function getEliminarFactura(respuesta) {
    var resultado = respuesta.responseText;
    if (resultado == 1) {
        alerta("Factura Eliminada");
        setModificarBuscarFacturas($("#id_pedido").text());
        //buscarDtospedidos(); // esto para actualizar la informacion de los pedidos
    }
    else alerta("Hubo un error al eliminar");
}
//ENLISTAR DATOS CLIENTES
function enlistarFacturasEditar(arrayJson, i) {
    // { "id": "418", "id_pedido": "2023019-20", "entregado": "600", "factura": "A-7935", "fecha": "2023-06-26" }
    let html1 = "";
    html1 += '<ons-card style="padding:0px;" class="botonPrograma">';

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
    html1 += '            <span class="accionFactura" onclick="setEliminarFactura(' + arrayJson.id + ')"><i class="fa-solid fa-trash"></i></span>';
    html1 += '        </div>';

    html1 += '    </ons-list-item>';
    html1 += '</ons-card>';

    return html1;
}


// NUEVO

function mostrarFacturas() {

    servidor('https://www.empaquessr.com/sistema/cinthya/php/facturas/selectVisual.php',function(respuesta){
        console.log(respuesta);
    });

}

function enlistarFacturas() {
    var html = `
        <ons-card style="padding:0px;" class="botonPrograma">
            <ons-list-header style="background-color: rgba(255, 255, 255, 0)">
                <b> 12 DE JUNIO DEL 2024 </b>
            </ons-list-header>
            <ons-list-item modifier="nodivider" expandable>
                <div class="left">
                    <i class="fas fa-file-invoice fa-2x"></i>
                </div>
                <div class="center romperTexto">
                    <span class="list-item__title">
                        A-8586
                    </span>
                    <span class="list-item__subtitle">
                        <span>PROVIDENCIA S.A. DE C.V.</span><br>
                    </span>
                </div>
                <div class="expandable-content expandProductos">
                    <div class="productos">
                        <b>083/001</b> - CAJA PARA ZAPATOS TORO
                        <span class="cantidad">
                            1,200 pzas
                        </span>
                    </div>
                    <div class="productos">
                        <b>083/001</b> - CAJA PARA ZAPATOS TORO
                        <span class="cantidad">
                            3,000 pzas
                        </span>
                    </div>
                </div>
            </ons-list-item>
        </ons-card>
    `;

    return html;

}

//FIN DE NUEVO

