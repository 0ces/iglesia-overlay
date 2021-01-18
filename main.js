// const sqlite3 = require('sqlite3').verbose();
const express = require('express');
const app = express();
const http = require('http');
const server1 = http.Server(app);
const fs = require('fs');
const path = require('path');
const io = require('socket.io')(server1);
const admin = io.of('/admin');
const viewer = io.of('/viewer');

const server2 = http.createServer((req, res) => {
    let stream = fs.createReadStream(path.join('.', req.url));
    stream.on('error', function() {
        res.writeHead(404);
        res.end();
    });
    stream.pipe(res);
}).listen(3001, () => {
    console.log('Listening for files requests on *:3001');
});

// let db = new sqlite3.Database('./db/database.db', sqlite3.OPEN_CREATE, (err) => {
//   if (err) {
//     console.error(err.message);
//   }
//   console.log('Connected to the database.');
// });

app.use(express.static(__dirname + "/client"));
app.use(express.static(__dirname + "/client/viewer"));
fs.mkdir(path.join('.', '/videos'), { recursive: true }, (err) => {
    if (err) throw err;
});

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
        console.log('User disconnected from /admin');
    });

    socket.on('banner', (checked) => {
        socket.broadcast.emit('banner', checked);
        viewer.emit('banner', checked);
    });

    socket.on('changer', (data) =>  {
        socket.broadcast.emit('changer', data);
        viewer.emit('changer', data);
    });

    socket.on('scene', seleccionado => {
        socket.broadcast.emit('scene', seleccionado);
        viewer.emit('scene', seleccionado);
    });

    socket.on('timer', (data) => {
        viewer.emit('timer', data);
    });

    socket.on('logo-pos', selected => {
        socket.broadcast.emit('logo-pos', selected);
        viewer.emit('logo-pos', selected);
    });

    socket.on('youtube-source', (data) => {
        viewer.emit('youtube-source', data);
    });

    socket.on('get-youtube-current-time', () => {
        viewer.emit('get-youtube-current-time');
    });

    socket.on('youtube-play', () => {
        viewer.emit('youtube-play');
    });

    socket.on('youtube-pause', () => {
        viewer.emit('youtube-pause');
    });
})

viewer.on('connection', (socket) => {
    let address = socket.handshake.address.replace('::ffff:', '');
    console.log(`Se ha conectado ${address} a /viewer`)

    socket.on('disconnect', () => {
        console.log('User disconnected from /viewer');
    });

    socket.on('youtube-state-change', () => {
        admin.emit('youtube-state-change');
    });

    socket.on('youtube-data', (data) => {
        admin.emit('youtube-data', data);
    });

    socket.on('youtube-current-time', (data) => {
        admin.emit('youtube-current-time', data);
    });

    socket.on('youtube-playing', () => {
        admin.emit('youtube-playing');
    });
});

server1.listen(3000, () => {
    console.log('Listening on *:3000');
});
