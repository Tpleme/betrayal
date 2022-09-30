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
})

module.exports = GameRoomModel