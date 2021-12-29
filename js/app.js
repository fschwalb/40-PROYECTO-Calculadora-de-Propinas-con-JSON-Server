let cliente = {
    mesa: '',
    hora: '',
    pedido: []
};

const categorias = {
    1: 'Comida',
    2: 'Bebidas',
    3: 'Postres'
};

const btnGuardarCliente = document.querySelector('#guardar-cliente');
btnGuardarCliente.addEventListener( 'click', guardarCliente );

function guardarCliente() {

    const mesa = document.querySelector('#mesa').value;
    const hora = document.querySelector('#hora').value;

    // Revisar si hay campos vacíos
    const camposVacios = [ mesa, hora ].some( campo => campo === '' );

    if ( camposVacios ) {
        // Verificar si ya existe una alerta
        const existeAlerta = document.querySelector('.invalid-feedback');

        if ( !existeAlerta ) {

            const alerta = document.createElement('div');
            alerta.classList.add( 'invalid-feedback', 'd-block', 'text-center' );
            alerta.textContent = 'Todos los campos son obligatorios';
    
            document.querySelector( '.modal-body form' ).appendChild( alerta );
            
            setTimeout(() => {
                alerta.remove();
            }, 2000);

        };

        return;

    };

    // Asignar datos del formulario a Cliente
    cliente = { ...cliente, mesa, hora };

    // Ocultar Modal
    const modalFormulario = document.querySelector('#formulario');
    const modalBoostrap = bootstrap.Modal.getInstance( modalFormulario );
    modalBoostrap.hide();

    // Mostrar las secciones
    mostrarSecciones();

    // Obtener Info de la API de JSON-Server
    obtenerPlatillos();

};

function mostrarSecciones() {

    const seccionesOcultas = document.querySelectorAll('.d-none');
    seccionesOcultas.forEach( seccion => seccion.classList.remove( 'd-none' ));

};

function obtenerPlatillos() {

    const url = 'http://localhost:5000/platillos';

    fetch( url )
        .then( respuesta => respuesta.json())
        .then( resultado => mostrarPlatos( resultado ))
        .catch( error => console.log(error))

};

function mostrarPlatos( platillos ) {

    const contenido = document.querySelector('#platillos .contenido');

    platillos.forEach( platillo => {
        const row = document.createElement('div');
        row.classList.add('row', 'py-3', 'border-top');

        const nombre = document.createElement('div');
        nombre.classList.add('col-md-4');
        nombre.textContent = platillo.nombre;

        const precio = document.createElement('div');
        precio.classList.add( 'col-md-3', 'fw-bold' );
        precio.textContent = `$${ platillo.precio }`;

        const categoria = document.createElement('div');
        categoria.classList.add( 'col-md-3' );
        categoria.textContent = categorias[ platillo.categoria ];

        const inputCantidad = document.createElement('input');
        inputCantidad.type  = 'number';
        inputCantidad.min   = 0;
        inputCantidad.value = 0;
        inputCantidad.id    = `producto-${ platillo.id }`;
        inputCantidad.classList.add( 'form-control' );

        // Función que detecta la cantidad y el plato que se está agregando
        inputCantidad.onchange = function() {
            const cantidad = parseInt( inputCantidad.value );
            agregarPlatillo( { ...platillo, cantidad } );
        };

        const agregar = document.createElement('div');
        agregar.classList.add( 'col-md-2' );
        agregar.appendChild( inputCantidad );

        row.appendChild( nombre );
        row.appendChild( precio );
        row.appendChild( categoria );
        row.appendChild( agregar );

        contenido.appendChild( row );
    });

};

function agregarPlatillo( producto ) {

    // Extraer el pedido actual
    let { pedido } = cliente;

    // Revisar que la cantidad sea mayor a 0
    if ( producto.cantidad > 0 ) {
        // Comprueba si un elemento ya existe en el array
        if ( pedido.some( articulo => articulo.id === producto.id ) ) {
            // El artículo ya existe, actualizamos la cantidad
            const pedidoActualizado = pedido.map( articulo => {
                if ( articulo.id === producto.id ) {
                    articulo.cantidad = producto.cantidad;
                };

                return articulo;
            });
            // Se asigna el nuevo array a cliente.pedido
            cliente.pedido = [ ...pedidoActualizado ];
        } else {
            // El artículo no existe, lo agregamos al array de pedido
            cliente.pedido = [ ...pedido, producto ];  
        };        
    } else {
        // Eliminar elementos cuando la cantidad es 0
        const resultado = pedido.filter( articulo => articulo.id !== producto.id );
        cliente.pedido = [ ...resultado ];
    };

    // Limpiar el HTML previo
    limpiarHTML();

    if ( cliente.pedido.length ) {
        // Mostrar el Resumen
        actualizarResumen();  
    } else {
        mensajePedidoVacio();
    };

};

