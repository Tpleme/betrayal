const database = require('./sequelize_index')

const UsersModel = require('./models/Users')
const KeysModel = require('./models/Keys')
const GameRoomModel = require('./models/GameRoomModel')
const PlayerCharacter = require('./models/PlayerCharacter')
const CharactersModel = require('./models/CharactersModel')
const RoomTilesModel = require('./models/RoomTiles')
const RoomRulesModel = require ('./models/RoomRules')
const MainChatsModel = require('./models/MainChatModel')

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

    UsersModel.hasOne(PlayerCharacter)
    PlayerCharacter.belongsTo(UsersModel)

    GameRoomModel.hasOne(PlayerCharacter)
    PlayerCharacter.belongsTo(GameRoomModel)

    CharactersModel.hasOne(PlayerCharacter)
    PlayerCharacter.belongsTo(CharactersModel)

    // GameRoomModel.belongsTo(PlayerCharacter)

    GameRoomModel.hasOne(UsersModel, { foreignKey: 'hosting' })

    RoomRulesModel.hasOne(RoomTilesModel, { foreignKey: 'rules' })

    MainChatsModel(database)

}

exports.init = initializeDatabase;
exports.models = database.models