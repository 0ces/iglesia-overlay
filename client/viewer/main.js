function pad (str, max) {
  str = str.toString();
  return str.length < max ? pad("0" + str, max) : str;
}

function isUndefined (variable) {
    return typeof variable === 'undefined';
}

class Timer {
    constructor(segundos, elemento, callback, frecuent_callback){
        this.segundos = segundos;
        this.elemento = elemento;
        this.callback = callback;
        this.frecuent_callback = frecuent_callback;
        this.interval = setInterval(() => {
            if (!isUndefined(this.elemento)){
                this.reducirElemento();
            } else {
                this.reducir();
            }
            if (!isUndefined(this.frecuent_callback)){
                frecuent_callback();
            }
        }, 1000);
    }

    reducirElemento(){
        $(this.elemento).text(this.getString());
        this.reducir();
    }

    reducir(){
        this.segundos--;
        if(this.segundos < 0){
            this.stop();
            this.callback();
        }
    }

    getString(){
        let minutos = Math.floor(this.segundos/60);
        let segundos = this.segundos%60;
        return `${pad(minutos,1)}:${pad(segundos,2)}`
    }

    stop(){
        $(this.elemento).text('');
        clearInterval(this.interval);
    }
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

});




// setInterval(() => {
//
// }, 5000);
