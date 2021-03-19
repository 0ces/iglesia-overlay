const express = require('express');
const app = express();
const http = require('http');
const server1 = http.Server(app);
const fs = require('fs');
const path = require('path');
const io = require('socket.io')(server1);
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

async function getFilesFromRepo(repo){
    let treeFromRepo = await tree(repo, {recursive:true}).then(res => res.tree);
    treeFromRepo.forEach((file, i) => {
        if(file.path.startsWith('remote')){
            if (file.type === 'tree'){
                console.log(`Creando carpeta ${file.path}`);
                fs.mkdir(file.path, (error) => {
                    if (error) return console.error(error);
                });
            }
            if (file.type === 'blob'){
                console.log(`Descargando archivo ${file.path}`);
                downloadFile(repo, file.path);
            }
        }
    });
}

if (process.argv.indexOf('--no-git') >= 0){
    main();
} else {
    getFilesFromRepo(repo).then(() => {
        console.log('Termino!');
        main();
    });
}

function main() {
    app.use(express.static("client"));

    app.get('/overlay/remote/admin', (req, res) => {
        res.sendFile('client/admin/index.html')
    });

    admin.on('connection', (socket) => {
        let address = socket.handshake.address.replace('::ffff:', '');
        console.log(`Se ha conectado ${address} a /admin`)

        socket.on('*', (packet) => {
            socket.broadcast.emit(packet.data[0], packet.data[1]);
            remote.emit('remote', [packet.data[0], packet.data[1]]);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected from /admin');
        });

    });

    remote.on('connection', (socket) => {
        let address = socket.handshake.address.replace('::ffff:', '');
        console.log(`Se ha conectado ${address} a /admin`)

        socket.on('*', (packet) => {
            socket.broadcast.emit(packet.data[0], packet.data[1]);
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
