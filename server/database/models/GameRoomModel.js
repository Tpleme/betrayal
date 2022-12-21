const { DataTypes } = require('sequelize')
const database = require('../sequelize_index')

const GameRoomModel = database.define('game_rooms', {
    name: {
        type: DataTypes.STRING,
    },
    room_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
    },
    max_players: {
        type: DataTypes.INTEGER,
        defaultValue: 6,
        validate: { min: 2, max: 6 }
    }
})

module.exports = GameRoomModel