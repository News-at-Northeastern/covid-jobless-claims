var margin = {top:25, right:30, bottom:20, left:75};

var colors = {
    bold: ["#d51e2d", "#52CFE5", "#385775", "#FFBF3D", "#6f2b6e", "#00CFB5"],
    pastel: ["#e59097", "#c0adcc", "#b3cadd", "#a3ceaf", "lavender", "aquamarine", "gold"],
    procon: ["#cc0000", "#808080", "#000"],
    political: ["#D41B2C", "#006EB5"]
}

var linechartmeta = {
    title: "Weekly Initial Unemployment Insurance Claims, Since 2000",
    subtitle: "",
    source: "U.S. Department of Labor",
    note: "Numbers are seasonally adjusted. Areas with gray backgrounds denote recessions."
}

var tablemeta = {
    title: "Breakdown of Most Recent Jobless Claims By State",
    subtitle: "",
    source: "U.S. Department of Labor; Bureau of Labor Statistics",
    note: ""
}


Promise.all([
   d3.json('/interactive/2020/03/jobless-claims/data/jobless_claims.json'),
   d3.json('/interactive/2020/03/jobless-claims/data/statedata.json')
])
.then(function(data) {
  data[0].forEach(function(d) {
     d["Jobless Claims"] = +d["Jobless Claims"]
  })

 lineTemplate(data[0], linechartmeta, "#linechart");

 d3.select("#statedata h3").text(tablemeta.title);
 $('#datatable').DataTable({
    data: data[1],
    columns: [
        {   data: 'State',
            title: 'State'
         },
        {   data: 'Advance Claims',
            title: 'Jobless Claims Filed',
            render: function (data) {
                return data.toLocaleString('en-US');
            }
         },
        {   data: 'Percent Change',
            title: 'Change From Previous Week',
            render: function (data) {
                return "+" + Math.round(data*100) + "%";
            }
         },
        {   data: 'Claims Per Thousand',
            title: 'Claims Per 1000 Workers'
         }
    ]
});
d3.select("#statedata h6").text("SOURCE: " + tablemeta.source);

}).catch(function(error){
   // handle error
});

function lineTemplate(data, chartmeta, targetElement) {

   if (chartmeta.title) {
      d3.select(targetElement).append("h3").text(chartmeta.title);
   }
   if (chartmeta.subtitle) {
      var subtitle = d3.select(targetElement).append("h5").text(chartmeta.subtitle);
   }

   var width = d3.select(targetElement).node().getBoundingClientRect().width;
   var height = width * 0.4;

   var svg = d3.select(targetElement).append("svg")
      .attr("width", width)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");




   // horizontal axis
   var x = d3.scaleBand()
      .domain(data.map(function(d) { return d["Week Ending"]; }))
      .range([0, width - margin.left - margin.right])
      .padding(0);

   var xAxis = d3.axisBottom(x)
      .tickFormat(function(d,i){
         if ((i+45)%100 === 0) {
            if (width > 700) {
               return d;
            } else {
               return null;
            }
         }
      })
      .tickSize(0);

   function customXAxis(g) {
      g.call(xAxis);
      // g.select(".domain").remove();
   }

   svg.append("g")
      .attr("class", "xAxis")
      .attr("transform", "translate(0," + height + ")")
      .style("font-size", "14px")
      .call(customXAxis);
      // .selectAll(".tick:not(:first-of-type) line")
      // .attr("stroke-opacity", 0);

   // svg.append("text")
   //    .attr("transform",
   //    "translate(" + (width/2) + " ," +
   //    (height + margin.top + 15) + ")")
   //    .style("text-anchor", "middle")
   //    .text("Week Ending");


      // recession annotation
   svg.append("rect")
      .attr("x", x("3/3/01"))
      .attr("y", 0)
      .attr("width", (x("11/24/01") - x("3/3/01")))
      .attr("height", height)
      .attr("fill","gainsboro")

   svg.append("rect")
      .attr("x", x("12/1/07"))
      .attr("y", 0)
      .attr("width", (x("6/27/09") - x("12/1/07")))
      .attr("height", height)
      .attr("fill","gainsboro")



   // vertical axis
   var y = d3.scaleLinear()
      .domain([0, d3.max(data, function(d) { return d["Jobless Claims"]; })])
      .range([height, 0])
      .nice();

   var yAxis = d3.axisLeft(y)
      .ticks(7)
      .tickSize(-(width-margin.right));

   function customYAxis(g) {
      var s = g.selection ? g.selection() : g;
      g.call(yAxis);
      s.select(".domain").remove();
      s.selectAll(".tick line").filter(Number).attr("stroke", "#777").attr("stroke-dasharray", "2,2");
      s.selectAll(".tick text").attr("x", 10).attr("dy", -4);
      // if (s !== g) g.selectAll(".tick text").attrTween("x", null).attrTween("dy", null);
   }

   svg.append("g")
      .attr("class", "yAxis")
      .style("font-size", "12px")
      .call(customYAxis);

   svg.append("text")
      .attr("class", "axislabel")
      .attr("transform", "rotate(-90)")
      .attr("dy", "1em")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .style("text-anchor", "middle")
      .text("Jobless Claims");


   // visualize data
   var line = d3.line()
      .x(function(d) { return x(d["Week Ending"])})
      .y(function(d) { return y(d["Jobless Claims"]) });

   svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#cc0000")
      .attr("stroke-width", 2)
      .attr("d", line);






   // tooltips and hover zones
   var tooltipdiv = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

   svg.selectAll(".tooltipzone")
      .data(data)
      .enter().append("rect")
      .attr("class", "tooltipzone")
      .attr("x", function(d, i){
         return x(d["Week Ending"]) - 2;
      })
      .attr("y", function(d,i){
         return y(d["Jobless Claims"]) - 20;
      })
      .attr("width", 4)
      .attr("height", 40)
      .attr("fill", "red")
      .attr("fill-opacity", 0)
      // .attr("stroke","gray")
      // .attr("stroke-width","1px")
      .on('mouseover mousemove', function(d){
         tooltipdiv.style("opacity", 1);

         tooltipdiv.html(
            "Week ending " + d["Week Ending"] + ": " +
            d["Jobless Claims"].toLocaleString('en-US')
         )
         .style("left", (d3.event.pageX - 75) + "px")
         .style("top", (d3.event.pageY - 50) + "px");
      })
      .on('mouseout', function(d,i){
         tooltipdiv.transition().style("opacity", 0);
      });




   // meta info
   if (chartmeta.source) {
      d3.select(targetElement).append("h6").html("<b>SOURCE:</b> " + chartmeta.source);
   }
   if (chartmeta.note) {
      d3.select(targetElement).append("h6").html("<b>NOTE:</b> " + chartmeta.note);
   }


}
