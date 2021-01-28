function pad (str, max) {
  str = str.toString();
  return str.length < max ? pad("0" + str, max) : str;
}

function isUndefined(variable) {
    return typeof variable === 'undefined';
}

function minutosAString(input){
    let minutos = Math.floor(input/60);
    let segundos = Math.floor(input%60);
    return `${pad(minutos,1)}:${pad(segundos,2)}`
}

function parseTime(str){
    let minutes;
    if (str.includes(':')){
        let temp = str.split(':');
        minutes = parseInt(temp[0]) + (parseInt(temp[1])/60);
    } else {
        minutes = parseInt(str);
    }
    return minutes;
}

class Timer {
    constructor(data){
        this.segundos = data.segundos;
        this.elemento = data.elemento;
        this.callback = data.callback;
        this.frecuent_callback = data.frecuent_callback;
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
        $(this.elemento).val(this.getString());
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
        return minutosAString(this.segundos);
    }

    stop(){
        clearInterval(this.interval);
        $(this.elemento).text('Estamos por comenzar');
        $(this.elemento).val('');
    }
}
