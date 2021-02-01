const socket = io('/viewer');

function fadeVol(player, from, to,  duration) {
    const initial_vol = from;
    let volumen = from;
    let dv;
    let pause;
    if (from < to){
        dv = 1;
        pause = false;
    } else {
        dv = -1;
        pause = true;
    }
    let interval = setInterval(() => {
        if (volumen !== to){
            player.setVolume(volumen);
            volumen += dv;
        }  else {
            clearInterval(interval);
            if (pause)
            player.pauseVideo();
        }
    }, duration*1000/initial_vol);
}

var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var players = {
    inicio: null,
    fin: null
};

function onYouTubeIframeAPIReady() {

}

function getDataFromPlayer(player) {
    return {
        duration: player.getDuration(),
        volumen: player.getVolume(),
        state: player.getPlayerState(),
        currentTime: player.getCurrentTime()
    }
}

function onPlayerReady(event) {
    let player = event.target;
    // player.playVideo();
    // player.pauseVideo();
    player.setPlaybackQuality('hd1080');
    socket.emit('youtube-data', getDataFromPlayer(player));
}

function onStateChange(event) {
    let player = event.target;
    if (player.getPlayerState() !== 1) {
        socket.emit('youtube-state-change');
    } else {
        socket.emit('youtube-playing');
    }
}

