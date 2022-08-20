const { verifyKey } = require('../keyManager')

const Auth = (req, res, next) => {

    if (req.headers['key']) {
        try {
            const auth = req.headers['key'];
            const requestingUser = req.headers['requestinguser']
            console.log(req.headers)

            if (!verifyKey(auth, requestingUser)) {
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

module.exports = {
    Auth,
}