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
    }
}

$(document).ready(() => {
    const socket = io('/viewer');

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
        if (!checked && $('.banner').hasClass('show')){
            $('.banner').removeClass('show');
            $('.banner').addClass('hide');
        }
        if (checked && $('.banner').hasClass('hide')){
            $('.banner').removeClass('hide');
            $('.banner').addClass('show');
        }

    });

    socket.on('changer', (data) => {
        $('.logo').attr('src', `../static/${data.logo}`);
    });

    new Timer(5*60,'.timer',() => {});
});




// setInterval(() => {
//
// }, 5000);
