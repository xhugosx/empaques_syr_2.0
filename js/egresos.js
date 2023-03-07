function setEgresos()
{
    //let anio = "";
    servidor('https://empaquessyrgdl.000webhostapp.com/empaquesSyR/egresos/egresoTotal.php',getEgresos);
}
function getEgresos(respuesta)
{
    let resultado = respuesta.responseText;
    let importes = resultado.split("|");
    importes.pop();
    //importes[0] = separator(importes[0]);
    //aler(trespuesta);
    $("#cantidadTotal").text("$ "+suma(importes));
    
    var grafica = document.getElementById("grafica").getContext("2d");
    var chart = new Chart(grafica,{
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



function meses()
{
    return ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"]
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