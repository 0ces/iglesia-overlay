const express = require('express');
const app = express();
const http = require('http');
const server1 = http.Server(app);
const fs = require('fs');
const path = require('path');
const io = require('socket.io')(server1, {cors: {origin: '*'}});
const ioc = require("socket.io-client");
const admin = io.of('/admin');
const remote = io.of('/remote');
const repo = '0ces/iglesia-overlay';
const https = require('https');
const tree = require('github-trees');
const get = require('get-file');

let middleware = require('socketio-wildcard')();

admin.use(middleware);
remote.use(middleware);

function downloadFile(repo, path) {
    get(repo, path, (error, response) => {
        if (error) return console.error(error);
        let file = fs.createWriteStream(path);
        response.pipe(file);
    });
}

function main() {
    app.use(express.static("client"));
    app.use(express.static("client/admin"));

    app.get('/admin', (req, res) => {
        res.sendFile('client/admin/index.html', { root: __dirname })
    });

    admin.on('connection', (socket) => {
        let address = socket.handshake.address.replace('::ffff:', '');
        console.log(`Se ha conectado ${address} a /admin`)

        socket.on('*', (packet) => {
            socket.broadcast.emit(packet.data[0], packet.data[1]);
            console.log(`Admin ${address} mandó: ${JSON.stringify(packet)}`);
            remote.emit('remote', [packet.data[0], packet.data[1]]);
        });

        socket.on('disconnect', () => {
            console.log(`User ${address} disconnected from /admin`);
        });

    });

    remote.on('connection', (socket) => {
        let address = socket.handshake.address.replace('::ffff:', '');
        console.log(`Se ha conectado ${address} a /admin`)

        socket.on('*', (packet) => {
            socket.broadcast.emit(packet.data[0], packet.data[1]);
            console.log(`Remote ${address} mandó: ${JSON.stringify(packet)}`);
            admin.emit(packet.data[0], packet.data[1]);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected from /admin');
        });

    });

    server1.listen(3001, () => {
        console.log('Listening on *:3001');
    });
}

main()
