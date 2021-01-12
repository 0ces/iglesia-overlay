const socket = io('/viewer');

socket.on('init', () => {

});

setInterval(() => {
    $('.youtube').toggleClass('hide show');
}, 5000);
