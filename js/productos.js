

//productos
//ver productos
function setProductos()
{
    $('#loadingProductos').empty();
    $('#loadingProductos').append("<ons-progress-bar indeterminate></ons-progress-bar>");
    var busqueda = $('#busquedaProductos1').val();
    if (busqueda == "" || busqueda == undefined) servidor('https://empaquessyrgdl.000webhostapp.com/empaquesSyR/productos/select.php?type=2',getProductos);
    else setProductosBarraBusqueda(busqueda,13);
    //servidor('https://empaquessyrgdl.000webhostapp.com/empaquesSyR/productos/select.php?type=2',getProductos);
}
function getProductos(respuesta)
{
    var resultado = respuesta.responseText;//respuesta del servidor
    var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'
    //alert("entro");

    listaInfinita('datosProductos','loadingProductos',arrayJson,enlistarProductos);

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
    //alert(respuesta.responseText);
}
//fin de eliminar productos

//agregar productos
function setAgregarProducto()
{
    
    if(datoVacio($('#codigoProducto1').val()) && datoVacio($('#nombreProducto').val()) && datoVacio($('#precioProducto').val()) && datoVacio($('input[type=file]').val())) 
    {
        var filename = $('input[type=file]').val().replace(/.*(\/|\\)/, '');
        var codigo = filename.split(".");
        codigo = codigo[0].replace("-","/");

        if(codigo == $('#codigoProducto1').val())
        {
            var form = $('#formProducto')[0];
            var formData = new FormData(form);
    
            servidorPost('https://empaquessyrgdl.000webhostapp.com/empaquesSyR/productos/add.php',getAgregarProducto,formData);
            //alerta("el archivo si coiciden");
        }
        else alerta("El Archivo no coicide con el codigo del producto");
       
    }
    else alerta("Espacios en blanco");
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
    //alert(respuesta.responseText);
}

//fin de agregar productos

//actualizar producto
function setActualizarProducto()
{
    if(datoVacio($('#codigoProductoActualizar').val()) && datoVacio($('#nombreProductoActualizar').val())) 
    {
        if( $('input[type=file]').val() ) 
        {
            var filename = $('input[type=file]').val().replace(/.*(\/|\\)/, '');
            var codigo = filename.split(".");
            codigo = codigo[0].replace("-","/");
            if(codigo != $('#codigoProductoActualizar').val()) 
            {
                alerta("El Archivo no coicide con el codigo del producto"); 
                return 0;
            }
        }
        $("#codigoProductoActualizar").prop('disabled', false);
        var form = $('#formProductoActualizar')[0];
        var formData = new FormData(form);
        servidorPost('https://empaquessyrgdl.000webhostapp.com/empaquesSyR/productos/update.php',getActualizarProducto,formData);
    }
    else alerta("Espacios en blanco");
    
}
function getActualizarProducto(respuesta)
{
    //alert(respuesta.responseText);
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
    var producto = (arrayJson[0].codigo).split("/"); // funcion para dividir codigo y poner nombre del archivo...
    $('#codigoProductoActualizar').val(arrayJson[0].codigo);
    $('#nombreProductoActualizar').val(arrayJson[0].producto);
    $('#precioProductoActualizar').val(arrayJson[0].precio);
    $('#pdfNombreProductoActualizar').text(arrayJson[0].file == 1 ? producto[0]+"-"+producto[1]+".pdf"  : "No tiene Plano");
    //alert(arrayJson[0].file);
    
}
//fin de actualizar cliente


//fin de productos


//busqueda por barra de busqueda

function setProductosBarraBusqueda(busqueda,e)
{
    //asignar el progress bar 
    
    if(busqueda=="") setProductos();

    tecla = (document.all) ? e.keyCode : e.which;
    if (tecla==13 || e == 13) 
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
    //console.log(arrayJson);
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
    html1 += '  <div class="right">'+ExistePlano(arrayJson.file)+'$'+ arrayJson.precio +'</div>';
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

function cargarArchivoProducto()
{
   //alert(""+);
   var filename = $('input[type=file]').val().replace(/.*(\/|\\)/, '');
    //alert(filename);
    var extension = filename.split(".");
    if(extension[1] === "pdf") $('#pdfNombreProducto').text(filename);
    else
    {
        alerta("Archivo no valido");
        $('#pdfNombreProducto').text('Selecciona un archivo "PDF"');
        $('input[type=file]').val("");
    }

}

function cargarArchivoProductoActualizar()
{
   //alert(""+);
   var filename = $('input[type=file]').val().replace(/.*(\/|\\)/, '');
    //alert(filename);
    var extension = filename.split(".");
    if(extension[1] === "pdf") $('#pdfNombreProductoActualizar').text(filename);
    else
    {
        alerta("Archivo no valido");
        //$('#pdfNombreProductoActualizar').text('Selecciona un archivo "PDF"');
        $('input[type=file]').val("");
    }

}

function verPlano(plano)
{
    $("#loadingPlano").empty();
    $("#plano").attr("src","https://docs.google.com/gview?url="+plano+"&embedded=true");
}

function ExistePlano(file)
{
    return file == 1 ? '<i class="fa-solid fa-file-circle-check fa-lg" style="color:#00bb2d"></i>' :'<i class="fa-solid fa-file-circle-xmark fa-lg" style="color:#ff6961"></i>';
}