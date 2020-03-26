function lineTemplate(data, chartmeta, targetElement) {

    var title = d3.select(targetElement).append("h3").text(chartmeta.title);
    var subtitle = d3.select(targetElement).append("h5").text(chartmeta.subtitle);

    var width = d3.select(targetElement).node().getBoundingClientRect().width;
    var height = width * 0.4;

    // set the ranges
    var x = d3.scaleBand()
        .domain(data.map(function(d) { return d["Week Ending"]; }))
        .range([0, width - margin.left - margin.right])
        .padding(0.33);

    var y = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return d["Jobless Claims"]; })])
        .range([height, 0])
        .nice();

    var xAxis = d3.axisBottom(x)
                  .tickFormat(function(d){
                        return d;
                    })
                    .tickSize(0);

    var yAxis = d3.axisLeft(y)
                  .ticks(7)
                  .tickSize(-width);
                  // create container SVG

  var svg = d3.select(targetElement).append("svg")
      .attr("width", width)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

  svg.append("g")
      .attr("class", "xAxis")
      .attr("transform", "translate(" + margin.left + "," + height + ")")
      .style("font-size", "14px")
      .call(customXAxis);
      // .selectAll(".tick:not(:first-of-type) line")
      // .attr("stroke-opacity", 0);

  svg.append("g")
      .attr("class", "yAxis")
      .style("font-size", "12px")
      .call(customYAxis);

      function customXAxis(g) {
        g.call(xAxis);
        g.select(".domain").remove();
      }

      function customYAxis(g) {
        var s = g.selection ? g.selection() : g;
        g.call(yAxis);
        s.select(".domain").remove();
        s.selectAll(".tick line").filter(Number).attr("stroke", "#777").attr("stroke-dasharray", "2,2");
        s.selectAll(".tick text").attr("x", 10).attr("dy", -4);
        // if (s !== g) g.selectAll(".tick text").attrTween("x", null).attrTween("dy", null);
      }

      var line = d3.line()
        .x(function(d) { return x(d["Week Ending"]) + 50})
        .y(function(d) { return y(d["Jobless Claims"]) });

        var tooltip = d3.tip()
         .attr('class', 'd3-tip')
         .offset([-10,0])
         .html(function(d) {
             return d["Week Ending"] + ": " + d["Jobless Claims"];
           })
         .attr("fill", "red");

           svg.append('circle').attr('class', 'tiptarget');
           svg.call(tooltip);

      svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "#cc0000")
            .attr("stroke-width", 2)
            .attr("d", line) ;


            var div = d3.select("body").append("div")
       .attr("class", "tooltip")
       .style("opacity", 0);

      svg.selectAll(".dot")
          .data(data)
          .enter().append("circle")
          .attr("classs", "dot")
          .attr("cx", function(d, i){
            return x(d["Week Ending"]) + 50;
          })
          .attr("cy", function(d,i){
            return y(d["Jobless Claims"]);
          })
          .attr("r", 3)
          .attr("fill", "#cc0000")
          .on('mouseover, mousemove', function(d){
              d3.select(this)
                .attr("fill", "#f08080")
                .attr("r", 5);

              var target = d3.select(targetElement + ' .tiptarget')
              .attr('dx', d3.event.pageX + "px")
              .attr('dy', d3.event.pageY + "px") // 5 pixels above the cursor
              .node();
              tooltip.show(d, target);

              console.log(d["Week Ending"] + ":" + d["Jobless Claims"]);

              div.transition().style("opacity", .7);

              div.html(d["Week Ending"] + ": " + d["Jobless Claims"])
                  .style("left", (d3.event.pageX) + "px")
                  .style("top", (d3.event.pageY -28) + "px");
          })
          .on('mouseout', function(d,i){
            d3.select(this)
            .attr("fill", "#cc0000")
            .attr("r", 3);
            div.transition().style("opacity", 0);

            // tooltip.hide();
          });

          // text label for the x axis
        svg.append("text")
          .attr("transform",
                "translate(" + (width/2) + " ," +
                               (height + margin.top + 15) + ")")
          .style("text-anchor", "middle")
          .text("Label");

          // text label for the y axis
        svg.append("text")
        .attr("class", "axislabel")
        .attr("transform", "rotate(-90)")
        .attr("dy", "1em")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .style("text-anchor", "middle")
        .text("Vertical Label");

        if (chartmeta.source) {
        d3.select(targetElement).append("h6").html("<b>SOURCE:</b> " + chartmeta.source);
        }
        if (chartmeta.note) {
        d3.select(targetElement).append("h6").html("<b>NOTE:</b> " + chartmeta.note);
        }


}
