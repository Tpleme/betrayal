const { models } = require('../database/index')
const { getIdParam } = require('../utils')
const bcrypt = require('bcrypt')
const { promisify } = require('util')
const path = require('path')
const fs = require('fs')
const imageDir = path.join(__dirname, "../resources/images/users");

const unlinkAsync = promisify(fs.unlink);
const renameAsync = promisify(fs.rename)

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

const getByIDAndSecret = async (req, res) => {
    const id = getIdParam(req);

    if (!id || !req.params.secret) return res.status(400).send('Malformed request')

    const user = await models.users.findByPk(id);

    if (user) {
        if (user.pass_recovery_key === req.params.secret) {
            return res.status(200).json('ok')
        }
        return res.status(401).send('Non authorized')
    } else {
        res.status(401).send('User does not exists')
    }
}

const create = async (req, res) => {

    try {
        await models.users.findOne({ where: { email: req.body.email } }).then(user => {
            if (user) return res.status(401).send('User already exists')
        })

        await bcrypt.hash(req.body.password, 10).then(hash => {
            models.users.create({
                email: req.body.email,
                password: hash,
                image_id: res.locals.image_id,
            })
        })

        return res.status(201).send(`User, ${req.body.email}, successfully created`)

    } catch (err) {
        console.log(err)
        res.status(500).send('Error: ' + err)
    }
}

const update = async (req, res) => {
    const id = getIdParam(req);
    const authPassword = req.body.authPassword;
    const requestingUserID = req.headers['requesting-user']

    if (requestingUserID.toString() !== id.toString()) return res.status(401).send('You can only update your own profile')

    if (Object.keys(req.body).length === 0) return res.status(400).send('Malformed request')

    try {
        const user = await models.users.findOne({ where: { id: id } })

        if (!user) throw 'User does not exists'

        if (req.body.authPassword === undefined || req.body.authPassword === '') throw { code: 401, message: 'Missing password' }


        await bcrypt.compare(authPassword, user.password).then(async valid => {
            if (valid) {        
                await models.users.update(req.body, { where: { id: id } })
                res.status(200).send(`Your info was updated`)
            } else {
                res.status(401).send(`Incorrect credentials`)
            }
        })
        

    } catch (err) {
        console.log(`Error: ${err.message ? err.message : err}`);
        err.code ? res.status(err.code).send(err.message) : res.status(500).send('Error: ' + err)
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

const addPicture = async (req, res) => {
    const id = getIdParam(req)

    try {
        const user = await models.users.findByPk(id)

        if (!user) throw { code: 400, message: 'User does not exists' }

        if (req.files === undefined || Object.keys(req.files).length === 0) {
            throw { code: 400, message: 'Missing image' }
        }

        //restrict file size
        if (req.files.picture[0].size > 1048576) throw `${req.files.picture[0].originalname} is larger than 1MB`

        await models.users.update({
            picture: req.files.picture[0].filename
        }, { where: { id: id } })

        renameAsync(req.files.picture[0].path, path.join(imageDir, req.files.picture[0].filename), err => {
            if (err) throw err
        })

        res.status(201).send({
            message: `Picture successfully changed`,
            picture: req.files.picture[0].filename
        })

    } catch (err) {
        console.log(`Error: ${err.message ? err.message : err}`);

        if (req.files && Object.keys(req.files).length > 0) {
            unlinkAsync(req.files.picture[0].path, err => {
                if (err) console.log(`Unable to remove file ${req.file.picture[0]}`, err)
            })
        }

        err.code ? res.status(err.code).send(err.message) : res.status(500).send('Error: ' + err)
    }

}

const removePicture = async (req, res) => {
    const id = getIdParam(req);

    try {

        const user = await models.users.findByPk(id);
        if (!user) throw { code: 404, message: 'User does not exists' }

        fs.readdir(imageDir, (err, files) => {
            if (err) console.log('Cannot find files in ' + imageDir)

            files.forEach(file => {
                if (file.includes(`${user.image_id}`)) {
                    unlinkAsync(path.join(imageDir, file), err => {
                        if (err) console.log('Unable to remove file: ' + file)
                    })
                }
            })
        })

        await models.users.update({ picture: null }, { where: { id: id } })

        res.status(201).send(`Picture successfully removed`)


    } catch (err) {
        console.log(`Error: ${err.message ? err.message : err}`);
        err.code ? res.status(err.code).send(err.message) : res.status(500).send('Error: ' + err)
    }
}

const changePassword = async (req, res) => {
    const id = getIdParam(req);
    const requestingUserID = req.headers['requesting-user']

    if (requestingUserID.toString() !== id.toString()) return res.status(401).send('Unauthorized')

    try {
        if (!req.body.authPassword || !req.body.newPassword) throw { code: 400, message: 'Missing password' }
        if (req.body.authPassword === req.body.newPassword) throw { code: 400, message: 'New password cannot be the same as old the one' }

        const user = await models.users.findByPk(id);

        if (!user) return res.status(404).send('User does not exists')

        await bcrypt.compare(req.body.authPassword, user.password).then(valid => {
            if (!valid) throw { code: 401, message: 'Incorrect credentials' }
        })

        await bcrypt.hash(req.body.newPassword, 10).then(async hash => {
            await models.users.update({ password: hash }, { where: { id: id } })
            return res.status(201).send('Password successfully changed')
        })

    } catch (err) {
        console.log(`Error: ${err.message ? err.message : err}`);
        err.code ? res.status(err.code).send(err.message) : res.status(500).send('Error: ' + err)
    }
}

const requestPassReset = async (req, res) => {
    const email = req.body.email;

    const secretKey = generator.generate({
        length: 24,
        numbers: true,
        strict: true
    })

    try {
        if (!email) return res.status(400).send('Missing email')

        await models.users.findOne({ where: { email: email } }).then(user => {
            if (!user) return res.status(404).send('User does not exists')

            models.users.update({ pass_recovery_key: secretKey }, { where: { email: email } }).then(async () => {
                // await foRequestPassResetEmail({ email, userName: user.name, id: user.id, secretKey });
                return res.status(200).send('We just sent an email with the instructions on how to reset your password')
            })
        })

    } catch (err) {
        console.log(err)
        res.status(500).send(err)
    }
}

const resetPassword = async (req, res) => {
    const id = req.body.id;
    const password = req.body.password;
    const secret = req.body.secret

    try {
        if (id && password && req.body.secure && secret) {
            await models.users.findByPk(id).then(async user => {
                if (user) {
                    if (secret == user.pass_recovery_key) {
                        bcrypt.hash(password, 10).then(hash => {
                            models.app_users.update({ password: hash, pass_recovery_key: null }, { where: { id: id } })
                        })
                        // await foConfirmPassResetEmail({ email: user.email, name: user.name })
                        return res.status(201).send('Password successfully changed')
                    } else {
                        models.app_users.update({ pass_recovery_key: null }, { where: { id: id } })
                        return res.status(400).send('Error: not a valid secret')
                    }
                } else {
                    return res.status(404).send(responses.NO_USER[req.headers.lang])
                }
            })
        } else {
            return res.status(400).send('Not enough info provided, please try again')
        }
    } catch (err) {
        console.log(err)
        res.status(500).send(err)
    }
}


module.exports = {
    getAll,
    getByID,
    create,
    update,
    remove,
    addPicture,
    removePicture,
    requestPassReset,
    resetPassword,
    changePassword,
    getByIDAndSecret
}