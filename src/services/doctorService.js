import db from '../models/index';
require('dotenv').config();
import _, { reject } from 'lodash';
const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;
//ben service se return new Promise
let getTopDoctorHome = (limitInput) => {
	return new Promise(async (resolve, reject) => {
		try {
			let users = await db.User.findAll({
				limit: limitInput,
				where: { roleId: 'R2' },
				order: [["createdAt", "DESC"]],
				attributes: {
					exclude: ['password']
				},
				include: [
					{ model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
					{ model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] },
				],
				raw: true,
				nest: true
			})
			resolve({
				errCode: 0,
				data: users
			})
		} catch (error) {
			reject(error)
		}
	})
}
let getAllDoctors = () => {
	return new Promise(async (resolve, reject) => {
		try {
			let doctors = await db.User.findAll({
				where: { roleId: 'R2' },
				attributes: {
					exclude: ['password', 'image']
				}
			})
			//trong promise dung resolve
			resolve({
				errCode: 0,
				data: doctors
			})
		} catch (error) {
			reject(error)
		}
	})
}
/*     --------------------------------                          */
let saveDetailInforDoctor = (inputData) => {
	return new Promise(async (resolve, reject) => {
		try {

			if (
				!inputData.doctorId || !inputData.contentHTML
				|| !inputData.contentMarkdown || !inputData.action

				|| !inputData.selectedPrice || !inputData.selectedPayment
				|| !inputData.selectedProvince
				|| !inputData.nameClinic || !inputData.addressClinic
				|| !inputData.note
			) {
				resolve({
					errCode: 1,
					errMessage: 'missing paramaters'
				})
			} else {
				// update insert to Markdown
				if (inputData.action === 'CREATE') {

					await db.Markdown.create({
						contentHTML: inputData.contentHTML,
						contentMarkdown: inputData.contentMarkdown,
						description: inputData.description,
						doctorId: inputData.doctorId
					})
				} else if (inputData.action === 'EDIT') {
					let doctorMarkdown = await db.Markdown.findOne({
						where: { doctorId: inputData.doctorId },
						raw: false
						// luu y raw: false
					})
					if (doctorMarkdown) {
						doctorMarkdown.contentHTML = inputData.contentHTML
						doctorMarkdown.contentMarkdown = inputData.contentMarkdown
						doctorMarkdown.description = inputData.description
						doctorMarkdown.updatedAt = new Date();
						await doctorMarkdown.save();
					}
				}
				// upsert to Doctor_Infor table
				let doctorInfor = await db.Doctor_Infor.findOne({
					where: {
						doctorId: inputData.doctorId,

					},
					raw: false
				})
				// await findOne tra ra object neu tim thay

				// || !inputData.selectedPrice || !inputData.selectedPayment
				// || !inputData.selectedProvince
				// || !inputData.nameClinic || !inputData.addressClinic
				// || !inputData.note
				if (doctorInfor) {
					// update
					doctorInfor.doctorId = inputData.doctorId;
					doctorInfor.priceId = inputData.selectedPrice
					doctorInfor.provinceId = inputData.selectedProvince
					doctorInfor.paymentId = inputData.selectedPayment

					doctorInfor.addressClinic = inputData.addressClinic
					doctorInfor.nameClinic = inputData.nameClinic
					doctorInfor.note = inputData.note
					await doctorInfor.save();
				}
				else {
					//create
					await db.Doctor_Infor.create({
						doctorId: inputData.doctorId,
						priceId: inputData.selectedPrice,
						provinceId: inputData.selectedProvince,
						paymentId: inputData.selectedPayment,

						addressClinic: inputData.addressClinic,
						nameClinic: inputData.nameClinic,
						note: inputData.note
					})

				}
				resolve({
					errCode: 0,
					errMessage: 'save infor doctor succeed!'
				})
			}

		} catch (error) {
			reject(error)
		}
	})
}
/*     --------------------------------                          */

