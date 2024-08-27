const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req,res) =>{
    res.send("Benvenuto nel mio sistema di autenticazione");
});

const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);

app.listen(3000);