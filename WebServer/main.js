/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//to run, you will need to npm install mqtt -g (sudo access might be required
var mqtt = require('mqtt');
var options = {
    keepalive: 0,
//    port: 800
}


console.log('Started MQTT Websocket');
var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://45.55.1.125', options);
 
client.on('connect', function () {
  client.subscribe('team-mat-canary');
  console.log('connected');
});
 

//called when a message event is received
client.on('message', function (topic, message) {
  // message is Buffer 
  console.log(message.toString());

  // var messageJSON = JSON.parse(message.toString());
  // console.log(messageJSON);

  // console.log(message);
	var id = generateUUID();
  	var stringMessage = message.toString();
			
 	//the following block will log the hearbeat to elasticsearch
 	//TODO: uncomment this when the android client sends the proper JSON
 	// if (messageJSON.hasOwnProperty('type') && messageJSON.type === 'heartbeat'){

 	var URL = "http://45.55.1.125:9200/message/heartbeat/" + id;
	 	
 	var request = require('request');
	request({
		url: URL, 
		method: 'PUT',
		body: stringMessage 
	}, //the callback function when something is successfully stored in elasticsearch
		function(error, response, body){
			if(error) {
	    		console.log(error);
			} else {
	    		console.log(body);
		  }
	   }
    );
//}





// !!!  TODO: FOR RECEIVING SOS MESSAGES FROM WATCH
// if(receiveSOSMessage){
//   sendSOSToDashboard();
// }

// !!!  TODO: ADD LOGIC FOR DETECTION OF FALL AND SEND SOS TO DASHBOARD
// if(detectFALL){
//   sendSOSToDashboard();
// }


// !!!  TODO: SOCKET CODE BELOW
// var app = require('http').createServer(handler)
// var io = require('socket.io')(app);
// var fs = require('fs');

//SocketIO Server-side
var express = require("express");
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = 9000;
var path = require('path');

// app.listen(80);
app.use('/', express.static(__dirname + '/'));

// function handler (req, res) {
//   fs.readFile(__dirname + '/index.html',
//   function (err, data) {
//     if (err) {
//       res.writeHead(500);
//       return res.end('Error loading index.html');
//     }

//     res.writeHead(200);
//     res.end(data);
//   });
// }
app.get('/', function(req, res) {
  // path.resolve('/../Dashboard/index.html');
  res.sendFile(__dirname+path.normalize('/../Dashboard/index.html'));
  });
  
http.listen(port, function(){
  console.log('listening on *:9000');
});


// io.on('connection', function (socket) {
//   socket.emit('news', { hello: 'world' });
//   socket.on('my other event', function (data) {
//     console.log(data);
//   });
// });
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
    //  case 'clientID':
    //      break;
    //  case 'battery':
    //      break;
    //  case 'accel':
    //      break;
    //  case 'pos':
    //      break;
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
                }, 1000);
        } else{
            console.log("real-time socket JSON incorrect");
            console.log(data);
        }
    });

    //listen for battery query
    //input: '{"clientID":String, "datetime"Array[]}'
    //output: '{"clientID":String, "datetime":Array[], "battery":Array[]}'
    socket.on('battery',function(data){
        if(currIntervalID != null){
            clearInterval(currIntervalID)
        };
        if(isJSON(data)){
            console.log(data);
            //input & output values
            var parsed = JSON.parse(data);  
            var curr_ID = parsed.clientID;
            var rDateTime = parsed.datetime;
            console.log(rDateTime);
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
        if(currIntervalID != null){
            clearInterval(currIntervalID)
        };
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
    var rBatt = [{per:100},{per:60},{per:30},{per:20}];
    var message = '{"clientID":'+JSON.stringify(curr_ID)+
                    ', "datetime":'+JSON.stringify(rDateTime)+
                    ', "battery":'+JSON.stringify(rBatt)+'}';
    console.log(message);
    return message;
};

function accelQuery(curr_ID,rDateTime){
    var rX = [{x:0},{x:0},{x:0},{x:0}];
    var rY = [{y:3},{y:3},{y:3},{y:3}];
    var rZ = [{z:1},{z:2},{z:3},{z:4}];
    var message = '{"clientID":'+JSON.stringify(curr_ID)+
                    ', "datetime":'+JSON.stringify(rDateTime)+
                    ', "accelX":'+JSON.stringify(rX)+
                    ', "accelY":'+JSON.stringify(rY)+
                    ', "accelZ":'+JSON.stringify(rZ)+'}';
    console.log(message);
    return message;
};


//=-=socketIO code termination=-=//


if(isJSON(message)){
    var inputJSON = JSON.parse(message);
    var inputDateTime = inputJSON.datetime;
    var inputAccelX = inputJSON.accelX;
    var inputAccelY = inputJSON.accelY;
    var inputAccelZ = inputJSON.accelZ;
    var inputbattery = inputJSON.accelZ;
    var batteryPercent = inputbattery*100;
    var inputClientId = inputJSON.clientId;
    
    if(inputAccelX<1){
      console.log('fall');
    }
  }
  else{
    console.log('Not a JSON message')
  }

function isJSON(message){
    try {
        JSON.parse(message);
    } catch (e) {
        return false;
    }
    return true;
  }
  

  // if (messageJSON.hasOwnProperty("status") && messageJSON.status === "disconnect"){
  //     console.log("Intention to exit was logged");
  //     client.end();
  // }
});

getHeartbeatResponses(1456464385000,1456464387000);

//**HELPER FUNCTIONS BELOW***
function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
};


//@Wes: use this function to retrun all the heartbeats that fall within the start and end times
function getHeartbeatResponses(start, end){
	var payload = {
		"size": 5000,
		"sort": [
		    {
		        "datetime": 
		            {"order":"desc"}
            }
	    ],
		"query": {
	    	"filtered": {
	      		"query": {
	       			"match_all": {}
	      		},
		      	"filter": {
		        	"range": {
		          		"datetime": {
		            		"to": end,
		            		"from": start
		          		}
		        	}			
		    	}
	    	}
	  	}
	}

	var payloadString = JSON.stringify(payload);
	var URL = "http://45.55.1.125:9200/message/heartbeat/_search"
	var request = require('request');
	request({
		url: URL, 
		method: 'POST',
		body: payloadString 
	}, //the callback function when something is successfully retrieved
		function(error, response, body){
			if(error) {
	    		console.log(error);
			} else {
	    		console.log(body);
			}
		});
	// }

};

function isJSON(message){
    try {
        JSON.parse(message);
    } catch (e) {
        return false;
    }
    return true;
};

getHeartbeatResponses(0, "now");