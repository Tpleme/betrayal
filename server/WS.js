const { models } = require('./database/index')

const handleWS = (socket, io) => {
    connectUser(io, socket)

    socket.on('disconnect', () => onDisconnect(socket));
    socket.on('message', (msg) => onMessage(io, socket, msg))
    socket.onAny((event, ...args) => console.log(event, args));
}

const connectUser = async (io, socket) => {

    // const verifyUser = await verifyKey(socket.handshake.auth.token, socket.handshake.auth.uuid);
    // if (!verifyUser) {
    //     socket.emit('server_message_warning', 'Server thrown a socket authentication error with the provided token')
    //     return;
    // }

    //Because refreshing a page closes the socket and by closing the socket it logs out the user 
    //removing the key from the database so we need to add the key again if non existent
    await models.keys.findOrCreate({
        where: { key: socket.handshake.auth.token, userId: socket.handshake.auth.uuid },
    })

    console.log('user connected ' + socket.id)
    socket.join('global')

    await models.users.update({ loggedIn: true, last_login: Date.now() }, { where: { id: socket.handshake.auth.uuid } }).then(async () => {
        await models.users.findAll().then(users => {
            io.in('global').emit('users', users)
        })
    })

}

const onDisconnect = async (socket) => {

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