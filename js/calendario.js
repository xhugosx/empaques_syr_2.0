document.addEventListener('init', function(event) {
    var page = event.target;
    
    if (page.id === 'calendario') {
        $("#dates").empty();
        let monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto','Septiembre','Octubre', 'Noviembre', 'Diciembre'];

        let currentDate = new Date();
        let currentDay = currentDate.getDate();
        let monthNumber = currentDate.getMonth();
        let currentYear = currentDate.getFullYear();
        

        let dates = document.getElementById('dates');
        let month = document.getElementById('month');
        let year = document.getElementById('year');
        let month__number = document.getElementById('month__number');

        let prevMonthDOM = document.getElementById('prev-month');
        let nextMonthDOM = document.getElementById('next-month');

        month.textContent = monthNames[monthNumber];
        year.textContent = currentYear.toString();

        prevMonthDOM.addEventListener('click', ()=>lastMonth());
        nextMonthDOM.addEventListener('click', ()=>nextMonth());

        month__number.innerHTML = monthNumber+1;
        

        const writeMonth = (month) => {

            

            for(let i = startDay(); i>0;i--){
                dates.innerHTML += ` <div class="calendar__date calendar__item calendar__last-days" onclick="console.log(event)">
                    ${getTotalDays(monthNumber-1)-(i-1)}
                </div>`;
            }

            for(let i=1; i<=getTotalDays(month); i++){
                if(i===currentDay && month__number.innerHTML == monthNumber+1) {
                    dates.innerHTML += ` <div class="calendar__date calendar__item calendar__today" onclick="mostrarFecha(event)">${i}</div>`;
                }else{
                    dates.innerHTML += ` <div class="calendar__date calendar__item" onclick="mostrarFecha(event)">${i}</div>`;
                }
            }
            
            
        }

        const getTotalDays = month => {
            if(month === -1) month = 11;

            if (month == 0 || month == 2 || month == 4 || month == 6 || month == 7 || month == 9 || month == 11) {
                return  31;

            } else if (month == 3 || month == 5 || month == 8 || month == 10) {
                return 30;

            } else {

                return isLeap() ? 29:28;
            }
        }

        const isLeap = () => {
            return ((currentYear % 100 !==0) && (currentYear % 4 === 0) || (currentYear % 400 === 0));
        }

        const startDay = () => {
            let start = new Date(currentYear, monthNumber, 1);
            return ((start.getDay()-1) === -1) ? 6 : start.getDay()-1;
        }

        const lastMonth = () => {
            if(monthNumber !== 0){
                monthNumber--;
            }else{
                monthNumber = 11;
                currentYear--;
            }

            setNewDate();
        }

        const nextMonth = () => {
            if(monthNumber !== 11){
                monthNumber++;
            }else{
                monthNumber = 0;
                currentYear++;
            }

            setNewDate();
        }

        const setNewDate = () => {
            currentDate.setFullYear(currentYear,monthNumber,currentDay);
            month.textContent = monthNames[monthNumber];
            year.textContent = currentYear.toString();
            dates.textContent = '';
            writeMonth(monthNumber);
            
        }

        writeMonth(monthNumber);
    } 
});

function mostrarFecha(event)
{
    
    let dia1 = event.target.innerHTML;
    let anio1 = document.getElementById('year').innerHTML;
    let mes1 = mesesNumero(document.getElementById('month').innerHTML);

    //console.log(document.getElementsByClassName('calendar__selected'));

    //if( document.getElementsByClassName('calendar__selected') != null ) 
    //document.getElementsByClassName('calendar__date calendar__item').classList.remove('calendar__selected');
    $(".calendar__date").removeClass("calendar__selected");
    
    event.target.classList.add('calendar__selected');

    let fecha1 = anio1+"-"+mes1+"-"+dia1;
    setMostrarPedidosLaminaFecha(fecha1)
}

function mesesNumero(mes1)
{
    //console.log(mes);
    switch (mes1)
    {
        case "Enero" : return "01";
        case "Febrero" : return "02";
        case "Marzo" : return "03";
        case "Abril" : return "04";
        case "Mayo" : return "05";
        case "Junio" : return "06";
        case "Julio" : return "07";
        case "Agosto" : return "08";
        case "Septiembre" : return "09";
        case "Octubre" : return "10";
        case "Noviembre" : return "11";
        case "Diciembre" : return "12";
    }
    
}