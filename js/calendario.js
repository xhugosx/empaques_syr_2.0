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

            // Agregar los encabezados de los días de la semana
            const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
            diasSemana.forEach(dia => {
                const diaHeader = document.createElement('div');
                diaHeader.className = 'calendario-day-header';
                diaHeader.textContent = dia;
                diasElemento.appendChild(diaHeader);
            });


            // Obtener el primer día del mes y el número de días en el mes
            const primerDia = new Date(año, mes, 1);
            const ultimoDia = new Date(año, mes + 1, 0);

            // Crear celdas para los días del mes
            for (let i = 1; i <= ultimoDia.getDate(); i++) {
                const diaElemento = document.createElement('div');
                diaElemento.className = 'dia';

                let hoy = año + "-" + llenar0(mes + 1) + "-" + llenar0(i);
                if (esFechaHoy(hoy)) {
                    diaElemento.classList.add('dia-hoy');
                }

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
        //fncion para ver si la fecha es de hoy
        function esFechaHoy(fecha) {
            // Obtener la fecha actual
            var fechaActual = new Date();

            // Formatear la fecha actual como "aaaa-mm-dd"
            var dia = fechaActual.getDate();
            var mes = fechaActual.getMonth() + 1; // Los meses van de 0 a 11
            var año = fechaActual.getFullYear();

            var fechaActualFormateada = año + '-' + llenar0(mes) + '-' + llenar0(dia);

            // Comparar la fecha actual formateada con la fecha proporcionada
            return fecha === fechaActualFormateada;
        }

        //llenar mes y dia con 0
        function llenar0(dato) {
            return dato < 10 ? ('0' + dato) : dato;
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