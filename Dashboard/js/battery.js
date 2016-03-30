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
		bottom: 100,
		left: 50
		};
	var margin_mini = {
		top: 430,
		right: 50,
		bottom: 20,
		left: 50
	};
	var width = 1000 - margin.left - margin.right;
	var height = 500 - margin.top - margin.bottom;
	var height_mini = 500 - margin_mini.top - margin_mini.bottom;

	if(isJSON(data)){
		var data = JSON.parse(data);
		var data = data.hits.hits;
		// console.log(data);

		//earliest date
		// var xMin = new Date(parseInt(d3.min(data,function(d, i){
		// 		return d.fields.datetime;
		// 		})));
		// console.log(xMin);
		// //latest date
		// var xMax = new Date(parseInt(d3.max(data,function(d, i){
		// 		return d.fields.datetime;
		// 		})));
		// console.log(xMax);


//=======================================================X Axis (dateTime)
		var x = d3.time.scale.utc()
			.domain(d3.extent(data,function(d){
				return d.fields.datetime;
			}))
			.range([0, width]);
//=======================================================Y Axis (battery)
		var y = d3.scale.linear()
			.domain([0,1])
			.range([height, 0]);

//=======================================================X Mini Axis (dateTime)
		var x_mini = d3.time.scale.utc()
			.domain(d3.extent(data,function(d){
				return d.fields.datetime;
			}))
			.range([0, width]);
//=======================================================Y Mini Axis (battery)
		var y_mini = d3.scale.linear()
			.domain([0,1])
			.range([height_mini, 0]);

//=======================================================Axises display
		var xAxis = d3.svg.axis()
			.scale(x)
			.orient('bottom')
			.ticks(3)
			.tickFormat(d3.time.format("%x %X"));

		var yAxis = d3.svg.axis()
			.scale(y)
			.orient('left')
			.ticks(5);

		var xAxis_mini = d3.svg.axis()
			.scale(x_mini)
			.orient('bottom')
			.tickFormat(d3.time.format("%x"));

//=======================================================Brush (Highlight)
		var brush = d3.svg.brush()
		.x(x_mini)
		.on("brush", brushed);

//=======================================================Paths (Lines and Areas)
		var line = d3.svg.line()
			// .defined(function(d){
			// 	return d.fields.battery != null;
			// })
			.x(function(d){
				// console.log(x(new Date(parseInt(d.datetime))));
				return x(new Date(parseInt(d.fields.datetime)));
			})
			.y(function(d){
				// console.log(y(d.fields.battery));
				return y(d.fields.battery);
			});

		var area = d3.svg.area()
		    .x(line.x())
		    .y1(line.y())
		    .y0(y(0));

		var line_mini = d3.svg.line()
			.x(function(d){
				// console.log(x(new Date(parseInt(d.datetime))));
				return x_mini(new Date(parseInt(d.fields.datetime)));
			})
			.y(function(d){
				// console.log(y(d.fields.battery));
				return y_mini(d.fields.battery);
			});

		var area_mini = d3.svg.area()
		    .x(line_mini.x())
		    .y1(line_mini.y())
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


//=======================================================DRAWING
		var graph = d3.select('#history').append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom);
			// .attr('transform','translate('+margin.left+','+margin.top+')');

//=======================================================clipPath & Sizes
			graph.append("defs").append('clipPath')
			.attr("id","rect-clip")
			.append("rect")
			.attr("width", width)
			.attr("height", height);

		var graph_main = graph.append('svg')
			.attr('transform','translate('+margin.left+','+margin.top+')');

		var graph_mini = graph.append('svg')
			.attr('transform','translate('+margin_mini.left+','+margin_mini.top+')');
//MAIN
//=======================================================DRAWING PATHS
			graph_main.append('path')
			.attr("class", "line")
			.attr("d", line(data))
			.attr("clip-path", "url(#rect-clip)")			
			.attr("stroke", "steelblue")
			.attr("stroke-width", 1)
			.attr("fill", "none")
			.attr('transform','translate('+(margin.left+1)+','+margin.top+')');

			graph_main.append('path')
			.data(data)
			.attr("class", "area")
			.attr("d", area(data))
			.attr("clip-path", "url(#rect-clip)")
			.style("fill", "lightsteelblue")
			.attr('transform','translate('+(margin.left+1)+','+margin.top+')');

