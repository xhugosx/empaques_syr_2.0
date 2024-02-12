
document.addEventListener('init', function (event) {
    var page = event.target;

    if (page.id === 'calendarioPedidos') {
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

                // Agrega una clase al dia de hoy para resaltar el dia de hoy
                if (esFechaHoy(hoy)) {
                    diaElemento.classList.add('dia-hoy');
                }


                const numeroDia = document.createElement('span');
                numeroDia.className = 'numero-dia';
                numeroDia.textContent = i;
                diaElemento.appendChild(numeroDia);

                // Verificar si hay productos con fecha de entrega correspondiente al día actual
                obtenerProductosDelDia(new Date(año, mes, i), function (productosDelDia) {
                    //console.log(productosDelDia);
                    if (productosDelDia.length > 0) {
                        const codigosElemento = document.createElement('div');
                        codigosElemento.className = 'codigos';
                        productosDelDia.forEach(producto => {
                            const codigoProductoElemento = document.createElement('div');
                            codigoProductoElemento.className = 'codigo';
                            codigoProductoElemento.textContent = producto.codigo;
                            codigosElemento.appendChild(codigoProductoElemento);
                        });
                        diaElemento.appendChild(codigosElemento);
                    }
                });



                diaElemento.addEventListener('click', function () {
                    //console.log(event);
                    if (diaSeleccionado) {
                        diaSeleccionado.classList.remove('selected');
                    }

                    diaElemento.classList.add('selected');
                    diaSeleccionado = diaElemento;

                    //alerta(hoy);
                    let link = "https://empaquessr.com/sistema/php/lista_pedidos/selectAll.php?filtro=1&estado=0,1,2,3,&fecha=" + hoy;
                    servidor(link, function (respuesta) {
                        var resultado = respuesta.responseText;//respuesta del servidor
                        var arrayJson = resultado.split('|'); //separamos los json en un arreglo, su delimitador siendo un '|'
                        //console.log('datosPedidosCalendario', 'datosPedidosLoadingCalendario', arrayJson, enlistarPedidos);
                        listaInfinita('datosPedidosCalendario', 'datosPedidosLoadingCalendario', arrayJson, enlistarPedidos);
                    });

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
        // Función para obtener productos con fecha de entrega correspondiente al día actual
        function obtenerProductosDelDia(fecha, callback) {
            let link = "https://empaquessr.com/sistema/php/lista_pedidos/selectAll.php?filtro=1&estado=0,1,2,3,&anio=2024";
            servidor(link, function (respuesta) {
                var resultado = respuesta.response;
                let subcadenas = resultado.split('|');
                subcadenas.pop();

                let objetosJSON = subcadenas.map(subcadena => JSON.parse(subcadena.trim()));

                const añoActual = fecha.getFullYear(); // Obtener el año actual desde la fecha proporcionada
                const mesActual = fecha.getMonth(); // Obtener el mes actual desde la fecha proporcionada
                const diaActual = fecha.getDate(); // Obtener el día actual desde la fecha proporcionada

                const productos = objetosJSON.filter(producto => {
                    const fechaEntregaProducto = new Date(sumarDiasAFecha(producto.fecha_oc, 22)); // Convertir la fecha de orden del producto a un objeto Date
                    const añoProducto = fechaEntregaProducto.getFullYear(); // Obtener el año del producto
                    const mesProducto = fechaEntregaProducto.getMonth(); // Obtener el mes del producto
                    const diaProducto = fechaEntregaProducto.getDate(); // Obtener el día del producto
                    return añoProducto === añoActual && mesProducto === mesActual && diaProducto === diaActual; // Filtrar productos que coinciden con el día actual
                });
                callback(productos);
            });
        }



        function sumarDiasAFecha(fechaInicial, diasASumar) {
            // Convertir la fecha inicial a objeto Date (si no lo es ya)
            let fecha = fechaInicial instanceof Date ? fechaInicial : new Date(fechaInicial);
            //console.log(fechaInicial,diasASumar);
            // Sumar los días
            fecha.setDate(fecha.getDate() + diasASumar);

            // Obtener el año, mes y día en formato YYYY-MM-DD
            let año = fecha.getFullYear();
            let mes = ('0' + (fecha.getMonth() + 1)).slice(-2); // Agregar 1 al mes porque los meses en JavaScript van de 0 a 11
            let dia = ('0' + fecha.getDate()).slice(-2);

            // Formar la nueva fecha en formato YYYY-MM-DD
            let nuevaFecha = año + '-' + mes + '-' + dia;

            //console.log(fechaInicial,diasASumar,nuevaFecha);
            return nuevaFecha;
        }



        // Mostrar el calendario al cargar la página
        mostrarCalendario();
    }

});