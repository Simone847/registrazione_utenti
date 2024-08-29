const bcrypt = require('bcrypt');
const db = require('../config/db');

const registerUser = (req, res) => {
    const { email, psw} = req.body;

    if (!email || !psw) {
        return res.status(400).json({ error: 'Email e password sono richiesti' });
    }

    bcrypt.hash(psw, 10, (err, pswHash) => {
        if(err) return res.status(500).json({error: "errore nella registrazione della password"});

        bcrypt.hash(email, 10, (err, emailHash) => {
            if(err) return res.status(500).json({error: "errore nella registrazione della email"});

            const sql = 'INSERT INTO USERS (email, psw) VALUES (?, ?)';
            db.query(sql, [emailHash, pswHash], (err, result) => {
                if (err) {
                    return res.status(500).json({ error: 'errore durante la registrazione' });
                }
                res.status(201).json({ message: 'registrazione avvenuta con successo' });
            })
        })
    })
}

module.exports = { registerUser };


