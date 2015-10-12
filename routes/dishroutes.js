
// call the packages we need
var express    = require('express');                        // call express
var router = express.Router();              // get an instance of the express Router
var Dish = require('../models/dish');

//	Creacion de Usuario
router.post('/create', function(req, res){
		var dish = new Dish.models.dish();

		dish.name = req.body.name;
		dish.type = req.body.type;
		dish.description = req.body.description;
		dish.ingredients = req.body.ingredients;
		dish.speciality = req.body.speciality;
		dish.favoriteChef = req.body.favoriteChef;
		dish.price = req.body.price;
		dish.image = req.body.image;
		
		dish.save(function(err){
			if (err)
				return res.send(err);

			res.json({message: 'Plato creado!'});
		});
	});

//	Lista de todos los Platos.
router.get('/dishes', function(req, res){
		Dish.models.dish.find(function(err, dishes){
			if(err) 
				return res.send(err);

			res.json(dishes[0].name);
		});
	});
	
	
module.exports = router;