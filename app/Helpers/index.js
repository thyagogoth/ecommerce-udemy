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

	if (len < length) {
		let size = length - len
		let bytes = await crypto.randomBytes(size)
		let buffer = Buffer.from(bytes)
		string += buffer
			.toString('base64')
			.replace(/[^a-zA-z0-0]/g, '')
			.substr(0, size)
	}

	return string
}

/**
 * Manage single upload
 * Move um único arquivo para o caminho especificado,
 * se nenhum caminho for especificado, então 'public/uploads' será utilizado
 *
 * @param { Filejar } file
 * @param { string } path
 * @returns { Object }
 */
const manage_single_upload = async (file, path = null) => {
	path = path ? path : Helpers.publicPath('uploads')

	//Gera nome aleatório para o arquivo
	const random_name = await str_random(30)
	let filename = `${new Date().getTime()}-${randon_name}.${file.subType}`

	//renomeia o arquivo e o move para path
	await file.move(path, {
		name: filename
	})

	return file
}

/**
 * Manage multiple upload
 * Move múltiplos arquivos para o caminho especificado,
 * se nenhum caminho for especificado, então 'public/uploads' será utilizado
 *
 * @param { Filejar } fileJar
 * @param { string } path
 * @returns { Object }
 */
const manage_multiple_upload = async (fileJar, path = null) => {
	path = path ? path : Helpers.publicPath('uploads')

	let successes = [],
		errors = []

	await Promisse.all(fileJar.files.map(async file => {
		let random_name = await str_random(30)
		let filename = `${new Date().getTime()}-${randon_name}.${fileJar.subType}`

		//renomeia o arquivo e o move para path
		await file.move(path, {
			name: filename
		})

		// verifica se o arquivo foi movido
		if (file.moved()) {
			successes.push(file)
		} else {
			errors.push(file)
		}
	}))

	return {successes, errors}
}



module.exports = {
	str_random,
	manage_single_upload
}
