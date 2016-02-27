var path = require("path");
var express = require("express");
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = 9000;


app.use('/', express.static(__dirname + '/'));

app.get('/', function(req, res) {
	res.sendFile(__dirname+'../index.html');
	});
	
http.listen(port, function(){
  console.log('listening on *:9000');
});

//SocketIO

io.on('connection',function(socket){
	var usersJSON = '{"clientIDs":["abc","xyz","ghi"]}';
	var currIntervalID;
	//future implementation: if possible, simplify on by getting event
	// var events = ['clientID','real_time','battery','rBatt','accel','rAccel','pos'];

	console.log('a machine has connected');

	//display all users
	socket.emit('clientIDs',usersJSON);
	console.log(usersJSON);
	// switch(event){
	// 	case 'clientID':
	// 		break;
	// 	case 'battery':
	// 		break;
	// 	case 'accel':
	// 		break;
	// 	case 'pos':
	// 		break;
	// }


	
	//once clientID is selected, display data
	//input: '{"clientID":String}'
	//output: '{"clientID":String, "accelX":int, "accelY":int, "accelZ"int}'
	socket.on('clientID', function(data){
		if(currIntervalID != null){
			clearInterval(currIntervalID)
		};
		if(isJSON(data)){
			var parsed = JSON.parse(data);
			var curr_ID = parsed.clientID;
			var message = realTimeQ(curr_ID);
			currIntervalID = setInterval(function(){
				socket.emit('real_time',message);
				}, 5000);
		} else{
			console.log("real-time socket JSON incorrect");
			console.log(data);
		}
	});

	//listen for battery query
	//input: '{"clientID":String, "datetime"Array[]}'
	//output: '{"clientID":String, "datetime":Array[], "battery":Array[]}'
	socket.on('battery',function(data){
		if(isJSON(data)){
			//input & output values
			var parsed = JSON.parse(data);	
			var curr_ID = parsed.clientID;
			var rDateTime = parsed.datetime;
			//function to query server
			var message = batteryQuery(curr_ID, rDateTime);
			socket.emit('rBatt',message);
		} else{
			console.log("battery socket JSON incorrect");
			console.log(data);
		}
	});

	//listen for accel query
	//input: '{"clientID":String, "datetime"Array[]}'
	//output: '{"clientID":"abc", "datetime":Array[], "accelX":Array[], "accelY":Array[], "accelZ"Array[]}'
	socket.on('accel', function(data){
		if(isJSON(data)){
			//input & output values
			var parsed = JSON.parse(data);	
			var curr_ID = parsed.clientID;
			var rDateTime = parsed.datetime;
			//function to query server
			var message = accelQuery(curr_ID, rDateTime);
			socket.emit('rAccel',message);
		} else{
			console.log("accel socket JSON incorrect");
			console.log(data);
		}
	});

	//listen for GPS query
	//input:
	//output:
	socket.on('pos', function(data){
	});
});

//helper mock functions with data
function realTimeQ(curr_ID){
	var x = 0;
	var y = 5;
	var z = 3;
	var message = '{"clientID":'+curr_ID+
					', "accelX":'+x+
					', "accelY":'+y+
					', "accelZ":'+z+'}';
	console.log(message);
	return message;

}

function batteryQuery(curr_ID, rDateTime){
	var rBatt = [100,90,60,40,30,20]
	var message = '{"clientID":'+curr_ID+
					', "datetime":'+rDateTime+
					', "battery":'+rBatt+'}';
	console.log(message);
	return message;
};

function accelQuery(curr_ID,rDateTime){
	var rX = [0,0,0,0];
	var rY = [3,3,3,3];
	var rZ = [1,2,3,4];
	var message = '{"clientID":'+curr_ID+
					', "datetime":'+rDateTime+
					', "accelX":'+rX+
					', "accelY":'+rY+
					', "accelZ":'+rZ+'}';
	console.log(message);
	return message;
};


function isJSON(message){
    try {
        JSON.parse(message);
    } catch (e) {
        return false;
    }
    return true;
};