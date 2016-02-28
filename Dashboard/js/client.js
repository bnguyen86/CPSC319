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