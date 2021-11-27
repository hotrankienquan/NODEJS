import doctorService from '../services/doctorService';
let getTopDoctorHome = async (req, res) => {
	let limit = req.query.limit;
	if (!limit) limit = 10;
	try {
		let response = await doctorService.getTopDoctorHome(+limit);// +limit: convert string sang number
		return res.status(200).json(response)
	} catch (error) {
		console.log(error)
		return res.status(200).json({
			errCode: -1,
			message: 'error from server'
		})
	}
}
let getAllDoctors = async (req, res) => {
	try {
		let doctors = await doctorService.getAllDoctors();
		return res.status(200).json(doctors);
	} catch (error) {
		console.log(e)
		return res.status(200).json({
			errCode: -1,
			errMessage: 'error from the server'
		})
	}
}

let postInforDoctor = async (req, res) => {
	try {
		let response = await doctorService.saveDetailInforDoctor(req.body);
		return res.status(200).json(response);
	} catch (error) {
		console.log(error)
		return res.status(200).json({
			errCode: -1,
			errMessage: 'error from the server'
		})
	}
}

let bulkCreateSchedule = async (req, res) => {
	try {
		// controller dai ka, de het moi viec cho thz service lo
		let infor = await doctorService.bulkCreateSchedule(req.body)
		return res.status(200).json(infor)
	} catch (error) {
		console.log(error)
		return res.status(200).json({
			errCode: -1,
			errMessage: 'error from the server'
		})
	}
}
let getDetailDoctorbyId = async (req, res) => {
	try {

		let infor = await doctorService.getDetailDoctorbyId(req.query.id);
		return res.status(200).json(infor);
	} catch (error) {
		console.log(error)
		return res.status(200).json({
			errCode: -1,
			errMessage: 'error from the server'
		})
	}
}
let getScheduleByDate = async (req, res) => {
	try {
		// method get: truyen query de lay cac tham so tren url vd: ?id=4

		let infor = await doctorService.getScheduleByDate(req.query.doctorId, req.query.date);
		console.log('kuri', infor)
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
	getTopDoctorHome: getTopDoctorHome,
	getAllDoctors: getAllDoctors,
	postInforDoctor: postInforDoctor,
	getDetailDoctorbyId: getDetailDoctorbyId,
	bulkCreateSchedule: bulkCreateSchedule,
	getScheduleByDate: getScheduleByDate
}