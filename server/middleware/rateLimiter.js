const { rateLimit } = require('express-rate-limit')

const LoginLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 4,
    message: 'Too many login requests in a short period of time, you can try again in 5 minutes',
    headers: true,
    keyGenerator: (req, res) => {
        return req.clientIp
    }
})

const StandardLimiter = rateLimit({
    windowMs: 30 * 1000,
    max: 100,
    message:'To many requests in a short period of time',
    keyGenerator: (req, res) => {
        return req.clientIp
    }
})

module.exports = {
    LoginLimiter,
    StandardLimiter
}