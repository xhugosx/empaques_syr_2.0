/*document.addEventListener('init', function (event) {
    var page = event.target;

    if (page.id === 'calendario') {
        $("#dates").empty();
        let monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

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

        prevMonthDOM.addEventListener('click', () => lastMonth());
        nextMonthDOM.addEventListener('click', () => nextMonth());

        month__number.innerHTML = monthNumber + 1;


        const writeMonth = (month) => {



            for (let i = startDay(); i > 0; i--) {
                dates.innerHTML += ` <div class="calendar__date calendar__item calendar__last-days" onclick="console.log(event)">
                    ${getTotalDays(monthNumber - 1) - (i - 1)}
                </div>`;
            }

            for (let i = 1; i <= getTotalDays(month); i++) {
                if (i === currentDay && month__number.innerHTML == monthNumber + 1) {
                    dates.innerHTML += ` <div class="calendar__date calendar__item calendar__today" onclick="mostrarFecha(event)">${i}</div>`;
                } else {
                    dates.innerHTML += ` <div class="calendar__date calendar__item" onclick="mostrarFecha(event)">${i}</div>`;
                }
            }


        }

        const getTotalDays = month => {
            if (month === -1) month = 11;

            if (month == 0 || month == 2 || month == 4 || month == 6 || month == 7 || month == 9 || month == 11) {
                return 31;

            } else if (month == 3 || month == 5 || month == 8 || month == 10) {
                return 30;

            } else {

                return isLeap() ? 29 : 28;
            }
        }

        const isLeap = () => {
            return ((currentYear % 100 !== 0) && (currentYear % 4 === 0) || (currentYear % 400 === 0));
        }

        const startDay = () => {
            let start = new Date(currentYear, monthNumber, 1);
            return ((start.getDay() - 1) === -1) ? 6 : start.getDay() - 1;
        }

        const lastMonth = () => {
            if (monthNumber !== 0) {
                monthNumber--;
            } else {
                monthNumber = 11;
                currentYear--;
            }

            setNewDate();
        }

        const nextMonth = () => {
            if (monthNumber !== 11) {
                monthNumber++;
            } else {
                monthNumber = 0;
                currentYear++;
            }

            setNewDate();
        }

        const setNewDate = () => {
            currentDate.setFullYear(currentYear, monthNumber, currentDay);
            month.textContent = monthNames[monthNumber];
            year.textContent = currentYear.toString();
            dates.textContent = '';
            writeMonth(monthNumber);

        }

        writeMonth(monthNumber);
    }
});

function mostrarFecha(event) {

    let dia1 = event.target.innerHTML;
    let anio1 = document.getElementById('year').innerHTML;
    let mes1 = mesesNumero(document.getElementById('month').innerHTML);

    $(".calendar__date").removeClass("calendar__selected");

    event.target.classList.add('calendar__selected');

    let fecha1 = anio1 + "-" + mes1 + "-" + dia1;
    setMostrarPedidosLaminaFecha(fecha1)
}

function mesesNumero(mes) {
    const meses = {
        Enero: "01",
        Febrero: "02",
        Marzo: "03",
        Abril: "04",
        Mayo: "05",
        Junio: "06",
        Julio: "07",
        Agosto: "08",
        Septiembre: "09",
        Octubre: "10",
        Noviembre: "11",
        Diciembre: "12"
    };

    return meses[mes]; // Devolver el número del mes o una cadena vacía si no se encuentra el mes
}*/



document.addEventListener('init', function (event) {
    var page = event.target;

    if (page.id === 'calendario') {
        const mesElemento = document.getElementById('nombreMes');
        const diasElemento = document.getElementById('dias');

        let fechaActual = new Date();
        let mes = fechaActual.getMonth();
        let año = fechaActual.getFullYear();
        let diaSeleccionado = null;

        // Función para obtener el nombre del mes
        function obtenerNombreMes(mes) {
            const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
            return meses[mes];
        }

        // Función para cambiar entre meses
        window.cambiarMes = function (direccion) {
            if (direccion === 'anterior') {
                mes = (mes === 0) ? 11 : mes - 1;
                año = (mes === 11) ? año - 1 : año;
            } else {
                mes = (mes === 11) ? 0 : mes + 1;
                año = (mes === 0) ? año + 1 : año;
            }

            mostrarCalendario();
        }

        // Función para mostrar el calendario
        function mostrarCalendario() {
            mesElemento.textContent = obtenerNombreMes(mes) + ' ' + año;
            diasElemento.innerHTML = '';

            // Obtener el primer día del mes y el número de días en el mes
            const primerDia = new Date(año, mes, 1);
            const ultimoDia = new Date(año, mes + 1, 0);

            // Crear celdas para los días del mes
            for (let i = 1; i <= ultimoDia.getDate(); i++) {
                const diaElemento = document.createElement('div');
                diaElemento.className = 'dia';

                const numeroDia = document.createElement('span');
                numeroDia.className = 'numero-dia';
                numeroDia.textContent = i;
                diaElemento.appendChild(numeroDia);

                diaElemento.addEventListener('click', function () {
                    //console.log(event);
                    if (diaSeleccionado) {
                        diaSeleccionado.classList.remove('selected');
                    }

                    diaElemento.classList.add('selected');
                    diaSeleccionado = diaElemento;

                    const fechaSeleccionada = new Date(año, mes, i);
                    const fechaFormateada = obtenerFechaFormateada(fechaSeleccionada);
                    setMostrarPedidosLaminaFecha(fechaFormateada);
                    //alert('Has clic en el día ' + i);
                });

                diasElemento.appendChild(diaElemento);
            }
        }
        function obtenerFechaFormateada(fecha) {
            const año = fecha.getFullYear();
            const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
            const dia = fecha.getDate().toString().padStart(2, '0');
            return `${año}-${mes}-${dia}`;
        }
        // Mostrar el calendario al cargar la página
        mostrarCalendario();
    }

});