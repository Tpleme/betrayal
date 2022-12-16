const { DataTypes } = require('sequelize')
const database = require('../sequelize_index')

const PlayerCharacter = database.define('player_character', {
    ready: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
})

module.exports = PlayerCharacter