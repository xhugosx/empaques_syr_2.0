var salida;

//funcion para editar cantidad producto
function setEditarCantidadSalidaP()
{
    let cantidad = $("#cantidad").val();
    let id = $("#id").val();
    if(vacio(cantidad,id)) servidor("https://empaquessr.com/sistema/cinthya/php/salida/caja/update.php?cantidad="+cantidad+"&id="+id,getEditarCantidadSalidaP);
    else alerta("Datos vacios"); 
    
}
function getEditarCantidadSalidaP(respuesta)
{
    if(respuesta.responseText == 1 )
    {
        alerta("Registro editado");
        mostrarTodoSalida();
        $("#cantidad").val("");
        $("#id").val("");
        hideDialogo('my-dialogEditarEntradaSalidaP');
    }
    else alerta("No se encontraron resultados");
}

//funcion para editar cantidad inserto
function setEditarCantidadSalidaI()
{
    let cantidad = $("#cantidadI").val();
    let id = $("#idI").val();
    if(vacio(cantidad,id)) servidor("https://empaquessr.com/sistema/cinthya/php/salida/inserto/update.php?cantidad="+cantidad+"&id="+id,getEditarCantidadSalidaI);
    else alerta("Datos vacios"); 
    
}
function getEditarCantidadSalidaI(respuesta)
{
    if(respuesta.responseText == 1 )
    {
        alerta("Registro editado");
        mostrarTodoSalida();
        $("#cantidadI").val("");
        $("#idI").val("");
        hideDialogo('my-dialogEditarEntradaSalidaI');
    }
    else alerta("No se encontraron resultados");
}

function mostrarTodoSalida()
{
    localStorage.setItem("bandera",1);
    setMostrarSalidaCajas();
    setMostrarSalidaLamina();
    setMostrarSalidaInserto();
    //aqui iran las otras dos funciones
}
//MOSTRAR SALIDAS INSERTO
function setMostrarSalidaInserto()
{
    servidor("https://empaquessr.com/sistema/cinthya/php/salida/inserto/select.php",getMostrarSalidaInserto);
}
function getMostrarSalidaInserto(respuesta)
{
    var resultado = respuesta.responseText;
    var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'
    //alerta(resultado);
    listaInfinita('datosInsertoInventario','insertoSalidasEntradasLoading',arrayJson,enlistarSalidasInserto);
}

