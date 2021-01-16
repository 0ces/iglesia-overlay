function pad (str, max) {
  str = str.toString();
  return str.length < max ? pad("0" + str, max) : str;
}

class Timer {
    constructor(segundos, elemento, callback){
        this.segundos = segundos;
        this.elemento = elemento;
        this.callback = callback;
        if (typeof this.elemento !== 'undefined'){
            this.interval = setInterval(() => {
                this.reducirElemento();
            }, 1000);
        } else {
            this.interval = setInterval(() => {
                this.reducir()
            },1000);
        }
    }

    reducirElemento(){
        this.reducir();
        $(this.elemento).text(this.getString());
    }

    reducir(){
        this.segundos--;
        if(this.segundos === 0){
            this.stop();
        }
    }

    getString(){
        let minutos = Math.floor(this.segundos/60);
        let segundos = this.segundos%60;
        return `${pad(minutos,1)}:${pad(segundos,2)}`
    }

    stop(){
        clearInterval(this.interval);
        $(this.elemento).text('');
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

        });

    });


});




// setInterval(() => {
//
// }, 5000);
