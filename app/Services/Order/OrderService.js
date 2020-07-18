'use strict'

const Database = use('Database')

class CouponService {
	constructor(model, trx = null) {
		this.motel = model
		this.trx = trx
	}

	async syncItems(items) {
		if (!Array.isArray(items)) {
			return false
		}
		await this.model.items().delete(this.trx)
		await this.model.items().createMany(items, this.trx)
	}

	async updateItems(items) {
		let currentItems = await this.model
			.items()
			.whereIn('id', items.map(item => item.id))
			.fetch(this.trx)

		// deleta os itens que o user não quer mais
		await this.model
			.items()
			.whereNotIn('id', items.map(item => item.id))
			.delete(this.trx)

		// Atualiza os valores e quantidades
		await Promise.all(currentItems.rows.map(async item => {
			item.fill(items.find(n => n.id === item.id))
			await item.save(this.trx)
		}))

	}

	async canApplyDiscount(coupon) {

		/**
		 * Verificar a validade (data/período) do cupom
		 */
		const now = Date().getTime() // retorna a data em milisegundos
		if (now >= coupon.valid_from.getTime() ||
			(typeof coupon.valid_until == 'object' && coupon.valid_until.getTime() < now)
		) {
			//verifica se o cupom já entrou em validade
			// verifica se há uma data de expiração
			// se houver data de expiração verifica se o cupom expirou
			return false
		}

		const couponProducts = await Database
			.from('coupon_products')
			.where('coupon_id', coupon.id)
			.pluck('product_id')

		const couponClients = await Database
			.from('coupon_user')
			.where('coupon_id', coupon_id)
			.pluck('user_id')

		// Verificar se o cupom não está associado à produtos & clientes específicos
		if (
			Array.isArray(couponProducts) && couponProducts.length < 1 &&
			Array.isArray(couponClients) && couponClients.length < 1
		) {
			/**
			 * Caso não esteja associado a cliente ou produto específico, é de uso livre
			 */
			return true
		}

		let isAssociatedToProducts,
			isAssociatedToClients = false

		if (Array.isArray(couponProducts) && couponProducts.length > 0) {
			isAssociatedToProducts = true
		}

		if (Array.isArray(couponClients) && couponClients.length > 0) {
			isAssociatedToClients = true
		}

		// Verifica se os itens são validos aos cupons
		const productsMatch = await Database
			.from('order_items')
			.where('order_id', this.model.id)
			.whereIn('product_id', couponProducts)
			.pluck() // retorna apanas os valores do array, disassociando os índices

		/**
		 * Caso de uso 1 - O cupom está assciado a clientes & produtos
		 */
		if (isAssociatedToClients && isAssociatedToProducts) {
			const clientMatch = couponClients.find(
				client => client === this.model.user_id
			)
			if (clientMatch && Array.isArray(productsMatch) && productsMatch.length > 0) {
				return true
			}
		}

		/**
		 * Caso de uso 2 - O cupom está associado apenas à produtos
		 */
		if (isAssociatedToProducts && Array.isArray(productsMatch) && productsMatch.length > 0) {
			return true
		}

		/**
		 * Caso de uso 3 - O cupom está associado a 1 ou mais clientes (e nenhum produto)
		 */
		if (isAssociatedToClients && Array.isArray(clientsMatch) && clientsMatch.length > 0) {
			const match = couponClients.find(cliente => client === this.model.user_id)
			if (match) {
				return true
			}
		}

		/**
		 * Se nenhum dos 3 casos acima retornar true, então o cupom está associado à
		 * Clientes ou Produtos ou os DOIS, porém nenhum dos produtos deste pedido está elegível ao desconto
		 * e o cliente que fez a compora também não poderá utilizar este desconto
		 */
		if (isAssociatedToClients && Array.isArray(clientsMatch) && clientsMatch.length > 0) {
			const match = couponClients.find(cliente => client === this.model.user_id)
			if (match) {
				return true
			}
		}
	}

}

module.exports = CouponService
