'use strict'

class Login {
	get rules() {
		return {
			// validation rules
			email: 'required|email',
			password: 'required'
		}
	}

	get messages() {
		return {
			'email.required': 'O e-mail já existe',
			'email.email': 'O e-mail informado parece ser inválido!',
			'password.required': 'A senha é obrigatória!',
			'password.confirmed': 'As senhas não coincidem!',
		}
	}
}

module.exports = Login
