// requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// inicializar variables

var app = express();

// CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    next();
});

// Body Parser

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());


// importar rutas
var usuarioRoutes = require('./routes/usuario');
var appRoutes = require('./routes/app');

// conexion a la base de datos

// mongoose.connection.openUri('mongodb://localhost:27017/EjemploDB', { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true },
//     (err, resp) => {
//         if (err) throw err;

//         console.log('Base de datos:  \x1b[32m%s\x1b[0m', 'online');
//     });

// rutas
app.use('/usuario', usuarioRoutes);
app.use('/', appRoutes);

// escuchar peticiones

// app.listen(3000, () => {
//     console.log('Express server corriendo en el puerto 3000: \x1b[32m%s\x1b[0m', 'online');
// });
// ============================
//  Puerto
// ============================
process.env.PORT = process.env.PORT || 3000;


// ============================
//  Entorno
// ============================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// ============================
//  Base de datos
// ============================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = "mongodb://localhost:27017/cafe";
} else {
    urlDB = "mongodb://root:root@cluster0-shard-00-00.aila2.mongodb.net:27017,cluster0-shard-00-01.aila2.mongodb.net:27017,cluster0-shard-00-02.aila2.mongodb.net:27017/cafe?ssl=true&replicaSet=atlas-s6v91x-shard-0&authSource=admin&retryWrites=true&w=majority";
}
process.env.URLDB = urlDB;

mongoose.connect(process.env.URLDB, (err, res) => {

    if (err) throw err;

    console.log('Base de datos ONLINE');

});



app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});