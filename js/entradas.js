var entrada;

//funcion para editar cantidad de entradas y salidas productos
function setEditarCantidadEntradaP()
{
    let cantidad = $("#cantidad").val();
    let id = $("#id").val();
    if(vacio(cantidad,id)) servidor(myLink+"/php/entrada/caja/update.php?cantidad="+cantidad+"&id="+id,getEditarCantidadEntradaP);
    else alerta("Datos vacios"); 
}
function getEditarCantidadEntradaP(respuesta)
{
    if(respuesta.responseText == 1 )
    {
        alerta("Registro editado");
        mostrarTodoEntrada();
        $("#cantidad").val("");
        $("#id").val("");
        hideDialogo('my-dialogEditarEntradaSalidaP');
    }
    else alerta("No se pudo Modificar por un error");
}

//fucnones para editar entradas y salidas de insertos
function setEditarCantidadEntradaI()
{
    let cantidad = $("#cantidadI").val();
    let id = $("#idI").val();
    if(vacio(cantidad,id)) servidor(myLink+"/php/entrada/inserto/update.php?cantidad="+cantidad+"&id="+id,getEditarCantidadEntradaI);
    else alerta("Datos vacios"); 
    
}
function getEditarCantidadEntradaI(respuesta)
{
    if(respuesta.responseText == 1 )
    {
        alerta("Registro editado");
        mostrarTodoEntrada();
        $("#cantidadI").val("");
        $("#idI").val("");
        hideDialogo('my-dialogEditarEntradaSalidaI');
    }
    else alerta("No se pudo Modificar por un error");
    //console.log(respuesta.responseText);
}

//funcion para editar entradas de Laminas
function setEditarCantidadEntradaL()
{
    let cantidad = $("#cantidadL").val();
    let id = $("#idL").val();
    let proveedor = $("#proveedorL").val();
    id = id + "/" + proveedor;
    if(vacio(cantidad,id)) servidor(myLink+"/php/entrada/lamina/update.php?cantidad="+cantidad+"&id="+id,getEditarCantidadEntradaL);
    else alerta("Datos vacios"); 
    
}
function getEditarCantidadEntradaL(respuesta)
{
    if(respuesta.responseText == 1 )
    {
        alerta("Registro editado");
        mostrarTodoEntrada();
        $("#cantidadL").val("");
        $("#idL").val("");
        $('#miSelect').val("1");
        hideDialogo('my-dialogEditarEntradaSalidaL');
    }
    else alerta("No se pudo Modificar por un error");
    console.log(respuesta.responseText);
}

//funcion para refresh
function mostrarTodoEntrada()
{
    localStorage.setItem("bandera",0);
    setMostrarEntradaCajas();
    setMostrarEntradaLamina();
    setMostrarEntradaInserto();
    //aqui iran las otras dos funciones mostrar insertos y lamina
}
//MOSTRAR ENTRADA INSERTO 
function setMostrarEntradaInserto()
{
    servidor(myLink+"/php/entrada/inserto/select.php",getMostrarEntradaInserto)
}
function getMostrarEntradaInserto(respuesta)
{
    var resultado = respuesta.responseText;
    var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'

    listaInfinita('datosInsertoInventario','insertoSalidasEntradasLoading',arrayJson,enlistarEntradasInserto);
}

//MOSTRAR ENTRADA LAMINA
function setMostrarEntradalaminaSearch(search)
{
    servidor(myLink+"/php/entrada/lamina/select.php?search="+search,getMostrarEntradaLamina)
}
function setMostrarEntradaLamina()
{
    servidor(myLink+'/php/entrada/lamina/select.php',getMostrarEntradaLamina)
}
function getMostrarEntradaLamina(respuesta)
{ 
    var resultado = respuesta.responseText;
    var proveedores = resultado.split('*');
    var proveedor1 = proveedores[0].split('|');
    var proveedor2 = proveedores[1].split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'

    listaInfinita('datosLaminaInventario','laminaSalidasEntradasLoading',proveedor1,enlistarEntradasLamina);
    listaInfinita('datosLaminaInventario1','laminaSalidasEntradasLoading',proveedor2,enlistarEntradasLamina);
}
function setMostrarEntradaCajasSearch(search)
{
    servidor(myLink+"/php/entrada/caja/select.php?search="+search,getMostrarEntradaCajas);
}
function setMostrarEntradaInsertoSearch(search)
{
    servidor(myLink+"/php/entrada/inserto/select.php?search="+search,getMostrarEntradaInserto);
}
function setMostrarEntradaCajas()
{
    servidor(myLink+"/php/entrada/caja/select.php",getMostrarEntradaCajas)
}
function getMostrarEntradaCajas(respuesta)
{
    var resultado = respuesta.responseText;
    var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'

    listaInfinita('datosCajaEntradaSalida','cajaSalidasEntradasLoading',arrayJson,enlistarEntradas);
}
function setEliminarEntrada(id)
{
    servidor(myLink+'/php/entrada/caja/delete.php?id='+id,getEliminarEntrada);
}
function getEliminarEntrada(respuesta)
{
    if(respuesta.responseText) 
    {
        alerta("Se eliminao el pedido Entrada");
        mostrarTodoEntrada();

    }
    else alerta("hubo un error al tratar de eliminar");
}

