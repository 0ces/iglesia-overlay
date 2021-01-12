const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static(__dirname + "/client"));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/client/index.html');
});

app.get('/admin', (req, res) => {
    res.sendFile(__dirname + '/client/admin/index.html')
});

io.on('connection', (socket) => {
    let address = socket.handshake.address.replace('::ffff:', '');
    console.log(`Se ha conectado ${address}`)
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

http.listen(3000, () => {
    console.log('listening on *:3000');
});
