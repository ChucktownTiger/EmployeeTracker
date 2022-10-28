const mysql = require('mysql');
require ('dotenv').config();

const connection = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'Clemson#2016',
        database: 'ChandlerCon',
        // socketPath: '/tmp/mysql.sock'
    }
)

connection.connect(function(err) {
    if (err) {
        return console.error('error: ' + err.message);
    }
    console.log('connected to ChandlerCon server')
})
module.exports = connection;