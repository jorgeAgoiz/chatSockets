let socket = io();

let params = new URLSearchParams(window.location.search);

if(!params.has('nombre') || !params.has('sala')){
    window.location = 'index.html';
    throw new Error('El nombre y sala son necesarios');
};

let usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
};

socket.on('connect', function() {
    console.log('Conectado al servidor');

    socket.emit('entrarChat', usuario, (resp) => {
        console.log('Usuarios conectados', resp);
        renderizarUsuarios(resp);
    });
});

// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});


// Escuchar información
socket.on('crearMensaje', (mensaje) => {
    console.log('Servidor:', mensaje);
    renderizarMensajes(mensaje, false);
    scrollBottom();
});

// Escuchar información
socket.on('listaPersonas', (personas) => {
    console.log(personas);
    renderizarUsuarios(personas);
});

//Mensajes privados
socket.on('mensajePrivado', (mensaje) => {
    console.log('Mensaje privado: ', mensaje);
});