const { DataTypes } = require('sequelize')
const database = require('../sequelize_index')


const CharactersModel = database.define('characters', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    color: {
        type: DataTypes.STRING,
        allowNull: false
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    birthday: {
        type: DataTypes.STRING,
        allowNull: false
    },
    hobbies: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fears: {
        type: DataTypes.STRING,
        allowNull: false
    },
    speed: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    might: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    sanity: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    knowledge: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    speed_range: {
        type: DataTypes.STRING,
    },
    might_range: {
        type: DataTypes.STRING,
    },
    sanity_range: {
        type: DataTypes.STRING,
    },
    knowledge_range: {
        type: DataTypes.STRING,
    },
    speed_value_index: {
        type: DataTypes.INTEGER,
    },
    might_value_index: {
        type: DataTypes.INTEGER,
    },
    sanity_value_index: {
        type: DataTypes.INTEGER,
    },
    knowledge_value_index: {
        type: DataTypes.INTEGER,
    },
    image: {
        type: DataTypes.STRING,
    },
    image_id: {
        type: DataTypes.STRING
    }
})

module.exports = CharactersModel