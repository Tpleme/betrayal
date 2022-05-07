const express = require('express')
const compression = require('compression')
const requestIp = require('request-ip')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const db = require('./database/index')
require('dotenv').config()

const { createServer } = require('http')
const { Server } = require('socket.io')

const app = express()
const server = createServer(app)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: ['http://localhost:3001'],
    allowedHeaders: ['Content-Type', 'Authorization', 'key', 'username'],
    exposedHeaders: ['key']
}))
app.use(helmet())
app.use(compression())
app.use(morgan('common'))
app.use('/resources', express.static('resources'))
app.use(requestIp.mw())

const startServer = async () => {
    await db.init();
    server.listen(3000)
}

/* const io = new Server(server, {
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
}) */



startServer()