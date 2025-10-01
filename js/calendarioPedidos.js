document.addEventListener('init', function (event) {
    var page = event.target;

    if (page.id === 'calendarioPedidos') {
        const mesElemento = document.getElementById('nombreMes');
        const diasElemento = document.getElementById('dias');

        let fechaActual = new Date();
        let mes = fechaActual.getMonth();
        let año = fechaActual.getFullYear();
        let diaSeleccionado = null;

        // Cache por año (clave = "YYYY" -> todos los pedidos de ese año)
        const productCache = {};

        function obtenerNombreMes(m) {
            const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
            return meses[m];
        }

        function llenar0(dato) {
            return dato < 10 ? ('0' + dato) : dato;
        }

        function esFechaHoy(fecha) {
            let hoy = new Date();
            let hoyStr = hoy.getFullYear() + '-' + llenar0(hoy.getMonth() + 1) + '-' + llenar0(hoy.getDate());
            return fecha === hoyStr;
        }

        function sumarDiasAFecha(fechaInicial, diasASumar) {
            let fecha = fechaInicial instanceof Date ? new Date(fechaInicial) : new Date(fechaInicial);
            fecha.setDate(fecha.getDate() + diasASumar);
            let año = fecha.getFullYear();
            let mes = ('0' + (fecha.getMonth() + 1)).slice(-2);
            let dia = ('0' + fecha.getDate()).slice(-2);
            return año + '-' + mes + '-' + dia;
        }

        // Obtiene todos los pedidos de un año (1 sola vez por año)
        function obtenerProductosDelAño(añoReq, callback) {
            if (productCache[añoReq]) {
                return callback(productCache[añoReq]);
            }
            let link = myLink + "/php/lista_pedidos/selectAll.php?filtro=1&estado=0,1,2,3,&anio=" + añoReq;
            servidor(link, function (respuesta) {
                let resultado = respuesta.response || respuesta.responseText;
                let subcadenas = resultado.split('|');
                subcadenas.pop();
                let objetosJSON = subcadenas.map(s => JSON.parse(s.trim()));
                productCache[añoReq] = objetosJSON;
                callback(objetosJSON);
            });
        }

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

        function mostrarCalendario() {
            mesElemento.textContent = obtenerNombreMes(mes) + ' ' + año;
            diasElemento.innerHTML = '';

            const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
            diasSemana.forEach(dia => {
                const diaHeader = document.createElement('div');
                diaHeader.className = 'calendario-day-header';
                diaHeader.textContent = dia;
                diasElemento.appendChild(diaHeader);
            });

            const primerDia = new Date(año, mes, 1).getDay();
            for (let i = 0; i < primerDia; i++) {
                const diaElemento = document.createElement('div');
                diaElemento.className = 'calendario-day empty';
                diasElemento.appendChild(diaElemento);
            }

            const ultimoDia = new Date(año, mes + 1, 0).getDate();

            obtenerProductosDelAño(año, function (productos) {
                // Armamos un mapa fecha → productos (con la regla de +2 días)
                const mapaFechas = {};
                productos.forEach(prod => {
                    let fechaEntrega = sumarDiasAFecha(prod.fecha_entrega, 1);
                    mapaFechas[fechaEntrega] = mapaFechas[fechaEntrega] || [];
                    mapaFechas[fechaEntrega].push(prod);
                });

                for (let diaNum = 1; diaNum <= ultimoDia; diaNum++) {
                    let fechaKey = año + "-" + llenar0(mes + 1) + "-" + llenar0(diaNum);

                    const diaElemento = document.createElement('div');
                    diaElemento.className = 'dia';
                    diaElemento.dataset.date = fechaKey;

                    if (mapaFechas[fechaKey]) {
                        diaElemento.classList.add('contiene');
                    }
                    if (esFechaHoy(fechaKey)) {
                        diaElemento.classList.add('dia-hoy');
                    }

                    const numeroDia = document.createElement('span');
                    numeroDia.className = 'numero-dia';
                    numeroDia.textContent = diaNum;
                    diaElemento.appendChild(numeroDia);

                    diasElemento.appendChild(diaElemento);
                }
            });
        }

        // Un solo listener para todos los días
        diasElemento.addEventListener('click', function (e) {
            let el = e.target.closest('.dia');
            if (!el || el.classList.contains('empty')) return;

            if (diaSeleccionado) diaSeleccionado.classList.remove('selected');
            el.classList.add('selected');
            diaSeleccionado = el;

            let hoy = el.dataset.date;
            let link = myLink + "/php/lista_pedidos/selectAll.php?filtro=1&estado=0,1,2,3,&fecha=" + hoy;
            servidor(link, function (respuesta) {
                var resultado = respuesta.responseText;
                var arrayJson = resultado.split('|');
                listaInfinita('datosPedidosCalendario', 'datosPedidosLoadingCalendario', arrayJson, enlistarPedidos);
            });
        });

        mostrarCalendario();
    }
});
