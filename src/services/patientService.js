import db from '../models/index';
require('dotenv').config();

import emailService from './emailService'
import { v4 as uuidv4 } from 'uuid';

let buildUrlEmail = (doctorId, token) => {

	let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`
	return result
}
let postAppointment = (data) => {
	return new Promise(async (resolve, reject) => {
		try {
			if (!data.email || !data.doctorId || !data.timeType || !data.date
				|| !data.fullName || !data.passEmail
			) {
				resolve({
					errCode: 1,
					errMessage: 'Missing parameters'
				})

			} else {
				let token = uuidv4(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'

				await emailService.sendSimpleEmail({
					receiverEmail: data.email,
					patientName: data.fullName,
					time: data.timeString,
					doctorName: data.doctorName,
					language: data.language,
					redirectLink: buildUrlEmail(data.doctorId, token)
				})
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
							token: token
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
let postVerifyBookAppointment = (data) => {
	return new Promise(async (resolve, reject) => {
		try {
			if (!data.token || !data.doctorId) {
				resolve({
					errCode: 1,
					errMessage: 'Missing parameters'
				})
			} else {
				let apppointment = await db.Booking.findOne({
					where: {
						doctorId: data.doctorId,
						token: data.token,
						statusId: 'S1'
					},
					raw: false // tra ra 1 sequelize object
					//raw: true  // tra ra 1 object cua javascript
				})

				if (apppointment) {
					apppointment.statusId = 'S2'
					await apppointment.save();//ham save thi gan statusId truoc
					resolve({
						errCode: 0,
						errMessage: "Update appointment succeed"
					})
				} else {
					resolve({
						errCode: 2,
						errMessage: "Appointment has been actived or does not exist"
					})
				}
			}
		} catch (error) {
			reject(error)
		}
	})
}
module.exports = {
	postAppointment,
	postVerifyBookAppointment
}