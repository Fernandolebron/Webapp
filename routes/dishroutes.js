
// call the packages we need
var express    = require('express');                        // call express
var router = express.Router();              // get an instance of the express Router
var Dish = require('../models/dish');
var jwt = require('jsonwebtoken');

/**
    Lista de todos los Platos.
    @author Fernando Lebrón
*/
router.get('/dishes', function(req, res){
	console.log('asking all dishes');
	
	Dish.models.dish.find(function(err, dishes){
		if(err){
			return res.send(err);
		}
		
		res.json(dishes);
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
    Retornar un plato en específico
    @author Fernando Lebrón
*/
router.get('/:id', function(req, res) {
	console.log('asking for dish ' + req.params.id);
	
	Dish.models.dish.get(req.params.id, function(err, dish){
		if(err) {
			return res.send(err);
		}

		res.json(dish);
	});
});

/**
    Creacion de un Plato
    @author Fernando Lebrón
*/
router.post('/create', function(req, res){
	console.log('creating a dish');
	
	var dish = new Dish.models.dish();
	dish.name = req.body.name;
	dish.type = req.body.type;
	dish.description = req.body.description;
	dish.speciality = req.body.speciality;
	dish.favoriteChef = req.body.chefFavorite;
	dish.price = req.body.price;
	dish.image = req.body.image;
	
	dish.save(function(err){
		if (err)
			return res.send(err);

		res.json({message: '¡Plato creado!'});
	});
});
	
/**
    Edicion de un Plato
    @author Fernando Lebrón
*/
router.put('/edit/:id', function(req, res){
	console.log('editing dish #' + req.params.id);
	
	Dish.models.dish.get(req.params.id, function (err, dish) {
        if (err)
        	return res.send(err);
        else {
        	dish.name = req.body.name;
			dish.type = req.body.type;
			dish.description = req.body.description;
			dish.speciality = req.body.speciality;
			dish.favoriteChef = req.body.chefFavorite;
			dish.price = req.body.price;
			dish.image = req.body.image;
			
			dish.save(function(err){
				if (err)
					return res.send(err);
	
				res.json({message: '¡Plato editado!'});
			});
        }
    });
});

/**
    Eliminar un plato	
    @author Fernando Lebrón
*/
router.delete('/delete/:id', function(req, res){
	console.log('deleting dish #' + req.params.id);
	
	Dish.models.dish.get(req.params.id, function (err, dish) {
		if (err)
			return res.send(err);
		else {
			dish.remove(function(err){
				if (err)
					return res.send(err);
		
				res.json({message: '¡Plato eliminado!'});
			});
		}
    });
});
	
	
module.exports = router;