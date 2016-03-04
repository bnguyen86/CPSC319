/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//to run, you will need to npm install mqtt -g (sudo access might be required

// !!!  TODO: FOR RECEIVING SOS MESSAGES FROM WATCH
// if(receiveSOSMessage){
//   sendSOSToDashboard();
// }

// !!!  TODO: ADD LOGIC FOR DETECTION OF FALL AND SEND SOS TO DASHBOARD
// if(detectFALL){
//   sendSOSToDashboard();
// }


// !!!  TODO: SOCKET CODE BELOW
//var app = require('http').createServer(handler)
//var io = require('socket.io')(app);
//var fs = require('fs');
var http = require('http'),
io = require('socket.io');

// Create server & socket
var server = http.createServer(function(req, res)
{
  // Send HTML headers and message
  res.writeHead(404, {'Content-Type': 'text/html'});
  res.end("<h1>Sorry, couldn't find anything! 404</h1>");
});
server.listen(80);
io = io.listen(server);

//var io = require("socket.io")(80);

io.on('connection',function(socket){
    var usersJSON = userIDs();
    var currIntervalID;
    //future implementation: if possible, simplify on by getting event
    // var events = ['clientID','real_time','battery','rBatt','accel','rAccel','pos'];

    console.log('a machine has connected');

    //display all users
    socket.emit('clientIds',usersJSON);
    console.log(usersJSON);


    //once clientID is selected, display accel data
    //input: '{"clientID":String}'
    //output: '{"clientID":String, "accelX":int, "accelY":int, "accelZ"int}'
    socket.on('clientId', function(data){
        if(currIntervalID != null){
            clearInterval(currIntervalID)
        };
        if(isJSON(data)){
            var parsed = JSON.parse(data);
            var curr_ID = parsed.clientId;
            var message = realTimeQ(curr_ID);
            currIntervalID = setInterval(function(){
                socket.emit('real_time',message);
                }, 1000);
        } else{
            console.log("real-time socket JSON incorrect");
            //console.log(data);
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
            console.log("Searching for battery data");
            //input & output values
            var parsed = JSON.parse(data);  
            var curr_ID = parsed.clientID;
            var start = parsed.start;
            var end = parsed.end;
            // console.log(dateTimeRec);
            //function to query server
            batteryQuery(curr_ID, start, end);
        } else{
            console.log("battery socket JSON incorrect");
            //console.log(data);
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
            var dateTimeRec = parsed.dateTimeRec;
            //function to query server
            var message = accelQuery(curr_ID, start, end);
            socket.emit('rAccel',message);
        } else{
            console.log("accel socket JSON incorrect");
            //console.log(data);
        }
    });

    //listen for GPS query
    //input:
    //output:
    socket.on('pos', function(data){
    });

//helper functions

//returns the list of cliendId
//OUTPUT:
function userIDs(){
    var userIDs = '{"clientIds":[{"clientId":"351559070571963"},{"clientId":"999999999999999"},{"clientId":"000000000000000"},{"clientId":"555555555555555"}]}';
    console.log(userIDs);
    return userIDs;
}
function realTimeQ(curr_ID){
    var x = 0.8559271097183228;
    var y = 0.1041477769613266;
    var z = 9.460687637329102;
    var message = '{"clientId":'+curr_ID+
                    ', "accelX":'+x+
                    ', "accelY":'+y+
                    ', "accelZ":'+z+'}';    
    console.log(message);
    return message;

}

function batteryQuery(curr_ID, start, end){
//Mock code with needed input and expected output
    // var rBatt = [{"batt":0.9999999988079071},{"batt":0.6099999988079071},{"batt":0.4699999988079071},{"batt":0.2399999988079071}];
    // var message = '{"clientId":'+JSON.stringify(curr_ID)+
    //              ', "dateTimeRec":'+JSON.stringify(dateTimeRec)+
    //              ', "batteryRec":'+JSON.stringify(rBatt)+'}';
    //var message = '[{"datetime":"1456869619000","battery":0.9999999988079071,"clientId":"351559070571963"},{"datetime":"1456869619500","battery":0.6099999988079071,"clientId":"351559070571963"},{"datetime":"1456869620000","battery":0.4699999988079071,"clientId":"351559070571963"},{"datetime":"1456869620500","battery":0.2399999988079071,"clientId":"351559070571963"}]';
    //console.log(message);
	var payload = {
		"size": 5000,
		"sort": [
		    {
		        "datetime": 
		            {"order":"desc"}
            }
	    ],
		"fields": ['clientId','datetime', 'battery'],
		"query": {
			"term" : { "clientId" : curr_ID }
	      		}
//		      	"filter": {
//		        	"range": {
		          		// "datetime": {
		            		// "to": end,
		            		// "from": start
		          		// }
		        	// }			
		    	// }
	    	}

	var payloadString = JSON.stringify(payload);
	var URL = "http://45.55.1.125:9200/message/heartbeat/_search"
	var message;
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
				console.log("Found data");
				socket.emit('rBatt', body);
				//console.log(body);
				//message = body;
				//console.log(message);
			}
		});
		//console.log("Message = " + body);
		//return message;
	// }

};

