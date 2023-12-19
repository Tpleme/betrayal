const { DataTypes } = require('sequelize')

const OmensModel = (database) => database.define('omens', {
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

module.exports = OmensModel