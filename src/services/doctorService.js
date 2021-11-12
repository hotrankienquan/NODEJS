import { reject } from 'bcrypt/promises';
import db from '../models/index';

//ben service se return new Promise
let getTopDoctorHome =(limitInput) => {
	return new Promise(async (resolve, reject) => {
		try {
			let users = await db.User.findAll({
				limit: limitInput,
				where: {roleId: 'R2'},
				order: [["createdAt", "DESC"]],
				attributes: {
					exclude: ['password']
				},
				include: [
					{model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi']},
					{model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi']},
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
let getAllDoctors =() => {
	return new Promise(async(resolve, reject) => {
		try {
			let doctors =  await db.User.findAll({
				where: {roleId: 'R2'},
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
let saveDetailInforDoctor =(inputData) => {
	return new Promise(async(resolve, reject) => {
		try {
			if(!inputData.doctorId || !inputData.contentHTML
				|| !inputData.contentMarkdown){
				resolve({
					errCode: 1,
					errMessage: 'missing paramaters'
				})
			}else {
				await db.Markdown.create({
					contentHTML: inputData.contentHTML,
					contentMarkdown: inputData.contentMarkdown,
					description: inputData.description,
					doctorId: inputData.doctorId
				})
				resolve({
					errCode:0,
					errMessage: 'save infor doctor succeed!'
				})
			}
			
		} catch (error) {
			reject(error)
		}
	})
}
module.exports = {
	getTopDoctorHome : getTopDoctorHome,
	getAllDoctors:getAllDoctors,
	saveDetailInforDoctor:saveDetailInforDoctor
}