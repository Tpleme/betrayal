const { checkKeyBeingUsed } = require('../utils')

const BOendPointAuth = (req, res, next) => {
    console.log(req.headers)
    if (req.headers['key']) {
        try {
            let auth = req.headers['key'];
            if (!checkKeyBeingUsed(auth)) {
                return res.status(401).send("Wrong authorization credentials")
            } else {
                next(null, true)
            }
        } catch (err) {
            next('Internal Error: ' + err, false)
        }
    } else {
        return res.status(401).send('Unauthorized Request');
    }
}

const FOendPointAuth = (req, res, next) => {
    if (req.headers['key']) {
        try {
            let auth = req.headers['key'];
            if (checkKeyBeingUsed(auth) || auth === process.env.API_KEY_FO) {
                next(null, true)
            } else {
                return res.status(401).send("Wrong authorization credentials")
            }
        } catch (err) {
            next('Internal Error: ' + err, false)
        }
    } else {
        return res.status(401).send('Unauthorized Request');
    }
}

module.exports = {
    BOendPointAuth,
    FOendPointAuth
}