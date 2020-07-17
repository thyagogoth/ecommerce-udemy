'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Coupon extends Model {

	static get dates() {
		return [
			'created_at',
			'updated_at',
			'valid_from',
			'valid_until'
		]
	}

	/**
	 * Relacionamento entre coupon e usuários
	 */
	users() {
		return this.belongsToMany('App/Models/User')
	}

	/**
	 * Relacionamento entre coupon e products
	 */
	products() {
		return this.belongsToMany('App/Models/Product')
	}

	/**
	 * Relacionamento entre coupons e orders
	 */
	orders() {
		return this.belongsToMany('App/Models/Order')
	}

}

module.exports = Coupon
