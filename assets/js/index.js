let myUrl = "https://api.coinmarketcap.com/v1/ticker/";

// D3 margin convention: http://bl.ocks.org/mbostock/3019563
const margin = { top: 20, right: 10, bottom: 100, left: 50 },
  width = 700 - margin.right - margin.left,
  height = 500 - margin.top - margin.bottom;

let svg = d3
  .select("#chart")
  .append("svg")
  .attr({
    width: width + margin.right + margin.left,
    height: height + margin.top + margin.bottom
  })
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.right + ")");

//define SCALE and AXIS. See D3 API Refrence.
let xScale = d3.scale.ordinal().rangeRoundBands([0, width], 0.2, 0.2);

let yScale = d3.scale.linear().range([height, 0]);

let xAxis = d3.svg
  .axis()
  .scale(xScale)
  .orient("bottom");

let yAxis = d3.svg
  .axis()
  .scale(yScale)
  .orient("left");

//import data
d3.json(myUrl, function(error, data) {
  if (error) console.log("Error: can not get json data.");

  //success
  let top10 = data.filter((obj, index) => {
    return index < 10;
  });

  console.log(top10);
  console.log(data);

  top10.forEach(function(d) {
    d.market_cap_usd = +d.market_cap_usd;
    //Use "+" before the variable to convert a string number into a number.
    // try removing the + and see what the console prints

    console.log(
      "US$ " + parseInt(d.market_cap_usd / 1000000000) + " B\t" + d.name
    );
  });

  // Specify the domains of the x and y scales
  xScale.domain(
    top10.map(function(d) {
      return d.symbol;
    })
  );
  yScale.domain([
    0,
    d3.max(top10, function(d) {
      return parseInt(d.market_cap_usd / 1000000000);
    })
  ]);

  svg
    .selectAll("rect")
    .data(top10)
    .enter()
    .append("rect")
    .attr("height", 0)
    .attr("y", height)
    .transition()
    .duration(2000)
    .delay(function(d, i) {
      return i * 200;
    })

    // another way to combine attributes
    .attr({
      x: function(d) {
        return xScale(d.symbol);
      },
      y: function(d) {
        return yScale(parseInt(d.market_cap_usd / 1000000000));
      },
      width: xScale.rangeBand(),
      height: function(d) {
        return height - yScale(parseInt(d.market_cap_usd / 1000000000));
      }
    })
    .style("fill", function(d, i) {
      return "rgb(20, " + (i * 20 + 100) + ", 20)";
    });

  //hover in each rect
  svg
    .selectAll("rect")
    //opacity effect
    .on("mouseover", function(d) {
      var rect = d3.select(this);
      rect
        .attr("class", "mouseover")
        .transition()
        .duration(300)
        .style("opacity", 0.8);
    })
    .on("mouseout", function() {
      var rect = d3.select(this);
      rect
        .attr("class", "mouseoff")
        .transition()
        .duration(300)
        .style("opacity", 1);
    })
    //info as a title attribute
    .append("svg:title")
    .text(function(d) {
      return (
        d.name +
        "\nMarket Cap. = US$ " +
        parseInt(d.market_cap_usd / 1000000000) +
        " B"
      );
    });

  // Draw xAxis and position the label
  svg
    .append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .selectAll("text")
    .attr("dx", "-.8em")
    .attr("dy", ".25em")
    .attr("transform", "rotate(-45)")
    .style("text-anchor", "end");

  // Draw yAxis and postion the label
  svg
    .append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("dy", "-3em")
    .style("text-anchor", "middle")
    .text("Market Cap. in Billions of US$");
});
