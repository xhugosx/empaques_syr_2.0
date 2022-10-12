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
    $(agregar).append(html);
    if(eliminar!=0)$(eliminar).remove();
}
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

    let html1;
    html1 = '<ons-card>';
    //html1 = '<ons-list>';

    for(var i=0;i<arrayJson.length-1;i++) 
    {
        arrayJson[i] = JSON.parse(arrayJson[i]); //convertimos los jsonText en un objeto json

       
        html1 += '<ons-list-header>'+ agregarCeros(arrayJson[i].codigo)+'</ons-list-header>';
        html1 += '<ons-list-item>';
        html1 += '<div class="left">';
        html1 += '    <i class="fa-solid fa-user-large"></i>';
        html1 += '</div>';
        html1 += '<div class="center">';
        html1 += '   <strong>'+arrayJson[i].nombre+'</strong>';
        html1 += '</div>';
        html1 += '</ons-list-item>';

    }
    //html1 += '</ons-list>';
    html1 += '</ons-card>';

    setDataPage('#datosClientes','#loadingClientes',html1);

}
//fin de mostrar clientes

//agregar clientes



//fin de agregar clientes

//fin de Clientes

//funcion para agregar 0 a la variable
function agregarCeros(numero)
{
    numero = String(numero);
    if(numero.length === 1) return "00"+numero;
    else if(numero.length === 2) return "0"+numero;
    else return numero;
}
