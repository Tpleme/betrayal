const { models } = require('./database/index')

const handleWS = (socket) => {

    console.log('user connected ' + socket.id)

    socket.on('disconnect', () => {
        onDisconnect(socket)
    });

}

const onDisconnect = (socket) => {
    console.log('User disconnected ' + socket.id)
}

module.exports = {
    handleWS
}