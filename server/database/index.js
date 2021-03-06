const database = require('./sequelize_index')

const UsersModel = require('./models/Users')

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
    UsersModel(database)
}

exports.init = initializeDatabase;
exports.models = database.models