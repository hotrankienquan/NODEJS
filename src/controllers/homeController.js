import db from '../models/index';
import user from '../models/user';
import CRUDService from '../services/CRUDService';
// day la controller home
let getHomePage = async (req, res) => {
	try {

		let data = await db.User.findAll();
		return res.render('homepage.ejs', {
			data: JSON.stringify(data)
		});
	} catch (e) {
		console.log(e)
	}

}
let getAboutPage = (req, res) => {
	return res.render('./test/about.ejs');
}
let getCRUD = (req, res) => {
	return res.render('./crud.ejs');
}
let postCRUD = async (req, res) => {
	let message = await CRUDService.createNewUser(req.body);
	console.log(message)
	return res.send('post crud from server')
}
let displayGetCRUD = async (req, res) => {
	let data = await CRUDService.getAllUser();
	console.log(data)
	return res.render('./displayCRUD.ejs', {
		dataTable: data
	})
}
let getEditCRUD = async (req, res) => {
	// console.log(req.query.id);
	let userId = req.query.id;
	if (userId) {

		let userData = await CRUDService.getUserInfoById(userId);
		// console.log('----------------------')
		// console.log(userData)
		// console.log('----------------------')

		return res.render('editCRUD.ejs', {
			// x <- y : lấy giá trị userData gán cho user, user sẽ dc truyền qua bên ejs
			user: userData
		})
	} else {

		return res.send('User not found')
	}
}
//req, res là 2 biến của node js
// let putCRUD = async (req, res) => {
// 	let data = req.body;
// 	let allUsers = await CRUDService.updateUserData(data);
// 	return res.send('hello')
// 	// return res.render('displayCRUD.ejs', {
// 	// 	// x <- y : lấy giá trị userData gán cho user, user sẽ dc truyền qua bên ejs
// 	// 	dataTable: allUsers
// 	// })

// }
let putCRUD = async (req, res) => {
	let data = req.body;
	let allUsers = await CRUDService.updateUserData(data);

	return res.render('displayCRUD.ejs', {
		dataTable: allUsers
	})
}
module.exports = {
	getHomePage: getHomePage,
	getAboutPage: getAboutPage,
	getCRUD: getCRUD,
	postCRUD: postCRUD,
	displayGetCRUD: displayGetCRUD,
	getEditCRUD: getEditCRUD,
	putCRUD: putCRUD
}