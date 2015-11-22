
// call the packages we need
var express    = require('express');                        // call express
var router = express.Router();              // get an instance of the express Router
var Dish = require('../models/dish');
var jwt = require('jsonwebtoken');

/**
    Lista de todos los Platos.
    @author Jose Reyes
*/
router.get('/dishes', function(req, res){
	res.header("Access-Control-Allow-Origin", "*");
  	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

	console.log(req);
	console.log(res);
	console.log('asking all dishes');
	
	Dish.findAll().then(function(dishes){
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
    Retornar un plato en específico
    @author Fernando Lebrón
*/
router.get('/:id', function(req, res) {
	console.log('asking for dish ' + req.params.id);
	
	Dish.findById(req.params.id).then(function(dish){
		res.json(dish);
	});
});

/**
    Creacion de un Plato
    @author Jose Reyes
*/
router.post('/create', function(req, res){
	console.log('creating a dish');
	
	Dish.create({
		name : req.body.name,
		type : req.body.type,
		description : req.body.description,
		specialty : req.body.specialty,
		chefFavorite : req.body.chefFavorite,
		price : req.body.price,
		image : req.body.image
	}).then(function(dish){
		res.json({message: '¡Plato creado!', dish: dish});
	});
});
	
/**
    Edicion de un Plato
    @author Jose Reyes
*/
router.put('/edit/:id', function(req, res){
	console.log('editing dish #' + req.params.id);
	
	Dish.findById(req.params.id).then(function (dish) {
        dish.name = req.body.name;
		dish.type = req.body.type;
		dish.description = req.body.description;
		dish.specialty = req.body.specialty;
		dish.chefFavorite = req.body.chefFavorite;
		dish.price = req.body.price;
		dish.image = req.body.image;
			
		dish.save().then(function(dish){
			res.json({message: '¡Plato editado!', dish: dish});
		});
    });
});

/**
    Eliminar un plato	
    @author Jose Reyes
*/
router.delete('/remove/:id', function(req, res){
	console.log('deleting dish #' + req.params.id);
	
	Dish.findById(req.params.id).then(function (dish) {
		dish.destroy().then(function(){
			res.json({message: '¡Plato eliminado!'});
		});
    });
});
	
	
module.exports = router;