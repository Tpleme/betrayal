const { models } = require('./database/index')
const { RateLimiterMemory } = require('rate-limiter-flexible')
const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcrypt')

const rateLimiter = new RateLimiterMemory(
    {
        points: 8, // requests
        duration: 10, // per second
        blockDuration: 30
    });


const handleWS = (socket, io) => {
    connectUser(io, socket)

    socket.on('disconnect', () => onDisconnect(socket));
    socket.on('message', (msg) => onMessage(socket, msg))
    socket.on('create-room', (data) => createRoom(socket, data))
    socket.on('join-room', (data) => joinRoom(socket, data))
    // socket.onAny((event, ...args) => console.log(event, args));
}

const connectUser = async (io, socket) => {

    await models.keys.findOrCreate({
        where: { key: socket.handshake.auth.token, userId: socket.handshake.auth.uuid },
    })

    //TODO: Aqui vai ser preciso ver se o user está em algum game room, se sim, faz-se join outra vez

    console.log('user connected ' + socket.id)
    socket.join('global')

    await models.users.update({ loggedIn: true, last_login: Date.now(), socket_id: socket.id }, { where: { id: socket.handshake.auth.uuid } }).then(async () => {
        await models.users.findAll().then(users => {
            io.in('global').emit('users', users)
        })
    })

}

const onDisconnect = async (socket) => {

    console.log('User disconnected ' + socket.id)

    await models.users.update({ loggedIn: false, socket_id: null }, { where: { id: socket.handshake.auth.uuid } }).then(async () => {
        await models.users.findAll().then(users => {
            socket.broadcast.emit('users', users)
        })
    })
}

const onMessage = async (socket, data) => {

    try {
        await rateLimiter.consume(data.user_id);
        await models.main_chats.create(data);
        socket.nsp.to(data.chat).emit('chat_message', data)
    } catch (rejRes) {
        socket.emit('blocked', { 'retry-ms': rejRes.msBeforeNext });
    }
}

const createRoom = async (socket, data) => {
    const room_id = uuidv4();

    socket.join(room_id)

    if (data.password) {
        await bcrypt.hash(data.password, 10).then(hash => {
            models.game_rooms.create({ room_id, password: hash }).then((room) => {
                models.users.update({ game_room: room.id, hosting: room.id }, { where: { id: data.user.id } }).then(() => {
                    socket.nsp.to(socket.id).emit('room_created', { room_id })
                })
            })
        })
    } else {
        models.game_rooms.create({ room_id }).then((room) => {
            models.users.update({ game_room: room.id, hosting: room.id }, { where: { id: data.user.id } }).then(() => {
                socket.nsp.to(socket.id).emit('room_created', { room_id })
            })
        })
    }
}

const joinRoom = async (socket, data) => {

}

module.exports = {
    handleWS
}