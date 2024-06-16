        // Set the dimensions and margins of the graph
        var margin = {top: 60, right: 230, bottom: 50, left: 50},
            width = 660 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;

        // Append the svg object to the body of the page
        var svg = d3.select("#my_dataviz")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // Load data
        Promise.all([
            d3.csv('globalAlcohol.csv'),
            d3.csv('GlobalUnemployment.csv')
        ]).then(([globalAlcohol, GlobalUnemployment]) => {
            // Filter alcohol data
            globalAlcohol = globalAlcohol.filter(d => d.Sex === 'A');
            globalAlcohol.forEach(d => {
                d.Year = +d.Year;
                d.Litres = +d.Litres;
            });

            // Parse unemployment data
            GlobalUnemployment.forEach(d => {
                d.Year = +d.Year;
                d.Percent = +d.Percent;
            });

            // Merge data by year and country
            let data = globalAlcohol.map(d => {
                let unemployment = GlobalUnemployment.find(u => u.Code === d.Code && u.Year === d.Year);
                return { ...d, Percent: unemployment ? unemployment.Percent : 0 };
            });

            // Add dropdown options
            const years = [...new Set(data.map(d => d.Year))];
            const dropdown = d3.select("#yearDropdown");
            dropdown.selectAll("option")
                .data(years)
                .enter().append("option")
                .attr("value", d => d)
                .text(d => d);

            // Function to update the chart
            function updateChart(selectedYear) {
                const filteredData = data.filter(d => d.Year === selectedYear);

                // Scales
                const x = d3.scaleBand()
                    .domain(filteredData.map(d => d.Country))
                    .range([0, width])
                    .padding(0.1);

                const y = d3.scaleLinear()
                    .domain([0, d3.max(filteredData, d => d.Litres + d.Percent)])
                    .range([height, 0]);

                // Stack data
                const stack = d3.stack()
                    .keys(['Litres', 'Percent']);

                const series = stack(filteredData);

                // Axes
                svg.selectAll(".axis").remove();

                const xAxis = d3.axisBottom(x);
                const yAxis = d3.axisLeft(y);

                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", `translate(0,${height})`)
                    .call(xAxis);

                svg.append("g")
                    .attr("class", "y axis")
                    .call(yAxis);

 // Area generator with smoothing
 const area = d3.area()
 .curve(d3.curveCardinal)  // Add curve for smoothing
 .x(d => x(d.data.Country) + x.bandwidth() / 2)
 .y0(d => y(d[0]))
 .y1(d => y(d[1]));

// Draw areas
svg.selectAll(".area").remove();
svg.selectAll(".area")
 .data(series)
 .enter().append("path")
 .attr("class", "area")
 .style("fill", (d, i) => i === 0 ? "steelblue" : "orange")
 .attr("d", area);
}

// Initial chart display
const initialYear = years[0];
updateChart(initialYear);

// Update chart when dropdown selection changes
dropdown.on("change", function() {
const selectedYear = +this.value;
updateChart(selectedYear);
});
}).catch(error => {
console.error("Error loading or processing data:", error);
});