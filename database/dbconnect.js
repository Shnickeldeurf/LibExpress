var mysql = require('mysql2');

var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'library_db'
});

module.exports = conn;