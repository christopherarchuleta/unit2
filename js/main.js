// Creating map for leaflet lab

//Step 4. Determine the attribute for scaling the proportional symbols GOOD
//Step 5. For each feature, determine its value for the selected attribute GOOD
//Step 6. Give each feature's circle marker a radius based on its attribute value

// Map variable declared globally.
var leafletMap;

// Minimum value, used for the Flannery ratio, will be put into this global variable
var minValue;

// Instantiate map, defining the initial viewpoint
function createMap(){
  leafletMap = L.map('mapid', {
    center: [-10,-70],
    zoom: 3
  });

  // Add OSM tile layer, will change basemap later
  L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
        id: 'mapbox/streets-v11',
        accessToken: 'pk.eyJ1IjoiY2phcmNodWxldGEiLCJhIjoiY2syYW9pcTAyMWV5ejNtbzZhM25zNnpsdSJ9.7Gl9zzKB40HnoFIWBW-Tvg'
      }).addTo(leafletMap);

      // Call getData function
      getData();

};

// Calculate minimum value within the dataset to use the Flannery ratio
function calcMinValue(data){

  // Create empty array to hold data
  var allValues = [];

  // Loop through features for each year between 2008 and 2018,
  // incrementing by one year
  for(var country of data.features){
    for(var year = 2008; year <= 2018; year++){
      // Create a variable to store all of the relevant values
      var value = country.properties[String(year)];
      // Fill array with relevant values
      allValues.push(Math.abs(value));
    }
  }

  // Use the Math.min function to calculate minimum value in the array
  var minValue = Math.min(...allValues)

  return minValue;
}

function calcPropRadius(attValue) {

  // Changes the sizes of all of the symbols by changing the minimum radius
  var minRadius = 2;

  // Flannery scaling ratio
  var radius = 1.0083 * Math.pow(attValue/minValue,0.5715) * minRadius

  return radius;
};

// Add proportional symbols to the map after specifying their attributes
function createPropSymbols(data){

// Hard code an attribute to create proportional symbols from
  var attribute = "2012";

  var geojsonMarkerOptions = {
    fillColor: "#d8b365",
    color: "#1a1a1a",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8,
    radius: 8
  };

// Create function to keep pointToLayer in L.geoJSON uncluttered
  function pointToLayer(feature, latlng){
    //Choose attribute to visulaize with proportional symbols
    var attribute = "2012";

    //Create marker options
    var options = {
        fillColor: "#ff7800",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };

    // Convert the attribute data type to number because data is derived from .csv
    // Make a variable to hold the attribute values
    // feature.properties is used because the attributes fall within the
    // "properties" group (see GeoJSON)
    var attValue = Number(feature.properties[attribute]);

    // Use hue to differentiate between increase and decrease in rural population
    if (attValue < 0){
      options.fillColor = "#d8b365"
    } else {
      options.fillColor = "#5ab4ac"
    };

    // Use absolute value to create symbols with negative values
    options.radius = calcPropRadius(Math.abs(attValue));

    // Test the attribute value
    console.log(feature.properties, attValue);

    //Create circle marker layer
    var layer = L.circleMarker(latlng, options);

    //Build popup content string with country name
    var popupContent = "<p><b>Country:</b> " + feature.properties[String("Country Name")] + "</p>";

    // Add context to the popup
    var percentChange = attribute.split("_")[1];
    popupContent += "<p><b>Rural Pop. Change in " + attribute + ":<b> " + feature.properties[attribute] + " %</p>";

    //Bind the popup to the circle marker and create an offset
    layer.bindPopup(popupContent, {
      offset: new L.Point(0,-options.radius * 0.5)
    });

    //Return the circle marker to the L.geoJson pointToLayer option
    return layer;
};

  L.geoJson(data, {
    pointToLayer: pointToLayer
  }).addTo(leafletMap);
};

function onEachFeature(feature, layer) {
  var popupContent = "";
  // Where ever there are properties in a given feature,
  // a for loop creates popup content stating the properties
  if (feature.properties) {
    for (var property in feature.properties){
      popupContent += "<p>" + property + ": " + feature.properties[property] + "</p>";
    }
    layer.bindPopup(popupContent);
  };
};

// Function to retrieve data and add proportional symbols to layer in map using AJAX and jQuery
function getData(leafletMap){
  $.getJSON("data/RuralPop.geojson", function(response){

    minValue = calcMinValue(response);
    createPropSymbols(response);
  });
};

// Call createMap function once page elements are ready
$(document).ready(createMap);








































// // Creating test div to see results via Prepros and browser inspector
// var mydiv = document.getElementById("mydiv");
// mydiv.innerHTML = "Hello World";
//
// // Using window.onload to perform js functions after html elements load
// function myfunc(){
//   var mydiv = document.getElementById("mydiv");
//   mydiv.innerHTML = "Hello World.";
// };
//
// window.onload = myfunc();
//
// // Initialize function when page loads, which calls the table function
// function initialize(){
//   newTable();
// };
//
// // Native JS function method for printing GeoJson file via AJAX
// function jsAjax(){
//   // Create new request
//   var ajaxrequest = new XMLHttpRequest();
//
//   // Create event handler to send data to callback function,
//   // where it can be accessed
//   ajaxrequest.onreadystatechange = function(){
//     if (ajaxrequest.readystate == 4){
//       callback(ajaxrequest.response);
//     };
//   };
//
//   // Open the server connection with path and asynchronicity
//   ajaxrequest.open('GET', 'data/MegaCities.geojson', true);
//
//   // Set response data type
//   ajaxrequest.responseType = "json";
//
//   // Send the request
//   ajaxrequest.send();
// };
//
// // Callback function for when data loads in JS file
// function callback(response){
//   // Print the geoJson file in the callback function so
//   // it can be sent to server and back before user engagement
//   console.log(response);
// };
//
// // Shorthand jQuery AJAX method equivalent to functions above
// $.getJSON("data/MegaCities.geojson", callback);
//
// // Function for making new table
// function newTable(){
//   // Create arrays
//   var name = [
//     'Kitty',
//     'Oreo',
//     'Snowbell'
//   ];
//   var birthYear = [
//     2013,
//     2012,
//     2003
//   ];
//
//   // Make table element to be filled
//   var table = document.createElement("table");
//
//   // Make header row to be filled
//   var headerRow = document.createElement("tr");
//
//   // Add column for names
//   var nameColumn = document.createElement("th");
//   nameColumn.innerHTML = "Name";
//   headerRow.appendChild(nameColumn);
//
//   // Add column for birth years
//   var birthYearColumn = document.createElement("th");
//   birthYearColumn.innerHTML = "Birth Year";
//   headerRow.appendChild(birthYearColumn);
//
//   // Add row, with the columns appended to them, to the table
//   table.appendChild(headerRow);
//
//   // Add rows for each cat with a for loop
//   for (var i = 0; i < name.length; i++){
//     var tr = document.createElement("tr");
//
//     var cat = document.createElement("td");
//     cat.innerHTML = name[i];
//     tr.appendChild(cat);
//
//     var year = document.createElement("td");
//     year.innerHTML = birthYear[i];
//     tr.appendChild(year);
//
//     table.appendChild(tr);
//   };
//
//   // Add table to div in index.html
//   var mydiv = document.getElementById("mydiv");
//   mydiv.appendChild(table);
// };
//
// // Call the initialize function after elements load
// window.onload = initialize();
// // Use AJAX for data transfer afetr elements load
// window.onload = jsAjax();
// // Scripts by Chris Archuleta, 2020
