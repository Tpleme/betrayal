const { DataTypes } = require('sequelize')
const database = require('../sequelize_index')

const PlayerCharacter = database.define('player_character', {
    ready: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    speed_modifier: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    might_modifier: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    sanity_modifier: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    knowledge_modifier: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    position: {
        type: DataTypes.STRING,
        defaultValue: '{"x":1,"y":1}'
    }
})

module.exports = PlayerCharacter