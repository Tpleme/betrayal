const { models } = require('../database/index')
const { getIdParam } = require('../utils')

const getAll = async (req, res) => {
    const rooms = await models.game_rooms.findAll()
    res.status(200).json(rooms)
}

const getByID = async (req, res) => {
    const id = getIdParam(req);

    await models.game_rooms.findOne({ where: { room_id: id } }).then(room => {
        if (!room) {
            return res.status(404).send('Room not found')
        }
        res.status(200).send(room)
    })
}

const getRoomUsers = async (req, res) => {
}

// const create = async (req, res) => {
//     models.main_chats.create(req.body.data).then(() => 
//     res.status(201).send('message created'))
// }

// const update = async (req, res) => {
//     const id = getIdParam(req);

//     await models.main_chats.findOne({ where: { id: id } }).then(async message => {
//         if (message) {
//             await models.custom_chats.update({ message: req.body.message }, { where: { id: id } }).then(() => {
//                 return res.status(200).send(`Message updated`)
//             })
//         } else {
//             res.status(404).send('message not found')
//         }
//     })
// }

// const remove = async (req, res) => {
//     const id = getIdParam(req);

//     await models.main_chats.findOne({ where: { id: id } }).then(async message => {
//         if (message) {
//             await models.custom_chats.update({ deleted: true }, { where: { id: id } }).then(() => {
//                 return res.status(200).send(`Message deleted`)
//             })
//         } else {
//             res.status(404).send('Message not found')
//         }
//     })
// }

module.exports = {
    getAll,
    getByID,
}