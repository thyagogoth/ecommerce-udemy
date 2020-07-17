'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const User = use('App/Models/User')

/**
 * Resourceful controller for interacting with users
 */
class UserController {
	/**
	 * Show a list of all users.
	 * GET users
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 */
	async index({ request, response, pagination }) {
		const name = request.input('name')

		const query = User.query()

		if (name) {
			query.where('name', 'LIKE', `%${name}%`)
			query.orWhere('surname', 'LIKE', `%${name}%`)
			query.orWhere('email', 'LIKE', `%${name}%`)
		}

		const users = await query
			.paginate(pagination.page, pagination.limit)

		return response.send(users)
	}

	/**
	 * Create/save a new user.
	 * POST users
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 */
	async store({ request, response }) {

		try {
			const userData = request.only([
				'name',
				'surname',
				'email',
				'password',
				'image_id'
			])

			const user = await User.create(userData)
			return response.status(201).send(user)
		} catch (error) {
			return response.status(400).send({ message: "Não foi possível efetuar este cadastro" })
		}
	}

	/**
	 * Display a single user.
	 * GET users/:id
	 *
	 * @param {object} ctx
	 * @param {Response} ctx.response
	 */
	async show({ params: { id }, response }) {
		const user = await User.findOrFail(id)
		return response.send(user)
	}

	/**
	 * Update user details.
	 * PUT or PATCH users/:id
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 */
	async update({ params: { id }, request, response }) {
		const user = await User.findOrFail(id)

		const userData = request.only([
			'name', 'surname', 'email', 'password', 'image_id'
		])

		/*
		 *atualiza (merge) o obj user
		 *com os dados de request.all() {name, surname, email, password, image_id}
		 */
		user.merge(userData)
		user.save()

		return response.status(200).send(user)
	}

	/**
	 * Delete a user with id.
	 * DELETE users/:id
	 *
	 * @param {object} ctx
	 * @param {Response} ctx.response
	 */
	async destroy({ params: { id }, response }) {
		const user = await User.findOrFail(id)
		try {
			await user.delete()
			return response.status(204).send()
		} catch (error) {
			response.status(500).send({ message: "Não foi possível deletar este usuário" })
		}
	}
}

module.exports = UserController
