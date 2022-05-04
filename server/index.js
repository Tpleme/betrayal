const express = require('express')
const { createServer } = require('http')
const { Server } = require('socket.io')

const app = express()
const server = createServer(app)
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3001'
    }
})

io.on('connection', socket => {
    console.log(socket);
    console.log('user connected')

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('chat message', msg => {
        console.log(msg)
    })
})


server.listen(3000, () => {
    console.log("listening on port 3000")
})