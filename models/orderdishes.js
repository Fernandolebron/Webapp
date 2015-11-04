var Sequelize = require('sequelize');
var Order = require('../models/order');
var Dish = require('../models/dish');

// Connección a la BD MySQL
var sequelize = new Sequelize('mysql://root:123456@localhost:9658/abelinos');

var OrdersDish = sequelize.define('OrdersDish', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
    status: {type: Sequelize.INTEGER, defaultValue: 1}
});

var Dishes = Order.belongsToMany(Dish, {
					through: {
						model: OrdersDish, unique: false
						}
					});
					
var Orders = Dish.belongsToMany(Order, {
					through: {
						model: OrdersDish, unique: false
						}
					});

OrdersDish.sync();

module.exports = {
	Orders: Orders,
	Dishes: Dishes
}