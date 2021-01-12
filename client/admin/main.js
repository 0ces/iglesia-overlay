function toggleProgressBar(selector) {
    if ($(`#${selector}`).attr('colspan') === '2'){
        $(`#${selector}`).prop('colspan', '1');
        $(`#${selector}-progress`).toggle();
        $(`#${selector}-progress>div`).toggleClass('hide-progressbar show-progressbar');
    } else {
        $(`#${selector}-progress>div`).toggleClass('hide-progressbar show-progressbar');
        setTimeout(()=>{
            $(`#${selector}`).prop('colspan', '2');
            $(`#${selector}-progress`).toggle();
        },2000);
    }
}

$(document).ready(() => {
    const socket = io('/admin');

    socket.on('init', () => {

    });

    $('.activador').each((index) => {
        let selector = $($('.activador')[index]).attr('data-selector');
        toggleProgressBar(selector);
    });

    $('.activador').click((e) => {
        let selector = $(e.target).attr('data-selector');
        socket.emit('shower', {nombre: selector});
        toggleProgressBar(selector);
        let i = 0;
        $(`#btn-${selector}`).prop('disabled', true);
        let interval = setInterval(() => {
            i++;
            $(`#${selector}-progress>div>div`).css('width', `${i%101}%`);
            if (i%101 === 100){
                $(`#btn-${selector}`).prop('disabled', false);
                clearInterval(interval);
                toggleProgressBar(selector);
            }
        }, 5000/100);
    });
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
