const { Sequelize } = require('sequelize')
const sequelize = require('sequelize')
require('dotenv').config()

const database = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: 'localhost',
    dialect: 'mysql'
})

module.exports = database