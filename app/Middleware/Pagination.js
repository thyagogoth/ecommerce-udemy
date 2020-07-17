'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class Pagination {
	/**
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Function} next
	 */
	async handle(ctx, next) {
		if ( ctx.request.method() == "GET" ){
			const page = ctx.request.input('page') ? parseInt(ctx.request.input('page')) : 1
			const limit = ctx.request.input('limit') ? parseInt(ctx.request.input('limit')) : 20
			const perpage = ctx.request.input('perpage') ? parseInt(ctx.request.input('perpage')) : limit

			// atribui os valores passados via GET para a propriedade pagination do Object ctx
			ctx.pagination = {
				page,
				limit
			}
			if ( perpage ) {
				ctx.pagination.limit = perpage
			}
		}

		// call next to advance the request
		await next()
	}
}

module.exports = Pagination
