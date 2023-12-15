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
    },
    started: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    turn: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    total_turns: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    turn_order: {
        type: DataTypes.STRING,
    }

})

module.exports = GameRoomModel