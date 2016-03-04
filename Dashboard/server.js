var path = require("path");
var express = require("express");
var app = express();
var http = require('http').Server(app);
//var io = require('socket.io')(http);
var port = 9000;


app.use('/', express.static(__dirname + '/'));

app.get('/', function(req, res) {
    res.sendFile(path.normalize(__dirname+'/../Dashboard/index.html'));
	});
	
http.listen(port, function(){
  console.log('listening on *:9000');
});

//SocketIO
// io.on('connection',function(socket){
	// var usersJSON = userIDs();
	// var currIntervalID;
	// //future implementation: if possible, simplify on by getting event
	// // var events = ['clientID','real_time','battery','rBatt','accel','rAccel','pos'];

	// console.log('a machine has connected');

	// //display all users
	// socket.emit('clientIds',usersJSON);
	// // console.log(usersJSON);
	
	// // switch(event){
	// // 	case 'clientID':
	// // 		break;
	// // 	case 'battery':
	// // 		break;
	// // 	case 'accel':
	// // 		break;
	// // 	case 'pos':
	// // 		break;
	// // }



	// //once clientID is selected, display data
	// //input: '{"clientID":String}'
	// //output: '{"clientID":String, "accelX":int, "accelY":int, "accelZ"int}'
	// socket.on('clientId', function(data){
		// if(currIntervalID != null){
			// clearInterval(currIntervalID)
		// };
		// if(isJSON(data)){
			// var parsed = JSON.parse(data);
			// var curr_ID = parsed.clientId;
			// var message = realTimeQ(curr_ID);
			// currIntervalID = setInterval(function(){
				// socket.emit('real_time',message);
				// }, 1000);
		// } else{
			// console.log("real-time socket JSON incorrect");
			// console.log(data);
		// }
	// });

	// //listen for battery query
	// //input: '{"clientID":String, "datetime"Array[]}'
	// //output: '{"clientID":String, "datetime":Array[], "battery":Array[]}'
	// socket.on('battery',function(data){
		// if(currIntervalID != null){
			// clearInterval(currIntervalID)
		// };
		// if(isJSON(data)){
			// // console.log(data);
			// //input & output values
			// var parsed = JSON.parse(data);	
			// var curr_ID = parsed.clientID;
			// var dateTimeRec = parsed.dateTimeRec;
			// // console.log(dateTimeRec);
			// //function to query server
			// var message = batteryQuery(curr_ID, dateTimeRec);
			// socket.emit('rBatt',message);
		// } else{
			// console.log("battery socket JSON incorrect");
			// console.log(data);
		// }
	// });

	// //listen for accel query
	// //input: '{"clientID":String, "datetime"Array[]}'
	// //output: '{"clientID":"abc", "datetime":Array[], "accelX":Array[], "accelY":Array[], "accelZ"Array[]}'
	// socket.on('accel', function(data){
		// if(currIntervalID != null){
			// clearInterval(currIntervalID)
		// };
		// if(isJSON(data)){
			// //input & output values
			// var parsed = JSON.parse(data);	
			// var curr_ID = parsed.clientID;
			// var dateTimeRec = parsed.dateTimeRec;
			// //function to query server
			// var message = accelQuery(curr_ID, dateTimeRec);
			// socket.emit('rAccel',message);
		// } else{
			// console.log("accel socket JSON incorrect");
			// console.log(data);
		// }
	// });

	// //listen for GPS query
	// //input:
	// //output:
	// socket.on('pos', function(data){
	// });
// });

// //helper mock functions with data
// function userIDs(){
	// var userIDs = '{"clientIds":[{"clientId":"351559070571963"},{"clientId":"999999999999999"},{"clientId":"000000000000000"},{"clientId":"555555555555555"}]}';
	// // console.log(userIDs);
	// return userIDs;
// }
// function realTimeQ(curr_ID){
	// var x = 0.8559271097183228;
	// var y = 0.1041477769613266;
	// var z = 9.460687637329102;
	// var message = '{"clientId":'+curr_ID+
					// ', "accelX":'+x+
					// ', "accelY":'+y+
					// ', "accelZ":'+z+'}';	
	// console.log(message);
	// return message;

// }

// function batteryQuery(curr_ID, dateTimeRec){
	// // var rBatt = [{"batt":0.9999999988079071},{"batt":0.6099999988079071},{"batt":0.4699999988079071},{"batt":0.2399999988079071}];
	// // var message = '{"clientId":'+JSON.stringify(curr_ID)+
	// // 				', "dateTimeRec":'+JSON.stringify(dateTimeRec)+
	// // 				', "batteryRec":'+JSON.stringify(rBatt)+'}';
	// var message = '[{"datetime":"1456869619000","battery":0.9999999988079071,"clientId":"351559070571963"},{"datetime":"1456869619500","battery":0.6099999988079071,"clientId":"351559070571963"},{"datetime":"1456869620000","battery":0.4699999988079071,"clientId":"351559070571963"},{"datetime":"1456869620500","battery":0.2399999988079071,"clientId":"351559070571963"}]';
	// console.log(message);
	// return message;
// };

// function accelQuery(curr_ID,dateTimeRec){
// // var rX = [{"accelX":0.8559271097183228},{"accelX":0.9559271097183228},{"accelX":0.8559271097183228},{"accelX":0.9559271097183228}];
// // var rY = [{"accelY":0.1041477769613266},{"accelY":0.1041477769613266},{"accelY":0.1041477769613266},{"accelY":0.1041477769613266}];
// // var rZ = [{"accelZ":9.4606876373291024},{"accelZ":8.4606876373291024},{"accelZ":7.4606876373291024},{"accelZ":6.4606876373291024}];
// // 	var message = '{"clientId":'+JSON.stringify(curr_ID)+
// // 					', "dateTimeRec":'+JSON.stringify(dateTimeRec)+
// // 					', "accelXRec":'+JSON.stringify(rX)+
// // 					', "accelYRec":'+JSON.stringify(rY)+
// // 					', "accelZRec":'+JSON.stringify(rZ)+'}';
	// var message = '[{"datetime":"1456869619000","accelX":0.8559271097183228,"accelY":0.1041477769613266,"accelZ":9.4606876373291024,"clientId":"351559070571963"},{"datetime":"1456869619500","accelX":0.9559271097183228,"accelY":0.1041477769613266,"accelZ":8.460687637329102,"clientId":"351559070571963"},{"datetime":"1456869620000","accelX":0.8559271097183228,"accelY":0.1041477769613266,"accelZ":7.4606876373291024,"clientId":"351559070571963"},{"datetime":"1456869620500","accelX":0.9559271097183228,"accelY":0.1041477769613266,"accelZ":6.460687637329102,"clientId":"351559070571963"}]';
	// console.log(message);
	// return message;
// };


// function isJSON(message){
    // try {
        // JSON.parse(message);
    // } catch (e) {
        // return false;
    // }
    // return true;
// };