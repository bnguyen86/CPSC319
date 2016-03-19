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
			.attr("stroke", "steelblue")
			.attr("stroke-width", 1)
			.attr("fill", "none")
			.attr('transform','translate('+(margin.left+1)+','+margin.top+')');

			graph.append('path')
			.data(data)
			.attr("class", "area")
			.attr("d", area(data))
			.attr("clip-path", "url(#rect-clip)")
			.style("fill", function(d){
				console.log(d);
				console.log(d.fields.transferRate);
				switch(d.fields.transferRate){
					case 1:
						return "coral";
						break;
					case 10:
						return "cornflowerblue";
						break;
					case 100:
						return "greenyellow";
						break;
					case 500:
						return "lemonchiffon";
						break;
					case 1000:
						return "lightcrimson";
						break;
					case 2000:
						return "steelblue";
						break;
					case 5000:
						return "limegreen";
						break;
					case 10000:
						return "khaki";
						break;
				}
			})
			.attr('transform','translate('+(margin.left+1)+','+margin.top+')');

			// graph.selectAll("area")
			// .attr("class", "area")
			// .attr("d", areaColor(data))
			// .append("path")
			// .style("fill", function(d){
			// 	console.log(d);
			// 	console.log(d.fields.transferRate);
			// 	switch(d.fields.transferRate){
			// 		case "1":
			// 			return "coral";
			// 			break;
			// 		case [10]:
			// 			return "cornflowerblue";
			// 			break;
			// 		case [100]:
			// 			return "greenyellow";
			// 			break;
			// 		case [500]:
			// 			return "lemonchiffon";
			// 			break;
			// 		case [1000]:
			// 			return "lightcrimson";
			// 			break;
			// 		case [2000]:
			// 			return "steelblue";
			// 			break;
			// 		case [5000]:
			// 			return "limegreen";
			// 			break;
			// 		case [10000]:
			// 			return "khaki";
			// 			break;
			// 	}
			// });

	} else{
		console.log("batteryDisplay JSON incorrect");
		console.log(data);
	}
};