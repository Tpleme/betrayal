const { models } = require('../database/index')
const { getIdParam } = require('../utils')

const getAll = async (req, res) => {
    const rooms = await models.game_rooms.findAll()
    res.status(200).json(rooms)
}

const getByID = async (req, res) => {
    const id = getIdParam(req);

    await models.game_rooms.findOne({ where: { id: id } }).then(room => {
        if (!room) {
            return res.status(404).send('Room not found')
        }
        res.status(200).send(room)
    })
}

const create = async (req, res) => {
    res.status(401).send('NO')
}

const update = async (req, res) => {
    res.status(201).send('OK')
}

const remove = async (req, res) => {
    res.status(401).send('NO')
}

module.exports = {
    getAll,
    getByID,
    create,
    update,
    remove
}