const { v4: uuidv4 } = require('uuid')
const { models } = require('./database/index')
const bcrypt = require('bcrypt')
require('dotenv').config()

const generateKey = async (id) => {
    const key = `${id}/${uuidv4()}`;

    try {
        await models.keys.create({ key: key, userId: id })
        return key
    } catch (err) {
        console.log(err)
        return null
    }
}

const revokeKey = async (id) => {
    try {
        await models.keys.destroy({ where: { userId: id } })
    } catch (err) {
        console.log(err)
    }
}

const verifyKey = async (key, userId) => {
    
    try {
        const foundKey = await models.keys.findOne({ where: { key } })
        console.log(foundKey)
        console.log(key)
        console.log(userId)
        console.log(foundKey.userId.toString() === userId.toString())
        if (foundKey && key && userId) {
            if (foundKey.userId.toString() === userId.toString() || foundKey.userId === null) {
                return true
            } else {
                return false
            }
        } else {
            return false
        }

    } catch (err) {
        console.log(err)
        return false
    }
}

module.exports = {
    generateKey,
    revokeKey,
    verifyKey,
}