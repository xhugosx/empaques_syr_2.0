function setEgresos()
{
  $("#loadingEgreso").empty();
  $('#loadingEgreso').append("<ons-progress-bar indeterminate></ons-progress-bar>");
  var anio = $("#anioG").text();
  servidor('https://empaquessyrgdl.000webhostapp.com/empaquesSyR/egresos/egresoTotal.php?anio='+anio,getEgresos);
}
function getEgresos(respuesta)
{
  let resultado = respuesta.responseText;
  let importes = resultado.split("|");
  if(importes.length>1) listaInfinita('mesesEgresos','loadingEgreso',importes,enlitsarMesEgreso);
  else 
  {
    importes.pop();
    listaInfinita('mesesEgresos','loadingEgreso',importes,enlitsarMesEgreso);
    importes.push("");
  }
  importes.pop();
  $("#cantidadTotal").text("$ "+suma(importes));
  if(chart) 
  {
    chart.data.datasets[0].data = importes;
    chart.update();
  }
  else 
  {
    var grafica = document.getElementById("grafica").getContext("2d");
    chart = new Chart(grafica,{
      type: "line",
      data:{
        labels: meses(),
          datasets:[
              {
                  label:"Gastos",
                  backgroundColor: 'rgba(229,112,126,0.2)',
                  borderColor: 'rgba(229,112,126,1)',
                  data: importes,

              }
          ],
      },
      options: {
        tooltips: {
            callbacks: {
              label (t, d) {
                const xLabel = d.datasets[t.datasetIndex].label;
                const yLabel = t.yLabel >= 1000 ? '$ ' + t.yLabel.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '$ ' + t.yLabel;
                return xLabel + ': ' + yLabel;
              }
            }
          },
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                  callback: (label, index, labels) => {
                    return '$ ' + label.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                  }
                }
              }
            ]
        }
        
      }
    });
  }
}
function enlitsarMesEgreso(arrayJson,i)
{
  let html1 = "";

  html1 += '<ons-card style="padding:0px;" class="botonPrograma"> ';
  html1 += '    <ons-list-item class="" modifier="nodivider">'; 
  html1 += '        <div class="left"> ';
  html1 += '            <i class="fa-solid fa-money-bill-trend-up fa-2x" style="transform: rotate(180deg);"></i> ';
  html1 += '        </div> ';
  html1 += '        <div class="center"> ';
  html1 += '            <b> '+mes(i)+' </b>';
  html1 += '        </div>';
  html1 += '        <div class="right" style="color: red;"><b>$ ' + arrayJson.toLocaleString("en")+'</b></div> ';
  html1 += '    </ons-list-item> ';
  html1 += '</ons-card>';
  return html1;
}



function meses()
{
    return ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
}
function mes(numero)
{
  var mes = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  return mes[numero];
}
function suma(array)
{
    let total = 0;
    for(let i=0; i<array.length;i++)
    {
        total+=parseFloat(array[i]);
    }
    return separator(total.toFixed(2));
}


function prevE() {
  //var carousel = document.getElementById(id);
  //carousel.prev();
  var anio = parseInt($("#anioG").text())-1;
  $("#anioG").text(anio);
  setEgresos();
};

function nextE() {
  //var carousel = document.getElementById(id);
  //carousel.next();
  var anio = parseInt($("#anioG").text())+1;
  $("#anioG").text(anio);
  setEgresos();
};