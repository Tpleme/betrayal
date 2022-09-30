const { models } = require('../database/index')
const { getIdParam } = require('../utils')
const bcrypt = require('bcrypt')

const getAll = async (req, res) => {
    await models.users.findAll({
        attributes: { exclude: ['password', 'password_recovery_key'] }
    }).then((users) => {
        res.status(200).json(users)
    })
}

const getByID = async (req, res) => {
    const id = getIdParam(req);

    await models.users.findOne({
        where: { id: id },
        attributes: { exclude: ['password', ['password_recovery_key']] }
    }).then(user => {
        if (!user) {
            return res.status(404).send('User not found')
        }
        res.status(200).send(user)
    })
}

const create = async (req, res) => {

    try {
        await models.users.findOne({ where: { email: req.body.email } }).then(user => {
            if (user) return res.status(401).send('User already exists')
        })

        await bcrypt.hash(req.body.password, 10).then(hash => {
            models.users.create({
                email: req.body.email,
                password: hash
            })
        })

        return res.status(201).send(`User, ${req.body.email}, successfully created`)

    } catch (err) {
        console.log(err)
        res.status(500).send('Error: ' + err)
    }
}

const update = async (req, res) => {
    const id = getIdParam(req)

    try {
        const user = await models.users.findOne({ where: { id: id } })

        if (!user) throw 'User does not exists'

        if (req.body.password === undefined || req.body.password === '') throw 'Must provide password'

        const modifyBody = async () => {
            delete req.body.password
        }

        await modifyBody();
        await models.users.update(req.body, { where: { id: id } })

        return res.status(200).send(`User was updated successfully`)

    } catch (err) {
        console.log(err)
        res.status(500).send('Error: ' + err)
    }
}

const remove = async (req, res) => {
    const id = getIdParam(req);

    try {

        await models.users.findByPk(id).then(user => {
            if (!user) throw 'User does not exists'
        })

        await models.user.destroy({ where: { id: id } })

        return res.status(200).send('User removed successfully')

    } catch (err) {
        console.log(err)
        res.status(500).send('Error: ' + err)
    }
}

module.exports = {
    getAll,
    getByID,
    create,
    update,
    remove,
}