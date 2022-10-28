const mysql = require('mysql');
require ('dotenv').config();

const connection = mysql.createConnection(
    {
        host: 'localhost',
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: 'ChandlerCon',
        socketPath: '/tmp/mysql.sock'
    }
)

connection.connect(function(err) {
    if (err) {
        return console.error('error: ' + err.message);
    }
    console.log('connected to ChandlerCon server')
})
module.exports = connection;