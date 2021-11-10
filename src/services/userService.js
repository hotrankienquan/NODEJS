import db from '../models/index';
import bcrypt from 'bcryptjs';

const salt = bcrypt.genSaltSync(10);
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

let handleUserLogin = (email, password) => {
	return new Promise(async (resolve, reject) => {
		try {
			let userData = {};
			let isExist = await checkUserEmail(email);
			if (isExist) {
				//user already exist
				let user = await db.User.findOne({
					attributes: ['email', 'roleId', 'password', 'firstName', 'lastName'],
					where: { email: email },
					raw: true,

				});
				if (user) {
					//compare password: dùng cách 1 hay cách 2 đều chạy đúng cả =))
					// Cách 1: dùng asynchronous (bất đồng bộ)
					// let check = await bcrypt.compare(password, user.password);


					// Cách 2: dùng synchronous  (đồng bộ)
					// let check = bcrypt.compareSync(password, user.password);

					// if (check) {
						userData.errCode = 0;
						userData.errMessage = 'OK';

						delete user.password;
						userData.user = user;
					// }
					// else {
					// 	userData.errCode = 3;
					// 	userData.errMessage = 'Wrong password';
					// }
				} else {
					userData.errCode = 2;
					userData.errMessage = `User not found`;
				}

			} else {
				//return error
				userData.errCode = 1;
				userData.errMessage = `Your's Email isn't exist in our system, plz try other email`
			}
			resolve(userData); // resolve phải đặt ở đây, lỗi đặt resolve ở hàng trên trong else
		} catch (e) {
			reject(e);
		}
	})
}

let checkUserEmail = (userEmail) => {
	return new Promise(async (resolve, reject) => {
		try {
			let user = await db.User.findOne({
				where: { email: userEmail }
			})
			if (user) {
				resolve(true)
			} else {
				resolve(false)
			}

		} catch (e) {
			reject(e)
		}
	})
}


let getALlUsers = (userId) => {
	return new Promise(async (resolve, reject) => {
		try {
			let users = '';
			if (userId === 'All') {
				users = await db.User.findAll({
					attributes: {
						exclude: ['password']
					}
				})
			} if (userId && userId !== 'All') {

				users = await db.User.findOne({
					where: { id: userId },
					attributes: {
						exclude: ['password']
					}
				})
			}

			resolve(users)

		} catch (e) {
			reject(e)
		}
	})
}
//ben frontend se goi toi ham nay de tao user
// ham createNewUser nay mình đã ko hash password
let createNewUser = (data) => {
	return new Promise(async (resolve, reject) => {
		try {
			// check email exxist
			let check = await checkUserEmail(data.email);
			if (check === true) {
				resolve({
					errCode: 1,
					errMessage: 'Your email is already in used, plz try again'
				})
			}
			else {
				// let hashPasswordFromBcrypt = await hashUserPassword(data.password);
				await db.User.create({
					email: data.email,
					password: data.password,
					firstName: data.firstName,
					lastName: data.lastName,
					address: data.address,
					phonenumber: data.phonenumber,
					gender: data.gender,
					roleId: data.roleId,
					positionId: data.positionId
				})
				resolve({
					errCode: 0,
					errMessage: 'OK'
				})
			}

		} catch (e) {
			reject(e)
		}
	})
}
let deleteUser = (id) => {
	return new Promise(async (resolve, reject) => {
		let user = await db.User.findOne({
			where: { id: id }
		})
		if (!user) {
			resolve({
				errCode: 2,
				errMessage: 'The user is not exist'
			})
		}
		await db.User.destroy({
			where: { id: id }
		})
		resolve({
			errCode: 0,
			errMessage: 'OK'
		})

	})
}
let updateUserData = (data) => {
	return new Promise(async (resolve, reject) => {
		try {
			if (!data.id) {
				resolve({
					errCode: 2,
					errMessage: 'require parameter'
				})
			}
			let user = await db.User.findOne({
				where: { id: data.id },
				raw: false
			})
			if (user) {
				user.firstName = data.firstName;
				user.lastName = data.lastName;
				user.address = data.addres;
				await user.save();
				// await db.User.save({
				// 	firstName: data.firstName,
				// 	lastName: data.lastName,
				// 	address: data.address
				// })
				resolve({
					errCode: 0,
					message: 'update user success'
				})

			} else {
				resolve({
					errCode: 1,
					errMessage: 'user not found'
				});

			}
		} catch (error) {
			reject(error)
		}
	})
}
let getAllCodeService = (typeInput) => {
	return new Promise(async (resolve, reject) => {
		try {
			if (!typeInput) {
				resolve({
					errCode: 1,
					errMessage: 'Missing required parameters'
				})
			} else {

				let res = {};
				let allcode = await db.Allcode.findAll({
					where: { type: typeInput }
				});
				res.errCode = 0;
				res.data = allcode; // append data từ db ra vào object rỗng để trả về controller
				resolve(res);
			}
		} catch (e) {
			reject(e)
			// khi bi loi chay vao day bị reject thì nó sẽ trả về catch exception bên userController
		}
	})
}
module.exports = {
	handleUserLogin: handleUserLogin,
	getALlUsers: getALlUsers,
	createNewUser: createNewUser,
	deleteUser: deleteUser,
	updateUserData: updateUserData,
	getAllCodeService: getAllCodeService
}