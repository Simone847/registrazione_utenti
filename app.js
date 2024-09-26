const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRoutes = require('./routes/authRoutes');
//qui ho messo app.use solo come 'passaggio' per reindirizzare in authRoutes qualsiasi tipo di richiesta
app.use('/', authRoutes);


app.get('/', (req,res) =>{
    res.send("Benvenuto nel mio sistema di autenticazione");
});


app.listen(3000);