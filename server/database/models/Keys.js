const { DataTypes } = require('sequelize')
const database = require('../sequelize_index')

const KeysModel = database.define('keys', {
    key: {
        type: DataTypes.STRING,
        allowNull: false
    },
    
})

module.exports = KeysModel