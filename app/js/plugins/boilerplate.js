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
