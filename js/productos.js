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
//productos
function setProductos()
{
    servidor('https://empaquessyrgdl.000webhostapp.com/empaquesSyR/productos/select.php?type=2',getProductos);
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

    setDataPage('#datosProductos','#loadingProductos',html1);

}
//fin de productos

//productos vista 2

function productos2()
{
    let html = "<center>";

    for(let i=1;i<101;i++)
    {
        html += '<ons-button id="'+i+'" class="boton-cliente" onclick="nextPageFunctionData(\'productos2Resultado.html\',setProductos2Resultado,agregarCeros(this.id))"><h2>'+ agregarCeros(i) +'</h2></ons-button>';
    }
    html += "</center>";
    $("#datosProductos2").append(html);
}
    //resultado de vista 2 de productos
function setProductos2Resultado(texto)
{
    servidor('https://empaquessyrgdl.000webhostapp.com/empaquesSyR/productos/select.php?type=1&search='+texto,getProductos2Resultado);
}
function getProductos2Resultado(respuesta)
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
    setDataPage('#datosProductos2Resultado','#loadingProductos2Vista',html1);
    
    
}
//fin de productos vista 2

//genera un pop de la pila de ventanas de la app *return*
function resetearPila()
{
    document.querySelector('ons-navigator').popPage(); 
}

//funcion para agregar 0 a la variable
function agregarCeros(numero)
{
    numero = String(numero);
    if(numero.length === 1) return "00"+numero;
    else if(numero.length === 2) return "0"+numero;
    else return numero;
}
