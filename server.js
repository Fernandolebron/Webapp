// Referencia del express
var express = require('express')
	, http = require('http');

// Puerto
var port = 8082;

// Instancia del express
var app = express();
var server = app.listen(port);
//var io = require('socket.io').listen(server);

// Referencia del bodyparser
var bodyParser = require('body-parser');
// Referencia de las rutas de usuarios
var userRoutes = require('./routes/userroutes');
// Referencia de las rutas de las órdenes
var order = require('./routes/orderroutes');
// Referencia de las rutas de los platos
var dishRoutes = require('./routes/dishroutes');

// configure app
app.set('SecretKey', 'Abelino Resturante');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// REGISTER OUR ROUTES -------------------------------
app.use('/user', userRoutes);
app.use('/dish', dishRoutes);
app.use('/order', order);

console.log('Magic happens on port ' + port);

// INICIA SERVIDOR
// =============================================================================
// app.listen(port);