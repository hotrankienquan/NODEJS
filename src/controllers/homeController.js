import db from '../models/index';
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
let deleteCRUD = async (req, res) => {
	let id = req.query.id;
	// cái gì cần thao tác đến db, cần tốn thời gian => async await
	if (id) {

		await CRUDService.deleteUserById(id);
		return res.send('delete user success')
	}
	else {
		return res.send('user not found')
	}

}
module.exports = {
	getHomePage: getHomePage,
	getAboutPage: getAboutPage,
	getCRUD: getCRUD,
	postCRUD: postCRUD,
	displayGetCRUD: displayGetCRUD,
	getEditCRUD: getEditCRUD,
	putCRUD: putCRUD,
	deleteCRUD: deleteCRUD
}