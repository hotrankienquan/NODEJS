import patientService from '../services/patientService';
// controller co 2 tham so req, res la cua thz thu vien express
let postAppointment = async (req, res) => {
	try {
		// method get: truyen query de lay cac tham so tren url vd: ?id=4

		let infor = await patientService.postAppointment(req.body);
		return res.status(200).json(infor);
	} catch (error) {
		console.log(error)
		return res.status(200).json({
			errCode: -1,
			errMessage: 'error from the server'
		})
	}
}
let postVerifyBookAppointment = async (req, res) => {
	try {

		let infor = await patientService.postVerifyBookAppointment(req.body);
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
	postAppointment,
	postVerifyBookAppointment
}