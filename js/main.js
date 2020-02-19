// Creating map for leaflet lab

// // Map variable declared globally.
// var map;
//
// // Instantiate map, defining the initial viewpoint
// function createMap(){
//   map = L.map('mapid', {
//     center: [20,0],
//     zoom: 2
//   });

  // Add OSM tile layer
var Esri_WorldStreetMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012',
  accessToken: 'pk.eyJ1IjoiY2phcmNodWxldGEiLCJhIjoiY2syYW9pcTAyMWV5ejNtbzZhM25zNnpsdSJ9.7Gl9zzKB40HnoFIWBW-Tvg'
}).addTo(leafletMap);


  L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
        id: 'mapbox/streets-v11',
        accessToken: 'pk.eyJ1IjoiY2phcmNodWxldGEiLCJhIjoiY2syYW9pcTAyMWV5ejNtbzZhM25zNnpsdSJ9.7Gl9zzKB40HnoFIWBW-Tvg'
      }).addTo(map);

      // Call getData function
      getData();

};








































// Creating test div to see results via Prepros and browser inspector
var mydiv = document.getElementById("mydiv");
mydiv.innerHTML = "Hello World";

// Using window.onload to perform js functions after html elements load
function myfunc(){
  var mydiv = document.getElementById("mydiv");
  mydiv.innerHTML = "Hello World.";
};

window.onload = myfunc();

// Initialize function when page loads, which calls the table function
function initialize(){
  newTable();
};

// Native JS function method for printing GeoJson file via AJAX
function jsAjax(){
  // Create new request
  var ajaxrequest = new XMLHttpRequest();

  // Create event handler to send data to callback function,
  // where it can be accessed
  ajaxrequest.onreadystatechange = function(){
    if (ajaxrequest.readystate == 4){
      callback(ajaxrequest.response);
    };
  };

  // Open the server connection with path and asynchronicity
  ajaxrequest.open('GET', 'data/MegaCities.geojson', true);

  // Set response data type
  ajaxrequest.responseType = "json";

  // Send the request
  ajaxrequest.send();
};

// Callback function for when data loads in JS file
function callback(response){
  // Print the geoJson file in the callback function so
  // it can be sent to server and back before user engagement
  console.log(response);
};

// Shorthand jQuery AJAX method equivalent to functions above
$.getJSON("data/MegaCities.geojson", callback);

// Function for making new table
function newTable(){
  // Create arrays
  var name = [
    'Kitty',
    'Oreo',
    'Snowbell'
  ];
  var birthYear = [
    2013,
    2012,
    2003
  ];

  // Make table element to be filled
  var table = document.createElement("table");

  // Make header row to be filled
  var headerRow = document.createElement("tr");

  // Add column for names
  var nameColumn = document.createElement("th");
  nameColumn.innerHTML = "Name";
  headerRow.appendChild(nameColumn);

  // Add column for birth years
  var birthYearColumn = document.createElement("th");
  birthYearColumn.innerHTML = "Birth Year";
  headerRow.appendChild(birthYearColumn);

  // Add row, with the columns appended to them, to the table
  table.appendChild(headerRow);

  // Add rows for each cat with a for loop
  for (var i = 0; i < name.length; i++){
    var tr = document.createElement("tr");

    var cat = document.createElement("td");
    cat.innerHTML = name[i];
    tr.appendChild(cat);

    var year = document.createElement("td");
    year.innerHTML = birthYear[i];
    tr.appendChild(year);

    table.appendChild(tr);
  };

  // Add table to div in index.html
  var mydiv = document.getElementById("mydiv");
  mydiv.appendChild(table);
};

// Call the initialize function after elements load
window.onload = initialize();
// Use AJAX for data transfer afetr elements load
window.onload = jsAjax();
// Scripts by Chris Archuleta, 2020
