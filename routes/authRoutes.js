const express = require('express');
const router = express.Router();

router.post('/register', (req, res) => {
    res.send('pagina in lavorazione');
})

module.exports = router;