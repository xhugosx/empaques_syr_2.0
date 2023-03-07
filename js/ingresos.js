function setIngresos()
{
    //let anio = "";
    servidor('https://empaquessyrgdl.000webhostapp.com/empaquesSyR/ingresos/ingresoTotal.php',getIngresos);
}
function getIngresos(respuesta)
{
    let resultado = respuesta.responseText;
    let importes = resultado.split("|");
    importes.pop();

    $("#cantidadTotal").text("$ "+suma(importes));

    var grafica = document.getElementById("grafica").getContext("2d");
    var chart = new Chart(grafica,{
       type: "line",
       data:{
           labels: meses(),
           datasets:[
               {
                   label:"Ganancias",
                   backgroundColor: 'rgba(163,221,203,0.2)',
                   borderColor: 'rgba(163,221,203,1)',
                   data: importes

               }
           ]
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