// call the packages we need
var express    = require('express');                        // call express
var router = express.Router();              // get an instance of the express Router
var Order = require('../models/order');
var jwt = require('jsonwebtoken');

/**
    Lista de todos las ordenes a partir del id del cliente.
    @author Jose Reyes
*/
router.get('/:idclient', function(req, res){
	console.log('asking all orders with id client ' + req.params.idclient);
	
	Order.models.order.find({ClientDocID: req.params.idclient}, function(err, orders){
		if(err){
			return res.send(err);
		}
		
		res.json(orders);
	});
});

/**
    route middleware to verify a token
    @author Jose Reyes
*/
router.use(function(req, res, next) {
	console.log('using dish controller');
	
	// check header or url parameters or post parameters for token
	var token = req.body.token || req.query.token || req.headers['x-access-token'];
	
	// decode token
	if (token) {
	// verifies secret and checks exp
	jwt.verify(token, 'SecretKey', function(err, decoded) {      
	  if (err) {
	    return res.json({ success: false, message: 'Failed to authenticate token.' });    
	  } else {
	    // if everything is good, save to request for use in other routes
	    req.decoded = decoded;    
	    next();
	  }
	});
	
	} else {
		// if there is no token
		// return an error
		return res.status(403).send({ 
		    success: false, 
		    message: 'No token provided.' 
		});
	}
	next();
});

/**
    Lista de todos las ordenes.
    @author Jose Reyes
*/
router.get('/getall', function(req, res){
	console.log('asking all orders');
	
	Order.models.order.find(function(err, orders){
		if(err){
			return res.send(err);
		}
		
		res.json(orders);
	});
});

/**
    Lista de todos las ordenes a partir de un estado.
    @author Jose Reyes
*/
router.get('/status/:orderstatus', function(req, res){
	console.log('asking all orders with status ' + req.params.orderstatus);
	
	Order.models.order.find({Status: req.params.orderstatus}, function(err, orders){
		if(err){
			return res.send(err);
		}
		
		res.json(orders);
	});
});

/**
    Creacion de una orden
    @author Jose Reyes
*/
router.post('/', function(req, res){
	console.log('creating an order');
	
 	var order = new Order.models.dish();
 	order.ClientDocID = req.body.clientID;
 	order.ClientEmail = req.body.email;
 	order.ClientPhone = req.body.telephone;
 	order.Status = 1;
 	order.Price = req.body.price;
 	order.Taxes = req.body.taxes;
 	order.CreditCardType = req.body.card;
 	order.Address = req.body.address;
	order.dishes = req.body.dishes;
	
	order.save(function(err){
		if (err)
			return res.send(err);

		res.json({message: '¡Orden creada!'});
	});
});

/**
    Edicion de un estado de una orden
    @author Fernando Lebrón
*/
router.put('/:id/:orderstatus', function(req, res){
	console.log('editing order #' + req.params.id + 'with status ' + req.params.orderstatus);
	
	Order.models.order.get(req.params.id, function (err, order) {
        if (err)
        	return res.send(err);
        else {
        	order.Status = req.params.orderstatus;
			
    			order.save(function(err){
    				if (err)
    					return res.send(err);
    	
    				res.json({message: '¡Estado de orden editado!'});
    			});
        }
    });
});

module.exports = router;