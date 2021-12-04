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
module.exports = {
	createNewSpe
}