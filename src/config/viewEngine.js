// tao function cu phap es6
// bien var :khai bao global, let thi local
import express from 'express';
let configViewEngine = (app) => {
	app.use(express.static("./src/public"));
	app.set("view engine", "ejs"); /// jsp, blade
	app.set("views", "./src/views");
}

module.exports = configViewEngine;
