// function toggleProgressBar(selector) {
//     if ($(`#${selector}`).attr('colspan') === '2'){
//         $(`#${selector}`).prop('colspan', '1');
//         $(`#${selector}-progress`).toggle();
//         $(`#${selector}-progress>div`).toggleClass('hide-progressbar show-progressbar');
//     } else {
//         $(`#${selector}-progress>div`).toggleClass('hide-progressbar show-progressbar');
//         setTimeout(()=>{
//             $(`#${selector}`).prop('colspan', '2');
//             $(`#${selector}-progress`).toggle();
//         },2000);
//     }
// }
let remoteurl = 'http://oces.ml:3001'

function activate(selector){
    $('.activador').prop('disabled', true);
    setTimeout(() => {
        $('.activador').prop('disabled', false);
    }, 12000);
}

function logoPosClick(selected) {
    let i;
    for (i = 1; i < 5; i++){
        if ($(selected).hasClass(`logo-pos-${i}`) && !$(selected).hasClass('checked')){
            $('.logo-pos div').removeClass('checked');
            $(selected).addClass('checked');
            break;
        }
    }
    return i;
}

$(document).ready(() => {
    const socket = io('/admin');
    let video_duration;
    let timePassed = 0;
    let timeBtw = 1000*60*20;
    let duracionVideo = 0;

    $('input[type="text"]').val('');

    socket.on('shower', (data) => {
        activate(data.nombre);
        timePassed = 0;
    });

    socket.on('banner', (checked) => {
        if (!$(`#${checked}-switch`).hasClass('checked')){
            $('.switch button').toggleClass('checked');
        }
    });

    socket.on('logo-pos', selected => {
        logoPosClick($(`.logo-pos-${selected}`))
    });

    socket.on('youtube-state-change', () => {
        $('.pause-btn').hide();
        $('.play-btn').show();
    });

    socket.on('youtube-playing', () => {
        $('.play-btn').hide();
        $('.pause-btn').show();
    });

    socket.on('youtube-data', (data) => {
        duracionVideo = minutosAString(data.duration);
        $('#video-duration').text(duracionVideo);
    });

    socket.on('youtube-current-time', (data) => {
        $('#video-current-time').val((data.currentTime/data.duration)*100);
        $('#video-current-time-label').text(minutosAString(data.currentTime));
        $('#video-time-left').text(minutosAString(data.duration-data.currentTime));
        $('#video-duration').text(minutosAString(data.duration));
        video_duration = data.duration;
    });

    socket.on('youtube-seek', (percentage) => {
        $('#video-current-time').val(percentage);
    });

    $('.play-btn').click(() => {
        socket.emit('youtube-play');
    });

    $('.pause-btn').click(() => {
        socket.emit('youtube-pause');
    });

    $('.activador').each((index) => {
        let selector = $($('.activador')[index]).attr('data-selector');
        // toggleProgressBar(selector);
    });

    $('.activador').click((e) => {
        let selector = $(e.target).attr('data-selector');
        socket.emit('shower', {nombre: selector});
        activate(selector);
        timePassed = 0;
    });

    $('.switch button').click((e) => {
        if (!$(e.target).hasClass('checked')){
            $('.switch button').toggleClass('checked');
        }
        let selected = $(e.target).attr('value');
        if (selected === 'logo'){
            $('.tema-switcher').hide();
            $('.logo-pos-parent').show();
        } else {
            $('.tema-switcher').show();
            $('.logo-pos-parent').hide();
        }
        socket.emit('banner', selected);
    });

    $('.tema-switcher button').click((e) => {
        if (!$(e.target).hasClass('checked')){
            $('.tema-switcher button').toggleClass('checked');
        }
        let selected = $(e.target).attr('value');
        if (selected === 'tema'){

            $('.tema-fila').show();
        } else {
            $('.tema-fila').hide();
        }
        socket.emit('tema-switcher', {isTema: selected === 'tema'});
    });

    $('#tema-aplicar').click((e) => {
        let tema = $('#tema-input').val();
        socket.emit('tema', {tema: tema});
    });

    $('#tema-input').on('keypress', (e) => {
        if(e.which == 13){
            $('#tema-aplicar').click();
        }
    });

    $('.logo-pos div').click((e) => {
        let _ = logoPosClick($(e.target));
        if (_ < 5){
            socket.emit('logo-pos', _);
        }
    });

    $('.changer').click((e) => {
        $('.changer-active').removeClass('changer-active');
        $(e.target).addClass('changer-active');
        socket.emit('changer', {logo: $(e.target).attr('logo-name'), nombre: $(e.target).attr('nombre')});
    });

    $('.scene-switcher button').click((e) => {
        let seleccionado = $(e.target).attr('value');
        if (!$(e.target).hasClass('checked')){
            $('.scene-switcher button').removeClass('checked');
            $(e.target).addClass('checked');
        }
        socket.emit('scene', seleccionado);
        setTimeout(() => {
            if (['inicio', 'fin', 'transicion'].indexOf(seleccionado) >= 0){
                $('.switch button')[1].click();
            } else {
                // $('.banner-switch button')[0].click();
            }
        }, 2000);
        if ('fin' === seleccionado) {
            timer = new Timer({
                segundos: parseTime(duracionVideo)*60-10,
                elemento: '.timer',
                callback: () => {$('.scene-switcher button')[3].click();}
            })
        }
        if (['inicio', 'fin'].indexOf(seleccionado) >= 0){
            $('.conf-controls').show();
            $('.logo-pos-4').click();
        } else {
            $('.conf-controls').hide();
        }
    });

    $('#timer-empezar').click(() => {
        let minutos = parseTime($('.timer').val());
        timer = new Timer({
            segundos: minutos*60,
            elemento: '.timer',
            callback: () => {
                let selected = $($('.scene-switcher button.checked').get(0)).val();
                console.log(`Está selecionado ${selected}`);
                if (selected === 'inicio'){
                    $('.scene-switcher button')[1].click();
                }
                if (selected === 'fin'){
                    $('.scene-switcher button')[3].click();
                }
            }
        });
        socket.emit('timer', {minutos: minutos, parar: false});
    });

    $('#timer-parar').click(() => {
        timer.stop();
        socket.emit('timer', {minutos: null, parar: true});
    });

    $('.timer').on('keypress', (e) => {
        if(e.which == 13){
            $('#timer-empezar').click();
        }
    });

    $('.conf-video>input').on('keypress', (e) => {
        if (e.which == 13){
            let elem = $(e.target);
            $('.pause-btn')[0].click();
            socket.emit('youtube-source', {ID: elem.attr('data-id'), YTID: elem.val()});
        }
    });

    let durationSelected = false;

    $('#video-current-time').mousedown((e) => {
        durationSelected = true;
    });

    $('#video-current-time').on('input', (e) => {
        // console.log(video_duration, $('#video-current-time').val()/100, ($('#video-current-time').val()/100)*video_duration)
        if(video_duration){
            $('#video-current-time-label').text(minutosAString(($('#video-current-time').val()/100)*video_duration));
        }
    })

    $('#video-current-time').mouseup((e) => {
        socket.emit('youtube-seek', $('#video-current-time').val()/100);
        // console.log($('#video-current-time').val()/100);
        durationSelected = false;
    });

    $('#contacto-aplicar').click((e) => {
        let value = $('#contacto').val();
        if (value === ''){
            value = 'Linea de oración +57 315 504 5131';
        }
        socket.emit('contacto', {valor: value});
    });

    $('#contacto-limpiar').click((e) => {
        $('#contacto').val('');
        $('#contacto-aplicar').click();
    });

    $('#contacto').on('keypress', (e) => {
        if (e.which == 13){
            $('#contacto-aplicar').click();
        }
    });

    $('#tema-limpiar').click((e) => {
        $('.tema-switcher button').get(0).click();
    });

    setInterval(() => {
        $('#time-activadores').text(`${minutosAString((timeBtw-timePassed)/(1000))}`);
        if(timePassed === timeBtw){
            console.log('Activadores!')
            setTimeout(() => {
                $('#btn-youtube').click();
            }, 1000*15);
            $('#btn-facebook').click();
            timePassed = -30*1000;
        }
        timePassed += 1000;
    }, 1000)

    setInterval(() => {
        if(!durationSelected){
            socket.emit('get-youtube-current-time');
        }
    }, 1000);

    $('#toggle-hora').click((e) => {
        socket.emit('toggle-hora');
    });

    // if (location.origin !== remoteurl){
    //     let remote = io('ws://oces.ml:3001/remote');
    //     if (remote.connected) {
    //         console.log(`Se ha conectado correctamente al main.`);
    //     } else {
    //         console.log('No se ha conectado al remote.');
    //     }
    //     remote.on('remote', (packet) => {
    //         console.log(packet);
    //         socket.emit(packet[0], packet[1]);
    //     });
    // }
});

// setInterval(() => {
//     $('.progress-bar').css('width', `${i%101}%`);
//     i++;
//     if (i%101 !== 100){
//         $('.btn').prop('disabled', true);
//     } else {
//         $('.btn').prop('disabled', false);
//     }
// }, 500);
