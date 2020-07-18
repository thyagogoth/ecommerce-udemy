'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Coupon = use('App/Models/Coupon')
const Database = use('Database')
const Service = use('App/Services/CouponService')

/**
 * Resourceful controller for interacting with coupons
 */
class CouponController {
	/**
	 * Show a list of all coupons.
	 * GET coupons
	 *
	 * @param {object} ctx
	 * @param {Response} ctx.response
	 * @param {Object} ctx.pagination
	 */
	async index({ request, response, pagination }) {
		const code = request.input('code')

		const query = Coupon.query()

		if (code) {
			query.where('code', 'LIKE', `%${code}%`)
		}

		const coupons = await query
			.paginate(pagination.page, pagination.limit)

		return response.send(coupons)
	}

	/**
	 * Create/save a new coupon.
	 * POST coupons
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 */
	async store({ request, response }) {

		const trx = await Database.beginTransaction()

		/**
		 * 1 - product - pode ser utilizado apenas em produtos específicos
		 * 2 - clients - pode ser utilizado apenas por clientes específicos
		 * 3 - clients e product - pode ser utilizado somente em produtos e clientes específicos
		 * 4 - pode ser utilizado por qualquer cliente em qualquer pedido
		 */

		var can_use_for = {
			client: false,
			product: false
		}

		try {
			const couponData = request.only([
				'code',
				'discount',
				'valid_from',
				'valid_until',
				'quantity',
				'type',
				'recursive'
			])

			const { users, products } = request.only(['users', 'products'])
			const coupon = await Coupon.create(couponData, trx)

			// starts service layer
			const service = new Service(coupon, trx)

			// insere os relacionamentos
			if (users && users.length > 0) {
				await service.syncUsers(users)
				can_use_for.client = true
			}

			if (products && products.length > 0) {
				await service.syncProducts(users)
				can_use_for.product = true
			}

			if (can_use_for.product && can_use_for.client) {
				coupon.can_use_for = 'product_client'
			} else if (can_use_for.product && !can_use_for.client) {
				coupon.can_use_for = 'product'
			} else if (!can_use_for.product && can_use_for.client) {
				coupon.can_use_for = 'client'
			} else {
				coupon.can_use_for = 'all'
			}

			await coupon.save(trx)
			await trx.commit()

			return response.status(201).send(coupon)

		} catch (error) {
			await trx.rollback()
			return response.status(400).send({ message: 'Não foi possível criar o cupom' })
		}
	}

	/**
	 * Display a single coupon.
	 * GET coupons/:id
	 *
	 * @param {object} ctx
	 * @param {Response} ctx.response
	 * @param {View} ctx.view
	 */
	async show({ params: { id }, response }) {
		const coupon = await Coupon.findOrFail(id)
		return response.send(coupon)
	}

	/**
	 * Update coupon details.
	 * PUT or PATCH coupons/:id
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 */
	async update({ params: { id }, request, response }) {
		const trx = await Database.beginTransaction()

		var coupon = await Coupon.findOrFail(id)

		var can_use_for = {
			client: false,
			product: false
		}

		try {
			const couponData = request.only([
				'code',
				'discount',
				'valid_from',
				'valid_until',
				'quantity',
				'type',
				'recursive'
			])

			coupon.merge(couponData)

			const { users, products } = request.only(['users', 'produts'])

			const service = new Service(coupon, trx)

			// insere os relacionamentos
			if (users && users.length > 0) {
				await service.syncUsers(users)
				can_use_for.client = true
			}

			if (products && products.length > 0) {
				await service.syncProducts(users)
				can_use_for.product = true
			}

			if (can_use_for.product && can_use_for.client) {
				coupon.can_use_for = 'product_client'
			} else if (can_use_for.product && !can_use_for.client) {
				coupon.can_use_for = 'product'
			} else if (!can_use_for.product && can_use_for.client) {
				coupon.can_use_for = 'client'
			} else {
				coupon.can_use_for = 'all'
			}

			await coupon.save(trx)

			await trx.commit()

			return response.send(coupon)

		} catch (error) {
			await trx.rollback()
			return response.status(400).send({ message: 'Não foi possível alterar este cupom' })
		}
	}

	/**
	 * Delete a coupon with id.
	 * DELETE coupons/:id
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 */
	async destroy({ params: { id }, request, response }) {

		const coupon = await Coupon.findOrFail(id)

		const trx = await Database.beginTransaction()
		try {
			await coupon.products().detach([], trx)
			await coupon.orders().detach([], trx)
			await coupon.users().detach([], trx)
			await coupon.delete(trx)

			await trx.commit()
			return response.status(204).send()
		} catch (error) {
			await trx.rollback()
			response.status(400).send({ message: "Não foi possível deletar este cupom" })
		}
	}
}

module.exports = CouponController
