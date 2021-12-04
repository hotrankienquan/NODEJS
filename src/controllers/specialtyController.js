import specialtyService from '../services/specialtyService'
let createNewSpe = async (req, res) => {
	try {

		let infor = await specialtyService.createNewSpe(req.body);
		return res.status(200).json(infor);
	} catch (error) {
		console.log(error)
		return res.status(200).json({
			errCode: -1,
			errMessage: 'error from the server'
		})
	}
}
module.exports = {
	createNewSpe
}