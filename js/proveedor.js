
var tipoFilter = 0;
//FUNCION PARA HACER UNA BUSQUEDA POR NOMBRE O CODIGO
function setProveedorBarraBusqueda(busqueda,e)
{
    //asignar el progress bar 
    if(busqueda=="") setProveedor();
    tecla = (document.all) ? e.keyCode : e.which;
    if (tecla==13) 
    {
        $("#insertoInventarioLoading").empty();
        $("#insertoInventarioLoading").append("<ons-progress-bar indeterminate></ons-progress-bar>");
        servidor('https://empaquessyrgdl.000webhostapp.com/empaquesSyR/proveedores/select.php?search='+busqueda+'&type='+tipoFilter,getProveedor);
    }
   
}

function setProveedor()
{
    $('#loadingProveedor').empty();
    $('#loadingProveedor').append("<ons-progress-bar indeterminate></ons-progress-bar>");
    servidor('https://empaquessyrgdl.000webhostapp.com/empaquesSyR/proveedores/select.php?type='+tipoFilter,getProveedor);
}
function getProveedor(respuesta)
{
    var resultado = respuesta.responseText;//respuesta del servidor
    var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'

    listaInfinita('datosProveedor','loadingProveedor',arrayJson,enlistarProveedor);
    //console.log(resultado);
}

function setAgregarProveedor()
{
    var nombre = $('#nombreproveedor').val();
    var tipo = $('#selectTipo').val();
    //console.log(vacio(nombre,tipo));
    if(vacio(nombre,tipo))
    {
        servidor("https://empaquessyrgdl.000webhostapp.com/empaquesSyR/proveedores/add.php?nombre="+nombre+"&tipo="+tipo,getAgregarProveedor);
    }
    else alerta("Espacios vacios");
}
function getAgregarProveedor(respuesta)
{
    if(respuesta.responseText=="1") 
    {
        alerta("Proveedor Agregado");
        resetearPilaFunction(setProveedor);
    }  
    else alerta("No se pudo insertar");
}
function setEliminarProveedor(codigo)
{
    servidor('https://empaquessyrgdl.000webhostapp.com/empaquesSyR/proveedores/delete.php?codigo='+codigo,getEliminarProveedor);   
}
function getEliminarProveedor(respuesta)
{
    //alert(respuesta.responseText);
    if(respuesta.responseText=="1") 
    {
        alerta("Registro eliminado");
        setProveedor();
    }  
    else alerta("No se pudo eliminar");
    console.log(respuesta.responseText);
}

//funciones para mostrar mensaje
function mensajeProveedor(codigo){mensajeArriba('Opciones', [{label:'Eliminar',modifier: 'destructive'}] ,accionMensajeProveedor,codigo); }  
function accionMensajeProveedor(index,codigo) { if(index == 0) mensajeConfirmProveedor(codigo);}

//mensajes para confirmar eliminar
function mensajeConfirmProveedor(codigo){ alertComfirm("Estas seguro de borrar este proveedor? ("+codigo+")",["Aceptar","Cancelar"],accionConfirmProveedor,codigo)}
function accionConfirmProveedor(index,codigo) { if(index==0) setEliminarProveedor(codigo); }

function enlistarProveedor(arrayJson)
{
    let html1 = "";
    
    html1 += '<ons-card class="botonPrograma" onclick="mensajeProveedor(\''+arrayJson.codigo+'\')">';

    html1 += '<ons-lit-header style="background: white"><strong>'+ agregarCeros(arrayJson.codigo)+'</strong></ons-list-header>';
    html1 += '<ons-list-item class="" modifier="nodivider">';
    html1 += '  <div class="left">';
    html1 += '      <i class="fa-solid fa-user-large fa-2x"></i> ';
    html1 += '  </div>';
    html1 += '  <div class="center">';
    html1 += '  <b>'+arrayJson.nombre+'</b>';
    html1 += '  </div>"';
    html1 += '  <div class="right">'+ tipoEgreso(arrayJson.tipo) +'</div>';
    html1 += '</ons-list-item>';

    html1 += '</ons-card>';
    return html1;
}

