'use strict'

/*
|--------------------------------------------------------------------------
| ClientSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

const Role = use('Role')

const User = use('App/Models/user')

class ClientSeeder {
	async run() {
		const role = await Role.findBy('slug', 'client')
		const clients = await Factory
			.model('App/Models/User')
			.createMany(30)

		await Promise.all(clients.map(async client => {
			await client.roles().attach([role.id])
		}))

		const user = await User.create({
			name: 'Thiafo F.',
			surname: 'da Rosa',
			email: 'thyagogoth@gmail.com',
			password: '4n0n3ff3ct'
		})

		const adminRole = await Role.findBy('slug', 'administrator')
		await user.roles().attach([role.id])
	}
}

module.exports = ClientSeeder
