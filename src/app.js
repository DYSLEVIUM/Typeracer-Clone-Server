const express = require('express');
const socketio = require('socket.io');
const mongoose = require('mongoose');
const helmet = require('helmet'); //  helps secure express app by adding various HTTP headers

const path = require('path');

const middlewares = require('./middlewares');

const socketIoHandler = require('./utils/socketIoHandler'); //  socketHandler

const app = express();

//  middlewares
app.use(helmet());

app.use(express.static('dist/typeracer-clone'));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname));
});

// app.get('/', (req, res) => {
//   res.send('Express is working!');
// });

app.use(middlewares.notFound);

app.use(middlewares.errorHandler);

const port = 80;

const server = app.listen(port, () => {
  console.log('Server Listening at port ', port);
}); //  returns http object

const io = socketio(server); //  passing express-server object to socketio server

//  connecting to mongodb locally

// mongoose.connect(
//   'mongodb://localhost/typeracer-clone',
// { useNewUrlParser: true, useUnifiedTopology: true },
//   () => {
//     console.log('Connected to database!');
//   }
// );

//  connecting to mongodb atlas
mongoose.connect(
  'mongodb+srv://pushpa:pushpa@typeracer-clone.fgjma.mongodb.net/typeracer-clone?retryWrites=true&w=majority',
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log('Connected to database!');
  }
);

io.on('connect', socketIoHandler(io));