$(document).ready(() => {
    let timer;
    let currentPlayer;
    let currentScene = 'inicio';
    let currentLogo = 'live-online';

    socket.on('shower', (data) => {
        $('.banner').addClass('blur-ani');
        $(`.${data.nombre}`).toggleClass('hide show');
        setTimeout(() => {
            $(`.${data.nombre}`).toggleClass('hide show');
        }, 8000);
        setTimeout(() => {
            $('.banner').removeClass('blur-ani');
        }, 14000);
    });

    // setTimeout(() => {
    //     $('#YTPlayer').replaceWith('<div id="YTPlayer" class="full"></div>');
    // }, 5000);

    socket.on('banner', (checked) => {
        if (checked === 'logo' && $('.banner').hasClass('show')){
            $('.banner').removeClass('show');
            $('.banner').addClass('hide');
            $('.titulo div').removeClass('show-any');
            $('.logos').removeClass('hide-any');
            $('.logos').addClass('show-any');
        }
        if (checked === 'banner' && $('.banner').hasClass('hide')){
            $('.banner').removeClass('hide');
            $('.banner').addClass('show');
            $('.logos').removeClass('show-any');
            $('.logos').addClass('hide-any');
        }

    });

    socket.on('changer', (data) => {
        $('.logo').attr('src', `../static/${data.logo}`);
        $('.titulo div').addClass('disable');
        $(`.${data.nombre}`).removeClass('disable');
        // $('.contacto-container').addClass('disable');
        currentLogo = data.nombre;
        $('.titulo div').addClass('disable');
        $(`.${currentLogo}`).removeClass('disable');
        $(`.${currentLogo}`).addClass('show-any');
        switch (data.nombre) {
            case 'live-online':
                $('.contacto-container').removeClass('disable');
                break;
        }
    });

    socket.on('timer', (data) => {
        if (!data.parar){
            timer = new Timer({
                segundos: data.minutos*60,
                elemento: '.timer',
                callback: () => {
                    console.log(currentScene);
                    if (currentScene === 'inicio'){
                        // $('.timer').text('Estamos por comenzar');
                    }
                    if (currentScene === 'fin'){
                        if (currentPlayer)
                        fadeVol(currentPlayer, 100, 0, 10);
                        $('#fin').removeClass('show');
                        $('#fin').addClass('hide');
                    }
                }
            });
        } else {
            timer.stop();
        }
    });

    socket.on('scene', (seleccionado) => {
        $('.escena').removeClass('show');
        $('.escena').addClass('hide');
        console.log(`Cambio de escena ${seleccionado}`);
        $('.logos').removeClass('scale center');
        // $('#transicion').removeClass('show');
        // $('#transicion').addClass('hide');
        currentScene = seleccionado;
        console.log($('#black'), seleccionado);
        if (seleccionado === 'inicio'){
            $('#black').removeClass('hide-any');
            $('#black').addClass('show-any');
            $('#inicio').removeClass('hide');
            $('#inicio').addClass('show');
            currentPlayer = players.inicio;
        }

        if (seleccionado === 'main'){
            $('#black').removeClass('show-any');
            $('#black').addClass('hide-any');
            $('.escena').removeClass('show');
            $('.escena').addClass('hide');
            currentPlayer = null;
        }

        if (seleccionado === 'fin'){
            $('#black').removeClass('hide-any');
            $('#black').addClass('show-any');
            currentPlayer = players.fin;
            if (currentPlayer){
                currentPlayer.playVideo();
            }
            $('#fin').removeClass('hide');
            $('#fin').addClass('show');
        }

        if (seleccionado === 'transicion'){
            $('#black').removeClass('hide-any');
            $('#black').addClass('show-any');
            $('#transicion').removeClass('hide');
            $('#transicion').addClass('show');
            $('.logos').removeClass('center scale');
            $('.logos').addClass('center scale');
        }

        if (currentPlayer) {
            currentPlayer.seekTo(0, true);
            fadeVol(currentPlayer, 0, 100, 5);
        } else {
            if (players.inicio)
            fadeVol(players.inicio, 100, 0, 10);
            if (players.fin)
            fadeVol(players.fin, 100, 0, 10);
        }
    });

    socket.on('logo-pos', selected => {
        $('.logos').toggleClass('hide-any show-any');
        setTimeout(() => {
            $('.logos').removeClass('top bottom left right center');
            switch (selected) {
                case 1:
                    $('.logos').addClass('top left');
                    break;
                case 2:
                    $('.logos').addClass('top right');
                    break;
                case 3:
                    $('.logos').addClass('bottom left');
                    break;
                case 4:
                    $('.logos').addClass('bottom right');
                    break;
            }
            $('.logos').toggleClass('hide-any show-any');
            // setTimeout(()=>{$('.logos').removeClass('show-any');},2000);
        }, 2100);
    });

    socket.on('youtube-source', (data) => {
        $(`#${data.ID} video`).get(0).pause();
        $(`#YTPlayer-${data.ID}`).replaceWith(`<div id="YTPlayer-${data.ID}" class="full blur"></div>`);
        players[data.ID] = new YT.Player(`YTPlayer-${data.ID}`, {
            height: '1920',
            width: '1080',
            videoId: data.YTID,
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onStateChange,
            },
            playerVars: {
                // 'autoplay': 1,
                'controls': 0,
            }
        });
        currentPlayer = players.inicio;
        socket.emit('youtube-state-change');
    });

    socket.on('get-youtube-current-time', () => {
        if (currentPlayer)
        socket.emit('youtube-current-time', getDataFromPlayer(currentPlayer));
    });

    socket.on('youtube-play', () => {
        currentPlayer.playVideo();
    });

    socket.on('youtube-pause', () => {
        currentPlayer.pauseVideo();
    });

    socket.on('youtube-seek', (percentage) => {
        console.log(currentPlayer.getDuration()*percentage);
        currentPlayer.seekTo(currentPlayer.getDuration()*percentage, true);
    });

    socket.on('tema-switcher', (data) => {
        if(data.isTema && $('.titulo .tema span').text() !== ''){
            $('.titulo div').addClass('disable');
            $('.titulo .tema').addClass('show-any');
            $('.titulo .tema').removeClass('disable');
        }
        if (!data.isTema) {
            $('.titulo div').addClass('disable');
            $(`.${currentLogo}`).removeClass('disable');
            $(`.${currentLogo}`).addClass('show-any');
            // $('.contacto,.encabezado').show();
            // setTimeout(()=>{$(`.${currentLogo}`).removeClass('show-any');},2000);
        }
    });

    socket.on('tema', (data) => {
        $('.titulo div').addClass('disable');
        $('.titulo .tema span').css('font-size', '100px');
        $('.titulo .tema span').text(`“${data.tema}”`);
        $('.titulo .tema').addClass('show-any');
        // $('.contacto,.encabezado').hide();
        // setTimeout(()=>{$('.titulo .tema').removeClass('show-any');},2000);
        $('.titulo .tema').removeClass('disable');
        autoSizeText();
    });

    socket.on('contacto', (data) => {
        $('.contacto span').text(data.valor);
    });
});




// setInterval(() => {
//
// }, 5000);
