var orm	= require ("orm");
var db = orm.connect('mysql://' + process.env.C9_USER + ':@' +  process.env.IP + ':3306/c9');

db.on('connect', function(err){
	if (err)
		return console.error('connection model error => ' + err);

	// Propiedades del Modelo
	var dish = db.define('dish', {
		name			: {type: "text", require: true, size: 80},
		type		    : {type: "text", require: true, size: 40},
	    description		: {type: "text", require: true, size: 50},
		ingredients		: {type: "text", require: true, size: 200},
		specialty		: {type: "boolean"},
		cheffavorite	: {type: "boolean"},
		price           : {type: "number"},
		image           : {type: "text", size: 160}
	}, {
		methods: {
			fullname: function () {
				return this.name;		
			}
		}, 
		validations: {
			name: orm.enforce.unique("Este plato ya existe")
		}
	});
});

module.exports = db;