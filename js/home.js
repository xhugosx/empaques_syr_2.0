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

//productos
function productos()
{
    servidor('https://empaquessyrgdl.000webhostapp.com/empaquesSyR/conexion/prueba.php',getProductos);
}
function getProductos(respuesta)
{
    var resultado = respuesta.responseText;//respuesta del servidor
    var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'

    let html1;
    html1 = '<ons-card>';

    for(var i=0;i<arrayJson.length-1;i++) 
    {
        arrayJson[i] = JSON.parse(arrayJson[i]); //convertimos los jsonText en un objeto json

        html1 += '<ons-list-item modifier="chevron" tappable>';
        html1 += '  <div class="left">';
        html1 += '      <i class="fa-solid fa-box fa-2x"></i>';
        html1 += '  </div>';
        html1 += '  <div class="center">';
        html1 += '    <span class="list-item__title"><b>'+ arrayJson[i].codigo +'</b> '+ arrayJson[i].producto +'</span>';
        html1 += '    <span class="list-item__subtitle">$'+ arrayJson[i].precio +'</span>';
        html1 += '  </div>';
        html1 += '</ons-list-item>';

    }

    html1 += '</ons-card>';

    $('#datosProductos').append(html1);
    $('#loadingProductos').remove();

}
//fin de productos