function actualizarResumen() {

    const contenido = document.querySelector('#resumen .contenido');

    const resumen = document.createElement('div');
    resumen.classList.add( 'col-md-6', 'card', 'py-2', 'px-3', 'shadow' );

    // Información de la Mesa
    const mesa = document.createElement('p');
    mesa.textContent = 'Mesa: ';
    mesa.classList.add( 'fw-bold' );

    const mesaSpan = document.createElement('span');
    mesaSpan.textContent = cliente.mesa;
    mesaSpan.classList.add( 'fw-normal' );

    // Información de la Hora
    const hora = document.createElement('p');
    hora.textContent = 'Hora: ';
    hora.classList.add( 'fw-bold' );

    const horaSpan = document.createElement('span');
    horaSpan.textContent = cliente.hora;
    horaSpan.classList.add( 'fw-normal' );
    
    // Agregar a los elementos padre
    mesa.appendChild( mesaSpan );
    hora.appendChild( horaSpan );

    // Título de la sección
    const heading = document.createElement('h3');
    heading.textContent = 'Platillos Consumidos';
    heading.classList.add( 'my-4', 'text-center' );

    // Iterar sobre el array de pedidos
    const grupo = document.createElement('ul');
    grupo.classList.add( 'list-group' );

    const { pedido } = cliente;
    pedido.forEach( articulo => {
        const { nombre, cantidad, precio, id } = articulo;

        const lista = document.createElement('li');
        lista.classList.add( 'list-group-item' );

        const nombreEl = document.createElement('h4');
        nombreEl.classList.add( 'my-4' );
        nombreEl.textContent = nombre;

        // Cantidad del artículo
        const cantidadEl = document.createElement('p');
        cantidadEl.classList.add( 'fw-bold' );
        cantidadEl.textContent = 'Cantidad: ';

        const cantidadValor = document.createElement('span');
        cantidadValor.classList.add( 'fw-normal' );
        cantidadValor.textContent = cantidad;

        // Precio del artículo
        const precioEl = document.createElement('p');
        precioEl.classList.add( 'fw-bold' );
        precioEl.textContent = 'Precio Unitario: ';

        const precioValor = document.createElement('span');
        precioValor.classList.add( 'fw-normal' );
        precioValor.textContent = `$${ precio }`;

        // Subtotal del artículo
        const subtotalEl = document.createElement('p');
        subtotalEl.classList.add( 'fw-bold' );
        subtotalEl.textContent = 'Subtotal: ';

        const subtotalValor = document.createElement('span');
        subtotalValor.classList.add( 'fw-normal' );
        subtotalValor.textContent = calcularSubtotal( precio, cantidad );

        // Botón para eliminar
        const btnEliminar = document.createElement('button');
        btnEliminar.classList.add( 'btn', 'btn-danger' );
        btnEliminar.textContent = 'Eliminar del Pedido';

        // Función para eliminar del pedido
        btnEliminar.onclick = function () {
            eliminarProducto( id );
        };

        // Agregar valores a sus contenedores
        cantidadEl.appendChild( cantidadValor );
        precioEl.appendChild( precioValor );
        subtotalEl.appendChild( subtotalValor );

        // Agregar Elementos al LI
        lista.appendChild( nombreEl );
        lista.appendChild( cantidadEl );
        lista.appendChild( precioEl );
        lista.appendChild( subtotalEl );
        lista.appendChild( btnEliminar );

        // Agregar Lista la grupo principal
        grupo.appendChild( lista );
    });

    // Agregar al contenido
    resumen.appendChild( heading );
    resumen.appendChild( mesa );
    resumen.appendChild( hora );
    resumen.appendChild( grupo );

    contenido.appendChild( resumen );

    // Mostrar formulario de Propinas
    formularioPropinas();

};

function limpiarHTML() {

    const contenido = document.querySelector('#resumen .contenido');

    while ( contenido.firstChild ) {
        contenido.removeChild( contenido.firstChild );
    };

};

function calcularSubtotal( precio, cantidad ) {

    return `$${ precio * cantidad }`;

};

function eliminarProducto( id ) {

    const { pedido } = cliente;

    const resultado = pedido.filter( articulo => articulo.id !== id );
    cliente.pedido = [ ...resultado ];

    // Limpiar el HTML previo
    limpiarHTML();

    if ( cliente.pedido.length ) {
        // Mostrar el Resumen
        actualizarResumen();  
    } else {
        mensajePedidoVacio();
    };

    // El producto se eliminó, regresamos la cantidad a 0 en el input
    const productoEliminado = `#producto-${ id }`;
    
    const inputEliminado = document.querySelector( productoEliminado );
    inputEliminado.value = 0;

};

function mensajePedidoVacio() {

    const contenido = document.querySelector('#resumen .contenido');

    const texto = document.createElement('p');
    texto.classList.add( 'text-center' );
    texto.textContent = 'Añade los elementos del pedido';

    contenido.appendChild( texto );

};