let getDetailDoctorbyId = (inputId) => {
	return new Promise(async (resolve, reject) => {
		try {
			// error boundary
			if (!inputId) {
				resolve({
					errCode: 1,
					errMessage: 'mising parameter'
				})
			} else {
				let data = await db.User.findOne({
					where: {
						id: inputId
					},
					attributes: {
						exclude: ['password']
					},
					include: [
						{
							model: db.Markdown,
							attributes: ['description', 'contentHTML', 'contentMarkdown']
						},
						{
							model: db.Allcode, as: 'positionData', attributes: ['valueVi', 'valueEn']
						},
						{
							model: db.Doctor_Infor,
							attributes: {

								exclude: ['id', 'doctorId']
							},
							include: [
								{ model: db.Allcode, as: 'priceTypeData', attributes: ['valueVi', 'valueEn'] },
								{ model: db.Allcode, as: 'provinceTypeData', attributes: ['valueVi', 'valueEn'] },
								{ model: db.Allcode, as: 'paymentTypeData', attributes: ['valueVi', 'valueEn'] }
							]
						},

					],
					raw: false,
					nest: true
				})
				// convert anh sang base64 tra ve client
				if (data && data.image) {
					data.image = Buffer.from(data.image, 'base64').toString('binary');

				}
				if (!data) data = {};
				resolve({
					errCode: 0,
					data: data
				})
			}

		} catch (error) {

			reject(error)
		}
	})
}
// req.body ben controller truyen qua, ben nay nhan dc cuc data
let bulkCreateSchedule = (data) => {
	return new Promise(async (resolve, reject) => {
		try {
			// doctorId: selectedDoctor.value,
			// 	date: formatedDate
			// console.log('check date from bulk create schedule nodejs', data)
			if (!data.arrSchedule || !data.doctorId || !data.date) {
				resolve({
					errCode: 1,
					errMessage: 'Missing parameters'
				})
			} else {
				let schedule = data.arrSchedule;
				if (schedule && schedule.length > 0) {

					schedule = schedule.map(item => {
						item.maxNumber = MAX_NUMBER_SCHEDULE;
						return item;
					})
				}
				// console.log('data send qua serive', schedule)

				let existing = await db.Schedule.findAll({
					where: { doctorId: data.doctorId, date: data.date },
					attributes: ['timeType', 'date', 'doctorId', 'maxNumber'],
					raw: true
				});

				// console.log('check exisitng', existing)
				// console.log('check exisitng', schedule)
				// a = '5';
				// b = +a; // => b = 5
				let toCreate = _.differenceWith(schedule, existing, (a, b) => {
					return a.timeType === b.timeType && +a.date === +b.date;
				})
				if (toCreate && toCreate.length > 0) {
					await db.Schedule.bulkCreate(toCreate);
				}
				// console.log(' check difference', toCreate)

				resolve({
					errCode: 0,
					errMessage: 'OK'
				})
			}
		} catch (error) {
			reject(error)
		}
	})
}
let getScheduleByDate = (doctorId, date) => {
	return new Promise(async (resolve, reject) => {
		try {
			if (!doctorId || !date) {
				resolve({
					errCode: 1,
					errMessage: "Missing paramaters"
				})
			} else {
				let dataFindDb = await db.Schedule.findAll({
					where: {
						// key db: key truyen vao
						doctorId: doctorId,
						date: date
					},
					// lay valueVi valueEn gui len phia front de hien thi ra
					include: [
						{ model: db.Allcode, as: 'timeTypeData', attributes: ['valueVi', 'valueEn'] },
						{ model: db.User, as: 'doctorData', attributes: ['firstName', 'lastName'] },

					],
					raw: false,
					nest: true
				})
				if (!dataFindDb) dataFindDb = [];
				resolve({
					errCode: 0,
					data: dataFindDb
				})

			}
		} catch (e) {
			reject(e);
		}
	})
}
let getExtraInforDoctorById = (doctorId) => {
	return new Promise(async (resolve, reject) => {
		try {
			if (!doctorId) {
				resolve({
					errCode: 1,
					errMessage: 'missing required parameters'
				})
			} else {
				//choc toi modelName cua model doctor_info la  Doctor_Infor
				let dataFindDb = await db.Doctor_Infor.findOne({
					where: {
						doctorId: doctorId
					},
					attributes: {
						exclude: ['id', 'doctorId']
					},
					include: [
						{ model: db.Allcode, as: 'priceTypeData', attributes: ['valueVi', 'valueEn'] },
						{ model: db.Allcode, as: 'provinceTypeData', attributes: ['valueVi', 'valueEn'] },
						{ model: db.Allcode, as: 'paymentTypeData', attributes: ['valueVi', 'valueEn'] }

					],
					raw: false,
					nest: true
				})

				if (!dataFindDb) data = [];
				resolve({
					errCode: 0,
					data: dataFindDb
				})
			}
		} catch (error) {
			reject(error)
		}
	})
}
let getProfileDoctorById = (inputId) => {
	return new Promise(async (resolve, reject) => {
		try {
			if (!inputId) {
				resolve({
					errCode: 1,
					errMessage: 'missing required parameters'
				})
			} else {
				let data = await db.User.findOne({
					where: {
						id: inputId
					},
					attributes: {
						exclude: ['password']
					},
					include: [
						{
							model: db.Markdown,
							attributes: ['description', 'contentHTML', 'contentMarkdown']
						},
						{
							model: db.Allcode, as: 'positionData', attributes: ['valueVi', 'valueEn']
						},
						{
							model: db.Doctor_Infor,
							attributes: {

								exclude: ['id', 'doctorId']
							},
							include: [
								{ model: db.Allcode, as: 'priceTypeData', attributes: ['valueVi', 'valueEn'] },
								{ model: db.Allcode, as: 'provinceTypeData', attributes: ['valueVi', 'valueEn'] },
								{ model: db.Allcode, as: 'paymentTypeData', attributes: ['valueVi', 'valueEn'] }
							]
						},

					],
					raw: false,
					nest: true
				})
				// convert anh sang base64 tra ve client
				if (data && data.image) {
					data.image = Buffer.from(data.image, 'base64').toString('binary');

				}
				if (!data) data = {};
				resolve({
					errCode: 0,
					data: data
				})
			}
		} catch (error) {
			reject(error)
		}
	})
}
module.exports = {
	getTopDoctorHome: getTopDoctorHome,
	getAllDoctors: getAllDoctors,
	saveDetailInforDoctor: saveDetailInforDoctor,
	getDetailDoctorbyId: getDetailDoctorbyId,
	bulkCreateSchedule: bulkCreateSchedule,
	getScheduleByDate: getScheduleByDate,
	getExtraInforDoctorById,
	getProfileDoctorById
}