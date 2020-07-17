'use strict'

/*
|--------------------------------------------------------------------------
| RoleSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
// const Factory = use('Factory')

const Role = use('Role')

class RoleSeeder {
	async run() {

		// Role para criação do administrador do sistema
		await Role.create({
			name: 'Administrator',
			slug: 'administrator',
			description: 'Administrator do sistema!'
		})

		// Role para criação do cargo de gerente
		await Role.create({
			name: 'Manager',
			slug: 'manager',
			description: 'Gerente da loja!'
		})

		// Role para criação do acesso de cliente
		await Role.create({
			name: 'Client',
			slug: 'client',
			description: 'Cliente da loja!'
		})
	}
}

module.exports = RoleSeeder
