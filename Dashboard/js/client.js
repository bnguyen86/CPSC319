<<<<<<< HEAD
var socket = io();
var curr_ID;
//battery var
var rDateTime = '[{"date":"2010-01-01"},{"date":"2010-02-01"},{"date":"2010-03-01"},{"date":"2010-04-01"}]';


//parse the clientIDs into buttons
socket.on('clientIDs',function(data){
	// console.log(data);
	var parsed = JSON.parse(data);
	userButtonCreation(parsed);
});

// displays the users available
function userButtonCreation(parsed){
	for(i = 0; i < parsed.clientIDs.length; i++){
		// console.log("parsed length: " + parsed.clientIDs.length);
		var element = document.createElement("button");
		var id  =  parsed.clientIDs[i];
		element.id = id;
		element.innerHTML = id;
		element.addEventListener("click", function(){
			userSelection(this.id);
		});
		var dis_loc = document.getElementById("user_dis");
		dis_loc.appendChild(element);
	}
};

// returns the user selected
function userSelection(id){
	curr_ID = id;
	console.log("selected clientID: " + id);
	var message = '{"clientID":"'+ id +'"}';
	socket.emit('clientID',message);
};


// displays the selected users real-time accel data
socket.on('real_time',function(data){
	console.log(data);
});

//query function
function query(event){
	var message = '{"clientID":"'+curr_ID+
					'", "datetime":'+rDateTime+'}';
	switch(event){
		case 'clientID':
			socket.emit('clientID',message);
			break;
		case 'battery':
			socket.emit('battery',message);
			break;
		case 'accel':
			socket.emit('accel',message);
			break;
		case 'pos':
			socket.emit('pos',message);
			break;
	}
};

//display/render data
socket.on('rBatt',function(data){
	batteryDisplay(data);
});

socket.on('rAccel',function(data){
	// accelDisplay(data);
});

// socket.on('rPos');



// //battery query function
// function battQ(){
// 	var message = '{"clientID":"'+curr_ID+
// 					'", "datetime":'+rDateTime+'}';
// 	socket.emit('battery',message);
// }

// //accel query function
// function accelQ(){
// 	var message = '{"clientID":"'+curr_ID+
// 					'", "datetime":'+rDateTime+'}';
// 	socket.emit('accel',message);
// }

// //pos query function
// function posQ(){
// 	var message = '{"clientID":"'+curr_ID+
// 					'", "datetime":'+rDateTime+'}';
// 	socket.emit('pos',message);
// }
=======
var socket = io();
var curr_ID;
//battery var
var qDate = [{"start": "1456869619000", "end": "1456869620500"}];
// var rDateTime = [{"datetime":"1456869619000"},{"datetime":"1456869619500"},{"datetime":"1456869620000"},{"datetime":"1456869620500"}];


//parse the clientIDs into buttons
socket.on('clientIds',function(data){
	// console.log(data);
	var parsed = JSON.parse(data);
	console.log(parsed);
	if(document.getElementById("user_dis").childNodes.length == 1){
		userButtonCreation(parsed);
	}
});

// displays the users available
function userButtonCreation(parsed){
	for(i = 0; i < parsed.clientIds.length; i++){
		// console.log("parsed length: " + parsed.clientIds.length);
		// console.log(parsed.clientIds[i].clientId);
		var element = document.createElement("button");
		var id  =  parsed.clientIds[i].clientId;
		element.tag = "uid";
		element.id = id;
		element.innerHTML = id;
		element.addEventListener("click", function(){
			userSelection(this.id);
		});
		var dis_loc = document.getElementById("user_dis");
		dis_loc.appendChild(element);
	}
};

// returns the user selected
function userSelection(id){
	curr_ID = id;
	console.log("selected clientId: " + id);
	var message = '{"clientId":'+ JSON.stringify(id) +'}';
	socket.emit('clientId',message);
};


// displays the selected users real-time accel data
socket.on('real_time',function(data){
	console.log(data);
});

//query function
function query(event){
	var message = '{"clientID":'+JSON.stringify(curr_ID)+
					', "dateTimeRec":'+JSON.stringify(qDate)+'}';
					// '",'+rDateTime+'}';
					
	switch(event){
		case 'clientId':
			socket.emit('clientId',message);
			break;
		case 'battery':
			socket.emit('battery',message);
			break;
		case 'accel':
			socket.emit('accel',message);
			break;
		case 'pos':
			socket.emit('pos',message);
			break;
	}
};

//display/render data
socket.on('rBatt',function(data){
	batteryDisplay(data);
});

socket.on('rAccel',function(data){
	// accelDisplay(data);
	console.log(data);
});

// socket.on('rPos');
function isJSON(message){
    try {
        JSON.parse(message);
    } catch (e) {
        return false;
    }
    return true;
};


// //battery query function
// function battQ(){
// 	var message = '{"clientID":"'+curr_ID+
// 					'", "datetime":'+rDateTime+'}';
// 	socket.emit('battery',message);
// }

// //accel query function
// function accelQ(){
// 	var message = '{"clientID":"'+curr_ID+
// 					'", "datetime":'+rDateTime+'}';
// 	socket.emit('accel',message);
// }

// //pos query function
// function posQ(){
// 	var message = '{"clientID":"'+curr_ID+
// 					'", "datetime":'+rDateTime+'}';
// 	socket.emit('pos',message);
// }

//helper Functions
// function isJSON(message){
//     try {
//         JSON.parse(message);
//     } catch (e) {
//         return false;
//     }
//     return true;
// };
>>>>>>> b4fa1ac77a8c9072e75c47244f75740beca0ad07
