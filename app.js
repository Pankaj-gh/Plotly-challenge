function buildMetadata(sample) {
    d3.json('data/samples.json').then(function(data){

        // print out the results for metadata
        var metadata = data.metadata
        // console.log(metadata)

        // filter results for each one
        var selectID = metadata.filter(row => row.id == sample);
        idOne = selectID[0]

        // select the metapanel from the Index Page 
        var metapanel = d3.select('#sample-metadata');
        metapanel.html('');

        Object.entries(idOne).forEach(([key, value]) => {
            console.log([key, value])
            metapanel.append('p').text(`${key}: ${value}`)
        });
    })
};



function buildCharts(sample) {

  // Use `d3.json` to fetch the sample data for the plots
  d3.json("data/samples.json").then((data) => {
    var samples= data.samples;
    var results= samples.filter(d => d.id == sample);
    var result= results[0]

    var ids = result.otu_ids;
    var labels = result.otu_labels;
    var values = result.sample_values;


    // Build a Bubble Chart using the sample data
    var LayoutBubble = {
      margin: { t: 0 },
      xaxis: { title: "Sample IDs" },
      hovermode: "closest",
      };

      var DataBubble = [
      {
        x: ids,
        y: values,
        text: labels,
        mode: "markers",
        marker: {
          color: ids,
          size: values,
          }
      }
    ];

    Plotly.plot("bubble", DataBubble, LayoutBubble);

    //  Build a bar Chart
    
    var bar_data =[
      {
        y:ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
        x:values.slice(0,10).reverse(),
        text:labels.slice(0,10).reverse(),
        type:"bar",
        orientation:"h"

      }
    ];

    var barLayout = {
      title: "Top 10 Bacteria Cultures",
      margin: { t: 30, l: 150 }
    };

    Plotly.newPlot("bar", bar_data, barLayout);
  });
}
   


function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

 

  d3.json("data/samples.json").then((data) => {
    var sampleNames = data.names;
    //for (var i=0; i<sampleNames.length; i++){
    //  select
    //}
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
  // console.log(json_obj)
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();





