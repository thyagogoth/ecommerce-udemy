'use strict'

class AuthRegister {
	get rules() {
		return {
			// validation rules
			name: 'required',
			surname: 'required',
			email: 'required|email|unique:users,email',
			password: 'required|confirmed'
		}
	}

	get messages() {
		return {
			'name.required': 'O nome é obrigatório!',
			'surname.required': 'O sobrenome é obrigatório!',
			'email.required': 'O e-mail é obrigatório!',
			'email.email': 'O e-mail informado parece ser inválido!',
			'email.unique': 'O e-mail informado já está cadastrado!',
			'password.required': 'A senha é obrigatória!',
			'password.confirmed': 'As senhas não coincidem!',
		}
	}
}

module.exports = AuthRegister
