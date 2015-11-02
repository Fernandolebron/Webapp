// call the packages we need
var express    = require('express');                        // call express
var router = express.Router();              // get an instance of the express Router
var Order = require('../models/order');
var Dish = require('../models/dish');
var jwt = require('jsonwebtoken');
var async = require('async');

/**
    Lista de todos las ordenes a partir del id del cliente.
    @author Jose Reyes
*/
router.get('/checkstatus/:idclient', function(req, res){
	console.log('asking all orders with id client ' + req.params.idclient);
		
	Order.findAll({where: {ClientDocID: req.params.idclient}}).then(function(orders){
		res.json(orders);
	});
});

function CalculateOcurrence(arr, id) {
	var total = 0;
	
    for ( var i = 0; i < arr.length; i++ ) {
        if ( arr[i] === id ) {
            total++;
        }
    }

    return total;
}

function CalculateOcurrence2(arr) {
	var a = [], b = [], prev;

    arr.sort();
    for ( var i = 0; i < arr.length; i++ ) {
        if ( arr[i] !== prev ) {
            a.push(arr[i]);
            b.push(1);
        } else {
            b[b.length-1]++;
        }
        prev = arr[i];
    }

    return [a, b];
}

/**
    Creacion de una orden
    @author Jose Reyes
*/
router.post('/create', function(req, res){
	console.log('creating an order');
	
 	Order.create({
							 	ClientDocID : req.body.clientID,
							 	ClientEmail : req.body.email,
							 	ClientPhone : req.body.telephone,
							 	CreditCardType : req.body.card,
							 	Address : req.body.address,
								LocalOrder : req.body.localorder,
 	}).then(function(order){
 		var arraydish = req.body.dish.split(',').map(Number);
		var Price = 0;
		
		Dish.findAll({where: {id: {$in: arraydish}}}).then(function(dishes) {
		    async.each(dishes, function(dish,cb){
				order.addDish(dish, {amount: CalculateOcurrence(arraydish, dish.id)});
				Price += dish.price;
				
				cb();
			},
			function(){
				order.Price = Price;
				
				order.save().then(function(order){
					res.json({message: '¡Orden creada!', orden: order});
				});
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
	
	Order.findAll().then(function(orders){
		res.json(orders);
	});
});

/**
    Lista de todos las ordenes a partir de un estado.
    @author Jose Reyes
*/
router.get('/status/:orderstatus', function(req, res){
	console.log('asking all orders with status ' + req.params.orderstatus);
	
	Order.findAll({where: {Status: req.params.orderstatus}}).then(function(orders){
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
        order.Status = req.params.orderstatus;
			
		order.save().then(function(order){
			res.json({message: '¡Estado de orden editado!', order: order});
		});
    });
});

module.exports = router;