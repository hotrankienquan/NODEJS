import db from '../models/index';
import bcrypt from 'bcryptjs';
const salt = bcrypt.genSaltSync(10);

let createNewUser = async (data) => {
	return new Promise(async (resolve, reject) => {
		try {
			let hashPasswordFromBcrypt = await hashUserPassword(data.password);
			await db.User.create({
				email: data.email,
				password: hashPasswordFromBcrypt,
				firstName: data.firstName,
				lastName: data.lastName,
				address: data.address,
				phonenumber: data.phonenumber,
				gender: data.gender === '1' ? true : false,
				roleId: data.roleId
			})
			resolve('ok create a new user success')
		} catch (e) {
			reject(e)
		}
	})
}

let hashUserPassword = (password) => {
	return new Promise(async (resolve, reject) => {
		try {

			let hashPassword = await bcrypt.hashSync(password, salt);
			resolve(hashPassword)
		} catch (e) {
			reject(e);
		}
	})
}
let getAllUser = () => {
	return new Promise(async (resolve, reject) => {
		// dung try catch de tranh' cac exception
		try {
			let users = db.User.findAll({
				raw: true
			})
			resolve(users);// thay vi return thi resolve tuong tu
		} catch (e) {
			reject(e)
		}
	})
}
let getUserInfoById = (userId) => {
	return new Promise(async (resolve, reject) => {
		try {
			let user = await db.User.findOne({
				where: { id: userId },
				raw: true
			})
			if (user) {
				resolve(user)

			} else {
				resolve({})
			}
		} catch (e) {
			reject(e)
		}
	})
}
// let updateUserData = (data) => {
// 	return new Promise(async (resolve, reject) => {
// 		try {
// 			let user = await db.User.findOne({
// 				where: { id: data.id }
// 			})
// 			if (user) {
// 				// user chính là lấy từ dưới db, còn data lấy từ form người dùng
// 				user.firstName = data.firstName;
// 				user.lastName = data.lastName;
// 				user.address = data.address;
// 				await user.save();
// 				let allUsers = await db.User.findAll();
// 				resolve(allUsers);
// 			} else {
// 				resolve();
// 			}
// 		} catch (e) {
// 			console.log(e)
// 		}
// 	})

// }
let updateUserData = (data) => {
	return new Promise(async (resolve, reject) => {
		try {
			let user = await db.User.findOne({
				where: { id: data.id },

			})
			if (user) {
				user.firstName = data.firstName;
				user.lastName = data.lastName;
				user.address = data.address;

				await user.save();
				let allUsers = await db.User.findAll();
				resolve(allUsers);

			} else {
				resolve();

			}

		} catch (e) {
			console.log(e);
		}
	})
}
let deleteUserById = (userId) => {
	return new Promise(async (resolve, reject) => {
		try {
			let user = await db.User.findOne({
				//id <- userId : userId gan cho id
				where: { id: userId }
			})
			if (user) {
				await user.destroy();
			}
			resolve(); // tuong duong return;
		} catch (e) {
			reject(e)
		}
	})
}
module.exports = {
	createNewUser: createNewUser,
	getAllUser: getAllUser,
	getUserInfoById: getUserInfoById,
	updateUserData: updateUserData,
	deleteUserById: deleteUserById
}