var idPedido = "";
//funcion para mostrara programa en artesanos
function refreshPrograma()
{
    setMostrarProgramaArtesanos();
    setMostrarProgramaAfilador1();
    setMostrarProgramaAfilador2();
}
function setMostrarProgramaArtesanos()
{
    servidor("https://empaquessyrgdl.000webhostapp.com/empaquesSyR/programa/select.php",getMostrarProgramaArtesanos)
}
function getMostrarProgramaArtesanos(respuesta)
{
    var resultado = respuesta.responseText;
    const arrayJson  = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'
    //creamos una copia 

    resultado = enlistarPrograma(arrayJson,1);
    $('#datosProgramaFlexo').empty();
    setDataPage('#datosProgramaFlexo','#loadingFlexo',resultado);
    //tipo 2 para impresion

    resultado = enlistarPrograma(arrayJson,2);
    $('#datosProgramaPegado').empty();
    setDataPage('#datosProgramaPegado',0,resultado);

    resultado = enlistarPrograma(arrayJson,3);
    $('#datosProgramaImpresion').empty();
    setDataPage('#datosProgramaImpresion',0,resultado);

    resultado = enlistarPrograma(arrayJson,4);
    $('#datosProgramaSuajado').empty();
    setDataPage('#datosProgramaSuajado',0,resultado);
}
//funcion para mostrar rpograma de afilador 2

function setMostrarProgramaAfilador1()
{
    servidor("https://empaquessyrgdl.000webhostapp.com/empaquesSyR/programa/select.php",getMostrarProgramaAfilador1);
}

function getMostrarProgramaAfilador1(respuesta)
{
    var resultado = respuesta.responseText;
    const arrayJson  = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'
    

    resultado = enlistarPrograma(arrayJson,5);
    $('#datosProgramaCortadora1').empty();
    setDataPage('#datosProgramaCortadora1','#loadingCortadora1',resultado);

    resultado = enlistarPrograma(arrayJson,6);
    $('#datosProgramaCaiman').empty();
    setDataPage('#datosProgramaCaiman',0,resultado);

}

function setMostrarProgramaAfilador2()
{
    servidor("https://empaquessyrgdl.000webhostapp.com/empaquesSyR/programa/select.php",getMostrarProgramaAfilador2);
}

function getMostrarProgramaAfilador2(respuesta)
{
    var resultado = respuesta.responseText;
    const arrayJson  = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'
    

    resultado = enlistarPrograma(arrayJson,7);
    $('#datosProgramaCortadora2').empty();
    setDataPage('#datosProgramaCortadora2','#loadingCortadora2',resultado);

    resultado = enlistarPrograma(arrayJson,8);
    $('#datosProgramaRanurado').empty();
    setDataPage('#datosProgramaRanurado',0,resultado);

    resultado = enlistarPrograma(arrayJson,9);
    $('#datosProgramaArmadoFlejado').empty();
    setDataPage('#datosProgramaArmadoFlejado',0,resultado);

}

//funcion para actualizar estado de un producto
function setActualizarEstado(id,estado)
{
    //alert('https://empaquessyrgdl.000webhostapp.com/empaquesSyR/programa/updateEstado.php?id='+id+'&estado='+estado);

    servidor('https://empaquessyrgdl.000webhostapp.com/empaquesSyR/programa/updateEstado.php?id='+id+'&estado='+estado,getActualizarEstado);
}
function getActualizarEstado(respuesta)
{
    if(respuesta.responseText=="1") 
    {
        alertToast('Actualizado!',1000);
        refreshPrograma();
    }  
    else alertToast('Proceso actual!',1000);

}
function setEliminarPrograma(id)
{
    
    servidor('https://empaquessyrgdl.000webhostapp.com/empaquesSyR/programa/delete.php?id='+id,getEliminarPrograma);
}
function getEliminarPrograma(respuesta)
{
    if(respuesta.responseText=="1")
    {
       
        alerta("Se ah eliminado del programa");
        refreshPrograma();
    } 
    else alerta("No se pudo eliminar!");
}

function setLlenarProcesoPrograma(id)
{
    Abrirdialogo('my-dialog-programa','dialogPrograma.html',id)
    servidor("https://empaquessyrgdl.000webhostapp.com/empaquesSyR/programa/selectProcesos.php?id="+id,getLlenarProcesoPrograma);
}
function getLlenarProcesoPrograma(respuesta)
{  
    var resultado = respuesta.responseText;
    const arrayJson  = resultado.split('|');
    for(var i=0;i<arrayJson.length-2;i++) 
    {
        arrayJson[i] = JSON.parse(arrayJson[i]); //convertimos los jsonText en un objeto json
        
        $('#check'+arrayJson[i].proceso).prop("checked","true");
        //alert('#check'+arrayJson[i].proceso);
    }

}

