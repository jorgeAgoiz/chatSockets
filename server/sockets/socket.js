const { io } = require('../server');
const { Usuarios } = require('../classes/usuario'); 
const { crearMensaje } = require('../utils/utils.js');

const usuarios = new Usuarios();

io.on('connection', (client) => {

    client.on('entrarChat', (usuario, callback) => {

        if(!usuario.nombre || !usuario.sala){
            return callback({
                error: true,
                mensaje: 'El nombre/sala es necesario.'
            });
        };

        client.join(usuario.sala);

        let personas = usuarios.agregarPersona( client.id, usuario.nombre, usuario.sala );

        client.broadcast.to(usuario.sala).emit('listaPersonas', usuarios.getPersonasPorSala(usuario.sala) );
        client.broadcast.to(usuario.sala).emit('crearMensaje', crearMensaje('Administrador', `${usuario.nombre} se unió.`));

        callback(usuarios.getPersonasPorSala(usuario.sala));
    });

    client.on('crearMensaje', (data, callback) => {

        let persona = usuarios.getPersona(client.id);

        let mensaje = crearMensaje(persona.nombre, data.mensaje);
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);
       
        callback(mensaje);
    });

    client.on('disconnect', () => {

        let personaBorrada = usuarios.borrarPersona(client.id);

        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador', `${personaBorrada.nombre} salió.`));
        client.broadcast.to(personaBorrada.sala).emit('listaPersonas', usuarios.getPersonasPorSala(personaBorrada.sala));

    });

    //Mensaje privado
    client.on('mensajePrivado', data => {

        let persona = usuarios.getPersona(client.id);
        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje( persona.nombre, data.mensaje));
    });

});