


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

function setEliminarCliente(codigo)
{
    servidor('https://empaquessyrgdl.000webhostapp.com/empaquesSyR/clientes/delete.php?codigo='+codigo,getEliminarCliente);
}
function getEliminarCliente(respuesta)
{
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
    if(arrayJson=="") return "<ons-card> <center> <h2>Sin resultados...</h2> </center> </ons-card>";

    let html1;
    html1 = '<ons-card>';

    for(var i=0;i<arrayJson.length-1;i++) 
    {
        arrayJson[i] = JSON.parse(arrayJson[i]); //convertimos los jsonText en un objeto json

        html1 += '<ons-list-item>';
        html1 += '<div class="left">';
        html1 += '    <i class="fa-solid fa-user-large fa-lg"></i>';
        html1 += '</div>';
        html1 += '<div class="center romperTexto">';
        html1 += '   <strong>'+ agregarCeros(arrayJson[i].codigo)+'</strong> &nbsp;'+arrayJson[i].nombre+'';
        html1 += '</div>';
        html1 += '<div class="right">';
        html1 += '   <i class="fa-solid fa-trash fa-lg" style="color:red" onclick="alertaConfirm(\'Estas seguro de eliminar este cliente '+agregarCeros(arrayJson[i].codigo)+'?\',setEliminarCliente,\''+arrayJson[i].codigo+'\')"></i>';
        html1 += '</div>';

        html1 += '</ons-list-item>';

    }
    html1 += '</ons-card><br><br><br>';

    return html1

}

//funcion para agregar 0 a la variable
function agregarCeros(numero)
{
    numero = String(numero);
    if(numero.length === 1) return "00"+numero;
    else if(numero.length === 2) return "0"+numero;
    else return numero;
}

//funcion para saber si tiene datos una variable
function datoVacio(dato)
{
    if(dato=="") return false;
    else return true;
}

