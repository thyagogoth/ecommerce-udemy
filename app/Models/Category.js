'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Category extends Model {

	/**
	 * Relacionamento entre Categoria e Imagem (imagem de capa da categoria)
	 */

	 image() {
		 /**
		 * PrimaryKey e Foreign Key já foram definidas em suas respectivos migrations
		 */
		 return this.belongsTo('App/Models/Image')
	 }

	 /**
	 * Relacionamento entre Categoria e Produtos
	 */
	products() {
		/**
		 * PrimaryKey e Foreign Key já foram definidas em suas respectivos migrations
		 */
		return this.belongsToMany('App/Models/Product')
	}

}

module.exports = Category
