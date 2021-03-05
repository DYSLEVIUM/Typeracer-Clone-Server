const cors = require('cors');
const express = require('express');
const socketio = require('socket.io');
const mongoose = require('mongoose');
const helmet = require('helmet'); //  helps secure express app by adding various HTTP headers

const path = require('path');

const middlewares = require('./middlewares');

const socketIoHandler = require('./utils/socketIoHandler'); //  socketHandler

const app = express();

//  middlewares
app.use(cors());
app.use(helmet());

app.use(express.static('dist/typeracer-clone'));

const port = process.env.PORT || 80;

const server = app.listen(port, () => {
	console.log('Server Listening at port ', port);
}); //  returns http object

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname));
	res.set('Content-Security-Policy');
});

app.use(middlewares.notFound);

app.use(middlewares.errorHandler);

const io = socketio(server); //  passing express-server object to socketio server

//  connecting to mongodb atlas
mongoose.connect(
	`mongodb+srv://${process.env.dbuser}:${process.env.dbpass}@${process.env.clusterName}.fgjma.mongodb.net/${process.env.dbname}?retryWrites=true&w=majority`,
	{ useNewUrlParser: true, useUnifiedTopology: true },
	() => {
		console.log('Connected to database!');
	}
);

io.on('connect', socketIoHandler(io));
