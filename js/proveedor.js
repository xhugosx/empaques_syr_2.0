function setProveedor()
{
    $('#loadingProveedor').empty();
    $('#loadingProveedor').append("<ons-progress-bar indeterminate></ons-progress-bar>");
    servidor('https://empaquessyrgdl.000webhostapp.com/empaquesSyR/proveedores/select.php',getProveedor);
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
    html1 += '    <i class="fa-solid fa-user-large fa-lg"></i> <strong>'+ agregarCeros(arrayJson.codigo)+'</strong> &nbsp;'+arrayJson.nombre+'';
    html1 += '</ons-card>';
    return html1;
}

