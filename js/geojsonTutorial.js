// The essential components for creating a leaflet map,
// including a variable to to hold the map within a div,
// a tile layer, and a method to add the tile layer to the map div.
var mymap2 = L.map('mapid').setView([39.756, -104.994], 13);
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  id: 'mapbox/streets-v11',
  accessToken: 'pk.eyJ1IjoiY2phcmNodWxldGEiLCJhIjoiY2syYW9pcTAyMWV5ejNtbzZhM25zNnpsdSJ9.7Gl9zzKB40HnoFIWBW-Tvg'
}).addTo(mymap2);


// GeoJSON feature with properties in key-value notation
var geojsonFeature = {
  "type": "Feature",
  "properties": {
    "name": "Coors Field",
    "amenity": "Baseball Stadium",
    "popupContent": "This is where the Rockies play!"
  },
  "geometry": {
    "type": "Point",
    "coordinates": [-104.99404, 39.75621]
  }
};

// Add a GeoJSON layer to put GeoJSON object into
L.geoJSON(geojsonFeature).addTo(mymap2);

// Add a layer to put features in, such as myLines
var myLayer = L.geoJSON().addTo(mymap2);

// An array of GeoJSON objects delineating a pair of lines
var myLines = [{
  "type": "LineString",
  "coordinates": [[-105, 40], [-105, 45], [-110, 55]]
}, {
  "type": "LineString",
  "coordinates": [[-105, 40], [-110, 45], [-115, 55]]
}];
myLayer.addData(myLines);
