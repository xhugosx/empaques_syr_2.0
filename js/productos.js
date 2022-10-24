function nextPageFunction(miPage,miFuncion)
{
    myNavigator.pushPage(miPage, {data: {title: ''}}).then(function() {

        miFuncion();

    });
}
function nextPage(miPage)
{
    myNavigator.pushPage(miPage, {data: {title: ''}});
}
function nextPageFunctionData(miPage,miFuncion,dato)
{
    myNavigator.pushPage(miPage, {data: {title: ''}}).then(function() {

        miFuncion(dato);

    });
}

function alerta(mensaje)
{
    ons.notification.alert(mensaje);
}

function servidor(link,miFuncion)
{
   var xhttp = new XMLHttpRequest();

   xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){

            miFuncion(this);

        }
    
    };

    xhttp.open("GET",link,true);
    xhttp.send();
}

function setDataPage(agregar,eliminar,html)
{
    if(eliminar!=0)$(eliminar).empty();
    $(agregar).append(html);
}

function crearObjetMensaje(codigo) {
    ons.openActionSheet({
      title: 'OPCIONES',
      cancelable: true,
      buttons: [
        'Plano',
        'Modificar',
        {
          label:'Eliminar',
          modifier: 'destructive'
        }
      ]
    }).then(function (index) { 
      if(index==0) window.open('https://empaquessyrgdl.000webhostapp.com/planos/'+codigo.substring(0,3)+'/'+codigo.substring(0,3)+'-'+codigo.substring(4,7)+'.pdf', '_blank');
      else if(index==1) nextPageFunctionData('ActualizarProductos.html',setBuscarProductoActualizar,codigo); //alert("modificara "+codigo);
      else if(index==2) alertaConfirm('Estas seguro de eliminar este producto? '+codigo,setEliminarProducto,codigo);
    });
  };


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
    
    if($('#codigoProducto').val().length == 7 && $('#codigoProducto').val().includes('/'))
    {
        if(datoVacio($('#codigoProducto').val()) && datoVacio($('#nombreProducto').val()) && datoVacio($('#precioProducto').val())) 
        {
            servidor('https://empaquessyrgdl.000webhostapp.com/empaquesSyR/productos/add.php?codigo='+$('#codigoProducto').val()+'&producto='+$('#nombreProducto').val()+'&precio='+$('#precioProducto').val(),getAgregarProducto)
        }
        else alerta("Espacios en blanco");
    }   
    else alerta("Codigo invalido")
   
    //validar si codigo y nombre tiene datos
    
}
function getAgregarProducto(respuesta)
{
    //respuesta del servidor
    if(respuesta.responseText=="1") 
    {
        alerta("Registro insertado");
        resetearPilaProducto(setProductos);
    }
    else alerta('"No se pudo insertar"');
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
        resetearPilaProducto(setProductos);
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
function resetearPilaProducto(miFuncion)
{
    document.querySelector('ons-navigator').popPage().then(function(){
        miFuncion();
    }); 
}

//funcion para agregar 0 a la variable
function agregarCeros(numero)
{
    numero = String(numero);
    if(numero.length === 1) return "00"+numero;
    else if(numero.length === 2) return "0"+numero;
    else return numero;
}


//funcion para acortar texto
/*function acortarTexto(texto)
{
    if(texto.length < 25) return texto;
    else return texto.substring(0,25)+"...";
}*/