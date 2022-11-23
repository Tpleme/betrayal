const database = require('./sequelize_index')

const UsersModel = require('./models/Users')
const KeysModel = require('./models/Keys')
const GameRoomModel = require('./models/GameRoomModel')
const MainChatsModel = require('./models/MainChatModel')
const CharactersModel = require('./models/CharactersModel')

const refreshDatabaseModels = false;

const initializeDatabase = async () => {

    await initializeModels();

    database.authenticate().then(() => {
        console.log('Connection to the database has been established')
    }).then(async () => {
        await database.sync({ alter: refreshDatabaseModels })
    }).catch((e) => {
        console.log('Unable to establish connection to the database' + e)
    })
}

const initializeModels = async () => {

    UsersModel.hasOne(KeysModel)
    GameRoomModel.hasMany(UsersModel)
    UsersModel.belongsTo(GameRoomModel)

    GameRoomModel.hasOne(UsersModel, { foreignKey: 'hosting' })

    MainChatsModel(database)
    CharactersModel(database)

}

exports.init = initializeDatabase;
exports.models = database.models