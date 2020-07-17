'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const { str_random } = use('App/Helpers')

class PasswordReset extends Model {
	static boot() {
		super.boot()

		this.addHook('beforeCreate', async model => {
			model.token = await str_random(25)
			const expires_at = new Date()
			expires_at.setMinutes(expires_at.getMinutes() + 30)
			model.expires_at = expires_at // neste momento o formato está em milisegundos. ex: 15887889845
		})
	}

	// Formata os valores para o padrão do Banco. ex: '2020-07-17 10:56:20
	static get dates() {
		return [
			'created_at',
			'updated_at',
			'expires_at'
		]
	}
}

module.exports = PasswordReset
