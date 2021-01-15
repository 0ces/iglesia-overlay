const sqlite3 = require('sqlite3').verbose();
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const admin = io.of('/admin');
const viewer = io.of('/viewer')

let db = new sqlite3.Database('./db/database.db', sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the database.');
});

app.use(express.static(__dirname + "/client"));
app.use(express.static(__dirname + "/client/viewer"));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/client/viewer/index.html');
});

app.get('/viewer', (req, res) => {
    res.sendFile(__dirname + '/client/viewer/index.html');
});

app.get('/admin', (req, res) => {
    res.sendFile(__dirname + '/client/admin/index.html')
});

admin.on('connection', (socket) => {
    let address = socket.handshake.address.replace('::ffff:', '');
    console.log(`Se ha conectado ${address} a /admin`)

    socket.on('shower', (data) => {
        socket.broadcast.emit('shower', data);
        viewer.emit('shower', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

    socket.on('banner', (checked) => {
        socket.broadcast.emit('banner', checked);
        viewer.emit('banner', checked);
    });
})

viewer.on('connection', (socket) => {
    let address = socket.handshake.address.replace('::ffff:', '');
    console.log(`Se ha conectado ${address} a /viewer`)
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

http.listen(3000, () => {
    console.log('listening on *:3000');
});
