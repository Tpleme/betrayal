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

module.exports = {
    getAll,
    getByID
}