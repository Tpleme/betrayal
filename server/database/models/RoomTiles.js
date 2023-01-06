const { DataTypes } = require('sequelize')
const database = require('../sequelize_index')

const RoomTilesModel = database.define('room_tiles', {
    image: {
        type: DataTypes.STRING,
        allowNull: false
    },
    image_id: {
        type: DataTypes.STRING,
    },
    floor: {
        type: DataTypes.STRING
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
    },
    event: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    item: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    omen: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    doors: {
        type: DataTypes.STRING,
        allowNull: 'false'
    },
    outside_windows: {
        type: DataTypes.ENUM('O', 'W'),
    },
    initial: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }

})

module.exports = RoomTilesModel