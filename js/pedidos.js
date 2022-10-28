//variable global para ver si filtrar o no
var filtro = false;
function asignarFiltro(valor)
{
    filtro = valor.checked;
    setBusquedaPendiente();
    setPedidosCliente()

}

function buscarDtospedidos()
{
    setBusquedaPendiente();
    setPedidosCliente();
    //aqui se ejecutara la otra funcion
}

//BUSQUEDA POR CLIENTE VISTA 1
function setPedidosCliente()
{
    var type = 2;
    if(filtro) type = 1;
    servidor("https://empaquessyrgdl.000webhostapp.com/empaquesSyR/lista_pedidos/selectCliente.php?type="+type,getPedidosCliente)
}
function getPedidosCliente(respuesta)
{
    var resultado = respuesta.responseText;//respuesta del servidor
    var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'

    resultado = enlistarPedidosCliente(arrayJson);

    $('#datosPedidosClientes').empty();    
    setDataPage('#datosPedidosClientes','#datosPedidosClientesLoading',resultado);
}

//BUQUEDA POR TODOS VISTA 2
function setBusquedaPendiente()
{
    var type = 2;
    if(filtro) type = 1;
    servidor("https://empaquessyrgdl.000webhostapp.com/empaquesSyR/lista_pedidos/selectAll.php?type="+type,getFiltroEntregado)
}
function getFiltroEntregado(respuesta)
{
    var resultado = respuesta.responseText;//respuesta del servidor
    var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'

    resultado = enlistarPedidos(arrayJson);

    $('#datosPedidos').empty();  
    setDataPage('#datosPedidos',0,resultado);
}

//ENLISTAR DATOS CLIENTES
function enlistarPedidosCliente(arrayJson)
{
    if(arrayJson=="") return "<ons-card> <center> <h2>Sin resultados...</h2> </center> </ons-card>";

    let html1;
    html1 = '<ons-card>';

    for(var i=0;i<arrayJson.length-1;i++) 
    {
        arrayJson[i] = JSON.parse(arrayJson[i]); //convertimos los jsonText en un objeto json

        
        html1 += '<ons-list-item modifier="chevron" tappable>';
        html1 += '    <div class="left">';
        html1 += '        <strong>';
        html1 += agregarCeros(arrayJson[i].codigo);
        html1 += '        </strong>';
        html1 += '    </div>';
        html1 += '    <div class="center">';
        html1 += arrayJson[i].cliente;
        html1 += '    </div>';
        html1 += '    <div class="right">';
        html1 += '        <span class="notification">'+arrayJson[i].contador+'</span>';
        html1 += '    </div>';
        html1 += '</ons-list-item>';
        

    }
    html1 += '</ons-card><br><br><br>';

    return html1
}
function enlistarPedidos(arrayJson)
{
    if(arrayJson=="") return "<ons-card> <center> <h2>Sin resultados...</h2> </center> </ons-card>";

    let html1;
    html1 = '<ons-card>';

    for(var i=0;i<arrayJson.length-1;i++) 
    {
        arrayJson[i] = JSON.parse(arrayJson[i]); //convertimos los jsonText en un objeto json
        
        
        html1 += '<ons-list-header>';
        html1 += arrayJson[i].id;
        html1 += '    &emsp;&emsp;&emsp;';
        html1 += '    <b style="color: rgb(61, 121, 75);">';
        html1 += '        Se entrega el dia: '+sumarDias(arrayJson[i].fecha_oc,20); //aqui ira una fecha 
        html1 += '    </b>';
        html1 += '</ons-list-header>';
        html1 += '<ons-list-item tappable onclick="preubaAlerta(\''+arrayJson[i].oc+'\')">';
        html1 += '    <div class="left">';
        html1 += '        <strong>'+arrayJson[i].codigo+'</strong>';
        html1 += '    </div>';
        html1 += '    <div class="center romperTexto">';
        html1 += '        <span class="list-item__title">'+arrayJson[i].producto+'</span>'; 
        html1 += '        <span class="list-item__subtitle">';
        html1 += arrayJson[i].cliente;
        html1 += '        </span>';
        html1 += '    </div>';
        html1 += '    <div class="right">';
        html1 += '<b>'+separator(arrayJson[i].cantidad)+' pzas</b>';
        html1 += '    </div>';
        html1 += '</ons-list-item>';
        

    }
    html1 += '</ons-card><br><br><br>';

    return html1
}
function informacionPedido()
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
function preubaAlerta(dato)
{
    alerta("O.C.: "+dato)
}