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

const { handleWS } = require('./WS')

const app = express()
const server = createServer(app)

const authRoute = require('./Routes/Auth')
const usersRoute = require('./Routes/Users')

const { LoginLimiter } = require('./middleware/rateLimiter')
const { BOendPointAuth, FOendPointAuth } = require('./middleware/EndpointAuth')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: ['http://localhost:3001'],
    allowedHeaders: ['Content-Type', 'Authorization', 'key'],
    exposedHeaders: ['key', 'user', 'email', 'id']
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

const makeHandlerAwareOfAsyncError = (handler) => {
    return async (req, res, next) => {
        try {
            await handler(req, res);
        } catch (error) {
            next(error);
        }
    }
}

app.post('/api/user/auth', [cors(), LoginLimiter], makeHandlerAwareOfAsyncError(authRoute.auth))
app.post('/api/user', [cors(), BOendPointAuth], makeHandlerAwareOfAsyncError(usersRoute.create))
app.get('/api/users/', [cors(), BOendPointAuth], makeHandlerAwareOfAsyncError(usersRoute.getAll))
app.get('/api/users/:id', [cors(), BOendPointAuth], makeHandlerAwareOfAsyncError(usersRoute.getByID))

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3001'
    }
})

io.on('connection', socket => handleWS(socket, io))

startServer()