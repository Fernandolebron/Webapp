// call the packages we need
var express    = require('express');                        // call express
var router = express.Router();              // get an instance of the express Router
var Order = require('../models/order');
var Dish = require('../models/dish');
var jwt = require('jsonwebtoken');
var async = require('async');
var Sequelize = require('sequelize');
var OrdersDishes = require('../models/orderdishes');

/**
    Lista de todos las ordenes a partir del id del cliente.
    @author Jose Reyes
*/
router.get('/checkstatus/:idclient', function(req, res){
	req.header("Access-Control-Allow-Origin", "*");
	console.log('asking all orders with id client ' + req.params.idclient);

	// CORS
	res.header("Access-Control-Allow-Origin", "*");
  	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

	Order.findAll({where: {clientID: req.params.idclient}}).then(function(orders){
		res.json(orders);
	});
});

/**
    Creacion de una orden
    @author Jose Reyes
*/
router.post('/create', function(req, res){
	console.log('creating an order');
	
 	Order.create({
							 	clientID : req.body.clientID,
							 	email : req.body.email,
							 	telephone : req.body.telephone,
							 	card : req.body.card,
							 	address : req.body.address,
								localorder : req.body.localorder,
 	}).then(function(order){
 		var arraydish = req.body.dish.map(Number);
		var Price = 0;
		
		async.each(arraydish, function(dishId,cb){
				Dish.findById(dishId).then(function(dish){
					order.addDish(dish);
					Price += dish.price;
					cb();
				});
			},
			function(){
				order.price = Price;
				
				order.save().then(function(order){
					res.json({message: '¡Orden creada!', orden: order});
				});
			});
 	});
});

/**
    route middleware to verify a token
    @author Jose Reyes
*/
router.use(function(req, res, next) {
	console.log('using order controller');

	// check header or url parameters or post parameters for token
	var token = req.body.token || req.query.token || req.headers['x-access-token'];

	// decode token
	if (token) {
		// verifies secret and checks exp
		jwt.verify(token, 'SecretKey', function(err, decoded) {      
		  if (err) {
		    res.json({ success: false, message: 'Failed to authenticate token.' });    
		    return;
		  } else {
		    // if everything is good, save to request for use in other routes
		    req.decoded = decoded;    
		    next();
		  }
		});
	} else {
		// if there is no token
		// return an error
		res.status(403).send({ 
		    success: false, 
		    message: 'No token provided.' 
		});
	}
});

/**
    Lista de todos las ordenes.
    @author Jose Reyes
*/
router.get('/getall', function(req, res){
	console.log('asking all orders');
	
	Order.findAll({where: {
							status:{
								$lt: 3
							}
						}
	}).then(function(orders) {
		async.each(orders, function(order,cb){
			order.getDishes().then(function(dishes){
				order.dataValues.dishes = JSON.stringify(dishes);
				cb();
			});
			},
			function(){
				res.json({orden: orders});
			});
	});
});

/**
    Lista de todos las ordenes a partir de un estado.
    @author Jose Reyes
*/
router.get('/status/:orderstatus', function(req, res){
	console.log('asking all orders with status ' + req.params.orderstatus);
	
	Order.findAll({where: {status: req.params.orderstatus}}).then(function(orders){
		res.json(orders);
	});
});

/**
    Edicion de un estado de una orden
    @author Fernando Lebrón
*/
router.put('/:id/:orderstatus', function(req, res){
	console.log('editing order #' + req.params.id + 'with status ' + req.params.orderstatus);
	
	Order.findById(req.params.id).then(function (order) {
        order.status = req.params.orderstatus;
			
		order.save().then(function(order){
			res.json({message: '¡Estado de orden editado!', order: order});
		});
    });
});

module.exports = router;