const bcrypt = require('bcrypt');
const db = require('../config/db');

//Funzione per la registrazione degli utenti - verifica se l'username e la e-mail non sono gia presenti e poi inserisce i dati nel database
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

//funzione per il login degli utenti - prende la riga dell'utente in base all'email inserita e usa l'hash della passowrd inserita per 
// vedere se corrisponde all' hash della password nel database
const loginUser = (req, res) => {
    const {email, psw} = req.body;

    if (!email || !psw) {
        return res.status(400).json({ error: 'Email e password sono richiesti'});
    }

    const checkPasswordSql = 'SELECT * FROM users WHERE email = ?';
        
    db.query(checkPasswordSql, [email], (err, result) => {
        if (err) {
            console.error('SQL Error:', err);
            return res.status(500).json({ error: 'Errore durante la verifica dell\'utente' });
        }

        if (result.length === 0) {
            return res.status(401).json({ error: 'Credenziali non valide' });
        }

        bcrypt.compare(psw, result[0].password, (err, isMatch) => {
            if(err) {
                return res.status(500).json({ error: 'Errore durante la verifica della password' });
            }

            if(!isMatch) {
                return res.status(401).json({error: 'Email o password errate'});
            }

            res.status(200).json({message: 'Login effettuato'});
        });
    });   
}

module.exports = { registerUser, loginUser };
