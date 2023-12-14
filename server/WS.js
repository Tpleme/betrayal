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

EventEmitter.on('invite-players', (players, room, hostingUser) => {
    const playersSocket = players.map(player => player.socket_id)
    global_io.to(playersSocket).emit('game-invite', { room, hostingUser });
})

const handleWS = (socket, io) => {
    global_io = io
    connectUser(io, socket)

    socket.on('disconnect', () => onDisconnect(socket));
    socket.on('message', (msg) => onMessage(socket, msg))
    socket.on('lobbyMessage', (msg) => onLobbyMessage(socket, msg))
    socket.on('create-room', (data) => createRoom(socket, data))
    socket.on('join-room', (data) => joinRoom(socket, data))
    socket.on('leave-room', data => leaveRoom(socket, data))
    socket.on('check-auto-connect', data => checkAutoConnect(socket, data))
    socket.on('auto-connect', data => autoConnect(socket, data))
    socket.on('character-picked', data => onCharacterPicked(socket, data))
    socket.on('player-ready', data => onPlayerReady(socket, data))
    socket.on('kick-player', data => onKickPlayer(io, socket, data))
    socket.on('start-game', data => onStartGame(io, socket, data))
    socket.on('change-host', data => onChangeHost(socket, data))

    socket.on('spawn_tile', data => onSpawnTile(io, socket, data))
    socket.on('move_player', data => onPlayerMove(io, socket, data))
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
            socket.emit('leave-room-response', { roomSocket })

            if (roomId === userHostingRoom) {
                await models.users.findAll({ where: { gameRoomId: roomId } }).then(async users => {
                    await models.users.update({ hosting: null }, { where: { id: user.id } })
                    if (users.length > 0) {
                        await models.users.update({ hosting: roomId }, { where: { id: users[0].id } }).then(el => {
                            socket.nsp.to(el.socket_id).emit('hosting-now', { roomId: roomId })
                        })
                    } else {
                        await models.game_rooms.destroy({ where: { id: roomId } })
                    }
                })
            }
            socket.nsp.to(roomSocket).emit('user_disconnected_lobby', { userId: user.id })
            socket.leave(roomSocket)

            data.wasKicked ?
                onLobbyMessage(socket, { chat: roomSocket, type: 'system', message: `${user.name} was kicked from the game`, createdAt: new Date() })
                :
                onLobbyMessage(socket, { chat: roomSocket, type: 'system', message: `${user.name} left lobby`, createdAt: new Date() })

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

            onLobbyMessage(socket, { chat: user.game_room.room_id, type: 'system', message: `${user.name} connected to lobby`, createdAt: new Date() })
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

    const user = await models.users.findByPk(data.userId)

    await models.users.update({ connected_to_room: true }, { where: { id: data.userId } });

    socket.emit('auto-connect-response', data)
    socket.nsp.to(data.roomSocket).emit('user_connected_lobby', 'User Connected')
    onLobbyMessage(socket, { chat: data.roomSocket, type: 'system', message: `${user.name} connected to lobby`, createdAt: new Date() })

}

