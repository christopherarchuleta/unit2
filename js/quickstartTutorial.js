// The essential components for creating a leaflet map,
// including a variable to to hold the map within a div,
// a tile layer, and a method to add the tile layer to the map div.
var mymap = L.map('mapid').setView([51.505, -0.09], 13);
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  id: 'mapbox/streets-v11',
  accessToken: 'pk.eyJ1IjoiY2phcmNodWxldGEiLCJhIjoiY2syYW9pcTAyMWV5ejNtbzZhM25zNnpsdSJ9.7Gl9zzKB40HnoFIWBW-Tvg'
}).addTo(mymap);

// Adding a marker with specified coordinates
var marker = L.marker([51.5, -0.09]).addTo(mymap);

// Adding a circle, with styling specifications included
var circle = L.circle([51.508, -0.11], {
  color: 'red',
  fillColor: '#f03',
  fillOpacity: '0.5',
  radius: 500
}).addTo(mymap);

// Adding a polygon in like manner as a circle.
// It includes an array of vertex coordinates
var polygon = L.polygon([
  [51.509, -0.08],
  [51.503, -0.06],
  [51.51, -0.047]
]).addTo(mymap);

// Adding popups to the marker, circle, and polygon
// The openPopup method makes the popup show when the page loads
marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
circle.bindPopup("I am a circle.");
polygon.bindPopup("I am a polygon.");

// Making a separate layer for a popup
var popup = L.popup()
  .setLatLng([51.5,-0.09])
  .setContent("I am a standalone popup.")
  .openOn(mymap);

// The listener function below is a popup rather than an alert.
// The alert event listener is in the comments below.
var popup = L.popup();

function onMapClick(e) {
  popup
    .setLatLng(e.latlng)
    .setContent("You clicked the map at " + e.latlng.toString())
    .openOn(mymap);
}

mymap.on('click', onMapClick);
// The listener function below enables an interaction based on where
// the user clicks on the map (e). There will be feedback
// telling the user the coordinates of where they clicked.
//   function onMapClick(e) {
//     alert("You clicked the map at " + e.latlng);
//   }
//
// mymap.on('click', onMapClick);
