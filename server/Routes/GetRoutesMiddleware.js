const AddImageId = require('../middleware/ImageID')
const { UserImageUploader} = require('../middleware/ImageUploader')
const { StandardLimiter } = require('../middleware/rateLimiter')
const { Auth } = require('../middleware/EndpointAuth')
const cors = require('cors')

const getRouteMiddleware = (routeName) => {
    switch (routeName) {
        case 'users': return [cors(), StandardLimiter, Auth];
        case 'gameRoom': return [cors(), StandardLimiter, Auth];
        case 'roomTiles': return [cors(), StandardLimiter, Auth];
        case 'characters': return [cors(), StandardLimiter, Auth];
        default: return [cors(), StandardLimiter, Auth];
    }
}

const postRouteMiddleware = (routeName) => {
    switch (routeName) {
        case 'user': return [cors(), StandardLimiter, Auth, AddImageId];
        case 'gameRoom': return [cors(), StandardLimiter, Auth];
        case 'roomTiles': return [cors(), StandardLimiter, Auth, AddImageId];
        case 'characters': return [cors(), StandardLimiter, Auth, AddImageId];
        default: return [cors(), StandardLimiter, Auth];
    }
}

const putRouteMiddleware = (routeName) => {
    switch (routeName) {
        case 'users': return [cors(), StandardLimiter, Auth];
        case 'gameRoom': return [cors(), StandardLimiter, Auth];
        case 'roomTiles': return [cors(), StandardLimiter, Auth];
        case 'characters': return [cors(), StandardLimiter, Auth];
        default: return [cors(), StandardLimiter, Auth];
    }
}

const deleteRouteMiddleware = (routeName) => {
    switch (routeName) {
        case 'users': return [cors(), StandardLimiter, Auth];
        case 'gameRoom': return [cors(), StandardLimiter, Auth];
        case 'roomTiles': return [cors(), StandardLimiter, Auth];
        case 'characters': return [cors(), StandardLimiter, Auth];
        default: return [cors(), StandardLimiter, Auth];
    }
}

module.exports = {
    getRouteMiddleware,
    postRouteMiddleware,
    putRouteMiddleware,
    deleteRouteMiddleware
}