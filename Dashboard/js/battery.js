<<<<<<< HEAD
//battery JSON object into graph
//input: '{"clientID":String, "datetime":Array[], "battery":Array[]}'
//output: battery percentage graph
function batteryDisplay(data){
	var width = 400;
	var height = 400;
	if(isJSON(data)){
		//input & output values
		//clientID: ghi
		// datetime: [ { date: '2010-01-01' },{ date: '2010-02-01' },{ date: '2010-03-01' },{ date: '2010-04-01' } ]
		// battery: [Object, Object, Object, Object, Object, Object]
		var parsed = JSON.parse(data);
		console.log(parsed);
		var clientID = parsed.clientID;
		var rDateTime = parsed.datetime;
		console.log(rDateTime);
		var rBatt = parsed.battery;
		console.log(rBatt);

		//y axis (percentage)
		var y = d3.scale.linear()
			.domain([0,100])
			.range([200,0]);
		
		var yAxis = d3.svg.axis()
			.scale(y)
			.orient('left')
			.ticks(4);

		//earliest date
		// var xMin = new Date(Date.parse(d3.min(rDateTime,function(d, i){
		var xMin = d3.min(rDateTime,function(d, i){
				return d.date
				});
		console.log(xMin);

		//latest date
		// var xMax = new Date(Date.parse(d3.max(rDateTime,function(d, i){
		var xMax = d3.max(rDateTime,function(d, i){
				return d.date
				});
		console.log(xMax);

		//x axis (percentage)
		var x = d3.scale.linear()
			.domain([0,100])
			.range([0,300]);

		var xAxis = d3.svg.axis()
			.scale(x)
			.orient('bottom');

		var line = d3.svg.line()
			.interpolate("monotone")
			.x(rDateTime,function(d){
				console.log(d.date);
				return x(d.date);
			})
			.y(rBatt,function(d){
				console.log(d.per);
				return y(d.per);
			});
			console.log(line);
			
		var svg = d3.select('#batt_graph')
			.append('svg')
			.attr('width',width)
			.attr('height',height);
			
			svg.append('clipPath')
			.attr('id','clip')
			.append('rect')
			.attr('width', width)
			.attr('height', height);

			svg.append('g')
			.attr('class', 'y axis')
			.attr('transform','translate(50,50)')
			.call(yAxis);

			svg.append('g')
			.attr('class', 'x axis')
			.attr('transform','translate(50,250)')
			.call(xAxis);

			svg.append('path')
			.attr('class', 'line')
			.attr("clip-path", "url(#clip)")
			.attr("d", line);

	} else{
		console.log("batteryDisplay JSON incorrect");
		console.log(data);
	}
=======
//battery JSON object into graph
//input: '{"clientID":String, "datetime":Array[], "battery":Array[]}'
//output: battery percentage graph
function batteryDisplay(data){
	var margin = {
		top: 20,
		right: 50,
		bottom: 30,
		left: 50
		};
	var width = 1000 - margin.left - margin.right;
	var height = 300 - margin.top - margin.bottom;

	if(isJSON(data)){
		var data = JSON.parse(data);
		console.log(data);
		// var clientId = data.clientId;
		// var rDateTime = data.dateTimeRec;
		// console.log(rDateTime);
		// var rBatt = data.batteryRec;
		// console.log(rBatt);

		//earliest date
		// var xMin = new Date(d3.min(rDateTime,function(d, i){
		var xMin = new Date(parseInt(d3.min(data,function(d, i){
				return d.datetime;
				})));
		// console.log(xMin);
		//latest date
		// var xMax = new Date(d3.max(rDateTime,function(d, i){
		var xMax = new Date(parseInt(d3.max(data,function(d, i){
				return d.datetime;
				})));
		// console.log(xMax);

		//x axis (percentage)
		var x = d3.time.scale()
			// .domain([xMin, xMax])
			.domain(d3.extent(data,function(d){
				return d.datetime;
			}))
			.range([0, width]);
		//y axis (percentage)
		var y = d3.scale.linear()
			.domain([0,1])
			// .domain(d3.extent(data,function(d){
			// 	return d.battery;
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
			.ticks(3);


		var line = d3.svg.line()
			.x(function(d){
				// console.log(x(new Date(parseInt(d.datetime))));
				return x(new Date(parseInt(d.datetime)));
			})
			.y(function(d){
				// console.log(y(d.battery));
				return y(d.battery);
			})
			.interpolate("line");

			
		var svg = d3.select('#batt_graph')
			.append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.attr('transform','translate('+margin.left+','+margin.top+')');

			svg.append('g')
			.attr('class', 'y axis')
			.attr('transform','translate(50,20)')
			.call(yAxis);
			// .append("text")
			// .attr("transform", "rotate(-90)")
			// .style("text-anchor", "end")
			// .text("Battery Precetage");

			svg.append('g')
			.attr('class', 'x axis')
			.attr('transform','translate(50,'+(height+20)+')')
			.call(xAxis);
			// .append("text")
			// .style("text-anchor", "end")
			// .text("Date");

			svg.append('path')
			.attr("class", "line")
			.attr("d", line(data))
			.attr("stroke", "blue")
			.attr("stroke-width", 1)
			.attr("fill", "none")
			.attr('transform','translate(50,20)');

//UPDATE GRAPH INSTEAD OF REDRAWING. 
// if(document.getElementById("user_dis").childNodes.length == 1){
// 		userButtonCreation(data);
// 	}

	} else{
		console.log("batteryDisplay JSON incorrect");
		console.log(data);
	}
>>>>>>> b4fa1ac77a8c9072e75c47244f75740beca0ad07
};