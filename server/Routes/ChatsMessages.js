const { models } = require('../database/index')
const { getIdParam } = require('../utils')


const getAll = async (req, res) => {
    const messages = await models.main_chats.findAll({ where: { chat: req.params.chat } })
    res.status(200).json(messages)
}

const getByID = async (req, res) => {
    const id = getIdParam(req);

    await models.main_chats.findOne({ where: { id: id } }).then(message => {
        if (!message) {
            return res.status(404).send('message not found')
        }
        res.status(200).send(message)
    })
}

const create = async (req, res) => {
    models.main_chats.create(req.body.data).then(() => 
    res.status(201).send('message created'))
}

const update = async (req, res) => {
    const id = getIdParam(req);

    await models.main_chats.findOne({ where: { id: id } }).then(async message => {
        if (message) {
            await models.custom_chats.update({ message: req.body.message }, { where: { id: id } }).then(() => {
                return res.status(200).send(`Message updated`)
            })
        } else {
            res.status(404).send('message not found')
        }
    })
}

const remove = async (req, res) => {
    const id = getIdParam(req);

    await models.main_chats.findOne({ where: { id: id } }).then(async message => {
        if (message) {
            await models.custom_chats.update({ deleted: true }, { where: { id: id } }).then(() => {
                return res.status(200).send(`Message deleted`)
            })
        } else {
            res.status(404).send('Message not found')
        }
    })
}

module.exports = {
    getAll,
    getByID,
    create,
    update,
    remove
}