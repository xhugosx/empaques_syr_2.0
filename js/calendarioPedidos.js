
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

                // Verificar si hay productos con fecha de entrega correspondiente al día actual
                const productosDelDia = obtenerProductosDelDia(new Date(año, mes, i));
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

                diaElemento.addEventListener('click', function () {
                    //console.log(event);
                    if (diaSeleccionado) {
                        diaSeleccionado.classList.remove('selected');
                    }

                    diaElemento.classList.add('selected');
                    diaSeleccionado = diaElemento;

                    let fecha = año + "-" + (mes+1) + "-" + i;
                    
                });

                diasElemento.appendChild(diaElemento);
            }
        }

        // Función para obtener productos con fecha de entrega correspondiente al día actual
        function obtenerProductosDelDia(fecha) {
            // Aquí debes proporcionar tu propio array de productos con fechas de entrega
            const productos = [
                { codigo: '001/001', fechaEntrega: '2024-02-02' },
                { codigo: '001/002', fechaEntrega: '2024-02-02' },
                { codigo: '001/003', fechaEntrega: '2024-02-02' },
                { codigo: '001/004', fechaEntrega: '2024-02-02' },
                { codigo: '001/005', fechaEntrega: '2024-02-02' },
                { codigo: '001/006', fechaEntrega: '2024-02-02' },
                { codigo: '001/007', fechaEntrega: '2024-02-02' },
                { codigo: '001/008', fechaEntrega: '2024-02-02' },
                { codigo: '001/009', fechaEntrega: '2024-02-02' },
                { codigo: '001/010', fechaEntrega: '2024-02-02' },
                // ... otros productos ...
            ];

            return productos.filter(producto => {
                const fechaEntregaProducto = new Date(producto.fechaEntrega);
                return fechaEntregaProducto.toDateString() === fecha.toDateString();
            });
        }

        // Mostrar el calendario al cargar la página
        mostrarCalendario();
    }

});