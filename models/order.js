// Referencia del ORM utilizado para acceder a MYSQL
var orm	= require ("orm");
// Connección a la BD MySQL
var db = orm.connect('mysql://' + process.env.C9_USER + ':@' +  process.env.IP + ':3306/abelinos');
var Dish = require('../models/dish');

// Define la clase usuario de la base de datos
db.on('connect', function(err){
	if (err)
		return console.error('connection error => ' + err);

	// Propiedades del Modelo
	var order = db.define('order', {
		ClientDocID		: {type: "text"},
		ClientEmail		: {type: "text", size: 100},
		ClientPhone		: {type: "text", size: 15},
		Status			: {type: "integer"},
		Price			: {type: "number"},
		Taxes			: {type: "number"},
		CreditCardType	: {type: "text"},
		Address     	: {type: "text"}
	}, {
		methods: {
			fullname: function () {
				return this.name + ' ' + this.lastname;		
			}
		}, 
		validations: {
			username: orm.enforce.unique("Cuenta de Usuario ya existe")
		}
	});
	
	order.hasMany('dish', Dish.models.dish, { dishName: String, status: Number }, { reverse: 'orders', key: true })
	
	order.sync();
});

module.exports = db;