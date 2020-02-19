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

// Function below, with corresponding function call,
// would add geojsonFeature to the map in a different manner

// function onEachFeature(feature, layer) {
//   if (feature.properties && feature.properties.popupContent) {
//     layer.bindPopup(feature.properties.popupContent);
//   }
// }

// The feature below, just northwest of geojsonFeature,
// will not show up on the map because of the filter function
var filterFeature = [{
  "type": "Feature",
  "properties": {
    "name": "Busch Field",
    "show_on_map": false
  },
  "geometry": {
    "type": "Point",
    "coordinates": [-104.98404, 39.74621]
  }
}];

L.geoJSON(filterFeature, {
  filter: function(feature, layer) {
    return feature.properties.show_on_map;
  }
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

// Object that styles objects uniformly
var myStyle = {
  "color": "#ff7800",
  "weight": 5,
  "opacity": 0.65
};

myLayer.addData(myLines);

// Apply myStyle variable to myLines
L.geoJSON(myLines, {
  style: myStyle
}).addTo(mymap2);

// Create example features to demonstrate function that styles individual objects
var states = [{
  "type": "Feature",
  "properties": {"party": "Republican"},
  "geometry": {
    "type": "Polygon",
    "coordinates": [[
      [-104.05, 48.99],
      [-97.22, 48.98],
      [-96.58, 45.94],
      [-104.03, 45.94],
      [-104.05, 48.99]
    ]]
  }
}, {
  "type": "Feature",
  "properties": {"party": "Democrat"},
  "geometry": {
    "type": "Polygon",
    "coordinates": [[
      [-109.05, 41.00],
      [-102.06, 40.99],
      [-102.03, 36.99],
      [-109.04, 36.99],
      [-109.05, 41.00]
    ]]
  }
}];

L.geoJSON(states, {
  style: function(feature) {
    switch (feature.properties.party) {
      case 'Republican': return {color: "#ff0000"};
      case 'Democrat': return {color: "#0000ff"};
    }
  }
}).addTo(mymap2);

// pointToLayer function instead of just a simple layer, but I don't see how it's working
var geojsonMarkerOptions = {
  radius: 8,
  fillColor: "#ff7800",
  color: "#000",
  weight: 1,
  opacity: 1,
  fillOpacity: 0.8
};

L.geoJSON(someGeojsonFeature, {
  pointToLayer: function (feature, latlng) {
    return L.circleMarker(latlng, geojsonMarkerOptions);
  }
}).addTo(mymap2);
