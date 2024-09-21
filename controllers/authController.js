const bcrypt = require('bcrypt');
const db = require('../config/db');

const registerUser = (req, res) => {
    const { username, email, psw } = req.body;

    if (!email || !psw || !username) {
        return res.status(400).json({ error: 'Username, email e password sono richiesti' });
    }

    bcrypt.hash(psw, 10, (err, pswHash) => {
        if (err) return res.status(500).json({ error: "Errore durante la registrazione della password" });

        const checkUserSql = 'SELECT * FROM users WHERE username = ? OR email = ?';
        db.query(checkUserSql, [username, email], (err, result) => {
            if (err) {
                console.error('SQL Error:', err);
                return res.status(500).json({ error: 'Errore durante la verifica dell\'utente' });
            }

            if (result.length > 0) {
                return res.status(409).json({ error: 'Username o email già in uso' });
            }

            const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
            db.query(sql, [username, email, pswHash], (err, result) => {
                if (err) {
                    console.error('SQL Error:', err);
                    return res.status(500).json({ error: 'Errore durante la registrazione' });
                }
                res.status(201).json({ message: 'Registrazione avvenuta con successo' });
            });
        });
    });
};

module.exports = { registerUser };
