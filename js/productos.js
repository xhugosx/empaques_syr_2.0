

//productos
//ver productos
function setProductos()
{
    servidor('https://empaquessyrgdl.000webhostapp.com/empaquesSyR/productos/select.php?type=2',getProductos);
}
function getProductos(respuesta)
{
    var resultado = respuesta.responseText;//respuesta del servidor
    var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'

    resultado = enlistarProductos(arrayJson);

    $('#datosProductos').empty();
    setDataPage('#datosProductos','#loadingProductos',resultado);

}
//fin de ver productos

//eliminar productos
function setEliminarProducto(producto)
{
    servidor('https://empaquessyrgdl.000webhostapp.com/empaquesSyR/productos/delete.php?codigo='+producto,getEliminarProducto)
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
    
   
    if(datoVacio($('#codigoProducto1').val()) && datoVacio($('#codigoProducto2').val()) && datoVacio($('#nombreProducto').val()) && datoVacio($('#precioProducto').val())) 
    {
        servidor('https://empaquessyrgdl.000webhostapp.com/empaquesSyR/productos/add.php?codigo='+$('#codigoProducto1').val()+'/'+$('#codigoProducto2').val()+'&producto='+$('#nombreProducto').val()+'&precio='+$('#precioProducto').val(),getAgregarProducto)
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
    if(busqueda=="") setProductos();

    tecla = (document.all) ? e.keyCode : e.which;
    if (tecla==13) 
    {
        servidor('https://empaquessyrgdl.000webhostapp.com/empaquesSyR/productos/select.php?type=3&search='+busqueda,getProductosBarraBusqueda);
    }
   
}
function getProductosBarraBusqueda(respuesta)
{
    var resultado = respuesta.responseText;//respuesta del servidor
    var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'
    
    resultado = enlistarProductos(arrayJson);
    
    $('#datosProductos').empty();
    setDataPage('#datosProductos',0,resultado);
}


//sirve para enlistar todos los productos
function enlistarProductos(arrayJson)
{
    if(arrayJson=="") return "<ons-card> <center> <h2>Sin resultados...</h2> </center> </ons-card>";
    let html1;
    html1 = '<ons-card>';

    for(var i=0;i<arrayJson.length-1;i++) 
    {
        arrayJson[i] = JSON.parse(arrayJson[i]); //convertimos los jsonText en un objeto json

        html1 += '<ons-list-item>';
        html1 += '  <div class="left">';
        html1 += '      <i class="fa-solid fa-box fa-2x"></i>';
        //html1 += '        hola';
        html1 += '  </div>';
        html1 += '  <div class="center romperTexto">';
        html1 += '    <span class="list-item__title"><b>'+ arrayJson[i].codigo +'</b> '+ arrayJson[i].producto +'</span>';
        html1 += '    <span class="list-item__subtitle">$'+ arrayJson[i].precio +'</span>';
        html1 += '  </div>';
        html1 += '    <div class="right">';
        html1 += '          <i class="fa-solid fa-bars fa-lg" onclick="crearObjetMensaje(\''+arrayJson[i].codigo+'\')"></i>';
        html1 += '    </div>';
        html1 += '</ons-list-item>';

    }

    html1 += '</ons-card> <br><br>';

    return html1;
}

//genera un pop de la pila de ventanas de la app *return*

