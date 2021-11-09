import userService from '../services/userService';
let handleLogin = async (req, res) => {
	let email = req.body.email;
	let password = req.body.password;
	// check email exist
	// compare password
	// return userInfo
	// access_token: JWT : json web token
	// code thổ dân: if(email === '' || email === 'undefined' || email = NULL)
	if (!email || !password) {
		return res.status(500).json({
			errCode: 1,
			message: 'Missing inputs !!'
		})
	}
	let userData = await userService.handleUserLogin(email, password);

	return res.status(200).json({
		errCode: userData.errCode,
		message: userData.errMessage,
		user: userData.user ? userData.user : {}
	})
}
let handleGetAllUsers = async (req, res) => {
	let id = req.query.id;
	if (!id) {
		return res.status(200).json({
			errCode: 1,
			errMessage: 'Missing ',
			users: []
		})
	}
	let users = await userService.getALlUsers(id);
	// console.log(users)
	return res.status(200).json({
		errCode: 0,
		errMessage: 'OK',
		users: users
	})
}
let handleCreateNewUser = async (req, res) => {
	let message = await userService.createNewUser(req.body);
	console.log(message);
	return res.status(200).json(message);
}
let handleDeleteUser = async (req, res) => {
	//truyen id len la xoa dc
	if (!req.body.id) {
		return res.status(500).json({
			errCode: 1,
			errMessage: 'Missing'
		})
	}
	let message = await userService.deleteUser(req.body.id);
	console.log(message);
	return res.status(200).json(message);
}
let handleEditUser = async (req, res) => {
	let data = req.body;
	let message = await userService.updateUserData(data);
	return res.status(200).json(message);
}
let getAllCode = async (req, res) => {
	try {
		// setTimeout(async () => {

			
		// }, 5000)
		let data = await userService.getAllCodeService(req.query.type);
		return res.status(200).json(data);
	} catch (error) {
		console.log('get all code error', error)
		return res.status(500).json({
			errCode: -1,
			errMessage: 'Error from server'
		})
	}
}
module.exports = {
	handleLogin: handleLogin,
	handleGetAllUsers: handleGetAllUsers,
	handleCreateNewUser: handleCreateNewUser,
	handleEditUser: handleEditUser,
	handleDeleteUser: handleDeleteUser,
	getAllCode: getAllCode
}