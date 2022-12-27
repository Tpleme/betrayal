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

const AddImageId = require('./middleware/ImageID')
const { UserImageUploader} = require('./middleware/ImageUploader')
const { LoginLimiter, StandardLimiter, ChangePassLimiter } = require('./middleware/rateLimiter')
const { Auth } = require('./middleware/EndpointAuth')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: ['http://localhost:3001'],
    allowedHeaders: ['Content-Type', 'Authorization', 'key', 'requesting-user'],
    exposedHeaders: ['key', 'user', 'email', 'id']
}))
app.use(helmet())
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))
app.use(compression())
app.use(morgan('common'))
app.use('/resources', express.static('resources'))
app.use(requestIp.mw())

const authRoute = require('./Routes/Auth')
const usersRoute = require('./Routes/Users')
const chatMessagesRoute = require('./Routes/ChatsMessages')
const CharactersRoute = require('./Routes/Characters')
const GameRoomRoute = require('./Routes/GameRooms')

const routes = {
    users: usersRoute,
    gameRoom: GameRoomRoute
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

//Auth
app.post('/api/user/auth', [cors(), LoginLimiter], makeHandlerAwareOfAsyncError(authRoute.auth))

//Chats
app.get('/api/chat_messages/:chat', [cors(), StandardLimiter, Auth], makeHandlerAwareOfAsyncError(chatMessagesRoute.getAll))

// Characters
app.get('/api/characters', [cors(), StandardLimiter, Auth], makeHandlerAwareOfAsyncError(CharactersRoute.getAll))
app.get('/api/characters/:id', [cors(), StandardLimiter, Auth], makeHandlerAwareOfAsyncError(CharactersRoute.getByID))

// Users
app.post('/api/users/remove-picture/:id', [cors(), StandardLimiter, Auth], makeHandlerAwareOfAsyncError(routes.users.removePicture))
app.post('/api/users/change-picture/:id', [cors(), StandardLimiter, Auth, AddImageId, UserImageUploader], makeHandlerAwareOfAsyncError(routes.users.addPicture))

app.post('/api/users/forgot-pass', [cors(), ChangePassLimiter], makeHandlerAwareOfAsyncError(routes.users.requestPassReset))
app.post('/api/users/reset-pass', [cors(), ChangePassLimiter], makeHandlerAwareOfAsyncError(routes.users.resetPassword))
app.get('/api/users/get-user-for-pass-reset/:id/:secret', [cors(), ChangePassLimiter], makeHandlerAwareOfAsyncError(routes.users.getByIDAndSecret))
app.post('/api/users/change-pass/:id', [cors(), ChangePassLimiter, Auth], makeHandlerAwareOfAsyncError(routes.users.changePassword))
app.get('/api/users/get-room-users/:roomId', [cors(), StandardLimiter, Auth], makeHandlerAwareOfAsyncError(routes.users.getUsersFromRoom))

//room
app.post('/api/game-room/change-password/:id', [cors(), StandardLimiter, Auth], makeHandlerAwareOfAsyncError(routes.gameRoom.changeRoomPassword))
app.post('/api/game-room/invite-players', [cors(), StandardLimiter, Auth], makeHandlerAwareOfAsyncError(routes.gameRoom.invitePlayers))

for (const [routeName, routeController] of Object.entries(routes)) {
    if (routeController.getAll) {
        app.get(`/api/${routeName}`, [cors(), StandardLimiter, Auth], makeHandlerAwareOfAsyncError(routeController.getAll))
    }

    if (routeController.getByID) {
        app.get(`/api/${routeName}/:id`, [cors(), StandardLimiter, Auth], makeHandlerAwareOfAsyncError(routeController.getByID))
    }

    if (routeController.create) {
        app.post(`/api/${routeName}`, [cors(), StandardLimiter, Auth, AddImageId], makeHandlerAwareOfAsyncError(routeController.create))
    }

    if (routeController.update) {
        app.put(`/api/${routeName}/:id`, [cors(), StandardLimiter, Auth], makeHandlerAwareOfAsyncError(routeController.update))
    }

    if (routeController.remove) {
        app.delete(`/api/${routeName}/:id`, [cors(), StandardLimiter, Auth], makeHandlerAwareOfAsyncError(routeController.remove))
    }
}

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3001'
    }
})

io.on('connection', socket => handleWS(socket, io))

startServer()