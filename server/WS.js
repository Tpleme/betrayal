const { models } = require('./database/index')
const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcrypt')
const EventEmitter = require('./EventEmitter')
const { RateLimiterMemory } = require('rate-limiter-flexible')

let global_io;


const rateLimiter = new RateLimiterMemory(
    {
        points: 8, // requests
        duration: 10, // per second
        blockDuration: 30
    });

const handleWS = (socket, io) => {
    global_io = io
    connectUser(io, socket)

    socket.on('disconnect', () => onDisconnect(socket));
    socket.on('message', (msg) => onMessage(socket, msg))
    socket.on('create-room', (data) => createRoom(socket, data))
    socket.on('join-room', (data) => joinRoom(socket, data))
    socket.on('leave-room', data => leaveRoom(socket, data))
    socket.on('check-auto-connect', data => checkAutoConnect(socket, data))
    socket.on('auto-connect', data => autoConnect(socket, data))
    // socket.onAny((event, ...args) => console.log(event, args));
}

const removeUserFromRoom = async (socket, data) => {
    const user = await models.users.findOne({
        where: { id: data.userId },
        include: [models.game_rooms]
    })

    if (!user.connected_to_room) {
        //removes user from room and if he is the hosting, the next user becomes de host, if no users left remove room
        if (user.game_room) {

            const roomId = user.gameRoomId
            const userHostingRoom = user.hosting
            const roomSocket = user.game_room.room_id

            await models.users.update({ gameRoomId: null }, { where: { id: user.id } })

            if (roomId === userHostingRoom) {
                await models.users.findAll({ where: { gameRoomId: roomId } }).then(async users => {
                    await models.users.update({ hosting: null }, { where: { id: user.id } })
                    if (users.length > 0) {
                        await models.users.update({ hosting: roomId }, { where: { id: users[0].id } }).then(el => {
                            socket.nsp.to(el.socket_id).emit('hosting_now', { roomId: roomId })
                        })
                    } else {
                        await models.game_rooms.destroy({ where: { id: roomId } })
                    }
                })
            }

            socket.nsp.to(roomSocket).emit('user_disconnected_lobby', { userId: user.id })
            socket.leave(roomSocket)
        }
    }
    socket.join('global')
}

const leaveRoom = async (socket, data) => {
    await models.users.update({ connected_to_room: false }, { where: { id: data.userId } });
    await removeUserFromRoom(socket, data)
}

const connectUser = async (io, socket) => {
    const userRoom = socket.handshake.auth.room

    await models.keys.findOrCreate({
        where: { key: socket.handshake.auth.token, userId: socket.handshake.auth.uuid },
    })

    const user = await models.users.findOne({
        where: { id: socket.handshake.auth.uuid },
        include: [models.game_rooms]
    })

    if (user.game_room) {
        if (userRoom) {
            await models.users.update({ connected_to_room: true }, { where: { id: user.id } });
            socket.join(user.game_room.room_id);
            socket.leave('global')
        }
    } else {
        socket.join('global')
    }

    console.log('user connected ' + socket.id)

    await models.users.update({ loggedIn: true, last_login: Date.now(), socket_id: socket.id }, { where: { id: socket.handshake.auth.uuid } }).then(async () => {
        await models.users.findAll().then(users => {
            io.in('global').emit('users', users)
        })
    })
}

const checkAutoConnect = async (socket, data) => {

    const user = await models.users.findOne({
        where: { id: data.userId },
        include: [models.game_rooms]
    })

    if (user.game_room) {
        socket.join('global')
        socket.emit('auto-connect-room', { roomSocket: user.game_room.room_id, roomId: user.game_room.id })
    }
}

const autoConnect = async (socket, data) => {
    socket.join(data.roomSocket)
    socket.leave('global')
    await models.users.update({ connected_to_room: true }, { where: { id: data.userId } });
    socket.emit('auto-connect-response', data)
}

const onDisconnect = async (socket) => {

    console.log('User disconnected ' + socket.id)

    await models.users.update({ loggedIn: false, socket_id: null, connected_to_room: false }, { where: { id: socket.handshake.auth.uuid } }).then(async () => {
        await models.users.findAll().then(users => {
            socket.broadcast.emit('users', users)
        })
    })

    // //Só faz disconnect ao user passados 10 segundos, pois entretanto pode ter-se re-conectado (refresh)
    // setTimeout(() => {
    //     removeUserFromRoom(socket, { userId: socket.handshake.auth.uuid })
    // }, 10000);

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
    const roomSocket = uuidv4();

    socket.leave('global')
    socket.join(roomSocket)

    if (data.password) {
        await bcrypt.hash(data.password, 10).then(hash => {
            models.game_rooms.create({ room_id: roomSocket, password: hash }).then(room => {
                models.users.update({ gameRoomId: room.id, hosting: room.id, connected_to_room: true }, { where: { id: data.user.id } }).then(() => {
                    socket.nsp.to(socket.id).emit('room-created', { roomSocket, roomId: room.id })
                })
            })
        })
    } else {
        models.game_rooms.create({ room_id: roomSocket }).then(room => {
            models.users.update({ gameRoomId: room.id, hosting: room.id, connected_to_room: true }, { where: { id: data.user.id } }).then(() => {
                socket.nsp.to(socket.id).emit('room-created', { roomSocket, roomId: room.id })
            })
        })
    }
}

const joinRoom = async (socket, data) => {
    const roomSocket = data.roomId
    const userId = data.userId
    const pass = data.password

    const room = await models.game_rooms.findOne({ where: { room_id: roomSocket } })

    if (room) {
        if (pass) {
            await bcrypt.compare(pass, room.password).then(valid => {
                if (valid) {
                    models.users.update({ gameRoomId: room.id, connected_to_room: true }, { where: { id: userId } }).then(() => {
                        socket.leave('global')
                        socket.join(roomSocket)
                        socket.nsp.to(roomSocket).emit('user_connected_lobby', { userId })
                        socket.emit('join-room-response', { code: 0, message: 'go to room', roomSocket, roomId: room.id });
                    })
                } else {
                    socket.emit('join-room-response', { code: 3, message: 'Incorrect password' });
                }
            })
        } else {
            if (room.password) {
                socket.emit('join-room-response', { code: 1, message: 'password required', roomId: roomSocket });
                return
            } else {
                models.users.update({ gameRoomId: room.id, connected_to_room: true }, { where: { id: userId } }).then(() => {
                    socket.leave('global')
                    socket.join(roomSocket)
                    socket.nsp.to(roomSocket).emit('user_connected_lobby', { userId })
                    socket.emit('join-room-response', { code: 0, message: 'go to room', roomSocket, roomId: room.id });
                })
            }
        }
    } else {
        socket.emit('join-room-response', { code: 2, message: 'Game Room not found' });
    }
}

module.exports = {
    handleWS
}