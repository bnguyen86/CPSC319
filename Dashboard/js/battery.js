//battery JSON object into graph
//INPUT: JSON Object
//		ex) '[{"datetime":String, "battery":float, clientID":String},*(__n)]'
//			where __n is the total number of data points
//OUTPUT: battery percentage graph
function batteryDisplay(data){
	// console.log(data);
	document.getElementById("real-time").innerHTML = "";
	document.getElementById("history").innerHTML = "";
	var margin = {
		top: 20,
		right: 50,
		bottom: 70,
		left: 50
		};
	var width = 1000 - margin.left - margin.right;
	var height = 500 - margin.top - margin.bottom;

	if(isJSON(data)){
		var data = JSON.parse(data);
		var data = data.hits.hits;
		// var dataTest = [1,1000];
		var bisectDateTime = d3.bisector(function(d) { 
			console.log(d.fields.datetime);
			// console.log(d);
			return d.fields.datetime;
		}).left;
		// console.log(data);

		//earliest date
		var xMin = new Date(parseInt(d3.min(data,function(d, i){
				return d.fields.datetime;
				})));
		console.log(xMin);
		//latest date
		var xMax = new Date(parseInt(d3.max(data,function(d, i){
				return d.fields.datetime;
				})));
		console.log(xMax);

		//x axis (dateTime)
		var x = d3.time.scale.utc()
			// .domain([xMin, xMax])
			.domain(d3.extent(data,function(d){
				return d.fields.datetime;
			}))
			.range([0, width]);
			
		//y axis (percentage)
		var y = d3.scale.linear()
			.domain([0,1])
			// .domain(d3.extent(data,function(d){
			// 	return d.fields.battery;
			// }))
			.range([height, 0]);


		//Axis
		var xAxis = d3.svg.axis()
			.scale(x)
			.orient('bottom')
			.ticks(3)
			.tickFormat(d3.time.format("%x %X"));

		var yAxis = d3.svg.axis()
			.scale(y)
			.orient('left')
			.ticks(5);


		var line = d3.svg.line()
			.defined(function(d){
				return d.fields.battery != null;
			})
			.x(function(d){
				// console.log(x(new Date(parseInt(d.datetime))));
				return x(new Date(parseInt(d.fields.datetime)));
			})
			.y(function(d){
				// console.log(y(d.fields.battery));
				return y(d.fields.battery);
			});

		var area = d3.svg.area()
		    // .defined(line.defined())
		    .x(line.x())
		    .y1(line.y())
		    .y0(y(0));

		// var areaColor = d3.svg.area()
		// 	.x(function(d){
		// 		console.log(d.fields.datetime)
		// 		return d.fields.datetime;
		// 	})
		// 	.y(function(d){
		// 		console.log(d.fields.transferRate);
		// 		return d.fields.transferRate;
		// 	})

		var graph = d3.select('#history').append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.attr('transform','translate('+margin.left+','+margin.top+')');


			graph.append('g')
			.attr('class', 'y axis')
			.attr("stroke-width", 1)
			.attr('transform','translate('+margin.left+','+margin.top+')')
			.call(yAxis);
			
   			graph.append("text")
	        .attr("class", "legend")
	        .attr("transform", "rotate(-90)")
	        .attr("y", 0)
	        .attr("x",0 - ((height / 2)+ margin.top))
	        .attr("dy", "1em")
	        .style("text-anchor", "middle")
	        .text("Battery Life");

			graph.append('g')
			.attr('class', 'x axis')
			.attr("stroke-width", 1)
			.attr('transform','translate('+margin.left+','+(height+margin.top)+')')
			.call(xAxis);
			
			graph.append("text")
	        .attr("class", "legend")
			.attr("transform", "translate("+((width+margin.left+margin.right)/2) + " ," + (height+margin.bottom+margin.top) + ")")
			.style("text-anchor", "middle")
			.text("Date & Time");

			//clipPath
			graph.append('clipPath')
			.attr("id","rect-clip")
			.append("rect")
			.attr("width", width)
			.attr("height", height);


			graph.append('path')
			.attr("class", "line")
			.attr("d", line(data))
			.attr("stroke", "black")
			.attr("stroke-width", 1)
			.attr("fill", "none")
			// .on("mouseover", function(d){
			// 	console.log(d);
			// 	console.log(data[100]);
			// 	// d3.select(this).select("text").style("visibility", "visible")
			// 	data.fields();
			// })
			// .on("mouseout", function(d){
			// 	d3.select(this).select("text").style("visibility", "hidden")
			// })
			.attr('transform','translate('+(margin.left+1)+','+margin.top+')');


			graph.append('path')
			.data(data)
			// .data(data, function(d){
			// 	console.log(d);
			// 	return d;
			// })
			.attr("class", "area")
			.attr("d", area(data))
			.attr("clip-path", "url(#rect-clip)")
			.style("fill", "lightsteelblue")
			.attr('transform','translate('+(margin.left+1)+','+margin.top+')');

		var focus = graph.append('g')
			.attr("class", "focus")
			.style("display", "none")
			.attr('transform','translate('+(margin.left+1)+','+margin.top+')');
			
			focus.append("circle")
			.attr("r", 5.5)
			.attr('transform','translate('+(margin.left+1)+','+margin.top+')');
			focus.append("circle")
			.attr("r", 2)
			.attr('transform','translate('+(margin.left+1)+','+margin.top+')');

			focus.append("text")
			.attr("id", "dateTimeLabel")
			.attr("x", 10)
			.attr("dy", "0.35em")
			.attr('transform','translate('+(margin.left+1)+','+margin.top+')');
			focus.append("text")
			.attr("id", "batteryLabel")
			.attr("x", 10)
			.attr("dy", "1.35em")
			.attr('transform','translate('+(margin.left+1)+','+margin.top+')');
			focus.append("text")
			.attr("id", "tansferRateLabel")
			.attr("x", 10)
			.attr("dy", "2.35em")
			.attr('transform','translate('+(margin.left+1)+','+margin.top+')');
			
			graph.append("rect")
			.attr("class", "overlay")
			.attr("width", width)
			.attr("height", height)
			.on("mouseover", function(){
				focus.style("display", null);
			})
			.on("mouseout", function(){
				focus.style("display", "none");
			})
			.on("mousemove", mouseMove)
			.attr('transform','translate('+(margin.left+1)+','+margin.top+')');

	function mouseMove(){
		// console.log(data);
		// var dataSorted = data.sort(function(a,b){
		// 	if(a.fields.datetime[0] < b.fields.datetime[0]){
		// 		return -1;
		// 	} 
		// 	if(a.fields.datetime[0] < b.fields.datetime[0]){
		// 		return 1;
		// 	}
		// 	return 0;
		// })
		// console.log(x.invert(d3.mouse(this)[0]));
		var x0 = Date.parse(x.invert(d3.mouse(this)[0]));//date in millisec
		var lo = 0;//index
		var hi = (data.length)-1;//data.length
		// console.log(x0);
		while(lo < hi){
			var mid = lo + hi >>> 1;
			if ((parseInt(data[mid].fields.datetime[0])- x0) < 0){//descending order
					hi = mid;
			} else{
				lo = mid + 1;
			}
			// console.log(lo);
			// console.log(new Date(parseInt(data[lo].fields.datetime[0])));
		} d = data[lo];
		// var i = bisectDateTime(data.sort(d3.ascending), x0);
		// var d0 = data[i-1];
		// var d1 = data[i];
		// console.log(x.invert(d3.mouse(this)[0]));
		// console.log(x0);
		// console.log(i);
		// console.log(d0);
		// console.log(d1);
		// var d = x0 - d0.datetime > d1.datetime - x0 ? d1 : d0;
		// console.log(d.fields.size);

		focus.attr("transform", "translate("+x(new Date(parseInt(d.fields.datetime)))+"," + y(d.fields.battery)+")");
		// for(var i = 0; i < d.fields.length; i++){
		// 	focus.select
		// }
		// console.log(d);
		subStringDate = (new Date(parseInt(d.fields.datetime))).toString().substring(0,24);
		focus.select("#dateTimeLabel").text("Date Time: "+subStringDate);
		// document.getElementById("dateTimeLabel").innerHTML= ("Date Time: "+d.fields.datetime[0]);
		focus.select("#batteryLabel").text("Battery: "+(Math.round(d.fields.battery*100)) + "%");
		if(d.fields.transferRate != null){
			focus.select("#tansferRateLabel").text("Transfer Rate: "+ d.fields.transferRate[0]);
		}else{
			focus.select("#tansferRateLabel").text("Transfer Rate: null");
		}
	};
	// 		graph.selectAll("area")
	// 		.data(dataTest)
	// 		.enter().append("area")
	// 		.attr("class", "area")
	// 		// .attr("d", area(data))
	// 		.style("fill", function(d){
	// 			// console.log(d);
	// 			// console.log(d.fields.transferRate[0]);
	// //make an array of 
	// 			// switch(d.fields.transferRate[0]){
	// 			console.log(d);
	// 			console.log(d[0]);
	// 			switch(d){
	// 				case 1:
	// 					return "lightcoral";
	// 					break;
	// 				case 10:
	// 					return "cornflowerblue";
	// 					break;
	// 				case 100:
	// 					return "greenyellow";
	// 					break;
	// 				case 500:
	// 					return "lemonchiffon";
	// 					break;
	// 				case 1000:
	// 					return "lightsalmon";
	// 					break;
	// 				case 2000:
	// 					return "lightsteelblue";
	// 					break;
	// 				case 5000:
	// 					return "limegreen";
	// 					break;
	// 				case 10000:
	// 					return "khaki";
	// 					break;
	// 			}
	// 		});

	} else{
		console.log("batteryDisplay JSON incorrect");
		console.log(data);
	}
};

