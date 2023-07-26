// Store our API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
    // Once we get a response, send the data.features object to the createFeatures function.
   // createFeatures(data.features);
   let myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
    });

// Add the base layer to the map.
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(myMap);
 
    

// Create a overlay layer containing the earthquake info.
  for (let i = 0; i < data.features.length; i++) 
  {
    let mag = data.features[i].properties.mag*4;
    let depth = Math.round(data.features[i].geometry.coordinates[2]*10000)/10000;
    let lat = data.features[i].geometry.coordinates[1];
    let lng = data.features[i].geometry.coordinates[0];
    
    L.circleMarker([lat, lng], {radius: mag, color:"#000", fillColor: getColor(depth) , fillOpacity: 0.75, weight:0.5})
    .bindPopup(`<h3>Mag: ${data.features[i].properties.mag}, Depth: ${depth}km, Loc: ${data.features[i].properties.place}</h3>`)
    .addTo(myMap);
  };

// Add a legend to the map.
let legend = L.control({position: "bottomright"});

//Create a function to show the range colors for the density intervals in the legend.
function getColor(d) {
  return d > 90 ? '#780000' :
         d > 70  ? '#EF233C' :
         d > 50  ? '#FF006E' :
         d > 30  ? '#FFC247' :
         d > 10   ? '#B5DD7E' :
         d > -10   ? '#69D025' :
                    '#FFEDA0';}  

// Create the legend table and add it to the map.
legend.onAdd = function (map) 
{
    let div = L.DomUtil.create('div', 'info legend');
    grades = [-10,10,30,50,70,90];
    

    // loop through our density intervals and generate a label with a colored square for each interval
    for (let i = 0; i < grades.length; i++) 
    {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        
    };
    return div;
};
legend.addTo(myMap);

});