//=======================================================DRAWING AXISES
			graph_main.append('g')
			.attr('class', 'x axis')
			.attr("stroke-width", 1)
			.attr('transform','translate('+margin.left+','+(height+margin.top)+')')
			.call(xAxis);
			// .append("text")
	  //       // .attr("class", "legend")
			// .attr("transform", "translate("+((width+margin.left+margin.right)/2) + " ," + (height+margin.bottom+margin.top) + ")")
			// .style("text-anchor", "middle")
			// .text("Date & Time");


			graph_main.append('g')
			.attr('class', 'y axis')
			.attr("stroke-width", 1)
			.attr('transform','translate('+margin.left+','+margin.top+')')
			.call(yAxis)
			.append("text")
	        .attr("transform", "rotate(-90)")
	        .attr("y", -(margin.left))
	        .attr("x",0 - ((height / 2)+ margin.top))
	        .attr("dy", "1em")
	        .style("text-anchor", "middle")
	        .text("Battery Life");


//MINI
//=======================================================DRAWING PATHS
			graph_mini.append('path')
			.attr("class", "line")
			.attr("d", line_mini(data))
			.attr("stroke", "black")
			.attr("stroke-width", 1)
			.attr("fill", "none")
			.attr('transform','translate('+(margin_mini.left+1)+','+margin_mini.top+')');

			// graph_mini.append('path')
			// .data(data)
			// .attr("class", "area")
			// .attr("d", area_mini(data))
			// .attr("clip-path", "url(#rect-clip)")
			// .style("fill", "lightsteelblue")
			// .attr('transform','translate('+(margin_mini.left+1)+','+margin_mini.top+')');

//=======================================================DRAWING AXISES
			graph_mini.append('g')
			.attr('class', 'x axis')
			.attr("stroke-width", 1)
			.attr('transform','translate('+margin_mini.left+','+(height_mini+margin_mini.top)+')')
			.call(xAxis_mini);
			// .append("text")
	        // .attr("class", "legend")
			// .attr("transform", "translate("+((width+margin_mini.left+margin_mini.right)/2) + " ," + (height_mini+margin_mini.bottom+margin_mini.top) + ")")
			// .style("text-anchor", "middle")
			// .text("Date & Time");

//=======================================================BRUSH
		graph_mini.append('g')
		.attr("class", "x brush")
		.call(brush)
		.selectAll("rect")
		// .attr("y", margin_mini.top - 3)
		// .attr("x", margin_mini.left)
		.attr("transform", "translate("+(margin_mini.left)+","+(margin_mini.top - 3)+")")
		.attr("height", height_mini + 2.8);
//=======================================================FOCUS BALL
		var focus = graph_main.append('g')
			.attr("class", "focus")
			.style("display", "none")
			.attr('transform','translate('+(margin.left+1)+','+margin.top+')');
			
			focus.append("circle")
			.attr("r", 4)
			.attr('transform','translate('+(margin.left+1)+','+margin.top+')');
			focus.append("circle")
			.attr("r", .5)
			.attr('transform','translate('+(margin.left+1)+','+margin.top+')');

			focus.append("text")
			.attr("id", "dateTimeLabel")
			// .attr("x", 10)
			.attr("dy", "0.35em")
			.attr('transform','translate('+(margin.left+1)+','+margin.top+')');
			focus.append("text")
			.attr("id", "batteryLabel")
			// .attr("x", 10)
			.attr("dy", "1.35em")
			.attr('transform','translate('+(margin.left+1)+','+margin.top+')');
			focus.append("text")
			.attr("id", "tansferRateLabel")
			// .attr("x", 10)
			.attr("dy", "2.35em")
			.attr('transform','translate('+(margin.left+1)+','+margin.top+')');
			
			graph_main.append("rect")
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
		var x0 = Date.parse(x.invert(d3.mouse(this)[0]));//date in millisec
		var lo = 0;//index
		var hi = (data.length)-1;//data.length
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
		// var d0 = data[i-1];
		// var d1 = data[i];
		// var d = x0 - d0.datetime > d1.datetime - x0 ? d1 : d0;
		focus.attr("transform", "translate("+x(new Date(parseInt(d.fields.datetime)))+"," + y(d.fields.battery)+")");
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
	function brushed(){
		x.domain(brush.empty() ? x_mini.domain() : brush.extent());
		graph_main.select(".line").attr("d", line(data));
		graph_main.select(".area").attr("d", area(data));
		graph_main.select(".x.axis").call(xAxis);
	}
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

