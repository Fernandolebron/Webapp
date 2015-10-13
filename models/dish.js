// Referencia del ORM utilizado para acceder a MYSQL
var orm	= require ("orm");
// Connección a la BD MySQL
var db = orm.connect('mysql://' + process.env.C9_USER + ':@' +  process.env.IP + ':3306/abelinos');

// Define la clase plato de la base de datos
db.on('connect', function(err){
	if (err)
		return console.error('connection model error => ' + err);

	// Propiedades del Modelo
	var dish = db.define('dish', {
		id				: {type: "serial", key: true}, // auto increment :)
		name			: {type: "text", require: true, size: 80},
		type		    : {type: "text", require: true, size: 40},
	    description		: {type: "text", require: true, size: 50},
		specialty		: {type: "boolean"},
		cheffavorite	: {type: "boolean"},
		price           : {type: "number"},
		image           : {type: "text", size: 160}
	}, {
		validations: {
			id: orm.enforce.unique("Este plato ya existe")
		}
	});
});

module.exports = db;