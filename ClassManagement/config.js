const mysql = require("mysql");
const db = mysql.createConnection({
    multipleStatements: true,
    host: 'localhost',
    user: 'root',
    password: '',
    //database: 'datenbanken'
    database: 'dwt'
});

db.connect(console.log("conected"))

module.exports = db;