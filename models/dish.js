var Sequelize = require('sequelize');

// Connección a la BD MySQL
var sequelize = new Sequelize('mysql://' + process.env.C9_USER + ':@' +  process.env.IP + ':3306/abelinos');

var dish = sequelize.define('dish', {
	name: {type: Sequelize.STRING(80), allowNull: false},
	type: {type: Sequelize.STRING(40), allowNull: false},
	description: {type: Sequelize.STRING(50), allowNull: false},
	specialty: {type: Sequelize.BOOLEAN},
	cheffavorite: {type: Sequelize.BOOLEAN},
	price: {type: Sequelize.INTEGER},
	image: {type: Sequelize.STRING(160)}
},{
  freezeTableName: true // Model tableName will be the same as the model name
});

dish.sync();

module.exports = dish;