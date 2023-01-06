const { DataTypes } = require('sequelize')
const database = require('../sequelize_index')

const RoomRulesModel = database.define('room_rules', {
    when: {
        type: DataTypes.STRING
    },
    action: {
        type: DataTypes.STRING 
    },
    success: {
        type: DataTypes.STRING
    },
    fail: {
        type: DataTypes.STRING
    }
})

module.exports = RoomRulesModel