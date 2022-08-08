const { models } = require('./database/index')
const { checkKeyBeingUsed } = require('./utils')

const connectedUsers = []

const handleWS = (socket, io) => {
    connectUser(io, socket)

    socket.on('disconnect', () => onDisconnect(socket));
    socket.on('message', (msg) => onMessage(io, socket, msg))
    socket.onAny((event, ...args) => console.log(event, args));
}

const connectUser = async (io, socket) => {
    if (!checkKeyBeingUsed(socket.handshake.auth.token)) {
        socket.emit('server_message_warning', 'Server thrown a socket authentication error with the provided token')
        return;
    }

    console.log('user connected ' + socket.id)
    socket.join('global')
    connectedUsers.push({ userId: socket.handshake.auth.uuid, socket: socket })

    await models.users.update({ loggedIn: true, last_login: Date.now() }, { where: { id: socket.handshake.auth.uuid } }).then(async () => {
        await models.users.findAll().then(users => {
            io.in('global').emit('users', users)
        })
    })

}

const onDisconnect = async (socket) => {
    const socketIndex = connectedUsers.findIndex(x => x.socket.id === socket.id)
    connectedUsers.splice(socketIndex, socketIndex >= 0 ? 1 : 0)

    console.log('User disconnected ' + socket.id)

    await models.users.update({ loggedIn: false }, { where: { id: socket.handshake.auth.uuid } }).then(async () => {
        await models.users.findAll().then(users => {
            socket.broadcast.emit('users', users)
        })
    })
}

const onMessage = (io, socket, data) => {
    console.log(data)
    console.log(socket.id)
    console.log(socket.rooms)
    io.in(data.chat).emit('chat_message', data)
}

module.exports = {
    handleWS
}