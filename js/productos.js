

//productos
//ver productos
function setProductos()
{
    $('#loadingProductos').append("<ons-progress-bar indeterminate></ons-progress-bar>");
    servidor('https://empaquessyrgdl.000webhostapp.com/empaquesSyR/productos/select.php?type=2',getProductos);
}
function getProductos(respuesta)
{
    var resultado = respuesta.responseText;//respuesta del servidor
    var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'
    //alert("entro");

    listaInfinita('datosProductos','loadingProductos',arrayJson,enlistarProductos);

    /*resultado = enlistarProductos(arrayJson);

    $('#datosProductos').empty();
    setDataPage('#datosProductos','#loadingProductos',resultado);*/

}
//fin de ver productos

//eliminar productos
function setEliminarProducto(producto,i)
{
    agregarClaseProducto(i);
    
    setTimeout(function(){
        servidor('https://empaquessyrgdl.000webhostapp.com/empaquesSyR/productos/delete.php?codigo='+producto,getEliminarProducto)
    }, 1500);

    
}
function getEliminarProducto(respuesta)
{
    if(respuesta.responseText=="1") 
    {
        alerta("Registro eliminado");
        setProductos();
    }  
    else alerta("No se pudo eliminar");
}
//fin de eliminar productos

//agregar productos
function setAgregarProducto()
{
    
   
    if(datoVacio($('#codigoProducto1').val()) && datoVacio($('#nombreProducto').val()) && datoVacio($('#precioProducto').val())) 
    {
        servidor('https://empaquessyrgdl.000webhostapp.com/empaquesSyR/productos/add.php?codigo='+$('#codigoProducto1').val()+'&producto='+$('#nombreProducto').val()+'&precio='+$('#precioProducto').val(),getAgregarProducto)
    }
    else alerta("Espacios en blanco");
    
   
    //validar si codigo y nombre tiene datos
    
}
function getAgregarProducto(respuesta)
{
    //respuesta del servidor
    if(respuesta.responseText=="1") 
    {
        alerta("Registro insertado");
        resetearPilaFunction(setProductos);
    }
    else alerta('Ya existe un producto con ese codigo!');
}

//fin de agregar productos

//actualizar producto
function setActualizarProducto()
{
    if(datoVacio($('#codigoProductoActualizar').val()) && datoVacio($('#nombreProductoActualizar').val())) 
    {
        servidor('https://empaquessyrgdl.000webhostapp.com/empaquesSyR/productos/update.php?codigo='+$('#codigoProductoActualizar').val()+'&producto='+$('#nombreProductoActualizar').val()+'&precio='+$('#precioProductoActualizar').val(),getActualizarProducto);
    }
    else alerta("Espacios en blanco");
    
}
function getActualizarProducto(respuesta)
{
    if(respuesta.responseText=="1") 
    {
        alerta("Registro actualizado");
        resetearPilaFunction(setProductos);
    }  
    else alerta("No se pudo actualizar");

}
function setBuscarProductoActualizar(codigo)
{
    servidor('https://empaquessyrgdl.000webhostapp.com/empaquesSyR/productos/select.php?type=3&search='+codigo,getBuscarProductoActualizar);
}
function getBuscarProductoActualizar(respuesta)
{
    var resultado = respuesta.responseText;//respuesta del servidor
    var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'
    
    
    arrayJson[0] = JSON.parse(arrayJson[0]);

    $('#codigoProductoActualizar').val(arrayJson[0].codigo);
    $('#nombreProductoActualizar').val(arrayJson[0].producto);
    $('#precioProductoActualizar').val(arrayJson[0].precio);
    
}
//fin de actualizar cliente


//fin de productos


//busqueda por barra de busqueda

function setProductosBarraBusqueda(busqueda,e)
{
    //asignar el progress bar 
    
    if(busqueda=="") setProductos();

    tecla = (document.all) ? e.keyCode : e.which;
    if (tecla==13) 
    {
        $('#loadingProductos').append("<ons-progress-bar indeterminate></ons-progress-bar>");
        servidor('https://empaquessyrgdl.000webhostapp.com/empaquesSyR/productos/select.php?type=3&search='+busqueda,getProductosBarraBusqueda);
    }
   
}
function getProductosBarraBusqueda(respuesta)
{
    var resultado = respuesta.responseText;//respuesta del servidor
    var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'
    
    listaInfinita('datosProductos','loadingProductos',arrayJson,enlistarProductos); 
}


//sirve para enlistar todos los productos
function enlistarProductos(arrayJson,i)
{
    let html1 = "";
    html1 += '<ons-card style="padding:0px;" class="botonPrograma" id="list-cliente'+i+'" onclick="crearObjetMensaje(\''+arrayJson.codigo+'\','+i+')">';
    html1 += '<ons-list-item class="" modifier="nodivider">';
    html1 += '  <div class="left">';
    html1 += '      <i class="fa-solid fa-box fa-2x"></i>';
    html1 += '  </div>';
    html1 += '  <div class="center">';
    html1 += '    <span class="list-item__title romperTexto"><b>'+ arrayJson.codigo +'</b> </span>';
    html1 += '    <span class="list-item__subtitle">'+ arrayJson.producto +'</span>';
    html1 += '  </div>"';
    html1 += '  <div class="right">$'+ arrayJson.precio +'</div>';
    html1 += '</ons-list-item>';
    html1 += '</ons-card>';

    return html1;
}

function agregarClaseProducto(i){

    $("#list-producto"+i).addClass("list-producto-animation");
    setTimeout(function(){
        $('.list-cliente-animation').remove();
    }, 1500);
}
//genera un pop de la pila de ventanas de la app *return*

