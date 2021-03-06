const { DataTypes } = require('sequelize')

const UsersModel = (database) => {
    database.define('users', {
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
    })
}

module.exports = UsersModel