function accelQuery(curr_ID, start, end){
// var rX = [{"accelX":0.8559271097183228},{"accelX":0.9559271097183228},{"accelX":0.8559271097183228},{"accelX":0.9559271097183228}];
// var rY = [{"accelY":0.1041477769613266},{"accelY":0.1041477769613266},{"accelY":0.1041477769613266},{"accelY":0.1041477769613266}];
// var rZ = [{"accelZ":9.4606876373291024},{"accelZ":8.4606876373291024},{"accelZ":7.4606876373291024},{"accelZ":6.4606876373291024}];
//  var message = '{"clientId":'+JSON.stringify(curr_ID)+
//                  ', "dateTimeRec":'+JSON.stringify(dateTimeRec)+
//                  ', "accelXRec":'+JSON.stringify(rX)+
//                  ', "accelYRec":'+JSON.stringify(rY)+
//                  ', "accelZRec":'+JSON.stringify(rZ)+'}';
    var message = '[{"datetime":"1456869619000","accelX":0.8559271097183228,"accelY":0.1041477769613266,"accelZ":9.4606876373291024,"clientId":"351559070571963"},{"datetime":"1456869619500","accelX":0.9559271097183228,"accelY":0.1041477769613266,"accelZ":8.460687637329102,"clientId":"351559070571963"},{"datetime":"1456869620000","accelX":0.8559271097183228,"accelY":0.1041477769613266,"accelZ":7.4606876373291024,"clientId":"351559070571963"},{"datetime":"1456869620500","accelX":0.9559271097183228,"accelY":0.1041477769613266,"accelZ":6.460687637329102,"clientId":"351559070571963"}]';
    console.log(message);
    return message;
};
});



//=-=socketIO code termination=-=//

var mqtt = require('mqtt');
var options = {
    keepalive: 0,
	clean: true
//    port: 800
}

console.log('Started MQTT Websocket');
var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://45.55.1.125', options);

client.on('connect', function() {
  client.publish('team-mat-canary', null, {retain: true});
  client.subscribe('team-mat-canary');
  console.log('connected to mqtt broker');
}); 

//called when a message event is received
client.on('message', function (topic, message) {
  // message is Buffer 
  console.log("Receiving message");

  var messageJSON = JSON.parse(message.toString());
  console.log(messageJSON);

  // console.log(message);
	var id = generateUUID();
  	var stringMessage = message.toString();
			
 	//the following block will log the hearbeat to elasticsearch
 	//TODO: uncomment this when the android client sends the proper JSON
 	if (messageJSON.hasOwnProperty('type') && messageJSON.type === 'heartbeat'){
	console.log("Logging heartbeat");
 	var URL = "http://45.55.1.125:9200/message/heartbeat/" + id;
	 	
 	var request = require('request');
	request({
		url: URL, 
		method: 'PUT',
		body: stringMessage
	}, //the callback function when something is successfully stored in elasticsearch
		function(error, response, body){
			if(error) {
				console.log("Error occurred");
	    		console.log(error);
			} else {
				console.log("Body contents");
	    		console.log(body);
		  }
	   }
    );
}


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

//getHeartbeatResponses(1456464385000,1456464387000);

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


//@Wes: use this function to return all the heartbeats that fall within the start and end times
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
	    		//console.log(body);
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