const express = require('express');
const app = express();
const http = require('http');
const server1 = http.Server(app);
const fs = require('fs');
const path = require('path');
const io = require('socket.io')(server1);
const admin = io.of('/admin');
const viewer = io.of('/viewer');
const repo = '0ces/iglesia-overlay';
const https = require('https');
const tree = require('github-trees');
const get = require('get-file');

// const server2 = http.createServer((req, res) => {
//     let stream = fs.createReadStream(path.join('.', req.url));
//     stream.on('error', function() {
//         res.writeHead(404);
//         res.end();
//     });
//     stream.pipe(res);
// }).listen(3001, () => {
//     console.log('Listening for files requests on *:3001');
// });

function downloadFile(repo, path) {
    // console.log(`${repo}/${path}`);
    get(repo, path, (error, response) => {
        if (error) return console.error(error);
        let file = fs.createWriteStream(path);
        response.pipe(file);
    });
}

async function getFilesFromRepo(repo){
    let treeFromRepo = await tree(repo, {recursive:true}).then(res => res.tree);
    treeFromRepo.forEach((file, i) => {
        if(file.path.startsWith('client')){
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
    app.use(express.static("client/viewer"));
    app.get('/', (req, res) => {
        res.sendFile('client/viewer/index.html');
    });

    app.get('/viewer', (req, res) => {
        res.sendFile('client/viewer/index.html');
    });

    app.get('/admin', (req, res) => {
        res.sendFile('client/admin/index.html')
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

        socket.on('youtube-seek', (percentage) => {
            socket.broadcast.emit('youtube-seek', percentage);
            viewer.emit('youtube-seek', percentage);
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
}
