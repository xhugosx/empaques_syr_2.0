function cargarCalendarioLamina() {
    const mesElemento = document.getElementById('nombreMes');
    const diasElemento = document.getElementById('dias');

    let fechaActual = new Date();
    let mes = fechaActual.getMonth();
    let año = fechaActual.getFullYear();
    let diaSeleccionado = null;
    let filtroLaminaRadio = true;

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
        const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
        diasSemana.forEach(dia => {
            const diaHeader = document.createElement('div');
            diaHeader.className = 'calendario-day-header';
            diaHeader.textContent = dia;
            diasElemento.appendChild(diaHeader);
        });

        // Obtener el primer día del mes y el número de días en el mes
        const primerDia = new Date(año, mes, 1);
        // Obtener el día de la semana del primer día del mes

        let primerDiaSemana = primerDia.getDay(); // 0 (Domingo) a 6 (Sábado)
        // Crear celdas para los días del mes

        for (let i = 0; i < primerDiaSemana; i++) {
            const diaElemento = document.createElement('div');
            diaElemento.className = 'calendario-day empty'; // Añadir clase 'empty' para días que están fuera del mes
            diasElemento.appendChild(diaElemento);
        }

        const ultimoDia = new Date(año, mes + 1, 0);
        // Crear celdas para los días del mes
        for (let i = 0; i < ultimoDia.getDate(); i++) {
            const diaElemento = document.createElement('div');
            diaElemento.className = 'dia';

            let hoy = año + "-" + llenar0(mes + 1) + "-" + llenar0(i + 1);

            // Agrega una clase al dia de hoy para resaltar el dia de hoy
            if (esFechaHoy(hoy)) {
                diaElemento.classList.add('dia-hoy');
            }
            obtenerProductosDelDia(new Date(año, mes, i + 1), function (productosDelDia) {
                if (productosDelDia.length > 0) {
                    diaElemento.classList.add('contiene');
                }
            });
            const numeroDia = document.createElement('span');
            numeroDia.className = 'numero-dia';
            numeroDia.textContent = i + 1;
            diaElemento.appendChild(numeroDia);

            diaElemento.addEventListener('click', function () {
                //console.log(event);
                if (diaSeleccionado) {
                    diaSeleccionado.classList.remove('selected');
                }

                diaElemento.classList.add('selected');
                diaSeleccionado = diaElemento;

                setMostrarPedidosLaminaFecha(hoy, filtroLaminaRadio);

            });

            diasElemento.appendChild(diaElemento);
        }
    }

    // Función para verificar si la fecha es de hoy
    function esFechaHoy(fecha) {
        var fechaActual = new Date();
        var dia = fechaActual.getDate();
        var mes = fechaActual.getMonth() + 1;
        var año = fechaActual.getFullYear();

        var fechaActualFormateada = año + '-' + llenar0(mes) + '-' + llenar0(dia);

        return fecha === fechaActualFormateada;
    }

    // Función para llenar mes y dia con 0
    function llenar0(dato) {
        return dato < 10 ? ('0' + dato) : dato;
    }

    window.filtroLamina = function (activoFijo) {
        filtroLaminaRadio = activoFijo == 2 ? false : true;
        mostrarCalendario();
    }


    // Función para obtener productos con fecha de entrega correspondiente al día actual
    function obtenerProductosDelDia(fecha, callback) {
        //$('#loadingPedidosLaminaFecha').empty().append("<ons-progress-bar indeterminate></ons-progress-bar>");
        //oCarga("Cargando Datos...");
        let tipo = filtroLaminaRadio ? "1" : "2,3";

        let link = myLink + "/php/lista_pedidos_lamina/select.php?type=" + tipo + "&anio=" + fecha.getFullYear();
        servidor(link, function (respuesta) {
            var resultado = respuesta.response;
            let subcadenas = resultado.split('|');
            subcadenas.pop();

            let objetosJSON = subcadenas.map(subcadena => JSON.parse(subcadena.trim()));

            const añoActual = fecha.getFullYear();
            const mesActual = fecha.getMonth();
            const diaActual = fecha.getDate();

            const productos = objetosJSON.filter(producto => {
                const fechaEntregaProducto = new Date(sumarDiasAFecha(producto.fecha_entrega, 2));
                const añoProducto = fechaEntregaProducto.getFullYear();
                const mesProducto = fechaEntregaProducto.getMonth();
                const diaProducto = fechaEntregaProducto.getDate();
                return añoProducto === añoActual && mesProducto === mesActual && diaProducto === diaActual;
            });
            console.log(link);
            callback(productos);
            //$('#loadingPedidosLaminaFecha').empty();
            //cCarga();
        });
    }

    function sumarDiasAFecha(fechaInicial, diasASumar) {
        let fecha = fechaInicial instanceof Date ? fechaInicial : new Date(fechaInicial);
        fecha.setDate(fecha.getDate() + diasASumar);
        let año = fecha.getFullYear();
        let mes = ('0' + (fecha.getMonth() + 1)).slice(-2);
        let dia = ('0' + fecha.getDate()).slice(-2);
        let nuevaFecha = año + '-' + mes + '-' + dia;
        return nuevaFecha;
    }

    // Mostrar el calendario al cargar la página
    mostrarCalendario();
}
