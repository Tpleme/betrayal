const { models } = require('../database/index')
const generator = require('generate-password')

const getModelsImageId = async (modelName, id) => {
    if (!id) return null
    return await models[modelName].findByPk(id)
}

const generateRandomId = () => {
    return generator.generate({ length: 12, numbers: true })
}

const AddImageId = async (req, res, next) => {
    const route = req.route.path.split('/')[2]
    const model = await getModelsImageId(route, req.params.id)
    if (model === null) {
        res.locals.image_id = generateRandomId()
    } else {
        res.locals.image_id = model.image_id
    }
    next()
}

module.exports = AddImageId