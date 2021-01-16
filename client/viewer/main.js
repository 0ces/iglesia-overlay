

$(document).ready(() => {
    const socket = io('/viewer');
    let timer;

    socket.on('shower', (data) => {
        $('.banner').addClass('blur-ani');
        console.log($('.banner'))
        $(`.${data.nombre}`).toggleClass('hide show');
        setTimeout(() => {
            $(`.${data.nombre}`).toggleClass('hide show');
        }, 5000);
        setTimeout(() => {
            $('.banner').removeClass('blur-ani');
        }, 10000);
    });

    socket.on('banner', (checked) => {
        if (checked === 'logo' && $('.banner').hasClass('show')){
            $('.banner').removeClass('show');
            $('.banner').addClass('hide');
            $('.logos').removeClass('hide');
            $('.logos').addClass('show');
        }
        if (checked === 'banner' && $('.banner').hasClass('hide')){
            $('.banner').removeClass('hide');
            $('.banner').addClass('show');
            $('.logos').removeClass('show');
            $('.logos').addClass('hide');
        }

    });

    socket.on('changer', (data) => {
        $('.logo').attr('src', `../static/${data.logo}`);
    });

    socket.on('timer', (data) => {
        if (typeof timer === 'undefined'){
            timer.stop();
        }
        timer = new Timer(data.minutos*60,'.timer',() => {
            $('.timer').text('Estamos por comenzar')
        });

    });

    timer = new Timer(5,'.timer',() => {
        $('.timer').text('Estamos por comenzar');
        console.log('CALLBACK');
    });

    socket.on('scene', (seleccionado) => {
        console.log(seleccionado);
        $('.pantalla').removeClass('show');
        $('.pantalla').addClass('hide');
        switch (seleccionado) {
            case 'inicio':
                $('#inicio').removeClass('hide');
                $('#inicio').addClass('show');
                $('#inicio video').get(0).play();
                break;
            case 'main':
                $('.pantalla').removeClass('show');
                $('.pantalla').addClass('hide');
                $('.pantalla video').each((i, e) => {
                    e.pause()
                });
                break;
            case 'fin':
                $('#fin').removeClass('hide');
                $('#fin').addClass('show');
                break;
        }
    });

});




// setInterval(() => {
//
// }, 5000);
