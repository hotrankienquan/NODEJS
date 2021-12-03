import db from '../models/index';
require('dotenv').config();
let postAppointment = (data) => {
	return new Promise(async (resolve, reject) => {
		try {
			if (!data.email || !data.doctorId || !data.timeType || !data.date) {
				resolve({
					errCode: 1,
					errMessage: 'Missing parameters'
				})

			} else {
				// 	fullName: this.state.fullName,
				// phoneNumber: this.state.phoneNumber,
				// email: this.state.email,
				// passEmail: this.state.passEmail,

				// address: this.state.address,
				// reason: this.state.reason,
				// birthday: this.state.birthday,

				// selectedGender: '',
				// doctorId: this.state.doctorId
				//upsert patient
				let user = await db.User.findOrCreate({
					where: { email: data.email },
					defaults: {
						email: data.email,
						password: data.passEmail,
						roleId: 'R3'
					},
				});
				if (user && user[0]) {
					// db.Booking : Booking la ten modalName
					await db.Booking.findOrCreate({
						where: { patientId: user[0].id },
						defaults: {
							statusId: 'S1',
							patientId: user[0].id,
							doctorId: data.doctorId,
							date: data.date,
							timeType: data.timeType,
						}
					})
				}
				resolve({
					errCode: 0,
					errMessage: 'Save infor patient succeed'
				})
			}
		} catch (error) {
			reject(error)
		}
	})
}
module.exports = {
	postAppointment
}