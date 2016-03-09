var socket = io('http://45.55.1.125:5555/');
// var socket = io();
var curr_ID;
var qDate;
// var qDate = '"start": "1456869619000", "end": "1456869620500"';
// var rDateTime = [{"datetime":"1456869619000"},{"datetime":"1456869619500"},{"datetime":"1456869620000"},{"datetime":"1456869620500"}];

//set Date values of query onLoad
function dateTimePopUp(event){
	if(curr_ID != null){
		var se = ["start", "end"];
		var date = document.getElementById("date");
		var subButt = document.createElement("button");
		var d = new Date();
		//date and time
//_+_ BUG (2)
		for(i = 0; i < se.length; i++){
			var element = document.createElement("input");
			element.type = "datetime-local"
			element.id = se[i];
			date.appendChild(element);
		}
		document.getElementById("start").value = d.getFullYear()+'-01-01T00:00';
		document.getElementById("end").value = d.toISOString().substring(0,16);
		//date, no time
		// for(i = 0; i < se.length; i++){
		// 	var element = document.createElement("input");
		// 	element.type = "date"
		// 	element.id = se[i];
		// 	date.appendChild(element);
		// }
		// document.getElementById("start").value = d.getFullYear()+'-01-01';
		// document.getElementById("end").value = d.toISOString().substring(0,10);
		subButt.addEventListener("click", function(){
			submitDateTime(this.id);
		});
		subButt.innerHTML = "Submit";
		subButt.id = event;
		date.appendChild(subButt);
	} else{
		console.log("Please Choose an ID first");
	}

}

//parse the clientIDs into buttons/lists
// INPUT: 
// OUTPUT:
socket.on('clientIds',function(data){
	// console.log("clientIDs");
	// console.log(data);
	// var parsed = JSON.parse(data);
	// consol.log(parsed);
	// console.log(parsed);
	// if(document.getElementById("user_dis").childNodes.length == 0){
	if(document.getElementById("user_dis").innerHTML==""){
		userButtonCreation(data);
	} else{
		console.log("Users buttons already loaded");
	}
});

// displays the users available
function userButtonCreation(data){
	for(i = 0; i < data.length; i++){
		// console.log("data length: " + data.clientIds.length);
		// console.log(data.clientIds[i].clientId);
		var element = document.createElement("button");
		var id  =  data[i];
		element.tag = "uid";
		element.id = id;
		element.className = "user-btn";
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
	document.getElementById("now").innerHTML="Current User: "+curr_ID;
	document.getElementById("user_dis").innerHTML="";
	socket.emit('real-time',message);
};



//Query function called by the button
function query(event){			
	var message = 'sent';
	switch(event){
		case 'clientIds':
			// userSelection(curr_ID);
			curr_ID = null;
			socket.emit('clientId',message);
			document.getElementById("div-title").innerHTML = "PLEASE SELECT A USER TO VIEW";
			document.getElementById("now").innerHTML= "";
			document.getElementById("real-time").innerHTML = "";
			document.getElementById("history").innerHTML = "";
			document.getElementById("date").innerHTML = "";
			break;
		case 'real-time':
			document.getElementById("date").innerHTML = "";
			var message = '{"clientId":'+ JSON.stringify(curr_ID) +'}';
			socket.emit('real-time',message);
			break;
		case 'battery':
			socket.emit('stop-real', message);
			document.getElementById("div-title").innerHTML = "BATTERY DATA";
			document.getElementById("date").innerHTML=""
			document.getElementById("real-time").innerHTML = "";
			document.getElementById("history").innerHTML = "";
			dateTimePopUp('battery');
			// socket.emit('battery',message);
			break;
		case 'accel':
			socket.emit('stop-real', message);
			document.getElementById("div-title").innerHTML = "ACCELEROMETER DATA";
			document.getElementById("date").innerHTML="";
			document.getElementById("real-time").innerHTML = "";
			document.getElementById("history").innerHTML = "";
			dateTimePopUp('accel');
			// socket.emit('accel',message);
			break;
		case 'pos':
			socket.emit('pos',message);
			break;
	}
};

// displays the selected users real-time accel data
socket.on('rRealTime',function(data){
	realTimeDisplay(data);
});

//display/render data
socket.on('rBatt',function(data){
	batteryDisplay(data);
});

socket.on('rAccel',function(data){
	accelDisplay(data);
});

socket.on('rPos',function(data){
	mapDisplay(data);
});

//Sets the dates to be used to query server/database
function submitDateTime(event){
	var start = document.getElementById("start").value;
	var end = document.getElementById("end").value;
	pStart =Date.parse(start);
	console.log(pStart);
	pEnd = Date.parse(end);
	console.log(pEnd);
	qDate = '"start":"'+pStart+'", "end":"'+pEnd+'"';
	// console.log("SUBMIT: "+qDate);
	// event = this.id;
	console.log(event);
	var message = '{"clientID":'+JSON.stringify(curr_ID)+
				', '+ qDate+'}';
				// '",'+rDateTime+'}';
				console.log(message);
	switch(event){
		case 'battery':
			socket.emit('battery',message);
			break;
		case 'accel':
			socket.emit('accel',message);
			break;
	}
	// return qDate;
};

socket.on('sos',function(data){
  	// console.log('SOS RECEIVED');
  	// if(isJSON(data)){
  		console.log(data);
  		// var sosParsed = JSON.parsed(data);
  		var sosClientId = data.clientId;
  		var sosDateTime = data.datetime;
  		var sosLat = data.lat;
  		var sosLon = data.lon;
/* 		alert( sosClientId + ' sent a SOS message, send help to ' + sosLat +', ' + sosLon + '.'); */		
		var popup = document.getElementById('light');
		var blackout = document.getElementById('fade');
		var alertmsg = document.getElementById('alertmsg');
		
		popup.style.display = 'block';
		blackout.style.display = 'block';
		alertmsg.innerHTML = sosClientId + ' sent a SOS message, send help to ' + sosLat +', ' + sosLon + '.';
		
		var closeBtn = document.createElement("button");
		closeBtn.className = "alert-btn";
		closeBtn.innerHTML = "OKAY";
		
		closeBtn.addEventListener("click", function() {
			popup.style.display = 'none';
			blackout.style.display = 'none';
		});
		
		if (popup.lastChild.className === "alert-btn") {
			// do nothing
		} else {
		popup.appendChild(closeBtn);
		}
		
  	// } else{
        // console.log("SOS socket JSON incorrect");
  	// }
});

// function clearDiv(){
// 	document.getElementById("date").innerHTML="";
// 	document.getElementById("real-time").innerHTML="";
// 	document.getElementById("history").innerHTML="";
// }

function isJSON(message){
    try {
        JSON.parse(message);
    } catch (e) {
        return false;
    }
    return true;
};
