// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var userRoutes = require('./routes/userroutes');
var order = require('./routes/orderroutes');
var ruta = require('./routes/route');
var dishRoutes = require('./routes/dishroutes');

// configure app
app.set('SecretKey', 'Abelino Resturante');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/', ruta);
app.use('/order', order);
app.use('/user', userRoutes);
app.use('/dish', dishRoutes);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
