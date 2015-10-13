var orm	= require ("orm");
var db = orm.connect('mysql://' + process.env.C9_USER + ':@' +  process.env.IP + ':3306/abelinos');

db.on('connect', function(err){
	if (err)
		return console.error('connection error => ' + err);

	// Propiedades del Modelo
	var user = db.define('user', {
		username		: {type: "text", unique: true, size: 20},
		name			: {type: "text", require: true, size: 50},
		lastname		: {type: "text", require: true, size: 50},
		email			: {type: "text", unique: true, size: 30},
		password		: {type: "text", require: true, size: 200},
		isAdmin			: {type: "boolean"},
		passwordReset	: {type: "text", unique: true}
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
	
	user.sync();
});

module.exports = db;