function setMostrarSalidaCajasSearch(search)
{
    servidor("https://empaquessr.com/sistema/cinthya/php/salida/caja/select.php?search="+search,getMostrarSalidaCajas);
}
function setMostrarSalidaInsertoSearch(search)
{
    servidor("https://empaquessr.com/sistema/cinthya/php/salida/inserto/select.php?search="+search,getMostrarSalidaInserto);
}
function setMostrarSalidaCajas()
{
    servidor("https://empaquessr.com/sistema/cinthya/php/salida/caja/select.php",getMostrarSalidaCajas);
}
function getMostrarSalidaCajas(respuesta)
{
    var resultado = respuesta.responseText;
    var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'
    //alerta(resultado);
    listaInfinita('datosCajaEntradaSalida','cajaSalidasEntradasLoading',arrayJson,enlistarSalidas);
}
function buscarEntradaSalidaCajas(search,e)
{
    tecla = (document.all) ? e.keyCode : e.which;
    if (tecla==13) 
    {
        $("#cajaSalidasEntradasLoading").empty();
        $("#cajaSalidasEntradasLoading").append("<ons-progress-bar indeterminate></ons-progress-bar>");
        let bandera = localStorage.getItem("bandera");
        if(bandera == 1) setMostrarSalidaCajasSearch(search);
        else setMostrarEntradaCajasSearch(search);
        //console.log(bandera);
    }
    else if(search == "") 
    {
        //validar si es entrada o salida
        $("#cajaSalidasEntradasLoading").empty();
        $("#cajaSalidasEntradasLoading").append("<ons-progress-bar indeterminate></ons-progress-bar>");
        let bandera = localStorage.getItem("bandera");
        if(bandera == 1) setMostrarSalidaCajas();
        else setMostrarEntradaCajas();
        //setMostrarEntradaCajas();
        //setMostrarSalidaCajas();
    }
}
function buscarEntradaSalidaInserto(search,e)
{
    tecla = (document.all) ? e.keyCode : e.which;
    if (tecla==13) 
    {
        $("#insertoSalidasEntradasLoading").empty();
        $("#insertoSalidasEntradasLoading").append("<ons-progress-bar indeterminate></ons-progress-bar>");
        let bandera = localStorage.getItem("bandera");
        if(bandera == 1) setMostrarSalidaInsertoSearch(search);
        else setMostrarEntradaInsertoSearch(search);
        
        //console.log(bandera);
    }
    else if(search == "") 
    {
        //validar si es entrada o salida
        $("#insertoSalidasEntradasLoading").empty();
        $("#insertoSalidasEntradasLoading").append("<ons-progress-bar indeterminate></ons-progress-bar>");
        let bandera = localStorage.getItem("bandera");
        if(bandera == 1) setMostrarSalidaInserto();
        else setMostrarEntradaInserto();
        //setMostrarEntradaCajas();
        //setMostrarSalidaCajas();
    }
}
function setMostrarSalidalaminaSearch(search)
{
    servidor("https://empaquessr.com/sistema/cinthya/php/salida/lamina/select.php?search="+search,getMostrarSalidaLamina)
}
function setMostrarSalidaLamina()
{
    servidor("https://empaquessr.com/sistema/cinthya/php/salida/lamina/select.php",getMostrarSalidaLamina);
}
function getMostrarSalidaLamina(respuesta)
{
    var resultado = respuesta.responseText;
    var proveedores = resultado.split('*');
    var proveedor1 = proveedores[0].split('|');
    var proveedor2 = proveedores[1].split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'
    listaInfinita('datosLaminaInventario','laminaSalidasEntradasLoading',proveedor1,enlistarSalidasLamina);
    listaInfinita('datosLaminaInventario1','laminaSalidasEntradasLoading',proveedor2,enlistarSalidasLamina);
}
function buscarEntradaSalidaLamina(search,e)
{
    tecla = (document.all) ? e.keyCode : e.which;
    if (tecla==13) 
    {
        $("#laminaSalidasEntradasLoading").empty();
        $("#laminaSalidasEntradasLoading").append("<ons-progress-bar indeterminate></ons-progress-bar>");
        let bandera = localStorage.getItem("bandera");
        if(bandera == 1) setMostrarSalidalaminaSearch(search);
        else setMostrarEntradalaminaSearch(search);
        //console.log(bandera);
    }
    else if(search == "") 
    {
        //validar si es entrada o salida
        $("#laminaSalidasEntradasLoading").empty();
        $("#laminaSalidasEntradasLoading").append("<ons-progress-bar indeterminate></ons-progress-bar>");
        let bandera = localStorage.getItem("bandera");
        if(bandera == 1) setMostrarSalidaLamina();
        else setMostrarEntradaLamina();
        //setMostrarEntradaCajas();
        //setMostrarSalidaCajas();
    }
}
function asignarTextSalidaEntrada(observaciones)
{
    
    $("#datoDialog").empty();
    $("#datoDialog").append('<textarea id="observacionesSalidasEntradas" cols="40" rows="5" onkeyup="javascript:this.value=this.value.toUpperCase();"></textarea>');

    setTimeout(() => {
        $("#observacionesSalidasEntradas").val(observaciones == "" ? "" : observaciones);
    }, 1);
    $('#aceptar').empty();
    $('#aceptar').append('<i style="color:green" class="fa-solid fa-check fa-2x" onclick="setActualizaObservaciones()"></i>')
    
    
   // $("#observacionesSalidasEntradas").val(id);
}
function setActualizaObservaciones()
{
    observacionesSalidasEntradas = $("#observacionesSalidasEntradas").val();
    var observaciones = $("#observacionesSalidasEntradas").val() == "" ? "(Sin comentarios)" : $("#observacionesSalidasEntradas").val();
    $('#aceptar').empty();
    $('#aceptar').append('<i style="color: orange;" class="fa-solid fa-pen-to-square fa-2x" onclick="asignarTextSalidaEntrada(observacionesSalidasEntradas)"></i>');

    $("#datoDialog").empty();
    $('#datoDialog').text(observaciones);
    
    var codigo = idSalidasEntradas.split("-");
    if(codigo[0].length == 7)
    servidor("https://empaquessr.com/sistema/cinthya/php/inventario/updateObservaciones.php?observaciones="+observacionesSalidasEntradas+"&id="+idSalidasEntradas+"&type="+type,getActualizarObservaciones);
    else servidor("https://empaquessr.com/sistema/cinthya/php/inventario/updateObservacionesInserto.php?observaciones="+observacionesSalidasEntradas+"&id="+idSalidasEntradas+"&type="+type,getActualizarObservaciones);
}
function getActualizarObservaciones(respuesta)
{
    if(respuesta.responseText == 1) mostrarTodoSalida();
    else if(respuesta.responseText == 2) mostrarTodoEntrada();
    else alerta("no se actualizo "+respuesta.responseText);
}
// observaciones Lamina
function asignarTextSalidaEntradaLamina(observaciones)
{
    
    $("#datoDialog").empty();
    $("#datoDialog").append('<textarea id="observacionesSalidasEntradas" cols="40" rows="5" onkeyup="javascript:this.value=this.value.toUpperCase();"></textarea>');

    setTimeout(() => {
        $("#observacionesSalidasEntradas").val(observaciones == "" ? "" : observaciones);
    }, 1);
    $('#aceptar').empty();
    $('#aceptar').append('<i style="color:green" class="fa-solid fa-check fa-2x" onclick="setActualizaObservacionesLamina()"></i>')
    
    
   // $("#observacionesSalidasEntradas").val(id);
}
function setActualizaObservacionesLamina()
{
    observacionesSalidasEntradas = $("#observacionesSalidasEntradas").val();
    var observaciones = $("#observacionesSalidasEntradas").val() == "" ? "(Sin comentarios)" : $("#observacionesSalidasEntradas").val();
    $('#aceptar').empty();
    $('#aceptar').append('<i style="color: orange;" class="fa-solid fa-pen-to-square fa-2x" onclick="asignarTextSalidaEntradaLamina(observacionesSalidasEntradas)"></i>');

    $("#datoDialog").empty();
    $('#datoDialog').text(observaciones);
    
    //console.log("https://empaquessr.com/sistema/cinthya/php/inventario/updateObservacionesLamina.php?observaciones="+observacionesSalidasEntradas+"&id="+idSalidasEntradas+"&type="+type);
    servidor("https://empaquessr.com/sistema/cinthya/php/inventario/updateObservacionesLamina.php?observaciones="+observacionesSalidasEntradas+"&id="+idSalidasEntradas+"&type="+type,getActualizarObservacionesLamina);
}
function getActualizarObservacionesLamina(respuesta)
{
    //console.log(respuesta.responseText);
    if(respuesta.responseText == 1) mostrarTodoSalida();
    else if(respuesta.responseText == 2) mostrarTodoEntrada();
    else alerta("no se actualizo "+respuesta.responseText);
}

