'use strict'; // Enforce use of strict verion of JavaScript

/*	@Doc
	This module will hold all the related codes and routes for multiplayer mode
*/


const app = require('../index').app;
// Socket.io used to maintain active web-sockets
const io = require('socket.io')(http);




// socket.io events.
// io.on('connection', (socket) => {
// 	print('a user connected');
// 	socket.on('disconnect', () => print('user disconnected'));
// 	socket.on('message', (msg) => print(msg));
// 	// socket.emit('message', 'New msg from server')
// 	socket.broadcast.emit('message', 'msg to all units')
// });
