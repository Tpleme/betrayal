const { DataTypes } = require('sequelize')

const EventsModel = (database) => database.define('events', {
    title: {
        type: DataTypes.STRING,
    },
    subtitle: {
        type: DataTypes.STRING,
    },
    description: {
        type: DataTypes.TEXT,
    }
})

module.exports = EventsModel