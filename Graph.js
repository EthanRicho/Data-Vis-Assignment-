document.addEventListener("DOMContentLoaded", function() {
    const data = [
        { ageGroup: "18-24", tenDrinks: 15, fiveDrinks: 20, exceeded: 23 },
        { ageGroup: "25-34", tenDrinks: 18, fiveDrinks: 25, exceeded: 26 },
        { ageGroup: "35-44", tenDrinks: 20, fiveDrinks: 18, exceeded: 21 },
        { ageGroup: "45-54", tenDrinks: 25, fiveDrinks: 22, exceeded: 24 },
        { ageGroup: "55-64", tenDrinks: 22, fiveDrinks: 15, exceeded: 22 },
        { ageGroup: "65-74", tenDrinks: 24, fiveDrinks: 12, exceeded: 20 },
        { ageGroup: "75+", tenDrinks: 15, fiveDrinks: 8, exceeded: 16 },
    ];

    const margin = { top: 40, right: 30, bottom: 50, left: 40 };
    const width = 900 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
        .domain(data.map(d => d.ageGroup))
        .range([0, width])
        .padding([0.2]);

    const y = d3.scaleLinear()
        .domain([0, 40])
        .range([height, 0]);

    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x));

    svg.append("g")
        .call(d3.axisLeft(y));

    svg.append("text")
        .attr("class", "axis-label")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom)
        .attr("text-anchor", "middle")
        .text("Age group (years)");

    svg.append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -margin.left + 20)
        .attr("text-anchor", "middle")
        .text("%");

    const barGroups = svg.selectAll("g.bar-group")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "bar-group")
        .attr("transform", d => `translate(${x(d.ageGroup)},0)`);

    barGroups.append("rect")
        .attr("class", "bar ten-drinks")
        .attr("x", x.bandwidth() / 4)
        .attr("y", d => y(d.tenDrinks))
        .attr("width", x.bandwidth() / 2.5)
        .attr("height", d => height - y(d.tenDrinks))
        .attr("fill", "#69b3a2");

    barGroups.append("rect")
        .attr("class", "bar five-drinks")
        .attr("x", x.bandwidth() / 1.5)
        .attr("y", d => y(d.fiveDrinks))
        .attr("width", x.bandwidth() / 2.5)
        .attr("height", d => height - y(d.fiveDrinks))
        .attr("fill", "#404080");

    const line = d3.line()
        .x(d => x(d.ageGroup) + x.bandwidth() / 2)
        .y(d => y(d.exceeded));

    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#ffab00")
        .attr("stroke-width", 2)
        .attr("d", line);

    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => x(d.ageGroup) + x.bandwidth() / 2)
        .attr("cy", d => y(d.exceeded))
        .attr("r", 4)
        .attr("fill", "#ffab00");

    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    svg.selectAll("circle")
        .on("mouseover", (event, d) => {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(`Age group: ${d.ageGroup}<br>Exceeded guideline: ${d.exceeded}%`)
                .style("left", (event.pageX) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", () => {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });
});