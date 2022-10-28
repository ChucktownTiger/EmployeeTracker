const inquirer = require('inquirer')
const cTable = require('console.table')
const mysql = require('mysql2')
require('dotenv').config();

const connection = mysql.createConnection(
    {
        host: 'localhost',
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: 'company',
        socketPath: '/tmp/mysql.sock'
    }
)

connection.connect(function(err) {
    if (err) {
        return console.error('error: ' + err.message);
    }
    console.log('connected to ChandlerCon Database')
})