function setProcesosProgramaEntradaPedido(id,cantidad)
{
    //id es id de lista de pedidos
    servidor('https://empaquessyrgdl.000webhostapp.com/empaquesSyR/programa/procesosEntradaProgramaPedido.php?id='+id+'&cantidad='+cantidad,getProcesosProgramaEntradaPedido)
}
function getProcesosProgramaEntradaPedido(respuesta)
{
    if(respuesta.responseText == 1)
    {
        alertToast("Se agrego a inventario",1000);
        refreshPrograma();
    } 
    else alerta("Hubo un error");
}

// funcion para agregar faltante a lista de pedidos
function setAgregarFaltante(json)
{
    
    servidor('https://empaquessyrgdl.000webhostapp.com/empaquesSyR/lista_pedidos/add.php?id='+json.id+'-F&codigo='+json.codigo+'&cantidad='+json.cantidad+'&resistencia='+json.resistencia,getAgregarFaltante);
}
function getAgregarFaltante(respuesta)
{
    if (respuesta.responseText == 1)
    {
        alerta("Se agrego a lista de pedidos");
        refreshPrograma();
    }
    else alerta("hubo un error"+ respuesta.responseText);
}
//funcion para enlistar los programas
function enlistarPrograma(arrayJson,tipo)
{
    //alert("entro");
    if(arrayJson=="" || arrayJson == "0") return '<ons-card  id="contenedorPrograma"> <center> <h2>Excelente haz terminado!</h2> </center> </ons-card>';
    let html1 = '';

    for(var i=0;i<arrayJson.length-1;i++) 
    {
        arrayJson[i] = verificarError(arrayJson[i]) ? JSON.parse(arrayJson[i]) : arrayJson[i]; //convertimos los jsonText en un objeto json
        if(arrayJson[i].proceso == tipo && arrayJson[i].estado != 3)
        {
            //html1 += '<ons-list-header>';                                                                                                 	
                                                                                                                                                                
            html1 += '<ons-card style="padding:0px" class="botonPrograma" '+estadoColor(arrayJson[i].estado)+' onclick="crearObjetMensajeProcesoPrograma(\''+arrayJson[i].idP+'\',\''+arrayJson[i].id+'\',\''+arrayJson[i].cantidad+'\',\''+arrayJson[i].codigo+'\',\''+arrayJson[i].resistencia+'\')">';
            html1 += '<ons-list-item modifier="nodivider">';
            html1 += '    <div class="left">';
            html1 += '        <strong style="font-size:15px;color:white;">'+arrayJson[i].codigo+'</strong>';
            html1 += '    </div>';
            html1 += '    <div class="center romperTexto">';
            html1 += '        <span class="list-item__title">'+arrayJson[i].producto+'</span>'; 
            html1 += '        <span class="list-item__subtitle">';
            html1 += arrayJson[i].cliente;
            html1 += '        </span>';
            html1 += '    </div>';
            html1 += '    <div class="right">';
            html1 += '         <div class="centrar">';
            html1 += arrayJson[i].resistencia;               
            html1 += '               <br>';                    
            html1 += '               <b>'+ separator(arrayJson[i].cantidad) +' pzas</b>';
            html1 += '         </div>';
            html1 += '    </div>';
            html1 += '</ons-list-item>';
            html1 += '</ons-card>';
        }

    }
    if(html1 == "") return '<ons-card  id="contenedorPrograma"> <center> <h2>Excelente haz terminado!</h2> </center> </ons-card>';
    html1 += '<br><br><br>';

    return html1;
}
function setagregarPrograma(id)
{
    var procesos = "";
    for(var i = 0; i<9 ; i++)
    {
        if ($('#check'+(i+1)).prop('checked')) procesos += (i+1) +",";
    } 

   if(procesos == "") alerta("No haz seleccionado niguna");
   else servidor('https://empaquessyrgdl.000webhostapp.com/empaquesSyR/programa/add.php?id='+id+'&procesos='+procesos,getAgregarPrograma);

   
} 
function getAgregarPrograma(respuesta)
{
    
    if(respuesta.responseText=="1") 
    {
        alerta("Producto se agrego al programa");
        cerrarDialogo('my-dialog-programa');
        buscarDtospedidos()
    }
    else alerta('hubo un error al insertar!'+respuesta.responseText);

    //limpiar select 
    limpiarSelectPrograma();
    
}

function asignarEstatusPrograma()
{
    servidor(0,0);
}
function estatus(dato)
{
   if(dato==0) return '';
   else if(dato==1) return 'Proceso';
   else return 'Terminado';
    
}
function estadoColor(dato)
{
    if(dato==0) return 'id="pendiente"';
   else if(dato==1) return 'id="proceso"';
   else return 'id="terminado"';
}
function verificarError(objeto)
{
    try{
        objeto = JSON.parse(objeto);
        return true;
    }
    catch{
        return false
    }
}
function prueba(){
    var icon = '<tr><td> <a  onclick="del('+i +',\'' + mat +'\',\'' +size +'\')"><img src="..wwwroot/img/ELIMINAR.png" id = "icon_delete" class= "img-delete" /></a></td ></tr>';
}
function limpiarSelectPrograma()
{
    for(var i = 0; i<9 ; i++)
    {
        $('#check'+(i+1)).val([])
    } 
}