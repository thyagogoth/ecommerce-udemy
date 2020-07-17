'use strict'

const crypto = use('crypto')

const Helpers = use('Helpers') // importa os Helpers nativos do AdonisJS


/**
 * Generate random String
 *
 * @param { int } length - Tamanho da string a gerar
 * @returns { string }
 */
const str_random = async (length = 40) => {
	let string = ''
	let len = string.length

	if ( len < length ) {
		let size = length - len
		let bytes = await crypto.randomBytes(size)
		let buffer = Buffer.from(bytes)
		string += buffer
			.toString('base64')
			.replace(/[^a-zA-z0-0]/g,'')
			.substr(0, size)
	}

	return string
}

module.exports = {
	str_random
}
