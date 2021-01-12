const socket = io('/admin');
let i = 0;

socket.on('init', () => {

});

setInterval(() => {
    $('.progress-bar').css('width', `${i%101}%`);
    i++;
    if (i%101 !== 100){
        $('.btn').prop('disabled', true);
    } else {
        $('.btn').prop('disabled', false);
    }
}, 500);
