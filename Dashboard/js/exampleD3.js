// an example
// var numbers = [ 5, 4, 10, 1 ];
// var data = [
//       { date: '2014-01-01', amount: 10 },
//       { date: '2014-02-01', amount: 20 },
//       { date: '2014-03-01', amount: 40 },
//       { date: '2014-04-01', amount: 80 }
//     ];

// d3.min(numbers);
// //1

// d3.max(data, function(d, i){
// 	return d.amount
// 	});
// //80

// d3.extent(numbers);
// //[1,10]

// // var y = d3.scale.linear()
// // 	.domain([0,80]) //$0 to $80
// // 	.range([200,0]) //seems backwards because SVG is y-down

// var y = d3.scale.linear()
// 	.domain(d3.extent(data, function(d){
// 		return d.amount
// 	}))
// 	.range([200,0]);

// y(0); 	//in: $0
// 		//out: 200px (botton of graph)
// y(80); 	//in: $80
// 		//out: 0px (top of graph)

// var x = d3.scale.linear()
// 	.domain([
// 		new Date(Date.parse('2014-01-01')),
// 		new Date(Date.parse('2014-04-01'))])
// 	.range([0,300]);

// 	x(new Date(Date.parse('2014-02-01'))); //~103.38

// var xAxis = d3.svg.axis()
// 	.scale(x)
// 	.orient('bottom')
// 	.ticks(4);

// var svg = d3.select('body')
// 	.append('svg')
// 	.attr('width', 300)
// 	.attr('height', 150);

// svg.append('g')
// 	.attr('class', 'x axis')
// 	.attr("transform", "translate(0"+(h - padding)+")")
// 	.call(xAxis);



//another example
// var margin = {top: 30, right: 30, bottom: 40, left: 50},
//     width = 960 - margin.left - margin.right,
//     height = 500 - margin.top - margin.bottom;

// var formatPercent = d3.format("+.0%"),
//     formatChange = function(x) { return formatPercent(x - 1); },
//     parseDate = d3.time.format("%d-%b-%y").parse;

// var x = d3.time.scale()
//     .range([0, width]);

// var y = d3.scale.log()
//     .range([height, 0]);

// var xAxis = d3.svg.axis()
//     .scale(x)
//     .orient("bottom");

// var yAxis = d3.svg.axis()
//     .scale(y)
//     .orient("left")
//     .tickSize(-width, 0)
//     .tickFormat(formatChange);

// var line = d3.svg.line()
//     .x(function(d) { return x(d.date); })
//     .y(function(d) { return y(d.ratio); });

// var svg = d3.select("body").append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//   .append("g")
//     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// var gX = svg.append("g")
//     .attr("class", "axis axis--x")
//     .attr("transform", "translate(0," + height + ")");

// var gY = svg.append("g")
//     .attr("class", "axis axis--y");

// gY.append("text")
//     .attr("class", "axis-title")
//     .attr("transform", "rotate(-90)")
//     .attr("y", 6)
//     .attr("dy", ".71em")
//     .text("Change in Price");

// d3.tsv("data.tsv", function(error, data) {
//   if (error) throw error;

//   // Compute price relative to base value (hypothetical purchase price).
//   var baseValue = +data[0].close;
//   data.forEach(function(d) {
//     d.date = parseDate(d.date);
//     d.ratio = d.close / baseValue;
//   });

//   x.domain(d3.extent(data, function(d) { return d.date; }));
//   y.domain(d3.extent(data, function(d) { return d.ratio; }));

//   // Use a second linear scale for ticks.
//   yAxis.tickValues(d3.scale.linear()
//       .domain(y.domain())
//       .ticks(20));

//   gX.call(xAxis);

//   gY.call(yAxis)
//     .selectAll(".tick")
//       .classed("tick--one", function(d) { return Math.abs(d - 1) < 1e-6; });

//   svg.append("path")
//       .datum(data)
//       .attr("class", "line")
//       .attr("d", line);
// });

