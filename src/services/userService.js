import db from '../models/index';
import bcrypt from 'bcryptjs';

let handleUserLogin = (email, password) => {
	return new Promise(async (resolve, reject) => {
		try {
			let userData = {};

			let isExist = await checkUserEmail(email);
			if (isExist) {
				//user already exist
				let user = await db.User.findOne({
					where: { email: email },
					attributes: [
						'email', 'roleId', 'password'
					],
					raw: true
					// attributes: {
					// 	include: ['email', 'roleId']
					// }
				});
				if (user) {
					//compare password
					let check = await bcrypt.compareSync(password, user.password); // false
					if (check) {
						userData.errCode = 0;
						userData.errMessage = 'Ok'
						console.log(user)
						delete user.password;
						userData.user = user
					} else {
						userData.errCode = 3;
						userData.errMessage = `Wrong password. Please try!!`;
					}
				} else {
					userData.errCode = 2;
					userData.errMessage = `User is not exist. Please try!!`;

				}
			} else {
				//return error
				userData.errCode = 1;
				userData.errMessage = `Your's Email isn't exist. Please try!!`;
				resolve(userData)
			}
		} catch (e) {
			reject(e)
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
module.exports = {
	handleUserLogin: handleUserLogin
}