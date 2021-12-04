const db = require("../models")

let createNewSpe = (data) => {
	return new Promise(async (resolve, reject) => {
		try {

			if (!data.name || !data.imageBase64 || !data.desHTML
				|| !data.desMarkdown
			) {
				resolve({
					errCode: 1,
					errMessage: 'Missing parameters'
				})
			} else {
				await db.Specialty.create({
					name: data.name,
					image: data.imageBase64,
					descriptionHTML: data.desHTML,
					descriptionMarkdown: data.desMarkdown
				})
				resolve({
					errCode: 0,
					errMessage: 'ok'
				})
			}
		} catch (error) {
			reject(error)
		}
	})
}
let getAllSpe = () => {
	return new Promise(async (resolve, reject) => {
		try {
			let data = await db.Specialty.findAll()
			if (data && data.length > 0) {
				// html chi hieu duoc string, ko hieu dc binary duoi database
				data.map(item => {

					item.image = Buffer.from(item.image, 'base64').toString('binary');
					return item;
				})

			}
			resolve({
				errCode: 0,
				errMessage: 'ok',
				data
			})

		} catch (error) {
			reject(error)
		}
	})
}
module.exports = {
	createNewSpe
	, getAllSpe
}