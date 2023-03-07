function preubaEgresos()
{
    var grafica = document.getElementById("prueba_grafica").getContext("2d");
    var chart = new Chart(grafica,{
       type: "line",
       data:{
           labels:["perro","gato","chucos"],
           datasets:[
               {
                   label:"Gastos",
                   backgroundColor: 'rgba(163,221,203,0.2)',
                   borderColor: 'rgba(163,221,203,1)',
                   data:[100,50,30]

               }
           ]
       }
    });
}