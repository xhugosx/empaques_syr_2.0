//ESTA FUNCION ES PARA EJECUTAR UNA FUNCION AL PAAR LA SIGUIENTE PAGINA
function nextPageFunction(miPage,miFuncion)
{
    myNavigator.pushPage(miPage, {data: {title: ''}}).then(function() {

        miFuncion();

    });
}
//ESTA FUNCION SOLO TE PASA A LA SIGUIENTE PAGINA
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
//FUMCION PRA MOSTRAR UN MENSAJE
function alerta(mensaje)
{
    ons.notification.alert(mensaje);
}
//ESTA FUNCIONA PARA MANDAR DATOS AL SERVIDOR Y RECIBIR SU RESPUESTA
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

//ASIGNAR DATOS A UN HTML Y BORRAR UNA SECCION DEL HTML
function setDataPage(agregar,eliminar,html)
{
    if(eliminar!=0)$(eliminar).empty();
    $(agregar).append(html);
}
//ESTA ES PARA MOSTRAR MENSAJE DEL LADO INFERIOR
function crearObjetMensaje(codigo) 
{
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
}
//FUNCION DE MENSAJE DE CONFIRMACION
function alertaConfirm(mensaje,funcion,variable)
{
    ons.notification.confirm({
        message: mensaje,
        buttonLabels: ['SI', 'NO'],
        callback: function(idx) {
            if(idx==0) funcion(variable);
          }
   });
}
//FUNCION PARA AGREGAR CEROS
function agregarCeros(numero)
{
    numero = String(numero);
    if(numero.length === 1) return "00"+numero;
    else if(numero.length === 2) return "0"+numero;
    else return numero;
}

//genera un pop de la pila de ventanas de la app *return* y ejecuta una funcion
function resetearPilaFunction(miFuncion)
{
    document.querySelector('ons-navigator').popPage().then(function(){
        miFuncion();
    }); 
}

//funcion para poner coma y puntos en un numro
function separator(numb) {
    var str = numb.toString().split(".");
    str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return str.join(".");
}

/* Función que suma o resta días a una fecha, si el parámetro
   días es negativo restará los días*/
function sumarDias(fecha, dias){
    fecha = new Date(fecha)
    fecha.setDate(fecha.getDate() + dias);
    // Creamos array con los meses del año
    const meses = ['ene', 'febr', 'mar', 'abr', 'may', 'jun', 'jul', 'agos', 'sep', 'oct', 'nov', 'dic'];
    // Creamos array con los días de la semana
    const dias_semana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vier', 'Sáb'];
    // Construimos el formato de salida
    fecha = dias_semana[fecha.getDay()] + ', ' + fecha.getDate() + ' de ' + meses[fecha.getMonth()] + ' de ' + fecha.getUTCFullYear();
    return fecha;
}

