const socket = io('/viewer');

socket.on('shower', (data) => {
    $(`.${data.nombre}`).toggleClass('hide show');
    setTimeout(() => {
        $(`.${data.nombre}`).toggleClass('hide show');
    }, 5000);
});

// setInterval(() => {
//
// }, 5000);
