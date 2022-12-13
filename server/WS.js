const { models } = require('./database/index')
const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcrypt')
const EventEmitter = require('./EventEmitter')
const { RateLimiterMemory } = require('rate-limiter-flexible')
const generator = require('generate-password')

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
    socket.on('character-picked', data => onCharacterPicked(socket, data))
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
            await models.player_character.destroy({ where: { userId: user.id } })

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
            socket.nsp.to(user.game_room.room_id).emit('user_connected_lobby', { user })
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
    socket.nsp.to(data.roomSocket).emit('user_connected_lobby', 'User Connected')
}

const onDisconnect = async (socket) => {

    console.log('User disconnected ' + socket.id)

    const user = await models.users.findOne({
        where: { id: socket.handshake.auth.uuid  },
        include: [models.game_rooms]
    })

    await models.users.update({ loggedIn: false, socket_id: null, connected_to_room: false }, { where: { id: user.id } }).then(async () => {
        await models.users.findAll().then(users => {
            socket.broadcast.emit('users', users)
        })
    })

    if(user.game_room) {
        socket.nsp.to(user.game_room.room_id).emit('user_disconnected_lobby', { userId: user.id }) 
    }

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
    const roomSocket = generator.generate({ length: 12, numbers: true })

    socket.leave('global')
    socket.join(roomSocket)

    if (data.password) {
        await bcrypt.hash(data.password, 10).then(async hash => {
            await models.game_rooms.create({ room_id: roomSocket, password: hash }).then(async room => {
                await models.player_character.create({ userId: data.user.id, gameRoomId: room.id })
                await models.users.update({ gameRoomId: room.id, hosting: room.id, connected_to_room: true }, { where: { id: data.user.id } }).then(() => {
                    socket.nsp.to(socket.id).emit('room-created', { roomSocket, roomId: room.id })
                })
            })
        })
    } else {
        await models.game_rooms.create({ room_id: roomSocket }).then(async room => {
            await models.player_character.create({ userId: data.user.id, gameRoomId: room.id })
            await models.users.update({ gameRoomId: room.id, hosting: room.id, connected_to_room: true }, { where: { id: data.user.id } }).then(() => {
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
    const user = await models.users.findByPk(data.userId)

    if (room) {
        if (pass) {
            await bcrypt.compare(pass, room.password).then(valid => {
                if (valid) {
                    models.users.update({ gameRoomId: room.id, connected_to_room: true }, { where: { id: userId } }).then(async () => {
                        await models.player_character.create({ userId, gameRoomId: room.id })
                        socket.leave('global')
                        socket.join(roomSocket)
                        socket.nsp.to(roomSocket).emit('user_connected_lobby', { user })
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
                models.users.update({ gameRoomId: room.id, connected_to_room: true }, { where: { id: userId } }).then(async () => {
                    await models.player_character.create({ userId, gameRoomId: room.id })
                    socket.leave('global')
                    socket.join(roomSocket)
                    socket.nsp.to(roomSocket).emit('user_connected_lobby', { user })
                    socket.emit('join-room-response', { code: 0, message: 'go to room', roomSocket, roomId: room.id });
                })
            }
        }
    } else {
        socket.emit('join-room-response', { code: 2, message: 'Game Room not found' });
    }
}

const onCharacterPicked = async (socket, data) => {
    await models.player_character.update({ characterId: data.charId }, { where: { userId: data.userId } })

    socket.nsp.to(data.roomSocket).emit('character-picked-response')

}

module.exports = {
    handleWS
}