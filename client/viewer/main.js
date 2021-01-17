var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('YTPlayer', {
        height: '1920',
        width: '1080',
        videoId: 'eRUM70CPYls',
        events: {
        'onReady': onPlayerReady
        },
        playerVars: {
            'autoplay': 1,
            // 'controls': 0,
            'cc_load_policy': 1
        }
    });
    setTimeout(()=>{$('#YTPlayer').contents().find('.ytp-subtitles-button.ytp-button').click();},1000);

}

function onPlayerReady(event) {
    event.target.playVideo();
}

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

    // setTimeout(() => {
    //     $('#YTPlayer').replaceWith('<div id="YTPlayer" class="full"></div>');
    //
    // }, 10000);

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
        $('.titulo div').addClass('disable');
        $(`.${data.nombre}`).removeClass('disable');
        $('.contacto-container').addClass('disable');
        console.log(data);
        switch (data.nombre) {
            case 'live-online':
                $('.contacto-container').removeClass('disable');
                break;
        }
    });

    socket.on('timer', (data) => {
        if (typeof timer !== 'undefined'){
            timer.stop();
        }
        if (!data.parar){
            timer = new Timer(data.minutos*60,'.timer',() => {
                $('.timer').text('Estamos por comenzar')
            });
        } else {
            timer.stop();
        }
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
