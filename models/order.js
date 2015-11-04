var Sequelize = require('sequelize');
var Dish = require('../models/dish');

// Connección a la BD MySQL
var sequelize = new Sequelize('mysql://root:123456@127.0.0.1:3306/abelinos');

var OrdersDish = sequelize.define('OrdersDish', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
    status: {type: Sequelize.INTEGER, defaultValue: 1}
});

var order = sequelize.define('orders', {
	clientID: {type: Sequelize.STRING(20), allowNull: false},
	email: {type: Sequelize.STRING(100)},
	telephone: {type: Sequelize.STRING(15)},
	status: {type: Sequelize.INTEGER, defaultValue: 1},
	price: {type: Sequelize.FLOAT},
	tax: {type: Sequelize.FLOAT, defaultValue: 0.28},
	address: {type: Sequelize.STRING},
	card: {type: Sequelize.STRING},
	localorder: {type: Sequelize.BOOLEAN},
},{
  freezeTableName: true // Model tableName will be the same as the model name
});

					
order.sync();
OrdersDish.sync();

module.exports = order;