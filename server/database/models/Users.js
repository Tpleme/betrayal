const { DataTypes } = require('sequelize')
const database = require('../sequelize_index')

const UsersModel = database.define('users', {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    picture: {
        type: DataTypes.STRING
    },
    image_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    last_login: {
        type: DataTypes.DATE,
    },
    password_recovery_key: {
        type: DataTypes.STRING
    },
    loggedIn: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    socket_id: {
        type: DataTypes.STRING
    },
    connected_to_room : {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    last_location: {
        type: DataTypes.STRING,
        defaultValue: null
    }
})

module.exports = UsersModel