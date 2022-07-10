const { models } = require('./database/index')
const { checkKeyBeingUsed } = require('./utils')

const connectedUsers = []

const handleWS = (socket, io) => {
    connectUser(socket)

    socket.on('disconnect', () => onDisconnect(socket));
    socket.on('message', () => onMessage(socket))
    socket.onAny((event, ...args) => console.log(event, args));
}

const connectUser = async (socket) => {
    if (!checkKeyBeingUsed(socket.handshake.auth.token)) {
        socket.emit('server_message_warning', 'Server thrown a socket authentication error with the provided token')
        return;
    }

    console.log('user connected ' + socket.id)
    connectedUsers.push({ userId: socket.handshake.auth.uuid, socket: socket })

    await models.users.update({ loggedIn: true, last_login: Date.now() }, { where: { id: socket.handshake.auth.uuid } })
    socket.broadcast.emit('user_logged', `${socket.handshake.auth.name} acabou de entrar na aplicação`)

}

const onDisconnect = async (socket) => {
    connectedUsers.filter(user => user.socket.id !== socket.id)

    
    console.log('User disconnected ' + socket.id)
    
    await models.users.update({ loggedIn: false }, { where: { id: socket.handshake.auth.uuid } })
}

const onMessage = (io, socket, msg) => {
    console.log(msg)
    console.log(socket.id)
    // io.to(socket.id).emit('message', 'hello client') para mandar mensagem para um socket especifico
    //socket.emit('message', 'hello client') para enviar mensagem para o socket
}

module.exports = {
    handleWS
}