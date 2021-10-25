import express from 'express';
import bodyParser from 'body-parser'; // lay cac tham so tu client
import viewEngine from "./config/viewEngine";
import initWebRoutes from './route/web';
import connectDB from './config/connectDB';
require('dotenv').config();

let app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


viewEngine(app);
initWebRoutes(app);
connectDB();
let port = process.env.PORT || 6969;
// port === undefined => gan port = 6969
app.listen(port, () => {
	//callback
	console.log('backend nodejs is running in the port: ', port);
})