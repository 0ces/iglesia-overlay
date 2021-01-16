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
        let minutos = Math.floor(this.segundos/60);
        let segundos = this.segundos%60;
        return `${pad(minutos,1)}:${pad(segundos,2)}`
    }

    stop(){
        $(this.elemento).text('');
        clearInterval(this.interval);
    }
}
