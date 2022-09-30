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
const chatMessagesRoute = require('./Routes/ChatsMessages')

const { LoginLimiter, StandardLimiter } = require('./middleware/rateLimiter')
const { Auth } = require('./middleware/EndpointAuth')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: ['http://localhost:3001'],
    allowedHeaders: ['Content-Type', 'Authorization', 'key', 'requesting-user'],
    exposedHeaders: ['key', 'user', 'email', 'id']
}))
app.use(helmet())
app.use(compression())
app.use(morgan('common'))
app.use('/resources', express.static('resources'))
app.use(requestIp.mw())

const routes = {
    users: usersRoute,
}

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

app.get('/', (req, res) => {
    res.status(200).send('Server is up and running')
})

app.post('/api/user/auth', [cors(), LoginLimiter], makeHandlerAwareOfAsyncError(authRoute.auth))

app.get('/api/chat_messages/:chat', [cors(), StandardLimiter], makeHandlerAwareOfAsyncError(chatMessagesRoute.getAll))


for (const [routeName, routeController] of Object.entries(routes)) {
    if (routeController.getAll) {
        app.get(`/api/${routeName}`, [cors(), Auth, StandardLimiter], makeHandlerAwareOfAsyncError(routeController.getAll))
    }

    if (routeController.getByID) {
        app.get(`/api/${routeName}/:id`, [cors(), Auth, StandardLimiter], makeHandlerAwareOfAsyncError(routeController.getByID))
    }

    if (routeController.create) {
        app.post(`/api/${routeName}`, [cors(), Auth, StandardLimiter], makeHandlerAwareOfAsyncError(routeController.create))
    }

    if (routeController.update) {
        app.put(`/api/${routeName}/:id`, [cors(), Auth, StandardLimiter], makeHandlerAwareOfAsyncError(routeController.update))
    }

    if (routeController.remove) {
        app.delete(`/api/${routeName}/:id`, [cors(), Auth, StandardLimiter], makeHandlerAwareOfAsyncError(routeController.remove))
    }
}

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3001'
    }
})

io.on('connection', socket => handleWS(socket, io))

startServer()