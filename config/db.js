const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'users_db',
    port: 3306
});

connection.connect((err) =>{
    if (err){
        console.error('errore nella connessione al database:', err)
        return;
    }

    console.log('sei ora connesso al database')
});

module.exports = connection;