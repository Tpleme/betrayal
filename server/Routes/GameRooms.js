const { models } = require('../database/index')
const { getIdParam } = require('../utils')
const bcrypt = require('bcrypt')
const EventEmitter = require('../EventEmitter')

const getAll = async (req, res) => {
    const rooms = await models.game_rooms.findAll()
    res.status(200).json(rooms)
}

const getByID = async (req, res) => {
    const id = getIdParam(req);

    const room = await models.game_rooms.findOne({ where: { id: id } })
    if (room) {
        const password = room.dataValues.password;

        if (password) {
            delete room.dataValues.password
            return res.status(200).json({ ...room.dataValues, password: true })
        }
        delete room.dataValues.password
        return res.status(200).send({ ...room.dataValues, password: false })
    }
    return res.status(404).send('Room not found')
}

const create = async (req, res) => {
    res.status(401).send('NO')
}

const update = async (req, res) => {
    const id = getIdParam(req);
    const userId = req.headers['requesting-user']

    if (req.body.password) {
        const room = await models.game_rooms.findByPk(id)
        if (room.password) {
            bcrypt.compare(req.body.authPass, room.password).then(async valid => {
                if (!valid) {
                    return res.status(401).send('Non Authorized')
                }
            })
        }
    }

    const hostingUser = await models.users.findByPk(userId)

    if (!hostingUser || parseInt(hostingUser.hosting) !== id) {
        return res.status(401).send('Non Authorized')
    }

    await models.game_rooms.update(req.body, { where: { id } }).then(() => {
        res.status(200).send('Room changed')
    })
}

const changeRoomPassword = async (req, res) => {
    const id = getIdParam(req);
    const userId = req.headers['requesting-user']

    const hostingUser = await models.users.findByPk(userId)

    try {
        if (!hostingUser || parseInt(hostingUser.hosting) !== id) {
            return res.status(401).send('Non Authorized')
        }

        const room = await models.game_rooms.findByPk(id)
        if (room.password) {
            await bcrypt.compare(req.body.authPass, room.password).then(async valid => {
                if (!valid) {
                    throw { code: 401, message: 'Incorrect password' }
                }
            })
        }

        if (req.body.password) {
            await bcrypt.hash(req.body.password, 10).then(async hash => {
                await models.game_rooms.update({ password: hash }, { where: { id: id } })
                if (room.password) {
                    res.status(201).send('Password changed successfully')
                } else {
                    res.status(201).send('Password created successfully')
                }
            })
        } else {
            await models.game_rooms.update({ password: null }, { where: { id: id } })
            res.status(201).send('Password removed successfully')
        }
    } catch (err) {
        console.log(`Error: ${err.message ? err.message : err}`);
        err.code ? res.status(err.code).send(err.message) : res.status(500).send('Error: ' + err)
    }
}

const remove = async (req, res) => {
    res.status(401).send('NO')
}

const invitePlayers = async (req, res) => {
    const players = req.body.players
    const room = req.body.room
    const playersArray = []

    const userId = req.headers['requesting-user']

    const hostingUser = await models.users.findByPk(userId)

    try {
        if (!hostingUser || parseInt(hostingUser.hosting) !== room.id) {
            return res.status(401).send('Non Authorized')
        }

        if (!players || players.length === 0) {
            throw { code: 401, message: 'No players selected' }
        }

        for (let i = 0; i < players.length; i++) {
            const player = players[i];
            await models.users.findByPk(player.id).then(user => {
                if (user.socket_id) {
                    playersArray.push(user)
                }
            })
        }

        EventEmitter.emit('invite-players', playersArray, room, hostingUser.name)
        res.status(201).send('Invites sent')

    } catch (err) {
        console.log(`Error: ${err.message ? err.message : err}`);
        err.code ? res.status(err.code).send(err.message) : res.status(500).send('Error: ' + err)
    }
}

module.exports = {
    getAll,
    getByID,
    create,
    update,
    remove,
    changeRoomPassword,
    invitePlayers
}