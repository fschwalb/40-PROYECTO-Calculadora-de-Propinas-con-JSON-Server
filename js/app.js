let cliente = {
    mesa: '',
    hora: '',
    pedido: []
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
        row.classList.add('row');

        const nombre = document.createElement('div');
        nombre.classList.add('col-md-4');
        nombre.textContent = platillo.nombre;

        row.appendChild( nombre );
        contenido.appendChild( row );
    });

};