const { models } = require('../database/index')
const { getIdParam } = require('../utils')


const getAll = async (req, res) => {
    const characters = await models.characters.findAll()
    res.status(200).json(characters)
}

const getByID = async (req, res) => {
    const id = getIdParam(req);

    await models.characters.findByPk(id).then(character => {
        if (!character) {
            return res.status(404).send('Character not found')
        }
        res.status(200).send(character)
    })
}

const create = async (req, res) => {
    res.status(401).send('NO')
}

const update = async (req, res) => {
    res.status(401).send('NO')
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