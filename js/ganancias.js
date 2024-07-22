

function setIngresosEgresos()
{
    let anio = $("#anioG").text();
    servidor(myLink+"/php/IngresosEgresos/select.php?anio="+anio,getIngresoEgresos);
}
function getIngresoEgresos(respuesta)
{
    //console.log(respuesta.responseText);

    let resultado = respuesta.responseText;
    let arrayJson = resultado.split("@");

    let jsonIngresos;
    let jsonEgresos;

    if(arrayJson[0] != "")
    {
        jsonIngresos = arrayJson[0].split('|');
        for(let i=0;i<jsonIngresos.length-1;i++) jsonIngresos[i] = JSON.parse(jsonIngresos[i]);
    }
    else jsonIngresos = { "suma" : 0, "mes" : 1};

    if(arrayJson[1] != "") 
    {
        jsonEgresos = arrayJson[1].split('|');
        for(let i=0;i<jsonEgresos.length-1;i++)jsonEgresos[i] = JSON.parse(jsonEgresos[i]); 
    }
    else jsonEgresos = { "suma" : 0, "mes" : 1};
    

    //console.log(jsonIngresos,jsonEgresos);
    graficaIngresosEgresos(jsonIngresos,jsonEgresos)


    //if(arrayJson[0] == 0);


    //alert("entro");
}

function graficaIngresosEgresos(jsonIngresos,jsonEgresos)
{
    let ingresos = [];
    let egresos = [];
    for(let i = 0; i<jsonIngresos.length;i++) ingresos.push(jsonIngresos[i].suma);
    for(let i = 0; i<jsonEgresos.length;i++) egresos.push(jsonEgresos[i].suma);
    //console.log(ingresos,egresos);
    if(chart) 
    {
        chart.data.datasets[0].data = ingresos;
        chart.data.datasets[1].data = egresos;
        chart.update();
    }
    else 
    {

        var dataFirst = {
            label: "Ingresos",
            data: ingresos,
            lineTension: 0,
            fill: false,
            backgroundColor: 'rgba(163,221,203,0.2)',
            borderColor: 'rgba(163,221,203,1)'
        };
        var dataSecond = {
            label: "Egresos",
            data: egresos,
            lineTension: 0,
            fill: false,
            backgroundColor: 'rgba(229,112,126,0.2)',
            borderColor: 'rgba(229,112,126,1)'
        };

        var speedData = {
        labels: meses(),
        datasets: [dataFirst, dataSecond]
        };
        var options = {
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

        chart = new Chart(grafica,{
            type: "line",
            data:speedData,
            options: options
        });

    }
}

function prevIE() {

    var anio = parseInt($("#anioG").text())-1;
    $("#anioG").text(anio);
    setIngresosEgresos();

};
  
function nextIE() {

    var anio = parseInt($("#anioG").text())+1;
    $("#anioG").text(anio);
    setIngresosEgresos();

};