function enlistarSalidas(arrayJson)
{
    var color = arrayJson.observaciones == "" ? "gray" : "rgb(115, 168, 115)";
    let html1 = "";
    html1 += '<ons-card  style="padding:0px;" class="botonPrograma" onclick="abrirDialog(\''+arrayJson.observaciones+'\',\''+arrayJson.id_lp+'\',\''+1+'\')">';
    html1 += '    <ons-list-header style="background:white">'+arrayJson.id_lp+' <b style="color: rgb(211, 64, 64);">Entregado: '+ sumarDias(arrayJson.fecha,0) +'</b></ons-list-header>';
    html1 += '    <ons-list-item modifier="nodivider">';
    html1 += '        <div class="left">';
    html1 +=              '<i class="fa-solid fa-box fa-2x"></i>';
    html1 += '        </div>';
    html1 += '        <div class="center">';
    html1 += '            <span class="list-item__title"><b>'+arrayJson.codigo+'</b>&nbsp;'+ arrayJson.producto +'</span>';
    html1 += '            <span class="list-item__subtitle">'+ arrayJson.nombre +'</span>';
    html1 += '        </div>';
    html1 += '        <div class="right">';
    html1 += '            <span class="notification">'+ separator(arrayJson.cantidad) +' <font size="2px">pza(s)</font></span>';
    html1 += '            <div style="position: absolute;bottom:60px; right: 10px;" ><i style="color: '+color+';filter: drop-shadow(0 2px 5px rgba(0, 0, 0, 0.3))" class="fa-solid fa-comment-dots fa-2x"></i></div>';
    html1 += '        </div>';
    html1 += '    </ons-list-item>';
    html1 += '</ons-card>';

    return html1;
}
function enlistarSalidasLamina(arrayJson)
{
    let html1 = '';
    var o_c = arrayJson.id_lp;
    o_c = o_c.slice(0,-2);


    var color = arrayJson.observaciones == "" ? "gray" : "rgb(115, 168, 115)";
    html1 += '<ons-card  style="padding:0px;" class="botonPrograma" onclick="abrirDialogLamina(\''+arrayJson.observaciones+'\',\''+arrayJson.id_lp+'\',\''+1+'\')">'
    html1 += ' <ons-list-header style="background:white">'+ o_c +' <b style="color: rgb(211, 64, 64);">Tomado: '+ sumarDias(arrayJson.fecha,0) +'</b></ons-list-header>';
    html1 += '<ons-list-item modifier="nodivider">'; 
    html1 += '        <div class="left">';
    html1 +=              '<i class="fa-solid fa-stop fa-2x"></i>';
    html1 += '        </div>';
    html1 += '        <div class="center">';
    html1 += '        <span class="list-item__title">'+esEntero(arrayJson.ancho)+' X '+esEntero(arrayJson.largo)+' - <b>'+arrayJson.resistencia+'</b></span>'; 
    html1 += arrayJson.producto != "" ? '<span class="list-item__subtitle">'+arrayJson.caja+' '+arrayJson.producto+' - <b>'+arrayJson.nombre+'</b></span>' : "";
    html1 += '        </div>';
    html1 += '        <div class="right">';
    html1 += '            <span class="notification">'+ separator(arrayJson.cantidad) +' <font size="2px">pza(s)</font></span>';
    html1 += '            <div style="position: absolute;bottom:60px; right: 10px;" ><i style="color: '+color+';filter: drop-shadow(0 2px 5px rgba(0, 0, 0, 0.3))" class="fa-solid fa-comment-dots fa-2x"></i></div>';
    html1 += '        </div>';
    html1 += '</ons-list-item>';
    html1 += '</ons-card>';

    return html1;
}

