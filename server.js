// Referencia del express
var express    = require('express');
// Instancia del express
var app        = express();
// Referencia del bodyparser
var bodyParser = require('body-parser');
// Referencia de las rutas de usuarios
var userRoutes = require('./routes/userroutes');
// Referencia de las rutas de las órdenes
var order = require('./routes/orderroutes');
// Referencia de las rutas de los platos
var dishRoutes = require('./routes/dishroutes');

//Adding CORS
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};

// configure app
app.set('SecretKey', 'Abelino Resturante');
app.use(allowCrossDomain);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Asigna puerto
var port = 3000;

// REGISTER OUR ROUTES -------------------------------
app.use('/user', userRoutes);
app.use('/dish', dishRoutes);
app.use('/order', order);

// INICIA SERVIDOR
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
