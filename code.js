        // set the dimensions and margins of the graph
        var margin = { top: 10, right: 30, bottom: 30, left: 60 },
            width = 660 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;

        // append the svg object to the body of the page
        var svg = d3.select("#my_dataviz")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        d3.csv("./dataset.csv", data => {

            data.forEach(function (d) {
                d.date = new Date(d3.timeParse("%Y-%m-%dT%H:%M:%S")(d.date))
            });
            
            
            const nestedBy = propertie => d3.nest()
                .key(d => d[propertie])
                .entries(data)
            const nestedArray = nestedBy("provider")
            // new Date().getUTCHours
            // Add X axis --> it is a date format
            var x = d3.scaleTime()
                .domain(d3.extent(data, function (d) { return d.date.getTime(); }))
                .range([0, width]);
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x))

            // Add Y axis
            var y = d3.scaleLinear()
                .domain(d3.extent(data, function (d) { return +d.price; }))
                .range([height, 0]);
            svg.append("g")
                .call(d3.axisLeft(y));

            // color palette
            var res = nestedArray.map(function (d) { return d.key }) // list of group names
            var color = d3.scaleOrdinal()
                .domain(res)
                .range(['#912658', '#979031', '#6cdde7'])

            // Draw the line
            svg.selectAll(".line")
                .data(nestedArray)
                .enter()
                .append("path")
                .attr("fill", "none")
                .attr("class", "dotted")
                .attr("stroke", function (d) { return color(d.key) })
                .attr("stroke-width", 1)
                .attr("d", function (d) {
                    return d3.line()
                        .curve(d3.curveBasis)
                        .x(function (d) { return x(d.date); })
                        .y(function (d) { return y(+d.price); })(d.values)
                })
        })