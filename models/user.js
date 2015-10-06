var orm	= require ("orm");
var db = orm.connect('mysql://' + process.env.C9_USER + ':@' +  process.env.IP + ':3306/c9');

db.on('connect', function(err){
	if (err)
		return console.error('connection error => ' + err);

	// Propiedades del Modelo
	db.define('user', {
		username		: {type: "text", unique: true, size: 20},
		name			: {type: "text", require: true, size: 50},
		lastname		: {type: "text", require: true, size: 50},
		email			: {type: "text", unique: true, size: 30},
		password		: {type: "text", require: true, size: 75},
		isAdmin			: {type: "boolean"},
		passwordReset	: {type: "text"}
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
});

module.exports = db;