'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CouponProductSchema extends Schema {
  up () {
    this.create('coupon_product', (table) => {
		table.increments()
		table.integer('coupon_id').unsigned()
		table.integer('product_id').unsigned()
		table.timestamps()

		table
			.foreing('coupon_id')
			.references('id')
			.inTable('coupons')
			.onDelete('cascade')

		table
			.foreing('product_id')
			.references('id')
			.inTable('products')
			.onDelete('cascade')
    })
  }

  down () {
    this.drop('coupon_product')
  }
}

module.exports = CouponProductSchema