const onDisconnect = async (socket) => {

    console.log('User disconnected ' + socket.id)

    const user = await models.users.findOne({
        where: { id: socket.handshake.auth.uuid },
        include: [models.game_rooms]
    })


    await models.users.update({ loggedIn: false, socket_id: null, connected_to_room: false }, { where: { id: user.id } }).then(async () => {
        await models.users.findAll().then(users => {
            socket.broadcast.emit('users', users)
        })
    })

    if (user.game_room) {
        //TODO: alterar o host se o atual host for disconnected
        // if (user.game_room?.id === user.hosting) {
        //     await models.users.findAll({ where: { gameRoomId: user.game_room.id } }).then(async users => {
        //         if (users.length > 1) {
        //             await models.users.update({ hosting: null }, { where: { id: user.id } })
        //             await models.users.update({ hosting: user.game_room.id }, { where: { id: users[1].id } }).then(el => {
        //                 socket.nsp.to(el.socket_id).emit('hosting_now', { roomId: user.game_room.id })
        //             })
        //         }
        //     })
        // }

        socket.nsp.to(user.game_room.room_id).emit('user_disconnected_lobby', { userId: user.id })
        onLobbyMessage(socket, { chat: user.game_room.room_id, type: 'system', message: `${user.name} disconnected`, createdAt: new Date() })
    }

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

const onLobbyMessage = async (socket, data) => {

    try {
        await rateLimiter.consume(data.user_id);
        socket.nsp.to(data.chat).emit('looby_chat_message', data)
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

    const room = await models.game_rooms.findOne({ where: { room_id: roomSocket }, include: [models.users] })
    const user = await models.users.findByPk(data.userId)

    if (room) {
        if (room.users.length >= room.max_players) {
            socket.emit('join-room-response', { code: 2, message: 'Game Room is full' });
            return;
        }
        if (pass) {
            await bcrypt.compare(pass, room.password).then(valid => {
                if (valid) {
                    models.users.update({ gameRoomId: room.id, connected_to_room: true }, { where: { id: userId } }).then(async () => {
                        await models.player_character.create({ userId, gameRoomId: room.id })
                        socket.leave('global')
                        socket.join(roomSocket)
                        socket.nsp.to(roomSocket).emit('user_connected_lobby', { user })
                        onLobbyMessage(socket, { chat: roomSocket, type: 'system', message: `${user.name} just connected to lobby`, createdAt: new Date() })
                        socket.emit('join-room-response', { code: 0, message: 'go to room', roomSocket, roomId: room.id });
                    })
                } else {
                    socket.emit('join-room-response', { code: 3, message: 'Incorrect password' });
                }
            })
        } else {
            if (room.password) {
                if (data.invited) {
                    models.users.update({ gameRoomId: room.id, connected_to_room: true }, { where: { id: userId } }).then(async () => {
                        await models.player_character.create({ userId, gameRoomId: room.id })
                        socket.leave('global')
                        socket.join(roomSocket)
                        socket.nsp.to(roomSocket).emit('user_connected_lobby', { user })
                        onLobbyMessage(socket, { chat: roomSocket, type: 'system', message: `${user.name} just connected to lobby`, createdAt: new Date() })
                        socket.emit('join-room-response', { code: 0, message: 'go to room', roomSocket, roomId: room.id });
                    })
                } else {
                    socket.emit('join-room-response', { code: 1, message: 'password required', roomId: roomSocket });
                    return
                }
            } else {
                models.users.update({ gameRoomId: room.id, connected_to_room: true }, { where: { id: userId } }).then(async () => {
                    await models.player_character.create({ userId, gameRoomId: room.id })
                    socket.leave('global')
                    socket.join(roomSocket)
                    socket.nsp.to(roomSocket).emit('user_connected_lobby', { user })
                    onLobbyMessage(socket, { chat: roomSocket, type: 'system', message: `${user.name} just connected to lobby`, createdAt: new Date() })
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

const onPlayerReady = async (socket, data) => {
    await models.player_character.update({ ready: data.ready }, { where: { userId: data.userId } })
    socket.nsp.to(data.roomSocket).emit('player-ready-response')
}

const onKickPlayer = async (io, socket, data) => {

    const requestingUser = await models.users.findByPk(data.myId)
    const user = await models.users.findByPk(data.userId)

    if (requestingUser.hosting === data.room.roomId) {
        if (user.socket_id) {
            socket.nsp.to(user.socket_id).emit('kicked')
        } else {
            await models.users.update({ gameRoomId: null }, { where: { id: user.id } })
            await models.player_character.destroy({ where: { userId: user.id } })
            socket.nsp.to(data.room.roomSocket).emit('user_disconnected_lobby', { userId: user.id })
        }
    }
}

const onChangeHost = async (socket, data) => {

    await models.users.update({ hosting: null }, { where: { id: data.currentHostId } })
    await models.users.update({ hosting: data.room.id }, { where: { id: data.newHostId } })

    onLobbyMessage(socket, { chat: data.room.socket, type: 'system', message: `${data.newHostName} is now the host`, createdAt: new Date() })
    socket.nsp.to(data.room.socket).emit('hosting-now')
}

const onStartGame = async (io, socket, data) => {
    //shuffle player to set the turn order
    const shuffledPlayersArray = [...data.players]

    for (let i = shuffledPlayersArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledPlayersArray[i], shuffledPlayersArray[j]] = [shuffledPlayersArray[j], shuffledPlayersArray[i]];
    }

    socket.nsp.to(data.roomSocket).emit('start-game-response', { players: data.players, turnOrder: shuffledPlayersArray })
}

const onSpawnTile = async (io, socket, data) => {
    socket.to(data.roomSocket).emit('on_tile_spawn', data)
}

const onPlayerMove = async (io, socket, data) => {
    //save new player position on database
    models.player_character.update({ position: JSON.stringify(data.player.position) }, { where: { id: data.player.id } })

    socket.to(data.roomSocket).emit('on_player_move', data)
}

module.exports = {
    handleWS
}