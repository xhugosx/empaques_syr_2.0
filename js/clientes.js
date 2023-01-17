//clientes
//mostrar clientes
function setClientes()
{
    servidor('https://empaquessyrgdl.000webhostapp.com/empaquesSyR/clientes/select.php?type=2',getClientes);
}
function getClientes(respuesta)
{
    
    var resultado = respuesta.responseText;//respuesta del servidor
    var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'

    resultado = enlistarClientes(arrayJson);

    $('#datosClientes').empty();
    setDataPage('#datosClientes','#loadingClientes',resultado);

}
//fin de mostrar clientes

//buscar clientes
function setClientesBarraBusqueda(busqueda,e)
{
    if(busqueda=="") setClientes()
    
    tecla = (document.all) ? e.keyCode : e.which;
    if (tecla==13) 
    {
        servidor('https://empaquessyrgdl.000webhostapp.com/empaquesSyR/clientes/select.php?type=3&search='+busqueda,getClientesBarraBusqueda);
    }
   
}
function getClientesBarraBusqueda(respuesta)
{
    var resultado = respuesta.responseText;//respuesta del servidor
    var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'
    
    resultado = enlistarClientes(arrayJson);
    
    $('#datosClientes').empty();
    setDataPage('#datosClientes',0,resultado);
}
//fin de buscar clintes
//agregar clientes
function setAgregarCliente()
{
    
    if(datoVacio($('#codigoCliente').val()) && datoVacio($('#nombreCliente').val())) 
    {
        servidor('https://empaquessyrgdl.000webhostapp.com/empaquesSyR/clientes/add.php?codigo='+$('#codigoCliente').val()+'&nombre='+$('#nombreCliente').val(),getAgregarCliente)
    }
    else alerta("Espacios en blanco");
    //validar si codigo y nombre tiene datos
    
}
function getAgregarCliente(respuesta)
{
    //alert(respuesta.responseText);
    //respuesta del servidor
    if(respuesta.responseText=="1") 
    {
        alerta("Registro insertado");
        resetearPilaFunction(setClientes);
    }
    else alerta('Ya existe un cliente con ese codigo, "No se pudo insertar"');
}

//fin de agregar clientes

//eliminar cliente

function setEliminarCliente(codigo,i)
{
    agregarClase(i);

    setTimeout(function(){
        servidor('https://empaquessyrgdl.000webhostapp.com/empaquesSyR/clientes/delete.php?codigo='+codigo,getEliminarCliente);
    }, 1500);
    
}
function getEliminarCliente(respuesta)
{
    //alert(respuesta.responseText);
    if(respuesta.responseText=="1") 
    {
        alerta("Registro eliminado");
        setClientes();
    }  
    else alerta("No se pudo eliminar");
}

//fin de eliminar cliente



//fin de Clientes

//funcion para enlistar clientes
function enlistarClientes(arrayJson)
{
    if(arrayJson=="") return '<ons-card id="contenedorPrograma"> <center> <h2>Sin resultados...</h2> </center> </ons-card>';

    let html1 = "";
    //html1 = '<ons-card id="contenedorPrograma">';

    for(var i=0;i<arrayJson.length-1;i++) 
    {
        arrayJson[i] = JSON.parse(arrayJson[i]); //convertimos los jsonText en un objeto json
        html1 += '<ons-card class="botonPrograma" id="list-cliente'+i+'" onclick="crearObjetMensajeCliente('+arrayJson[i].codigo+','+i+')">';
        html1 += '    <i class="fa-solid fa-user-large fa-lg"></i> <strong>'+ agregarCeros(arrayJson[i].codigo)+'</strong> &nbsp;'+arrayJson[i].nombre+'';
        html1 += '</ons-card>';
    }
    html1 += '<br><br><br>';

    return html1

}

//funcion para agregar 0 a la variable


