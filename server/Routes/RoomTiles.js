const { models } = require('../database/index')
const { getIdParam } = require('../utils')

const getAll = async (req, res) => {
    const tiles = await models.room_tiles.findAll()
    const initialTiles = tiles.filter(tile => tile.initial > 0)
    const restTiles = tiles.filter(tile => tile.initial === 0)

    res.status(200).json({ initialTiles, restTiles })
}

const getByID = async (req, res) => {
    res.status(401).send('NO')
}

const create = async (req, res) => {
    res.status(401).send('NO')
}

const update = async (req, res) => {
}


const remove = async (req, res) => {
    res.status(401).send('NO')
}



module.exports = {
    getAll,
    getByID,
    create,
    update,
    remove,
}