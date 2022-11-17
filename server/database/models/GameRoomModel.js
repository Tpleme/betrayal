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
    }
})

module.exports = GameRoomModel