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
    }
})

module.exports = UsersModel