var Sequelize = require('sequelize');

// Connección a la BD MySQL
var sequelize = new Sequelize('mysql://root:123456@127.0.0.1:3306/abelinos');

var user = sequelize.define('user', {
	username: {type: Sequelize.STRING(20), allowNull: false, unique: true},
	name: {type: Sequelize.STRING(50), allowNull: false},
	lastname: {type: Sequelize.STRING(50), allowNull: false},
	email: {type: Sequelize.STRING(30), allowNull: false},
	password: {type: Sequelize.STRING(200), allowNull: false},
	isAdmin: {type: Sequelize.BOOLEAN},
	passwordReset: {type: Sequelize.STRING, unique: true}
},{
  freezeTableName: true // Model tableName will be the same as the model name
});

user.sync();

module.exports = user;