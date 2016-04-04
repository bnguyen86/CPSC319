function sosDisplay(data){
	console.log(data);
		var notification = [];
  		// var sosParsed = JSON.parsed(data);
  		//DATA
  		var sosClientId = data.clientId;
  		var sosClientName = data.clientName;
  		var sosDateTime = data.datetime;
  		var sosLat = data.lat;
  		var sosLon = data.lon;
		var sosLoc = {lat: sosLat, lng: sosLon};

		//displaying message
		var popup = document.getElementById('light');
		var blackout = document.getElementById('fade');
		var alertmsg = document.getElementById('alertmsg');
		// var list = document.getElementById('left-side-tab');
		// var entry = document.createElement('li');
		var closeBtn = document.createElement("button");
		
//IF THE NOTIFICATION IS NOT DISPLAYED
		if(document.getElementById('light').style.display != 'block'){
		popup.style.display = 'block';
		blackout.style.display = 'block';
		
		//displaying map
		appendSOS(sosClientName, sosClientId, sosLat, sosLon, sosLoc);
		//OKAY button
		closeBtn.className = "alert-btn";
		closeBtn.innerHTML = "OKAY";	
		closeBtn.addEventListener("click", function(){
		// 	// console.log(list.childNodes.length);
		// 	if(list.childNodes.length == 2){
				document.getElementById('light').style.display = 'none';
				document.getElementById('fade').style.display = 'none';
  //   			document.getElementById(this).parentNode.removeChild(this);
		// 	} else{
		// 		document.getElementById(this).parentNode.removeChild(this);
		// 	}
		});

		if (popup.lastChild.className === "alert-btn") {
			// do nothing
		} else {
			popup.appendChild(closeBtn);
		}

		//appending to list
		// entry.appendChild(document.createTextNode(sosClientId));
		// entry.id = sosClientId;
		// entry.addEventListener("click", function(){
		// 	plotLoc(sosClientName, sosClientId, sosLat, sosLon, sosLoc);
		// 	console.log("clicked");
		// });
		// list.appendChild(entry);
		// // notification.push(data);
		// // console.log(notification);

		// } else{
		// 	entry.appendChild(document.createTextNode(sosClientId));
		// 	entry.addEventListener("click", function(){
		// 	appendSOS(sosClientName, sosClientId, sosLat, sosLon, sosLoc);
		// 	console.log("clicked");
		// });
		// list.appendChild(entry);
		// console.log("displaying sos already");
		// 	notification.push(data);
		// console.log(notification);
		} else{

		}
};

//HELPER FUNCTION
function appendSOS(sosClientName, sosClientId, sosLat, sosLon, sosLoc) {
	var tabList = document.getElementById('emptytab');
	tabList = tabList.parentElement;
	// console.log(tabList);

	var tab = document.createElement('md-tab');
	tab.setAttribute("label", sosClientName);
	tab.setAttribute("class", "ng-scope ng-isolate-scope");

	var content = document.createElement('md-content');
	content.setAttribute("class","md-padding");

	var alertmsg = document.createElement('div');
	alertmsg.id = "alertmsg";
	alertmsg.innerHTML = '<b>' + sosClientName  + '</b>' + " ("+sosClientId+")" + ' sent a SOS message. <br> Send help to <b>' + sosLat + ', ' + sosLon + '</b>';
	
	var alertmap = document.createElement('div');
	alertmap.id = "alertmap";
	alertmap.innerHTML = "test";
	// var alertmap = new google.maps.Map(alertmap, {
	// 	center: {lat: 49.246292, lng: -123.116226},
	// 	zoom: 15
	// });
	// alertmap.panTo(sosLoc);

	// var marker = new google.maps.Marker({
	// 	position: sosLoc,
	// 	map: alertmap,
	// 	title: 'SOS Location'
	// });
	tabList.appendChild(tab);
	tab.appendChild(content);
	content.appendChild(alertmsg);
	console.log(tabList);
	// content.appendChild(alertmap);
};