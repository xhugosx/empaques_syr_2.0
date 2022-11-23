
function setMostrarPrograma()
{
    servidor("https://empaquessyrgdl.000webhostapp.com/empaquesSyR/programa/select.php",getMostrarPrograma)
}
function getMostrarPrograma(respuesta)
{
    var resultado = respuesta.responseText;
    var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'
    //alerta(resultado);
    resultado = enlistarPrograma(arrayJson,1);

    $('#datosProgramaFlexo').empty();
    setDataPage('#datosProgramaFlexo',0,resultado);
}

function enlistarPrograma(arrayJson,tipo)
{
    if(arrayJson=="" || arrayJson == "0") return "<ons-card> <center> <h2>Sin resultados...</h2> </center> </ons-card>";
    let html1 = '<ons-list>';

    for(var i=0;i<arrayJson.length-1;i++) 
    {
        arrayJson[i] = JSON.parse(arrayJson[i]); //convertimos los jsonText en un objeto json
        if(arrayJson[i].proceso == tipo)
        {
            html1 += '<ons-list-header>';
            html1 += '</ons-list-header>';
            html1 += '<ons-list-item '+estadoColor(arrayJson[i].estado)+' tappable >';
            html1 += '    <div class="left">';
            html1 += '        <strong>'+arrayJson[i].codigo+'</strong>';
            html1 += '    </div>';
            html1 += '    <div class="center romperTexto">';
            html1 += '        <span class="list-item__title">'+arrayJson[i].producto+'  -  <b>'+arrayJson[i].resistencia+'</b></span>'; 
            html1 += '        <span class="list-item__subtitle">';
            html1 += arrayJson[i].cliente;
            html1 += '        </span>';
            html1 += '    </div>';
            html1 += '    <div class="right">';
            html1 += '         <div class="centrar">';
            html1 += separator(arrayJson[i].cantidad) + ' pzas';               
            html1 += '               <br>';                    
            html1 += '               <b>'+ estatus(arrayJson[i].estado)+'</b>';
            html1 += '         </div>';
            html1 += '    </div>';
            html1 += '</ons-list-item>';
        }

    }
    html1 += '</ons-list><br><br><br>';

    return html1
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