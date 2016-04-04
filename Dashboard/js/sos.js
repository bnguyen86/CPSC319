function sosDisplay(data) {
	
	// DATA
	var sosClientId = data.clientId;
	var sosDateTime = data.datetime;
 	var sosLat = data.lat;
 	var sosLon = data.lon;
 
	// POP UP
	var popup = document.getElementById('light');
 	var blackout = document.getElementById('fade');
 	var alertmsg = document.getElementById('alertmsg');
	var closeBtn = document.createElement("button");
		closeBtn.className = "alert-btn";
		closeBtn.innerHTML = "OKAY";
 	
		closeBtn.addEventListener("click", function() {
			popup.style.display = 'none';
			blackout.style.display = 'none';
		});
 		
 	popup.style.display = 'block';
 	blackout.style.display = 'block';
 	alertmsg.innerHTML = '<b>' + sosClientId + '</b>' + ' sent a SOS message. <br> Send help to <b>' + sosLat + ', ' + sosLon + '</b>';
 	
 	plotLoc(sosLat, sosLon);
 	
	if (popup.lastChild.className === "alert-btn") {
 		// do nothing
 	} 	 else {
 		popup.appendChild(closeBtn);
 	}
};

function sosAppend(data) {
	console.log("append another sos");
	
	var sosClientId = data.clientId;
	var sosLat = data.lat;
	var sosLon = data.lon;
	var alertmsg = document.getElementById('alertmsg');
	
	alertmsg.innerHTML += '<br><br><b>' + sosClientId + '</b>' + ' sent a SOS message. <br> Send help to <b>' + sosLat + ', ' + sosLon + '</b>';
	
	addMarker(sosLat, sosLon);
};

function plotLoc(lat, lon) {
 
	alertmap = new google.maps.Map(document.getElementById('alertmap'), {
		center: {lat: 49.246292, lng: -123.116226},
 		zoom: 15
 	});
	
	alertmap.panTo({lat: lat, lng: lon});
	
	var marker = new google.maps.Marker({
		position: {lat: lat, lng: lon},
		map: alertmap, 
		title: "SOS LOCATION"
	});
 			
};
 
function addMarker(lat, lon) {
	
	var marker = new google.maps.Marker({
		position: {lat: lat, lng: lon},
	});
	
	marker.setMap(alertmap);
	
};