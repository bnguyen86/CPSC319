var socket = io('http://45.55.1.125:5555/');
// var socket = io();
var curr_ID;
var qDate;
var lastSOSID;
// var qDate = '"start": "1456869619000", "end": "1456869620500"';
// var rDateTime = [{"datetime":"1456869619000"},{"datetime":"1456869619500"},{"datetime":"1456869620000"},{"datetime":"1456869620500"}];

//set Date values of query onLoad
function dateTimePopUp(event){
	if(curr_ID != null){
		var se = ["start", "end"];
		var date = document.getElementById("date");
		var subButt = document.createElement("button");
		function formatLocalDate() {
		    var now = new Date();
		    var tzo = -now.getTimezoneOffset();
			var dif = tzo >= 0 ? '+' : '-';
		    var pad = function(num) {
		            var norm = Math.abs(Math.floor(num));
		            return (norm < 10 ? '0' : '') + norm;
		        };
		    return now.getFullYear() 
		        + '-' + pad(now.getMonth()+1)
		        + '-' + pad(now.getDate())
		        + 'T' + pad(now.getHours())
		        + ':' + pad(now.getMinutes())
		        + ':' + pad(now.getSeconds())
		        + dif + pad(tzo / 60) 
		        + ':' + pad(tzo % 60);
		    console.log(now);
		}
		var d = new Date();
		//date and time
		for(i = 0; i < se.length; i++){
			var element = document.createElement("input");
			element.type = "datetime-local"
			element.id = se[i];
			date.appendChild(element);
			// date.appendChild(document.createElement("br"));
		}
		console.log(formatLocalDate());
		document.getElementById("start").value = d.getUTCFullYear()+'-01-01T00:00';
		document.getElementById("end").value = formatLocalDate().substring(0,16);
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
	console.log(data);
	// var parsed = JSON.parse(data);
	// console.log(parsed);
	if(document.getElementById("user_dis").innerHTML === ""){
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
		element.innerHTML = data[(i+1)];
		element.addEventListener("click", function(){
			userSelection(this.id, this.innerHTML);
		});
		var dis_loc = document.getElementById("user_dis");
		dis_loc.appendChild(element);
		i++;
	}
};

// returns the user selected
function userSelection(id, innerHTML){
	curr_ID = id;
	console.log("selected clientId: " + id);
	var message = '{"clientId":'+ JSON.stringify(id) +'}';
	document.getElementById("now").innerHTML="Current User: "+ innerHTML + " ("+curr_ID+")";
	document.getElementById("user_dis").innerHTML="";
	document.getElementById("real-time").innerHTML = " ";	
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
			socket.emit('stop-real', message);
			document.getElementById("div-title").innerHTML = "PLEASE SELECT A USER TO VIEW";
			document.getElementById("now").innerHTML= "";
			document.getElementById("real-time").innerHTML = "";
			document.getElementById("history").innerHTML = "";
			document.getElementById("history").removeAttribute("style");
			document.getElementById("date").innerHTML = "";
			// document.getElementById("map").innerHTML = "";
			break;
		case 'real-time':
		if(curr_ID != null){
			socket.emit('stop-real', message);
			document.getElementById("real-time").innerHTML = " ";
			document.getElementById("date").innerHTML = "";
			var message = '{"clientId":'+ JSON.stringify(curr_ID) +'}';
			socket.emit('real-time',message);
		}else{
			console.log("REAL-TIME: Please Choose an ID first");
		}
			break;
		case 'battery':
		if(curr_ID != null){		
			socket.emit('stop-real', message);
			document.getElementById("div-title").innerHTML = "BATTERY DATA";
			document.getElementById("date").innerHTML=""
			document.getElementById("real-time").innerHTML = "";
			document.getElementById("history").innerHTML = "";
			document.getElementById("history").removeAttribute("style");
			dateTimePopUp('battery');
		}else{
			console.log("BATTERY: Please Choose an ID first");
		}
			break;
		case 'accel':
		if(curr_ID != null){		
			socket.emit('stop-real', message);
			document.getElementById("div-title").innerHTML = "ACCELEROMETER DATA";
			document.getElementById("date").innerHTML="";
			document.getElementById("real-time").innerHTML = "";
			document.getElementById("history").innerHTML = "";
			document.getElementById("history").removeAttribute("style");

			dateTimePopUp('accel');
		}else{
			console.log("ACCEL: Please Choose an ID first");
		}
			break;
		case 'pos':
		if(curr_ID != null){		
			socket.emit('stop-real', message);
			document.getElementById("div-title").innerHTML = "LAST KNOWN LOCATION";
			document.getElementById("date").innerHTML="";
			document.getElementById("real-time").innerHTML = "";
			document.getElementById("history").innerHTML = "";
			document.getElementById("history").removeAttribute("style");

			
			message = '{"clientID":'+JSON.stringify(curr_ID)+'}';
			console.log(message);
			socket.emit('pos', message);
		}else{
			console.log("MAP: Please Choose an ID first");
		}			
			break;
	}
};

// displays the selected users real-time accel data
socket.on('rRealTime',function(data){
	if(document.getElementById("real-time").innerHTML != ""){
		realTimeDisplay(data);
	} else{
		console.log("Switched Query");
	}
});

//display/render data
socket.on('rBatt',function(data){
	batteryDisplay(data);
});

socket.on('rAccel',function(data){
	accelDisplay(data);
});

socket.on('rPOS',function(data){
	displayLastLoc(data);
});

socket.on('sos',function(data){
	if(lastSOSID === null) {
		sosDisplay(data);
		lastSOSID = data.clientId;
	} else if (lastSOSID != data.clientId) {
		sosAppend(data);
		lastSOSID = data.clientId;
	} else {
		sosDisplay(data);
		lastSOSID = data.clientId;
	}
});

//Sets the dates to be used to query server/database
function submitDateTime(event){
	offset = ((new Date().getTimezoneOffset() * 60 * 1000));
	var start = document.getElementById("start").value;
	var end = document.getElementById("end").value;
	pStart =Date.parse(start) + offset;
	console.log(pStart);
	pEnd = Date.parse(end) + offset;
	console.log(pEnd);
	qDate = '"start":"'+pStart+'", "end":"'+pEnd+'"';
	// console.log("SUBMIT: "+qDate);
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
		case 'pos':
			socket.emit('pos',message);
			break;
	}
	// return qDate;
};



//HELPER FUNCTIONS
function isJSON(message){
    try {
        JSON.parse(message);
    } catch (e) {
        return false;
    }
    return true;
};
