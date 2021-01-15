$(document).ready(() => {
    const socket = io('/viewer');

    socket.on('shower', (data) => {
        $(`.${data.nombre}`).toggleClass('hide show');
        setTimeout(() => {
            $(`.${data.nombre}`).toggleClass('hide show');
        }, 5000);
    });

    socket.on('banner', (checked) => {
        console.log(checked);
        if (!checked && $('.banner').hasClass('show')){
            $('.banner').removeClass('show');
            $('.banner').addClass('hide');
        }
        if (checked && $('.banner').hasClass('hide')){
            $('.banner').removeClass('hide');
            $('.banner').addClass('show');
        }

    });
});




// setInterval(() => {
//
// }, 5000);
