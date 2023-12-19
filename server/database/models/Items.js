const { DataTypes } = require('sequelize')

const ItemsModel = (database) => database.define('items', {
    image: {
        type: DataTypes.STRING
    },
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

module.exports = ItemsModel