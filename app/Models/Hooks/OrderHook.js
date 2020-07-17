'use strict'

const OrderHook = exports = module.exports = {}

/**
 * Atualizará o valor de cada item
 */
OrderHook.updateValues = async (model) => {

	model.$sideLoaded.subtotal = await model.items().getSum('subtotal')

	/**
	 * Não pode ter nome igual à um RELACIONAMENTO,
	 * por isso chama-se qty_items
	 */
	model.$sideLoaded.qty_items = await model.items().getSum('quantity')

	model.$sideLoaded.discount = await model.discounts().getSum('discount')

	model.total = model.$sideLoaded.subtotal - model.$sideLoaded.discount

}
