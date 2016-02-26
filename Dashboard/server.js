var path = require("path");
var express = require("express");
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = 9000;


app.use('/', express.static(__dirname + '/'));

app.get('/', function(req, res) {
	res.sendFile(__dirname+'/index.html');
	});
	
http.listen(port, function(){
  console.log('listening on *:9000');
});

//SocketIO

io.on('connection',function(socket){
	console.log('a user connected');
	//display all users
	socket.emit('users','{"users":["abc","xyz","ghi"]}');

	//once user is selected, display data
	socket.on('user', function(data){
		var curr_user;
		console.log(data);
		console.log(curr_user);
		if(data == curr_user){
			setInterval(function(){
			socket.emit('real_time_data',
				{
					'user':curr_user,
					'curr':[32.0,64.0,128.0]
				});
			}, 6000);
			
		}
	});
	


	socket.on('battery',function(data){

	});

	socket.on('accel', function(data){

	});

	socket.on('pos', function(data){

	});
	// socket.on('data request',function(data){
	// 	console.log(data);
	// });
});
