var idPedido = "";
function setMostrarPrograma()
{
    servidor("https://empaquessyrgdl.000webhostapp.com/empaquesSyR/programa/select.php",getMostrarPrograma)
}
function getMostrarPrograma(respuesta)
{
    var resultado = respuesta.responseText;
    const arrayJson  = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'
    //creamos una copia 

    resultado = enlistarPrograma(arrayJson,1);
    $('#datosProgramaFlexo').empty();
    setDataPage('#datosProgramaFlexo',0,resultado);
    //tipo 2 para impresion

    resultado = enlistarPrograma(arrayJson,2);
    $('#datosProgramaPegado').empty();
    setDataPage('#datosProgramaPegado',0,resultado);

    resultado = enlistarPrograma(arrayJson,3);
    $('#datosProgramaImpresion').empty();
    setDataPage('#datosProgramaImpresion',0,resultado);

    resultado = enlistarPrograma(arrayJson,2);
    $('#datosProgramaSuajado').empty();
    setDataPage('#datosProgramaSuajado',0,resultado);
}

function enlistarPrograma(arrayJson,tipo)
{
    //alert("entro");
    if(arrayJson=="" || arrayJson == "0") return "<ons-card> <center> <h2>Sin resultados...</h2> </center> </ons-card>";
    let html1 = '<ons-list>';

    for(var i=0;i<arrayJson.length-1;i++) 
    {
        arrayJson[i] = verificarError(arrayJson[i]) ? JSON.parse(arrayJson[i]) : arrayJson[i]; //convertimos los jsonText en un objeto json
        if(arrayJson[i].proceso == tipo)
        {
            //html1 += '<ons-list-header>';
            //html1 += '</ons-list-header>';
            html1 += '<ons-list-item '+estadoColor(arrayJson[i].estado)+' tappable >';
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
            html1 += '         <div class="centrar">';
            html1 += arrayJson[i].resistencia;               
            html1 += '               <br>';                    
            html1 += '               <b>'+ separator(arrayJson[i].cantidad) +' pzas</b>';
            html1 += '         </div>';
            html1 += '    </div>';
            html1 += '</ons-list-item>';
        }

    }
    html1 += '</ons-list><br><br><br>';

    return html1
}
function setagregarPrograma(id)
{
    var procesos = "";
    for(var i = 0; i<9 ; i++)
    {
        if ($('#check'+(i+1)).prop('checked')) procesos += (i+1) +",";
    } 

   if(procesos == "") alerta("No haz seleccionado niguna");
   else servidor('https://empaquessyrgdl.000webhostapp.com/empaquesSyR/programa/add.php?id='+id+'&procesos='+procesos,getAgregarPrograma)

   
} 
function getAgregarPrograma(respuesta)
{
    
    if(respuesta.responseText=="1") 
    {
        alerta("Producto se agrego al programa");
        cerrarDialogo('my-dialog-programa');
        buscarDtospedidos()
    }
    else alerta('hubo un error al insertar!');
    
}

function asignarEstatusPrograma()
{
    servidor(0,0);
}
function estatus(dato)
{
   if(dato==0) return '';
   else if(dato==1) return 'Proceso';
   else return 'Terminado';
    
}
function estadoColor(dato)
{
    if(dato==0) return '';
   else if(dato==1) return 'id="proceso"';
   else return 'id="terminado"';
}
function verificarError(objeto)
{
    try{
        objeto = JSON.parse(objeto);
        return true;
    }
    catch{
        return false
    }
}
function prueba(){
    var icon = '<tr><td> <a  onclick="del('+i +',\'' + mat +'\',\'' +size +'\')"><img src="..wwwroot/img/ELIMINAR.png" id = "icon_delete" class= "img-delete" /></a></td ></tr>';
}