function formularioPropinas() {

    const contenido = document.querySelector('#resumen .contenido');

    const formulario = document.createElement('div');
    formulario.classList.add( 'col-md-6', 'formulario' );

    const divFormulario = document.createElement('div');
    divFormulario.classList.add( 'card', 'py-2', 'px-3', 'shadow' )

    const heading = document.createElement('h3');
    heading.classList.add( 'my-4', 'text-center' );
    heading.textContent = 'Propina';

    // Radio Button 10%
    const radio10 = document.createElement('input');
    radio10.type = 'radio';
    radio10.name = 'propina';
    radio10.value = '10';
    radio10.classList.add( 'form-check-input' );
    radio10.onclick = calcularPropina;

    const radio10Label = document.createElement('label');
    radio10Label.textContent = '10%';
    radio10Label.classList.add( 'form-check-label' );

    const divRadio10 = document.createElement('div');
    divRadio10.classList.add( 'form-check' );

    divRadio10.appendChild( radio10 );
    divRadio10.appendChild( radio10Label );

    // Radio Button 25%
    const radio25 = document.createElement('input');
    radio25.type = 'radio';
    radio25.name = 'propina';
    radio25.value = '25';
    radio25.classList.add( 'form-check-input' );
    radio25.onclick = calcularPropina;

    const radio25Label = document.createElement('label');
    radio25Label.textContent = '25%';
    radio25Label.classList.add( 'form-check-label' );

    const divRadio25 = document.createElement('div');
    divRadio25.classList.add( 'form-check' );

    divRadio25.appendChild( radio25 );
    divRadio25.appendChild( radio25Label );

    // Radio Button 50%
    const radio50 = document.createElement('input');
    radio50.type = 'radio';
    radio50.name = 'propina';
    radio50.value = '50';
    radio50.classList.add( 'form-check-input' );
    radio50.onclick = calcularPropina;

    const radio50Label = document.createElement('label');
    radio50Label.textContent = '50%';
    radio50Label.classList.add( 'form-check-label' );

    const divRadio50 = document.createElement('div');
    divRadio50.classList.add( 'form-check' );

    divRadio50.appendChild( radio50 );
    divRadio50.appendChild( radio50Label );

    // Agregar al div Principal
    divFormulario.appendChild( heading );
    divFormulario.appendChild( divRadio10 );
    divFormulario.appendChild( divRadio25 );
    divFormulario.appendChild( divRadio50 );

    // Agregar al Formulario
    formulario.appendChild( divFormulario );

    contenido.appendChild( formulario );

};

function calcularPropina() {

    const { pedido } = cliente;

    let subtotal = 0;

    // Calcular el subtotal a pagar
    pedido.forEach( articulo => {
        subtotal += articulo.cantidad * articulo.precio;
    });

    // Seleccionar el Radio Button con la propina del cliente
    const propinaSeleccionada = document.querySelector('[name="propina"]:checked').value;

    // Calcular la propina
    const propina = (( subtotal * parseInt( propinaSeleccionada ) ) / 100 );

    // Calcular el total a pagar
    const total = subtotal + propina;

    mostrarTotalHTML( subtotal, total, propina );

};

function mostrarTotalHTML( subtotal, total, propina ) {

    const divTotales = document.createElement('div');
    divTotales.classList.add( 'total-pagar', 'my-5' );

    // Subtotal
    const subtotalParrafo = document.createElement('p');
    subtotalParrafo.classList.add( 'fs-4', 'fw-bold', 'mt-2' );
    subtotalParrafo.textContent = 'Subtotal Consumo: ';

    const subtotalSpan = document.createElement('span');
    subtotalSpan.classList.add( 'fw-normal' );
    subtotalSpan.textContent = `$${ subtotal }`;

    subtotalParrafo.appendChild( subtotalSpan );

    // Propina
    const propinaParrafo = document.createElement('p');
    propinaParrafo.classList.add( 'fs-4', 'fw-bold', 'mt-2' );
    propinaParrafo.textContent = 'Propina: ';

    const propinaSpan = document.createElement('span');
    propinaSpan.classList.add( 'fw-normal' );
    propinaSpan.textContent = `$${ propina }`;

    propinaParrafo.appendChild( propinaSpan );

    // Total
    const totalParrafo = document.createElement('p');
    totalParrafo.classList.add( 'fs-4', 'fw-bold', 'mt-2' );
    totalParrafo.textContent = 'Total a Pagar: ';

    const totalSpan = document.createElement('span');
    totalSpan.classList.add( 'fw-normal' );
    totalSpan.textContent = `$${ total }`;

    totalParrafo.appendChild( totalSpan );

    // Eliminar la selección anterior
    const totalPagarDiv = document.querySelector('.total-pagar');

    if ( totalPagarDiv ) {
        totalPagarDiv.remove();
    };



    divTotales.appendChild( subtotalParrafo );
    divTotales.appendChild( propinaParrafo );
    divTotales.appendChild( totalParrafo );

    const formulario = document.querySelector('.formulario > div');
    formulario.appendChild( divTotales );

};