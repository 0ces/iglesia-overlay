function pad (str, max) {
    str = str.toString();
    return str.length < max ? pad("0" + str, max) : str;
}

const getMethods = (obj) => {
    let properties = new Set()
    let currentObj = obj
    do {
        Object.getOwnPropertyNames(currentObj).map(item => properties.add(item))
    } while ((currentObj = Object.getPrototypeOf(currentObj)))
    return [...properties.keys()].filter(item => typeof obj[item] === 'function')
}


function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = `${pad(hours,2)}:${pad(minutes,2)}:${pad(seconds,2)} ${ampm}`;
    return strTime;
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

function autoSizeText() {
    var el, elements, _i, _len, _results;
    elements = $('.resize');
    if (elements.length < 0) {
        return;
    }
    _results = [];
    for (_i = 0, _len = elements.length; _i < _len; _i++) {
        el = elements[_i];
        _results.push((function(el) {
            var resizeText, _results1;
            resizeText = function() {
                var elNewFontSize;
                elNewFontSize = (parseInt($(el).css('font-size').slice(0, -2)) - 1) + 'px';
                return $(el).css('font-size', elNewFontSize);
            };
            _results1 = [];
            while (el.scrollHeight > el.offsetHeight) {
                _results1.push(resizeText());
            }
            return _results1;
        })(el));
    }
    return _results;
};

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
        $(this.elemento).prop('disabled', false);
        $(this.elemento).text(this.getString());
        $(this.elemento).val(this.getString());
        $(this.elemento).prop('disabled', true);
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
