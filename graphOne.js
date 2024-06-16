// Set up the SVG element for the map
const svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

// Define the map projection
const projection = d3.geoNaturalEarth1()
    .scale(width / 1.7 / Math.PI)
    .translate([width / 2, height / 2]);

// Define the color scale (from light blue to dark blueish purple)
const colors = [
    '#d0e1f9', '#c0d8f0', '#b0cfe8', '#a0c7df', '#90bed7', '#80b5cf', 
    '#70adc6', '#60a4be', '#509cb6', '#4093ad', '#308aa5', '#20819d', 
    '#107895', '#006f8c', '#006684', '#005d7c', '#005473', '#004b6b', 
    '#004262', '#011925'
];

// Create a tooltip for displaying additional information
const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// Load the CSV data
d3.csv("globalAlcohol.csv").then(function(data) {
    // Populate the year dropdown with unique years from the data
    const years = [...new Set(data.map(d => +d.Year))]; // Convert Year to number
    const yearSelect = d3.select("#yearSelect");
    yearSelect.selectAll("option")
        .data(years)
        .enter()
        .append("option")
        .attr("value", d => d)
        .text(d => d);

    // Populate the sex dropdown
    const sexSelect = d3.select("#sexSelect");
    sexSelect.on("change", updateMap);
    
    // Function to filter data and update the map based on user selection
    function updateMap() {
        const selectedYear = yearSelect.property("value");
        const selectedSex = sexSelect.property("value");

        // Filter the data based on the selected year and sex
        const filteredData = data.filter(d => {
            return (d.Year == selectedYear && d.Sex === selectedSex);
        });

        // Create an object to map country codes to alcohol consumption (rounded to 2 decimal places)
        const countryValues = {};
        filteredData.forEach(d => {
            countryValues[d.Code] = +(+d.Litres).toFixed(2);  // Convert to number and round
        });

        // Determine the range of values for the color scale after filtering
        const values = Object.values(countryValues);

        // Use a quantile scale to ensure even distribution of colors
        const colorScale = d3.scaleQuantile()
            .domain(values)
            .range(colors);

        // Load the GeoJSON data and draw the map
        d3.json("map.geojson").then(function(geoData) {
            // Remove existing paths to update the map
            svg.selectAll("path").remove();
            svg.append("g")
                .selectAll("path")
                .data(geoData.features)
                .join("path")
                    .attr("fill", function(d) {
                        // Get the country code and corresponding value
                        let country = d.id;  // Assuming the GeoJSON uses country codes as ids
                        let value = countryValues[country];
                        return colorScale(value) || "#d3d3d3";  // Default color if value is missing
                    })
                    .attr("d", d3.geoPath().projection(projection))
                    .style("stroke", "#fff")
                    .on("mouseover", function(event, d) {
                        d3.select(this).style("stroke", "black");
                        tooltip.transition()
                            .duration(200)
                            .style("opacity", .9);
                        tooltip.html("Country: " + d.properties.name + "<br>Litres: " + countryValues[d.id])  // Show country and value
                            .style("left", (event.pageX) + "px")
                            .style("top", (event.pageY - 28) + "px");
                    })
                    .on("mouseout", function(d) {
                        d3.select(this).style("stroke", "#fff");
                        tooltip.transition()
                            .duration(500)
                            .style("opacity", 0);
                    });
        });
    }
    
    // Initial map rendering
    updateMap();
});
