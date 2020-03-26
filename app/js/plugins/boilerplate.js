var margin = {top:25, right:50, bottom:50, left:75};

var colors = {
    bold: ["#d51e2d", "#52CFE5", "#385775", "#FFBF3D", "#6f2b6e", "#00CFB5"],
    pastel: ["#e59097", "#c0adcc", "#b3cadd", "#a3ceaf", "lavender", "aquamarine", "gold"],
    procon: ["#cc0000", "#808080", "#000"],
    political: ["#D41B2C", "#006EB5"]
}

var chartmeta = {
    title: "Title goes here",
    subtitle: "Subtitle goes here",
    source: "U.S. Department of Labor",
    note: "Numbers are seasonally adjusted."
}


d3.json('/interactive/2020/03/jobless-claims/data/jobless_claims.json')
  .then(function(data) {
     data.forEach(function(d) {
        d["Jobless Claims"] = +d["Jobless Claims"]
     })

     console.log(data);

    lineTemplate(data, chartmeta, "#line");

}).catch(function(error){
   // handle error
});
