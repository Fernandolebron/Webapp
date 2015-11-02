var Sequelize = require('sequelize');
var Dish = require('../models/dish');

// Connección a la BD MySQL
var sequelize = new Sequelize('mysql://' + process.env.C9_USER + ':@' +  process.env.IP + ':3306/abelinos');

var order = sequelize.define('orders', {
	ClientDocID: {type: Sequelize.STRING(20), allowNull: false},
	ClientEmail: {type: Sequelize.STRING(100)},
	ClientPhone: {type: Sequelize.STRING(15)},
	Status: {type: Sequelize.INTEGER, defaultValue: 1},
	Price: {type: Sequelize.FLOAT},
	Taxes: {type: Sequelize.FLOAT, defaultValue: 0.28},
	Address: {type: Sequelize.STRING},
	CreditCardType: {type: Sequelize.STRING},
	LocalOrder: {type: Sequelize.BOOLEAN},
},{
  freezeTableName: true // Model tableName will be the same as the model name
});

var OrdersDish = sequelize.define('OrdersDish', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
    status: {type: Sequelize.INTEGER, defaultValue: 1},
    amount: {type: Sequelize.INTEGER, defaultValue: 1}
});

order.belongsToMany(Dish, {through: OrdersDish});
OrdersDish.sync();
order.sync();

module.exports = order;