function enlistarEntradas(arrayJson)
{
    let html1 = '';
    var color = arrayJson.observaciones == "" ? "gray" : "rgb(115, 168, 115)";
    html1 += '<ons-card  style="padding:0px;" class="botonPrograma" onclick="abrirDialog(\''+arrayJson.observaciones+'\',\''+arrayJson.id_lp+'\',\''+2+'\')">'
    html1 += ' <ons-list-header style="background: white">'+ arrayJson.id_lp +' <b style="color: rgb(61, 174, 80);">Terminado: '+ sumarDias(arrayJson.fecha,0) +'</b></ons-list-header>';
    html1 += '<ons-list-item modifier="nodivider">'; 
    html1 += '        <div class="left">';
    html1 +=              '<i class="fa-solid fa-box fa-2x"></i>';
    html1 += '        </div>';
    html1 += '        <div class="center">';
    html1 += '            <span class="list-item__title"><b>'+arrayJson.codigo+'</b>&nbsp;'+ arrayJson.producto +'</span>';
    html1 += '            <span class="list-item__subtitle">'+ arrayJson.nombre +'</span>';
    html1 += '        </div>';
    html1 += '        <div class="right">';
    html1 += '            <span class="notification" style="background: rgb(61, 174, 80);">'+ separator(arrayJson.cantidad) +' <font size="2px">pza(s)</font></span>';
    html1 += '            <div style="position: absolute;bottom:60px; right: 10px;" ><i style="color: '+color+';filter: drop-shadow(0 2px 5px rgba(0, 0, 0, 0.3))" class="fa-solid fa-comment-dots fa-2x"></i></div>';
    html1 += '        </div>';
    html1 += '</ons-list-item>';
    html1 += '</ons-card>';

    return html1;
}
function enlistarEntradasLamina(arrayJson)
{
    let html1 = '';
    var o_c = arrayJson.id_lp;
    o_c =o_c.slice(0,-2);


    var color = arrayJson.observaciones == "" ? "gray" : "rgb(115, 168, 115)";
    html1 += '<ons-card  style="padding:0px;" class="botonPrograma" onclick="abrirDialogLamina(\''+arrayJson.observaciones+'\',\''+arrayJson.id_lp+'\',\''+2+'\')">'
    html1 += ' <ons-list-header style="background: white">'+ o_c +' <b style="color: rgb(61, 174, 80);">Recibido: '+ sumarDias(arrayJson.fecha,0) +'</b></ons-list-header>';
    html1 += '<ons-list-item modifier="nodivider">'; 
    html1 += '        <div class="left">';
    html1 +=              '<i class="fa-solid fa-stop fa-2x"></i>';
    html1 += '        </div>';
    html1 += '        <div class="center">';
    html1 += '        <span class="list-item__title">'+esEntero(arrayJson.ancho)+' X '+esEntero(arrayJson.largo)+' - <b>'+arrayJson.resistencia+'</b></span>'; 
    html1 += arrayJson.producto != "" ? '<span class="list-item__subtitle">'+arrayJson.caja+' '+arrayJson.producto+' - <b>'+arrayJson.nombre+'</b></span>' : "";
    html1 += '        </div>';
    html1 += '        <div class="right">';
    html1 += '            <span class="notification" style="background: rgb(61, 174, 80);">'+ separator(arrayJson.cantidad) +' <font size="2px">pza(s)</font></span>';
    html1 += '            <div style="position: absolute;bottom:60px; right: 10px;" ><i style="color: '+color+';filter: drop-shadow(0 2px 5px rgba(0, 0, 0, 0.3))" class="fa-solid fa-comment-dots fa-2x"></i></div>';
    html1 += '        </div>';
    html1 += '</ons-list-item>';
    html1 += '</ons-card>';

    return html1;
}

function enlistarEntradasInserto(arrayJson)
{
    let html1 = '';
    var color = arrayJson.observaciones == "" ? "gray" : "rgb(115, 168, 115)";
    html1 += '<ons-card  style="padding:0px;" class="botonPrograma" onclick="abrirDialog(\''+arrayJson.observaciones+'\',\''+arrayJson.id_lp+'\',\''+2+'\')">'
    html1 += ' <ons-list-header style="background: white">'+ arrayJson.id_lp +' <b style="color: rgb(61, 174, 80);">Terminado: '+ sumarDias(arrayJson.fecha,0) +'</b></ons-list-header>';
    html1 += '<ons-list-item modifier="nodivider">'; 
    html1 += '        <div class="left">';
    html1 +=              '<i class="fa-solid fa-box fa-2x"></i>';
    html1 += '        </div>';
    html1 += '        <div class="center">';
    html1 += '            <span class="list-item__title"><b>'+arrayJson.inserto+'</b> - '+arrayJson.resistencia+'</span>';
    html1 += '            <span class="list-item__subtitle"><b>'+arrayJson.codigo+'</b>&nbsp;'+ arrayJson.producto +'<br>'+ arrayJson.nombre +'</span>';
    html1 += '        </div>';
    html1 += '        <div class="right">';
    html1 += '            <span class="notification" style="background: rgb(61, 174, 80);">'+ separator(arrayJson.cantidad) +' <font size="2px">pza(s)</font></span>';
    html1 += '            <div style="position: absolute;bottom:60px; right: 10px;" ><i style="color: '+color+';filter: drop-shadow(0 2px 5px rgba(0, 0, 0, 0.3))" class="fa-solid fa-comment-dots fa-2x"></i></div>';
    html1 += '        </div>';
    html1 += '</ons-list-item>';
    html1 += '</ons-card>';

    return html1;
}