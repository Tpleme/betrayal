const { models } = require('../database/index')
const bcrypt = require('bcrypt')
const { getApiKey, addKeyToBeingUsed, checkKeyBeingUsed, popKeyBeingUsed, getIdParam } = require('../utils')

const auth = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    if (email && password) {
        await models.users.findOne({ where: { email: email } }).then(user => {
            if (!user) return res.status(404).send('User not found');

            bcrypt.compare(password, user.password).then(valid => {

                if (!valid) return res.status(401).send('Wrong Password')

                models.users.update({ last_login: Date.now(), loggedIn: true }, { where: { id: user.id } })

                const key = getApiKey(user.id)

                res.set({ 'key': key, 'email': user.email, 'user': user.name, 'id': user.id })

                addKeyToBeingUsed(key)

                res.status(200).send("Login successful")
            })
        })
    } else {
        res.status(401).send('Missing login information')
    }
}

const logoutUser = async (req, res) => {
    const id = getIdParam(req)

    await models.users.update({ loggedIn: false }, { where: { id: id } })
    popKeyBeingUsed(id)
    res.status(200).send('Logout successful')
}

module.exports = {
    auth,
    logoutUser
}