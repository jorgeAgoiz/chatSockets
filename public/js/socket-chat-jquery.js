
let param = new URLSearchParams(window.location.search);

let nombre = param.get('nombre');

//Referencias JQuery
let divUsuarios = $('#divUsuarios');
let formEnviar = $('#formEnviar');
let txtMensaje = $('#txtMensaje');
let divChatbox = $('#divChatbox');

//Funciones para renderizar los usuarios
function renderizarUsuarios( personas ){

    console.log(personas);

    let html = '';

    html += `<li>`;
    html+=      `<a href="javascript:void(0)" class="active"> Chat de <span>${param.get("sala")}</span></a>`;
    html += `</li>`;

    for(let persona of personas){
        
        html += `<li>`;
        html +=     `<a data-id="${persona.id}" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>${persona.nombre}<small class="text-success">online</small></span></a>`;
        html += `</li>`;
    };
    divUsuarios.html(html);
};

function renderizarMensajes( mensaje, yo ){

    let html = '';
    let fecha = new Date(mensaje.fecha);
    let hora = fecha.getHours()+ ':' + fecha.getMinutes();

    let adminClass = 'info';
    if( mensaje.nombre === 'Administrador' ){
        adminClass = 'danger';
    }

    if(yo){

        html += `<li class="reverse">`;
        html +=     `<div class="chat-content">`;
        html +=         `<h5>${mensaje.nombre}</h5>`;
        html +=         `<div class="box bg-light-inverse">${mensaje.mensaje}</div>`;
        html +=     `</div>`;
        html +=     `<div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>`;
        html +=     `<div class="chat-time">${hora}</div>`;
        html += `</li>`;

    } else {

        html += `<li class="animated fadeIn">`;
        if(mensaje.nombre !== 'Administrador'){
                       html +=     `<div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>`;
        }            
        html +=     `<div class="chat-content">`;
        html +=         `<h5>${mensaje.nombre}</h5>`;
        html +=         `<div class="box bg-light-${adminClass}">${mensaje.mensaje}</div>`;
        html +=     `</div>`;
        html +=     `<div class="chat-time">${hora}</div>`;
        html += `</li>`;

    };

    divChatbox.append(html);
};

function scrollBottom() {

    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    };
};


//Escuchas de JQuery

divUsuarios.on('click', 'a', function() {
     let id = $(this).data('id');

     if(id){
         console.log(id);
     };
});

formEnviar.on('submit', function(e) {

    e.preventDefault();

    if( txtMensaje.val().trim().length === 0) {
        return;
    };

    socket.emit('crearMensaje', {
        usuario: nombre,
        mensaje: txtMensaje.val()
    }, function(mensaje) {
        console.log('respuesta server: ', mensaje);
        txtMensaje.val('').focus();
        renderizarMensajes(mensaje, true);
        scrollBottom();
    });
});

