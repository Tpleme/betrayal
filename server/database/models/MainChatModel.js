const { DataTypes } = require('sequelize')

const MainChatsModel = (database) => {
    database.define('main_chats', {
        chat: {
            type: DataTypes.STRING
        },
        user_id: {
            type: DataTypes.INTEGER
        },
        user_name: {
            type: DataTypes.STRING
        },
        user_picture: {
            type: DataTypes.STRING,
        },
        message: {
            type: DataTypes.TEXT
        },
        deleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    })
}

module.exports = MainChatsModel