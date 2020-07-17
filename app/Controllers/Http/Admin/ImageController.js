'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Image = use('App/Models/Image')
const { manage_single_upload, manage_multiple_upload } = use('App/Helpers')

/**
 * Resourceful controller for interacting with images
 */
class ImageController {
	/**
	 * Show a list of all images.
	 * GET images
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 * @param {Object} ctx.pagination
	 */
	async index({ request, response, pagination }) {
		const images = await Image
			.query()
			.orderBy('id', 'DESC')
			.paginate(pagination.page, pagination.limit)

		return response.send(images)
	}

	/**
	 * Create/save a new image.
	 * POST images
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 */
	async store({ request, response }) {
		try {
			// captura a imagem do request
			const fileJar = request.file('images', {
				types: ['image'],
				size: '5mb'
			})

			// retorno pro usuário
			let images = []
			// caso seja um único arquivo - manage_single_upload
			if (!fileJas.files) {
				const file = await manage_single_upload(fileJar)
				if (file.moved()) {
					const image = await Image.create({
						path: file.fileName,
						size: file.size,
						original_name: file.clientName,
						extension: file.subType
					})

					images.push(image)

					return response.status(201).send({ successes: images, errors: {} })
				}

				return response.status(400).send({
					message: "Não foi possível efetuar o upload do arquivo"
				})
			}

			// caso seja multiplos arquivos - manage_multiple_upload
			let files = await manage_multiple_upload(fileJar)
			await Promise.all(
				files.successes.map( async file => {
					const image = await Image.create({
						path: file.fileName,
						size: file.size,
						original_name: file.clientName,
						extension: file.subType
					})
					images.push(image)
				})
			)
			return response.status(201).send({ successes: images, errors: files.errors })
		} catch (error) {
			return response.status(400).send({ message: "Ocorreu uma falha na solicitração de upload" })
		}
	}

	/**
	 * Display a single image.
	 * GET images/:id
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 * @param {View} ctx.view
	 */
	async show({ params, request, response, view }) {
	}

	// /**
	//  * Render a form to update an existing image.
	//  * GET images/:id/edit
	//  *
	//  * @param {object} ctx
	//  * @param {Request} ctx.request
	//  * @param {Response} ctx.response
	//  * @param {View} ctx.view
	//  */
	// async edit({ params, request, response, view }) {
	// }

	/**
	 * Update image details.
	 * PUT or PATCH images/:id
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 */
	async update({ params, request, response }) {
	}

	/**
	 * Delete a image with id.
	 * DELETE images/:id
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 */
	async destroy({ params, request, response }) {
	}
}

module.exports = ImageController
