const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

require('./config/config');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(require('./routes/index'));

app.use(express.static(path.resolve(__dirname,'./../public')));


var options = { 
    useNewUrlParser: true,
    useCreateIndex: true,
  };

mongoose.connect(process.env.URLDB, options,
    //{ useNewUrlParser: true, useCreateIndex: true },
    (err, res) => {
        if (err) throw err;
        console.log('Base de datos conectada');
    });

app.listen(process.env.PORT, () => {
    console.log(`SERVIDOR INICIALIZADO EN PUERTO`, process.env.PORT)
})