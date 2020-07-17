'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Order extends Model {

	items() {
		return this.hasMany('App/Models/OrderItem')
	}

	coupons() {
		return this.belongsToMany('App/Models/Coupon')
	}

	discounts() {
		return this.belongsToMany('App/Models/Discount')
	}

	user() {
		return this.belongsToMany('App/Models/User', 'user_id', 'id')
	}

}

module.exports = Order