function enlistarSalidasInserto(arrayJson)
{
    var color = arrayJson.observaciones == "" ? "gray" : "rgb(115, 168, 115)";
    let html1 = "";
    html1 += '<ons-card  style="padding:0px;" class="botonPrograma" onclick="abrirDialog(\''+arrayJson.observaciones+'\',\''+arrayJson.id_lp+'\',\''+1+'\')">';
    html1 += '    <ons-list-header style="background:white">'+arrayJson.id_lp+' <b style="color: rgb(211, 64, 64);">Entregado: '+ sumarDias(arrayJson.fecha,0) +'</b></ons-list-header>';
    html1 += '    <ons-list-item modifier="nodivider">';
    html1 += '        <div class="left">';
    html1 +=              '<i class="fa-solid fa-box fa-2x"></i>';
    html1 += '        </div>';
    html1 += '        <div class="center">';
    html1 += '            <span class="list-item__title"><b>'+arrayJson.inserto+'</b> - '+ arrayJson.resistencia +'</span>';
    html1 += '            <span class="list-item__subtitle"><b>'+arrayJson.codigo+'</b>&nbsp;'+ arrayJson.producto +'<br>'+ arrayJson.nombre +'</span>';
    html1 += '        </div>';
    html1 += '        <div class="right">';
    html1 += '            <span class="notification">'+ separator(arrayJson.cantidad) +' <font size="2px">pza(s)</font></span>';
    html1 += '            <div style="position: absolute;bottom:60px; right: 10px;" ><i style="color: '+color+';filter: drop-shadow(0 2px 5px rgba(0, 0, 0, 0.3))" class="fa-solid fa-comment-dots fa-2x"></i></div>';
    html1 += '        </div>';
    html1 += '    </ons-list-item>';
    html1 += '</ons-card>';

    return html1;
}