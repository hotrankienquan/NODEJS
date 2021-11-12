import doctorService from '../services/doctorService';
let getTopDoctorHome = async (req, res) => {
	let limit = req.query.limit;
	if(!limit) limit = 10; 
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
let getAllDoctors =async(req, res) => {
	try {
		let doctors =await doctorService.getAllDoctors();
		return res.status(200).json(doctors);
	} catch (error) {
		console.log(e)
		return res.status(200).json({
			errCode: -1,
			errMessage: 'error from the server'
		})
	}
}
let postInforDoctor = async(req, res) => {
	try {
		let response =await doctorService.saveDetailInforDoctor(req.body);
		return res.status(200).json(response);
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
	postInforDoctor:postInforDoctor
}