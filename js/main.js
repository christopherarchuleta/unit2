// Creating map for leaflet lab

// Steps for retrieve operator
//Step 4. Determine the attribute for scaling the proportional symbols GOOD
//Step 5. For each feature, determine its value for the selected attribute GOOD
//Step 6. Give each feature's circle marker a radius based on its attribute value GOOD

// Steps for sequence operator
//GOAL: Allow the user to sequence through the attributes and resymbolize the map
//   according to each attribute
//STEPS:
//Step 1. Create slider widget GOOD
//Step 2. Create step buttons GOOD
//Step 3. Create an array of the sequential attributes to keep track of their order GOOD
//Step 4. Assign the current attribute based on the index of the attributes array GOOD
//Step 5. Listen for user input via affordances GOOD
//Step 6. For a forward step through the sequence, increment the attributes array index;
//   for a reverse step, decrement the attributes array index GOOD
//Step 7. At either end of the sequence, return to the opposite end of the sequence on the next step
//   (wrap around) GOOD
//Step 8. Update the slider position based on the new index GOOD
//Step 9. Reassign the current attribute based on the new attributes array index
//Step 10. Resize proportional symbols according to each feature's value for the new attribute

// Map variable declared globally.
var leafletMap;

// Define variable globally to hold data
var attributes = ["2008","2009","2010","2011","2012","2013","2014","2015","2016","2017","2018"];

// Minimum value, used for the Flannery ratio, will be put into this global variable
var minValue;

// Instantiate map, defining the initial viewpoint
function createMap(){
  leafletMap = L.map('mapid', {
    center: [-10,-70],
    zoom: 3,
  });

  // Set maximum zoom to maintain national scale
  leafletMap.options.maxZoom = 7;

  // Add OSM tile layer, will change basemap later
  L.tileLayer('https://api.mapbox.com/styles/v1/cjarchuleta/ck7cvqmln0kc41jmlm4ngou7n/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiY2phcmNodWxldGEiLCJhIjoiY2syYW9pcTAyMWV5ejNtbzZhM25zNnpsdSJ9.7Gl9zzKB40HnoFIWBW-Tvg'
        // attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
        // id: 'mapbox/streets-v11',
        // accessToken: 'pk.eyJ1IjoiY2phcmNodWxldGEiLCJhIjoiY2syYW9pcTAyMWV5ejNtbzZhM25zNnpsdSJ9.7Gl9zzKB40HnoFIWBW-Tvg'
      ).addTo(leafletMap);

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
};

function calcPropRadius(attValue) {

  // Changes the sizes of all of the symbols by changing the minimum radius
  var minRadius = 1.3;

  // Flannery scaling ratio
  var radius = 1.0083 * Math.pow(attValue/minValue,0.5715) * minRadius

  return radius;
};


// function SymbolColors(properties, attribute){
//   this.properties = properties;
//   this.attribute = attribute;
//   if (properties[attribute] < 0){
//     layer.setStyle({fillColor:"#d8b365"});
//   } else {
//     layer.setStyle({fillColor:"5ab4ac"});
//   };
// };


// Refactor redundant code in pointToLayer and updatePropSymbols by making one function
function createPopupContent(properties, attribute){
  // Add country name to popup
  var popupContent = "<p><b>Country:</b> " + properties[String("Country Name")] + "</p>";

  // Add rural population growth to popup
  var year = attribute.split("_")[1];
  popupContent += "<p><b>Rural Pop. Growth in " + attribute + ":<b> " + properties[attribute] + "%</p>";

  return popupContent;
};

// Build array for holding temporal data with function
// Create attributes array for accessing data by their indices
function processData(data){
  var attributes = [];

  // Properties of the first feature
  var properties = data.features[0].properties;

  // Push attribute names to fill the array
  for (var attribute in properties){
    // Get attributes for percent change in rural population
    // by having special prefix
    if (attribute.indexOf("2") > -1){
      attributes.push(attribute);
    };
  };

  // Check result
  console.log(attributes[9]);
  console.log(attributes);

  return attributes;
};

function updatePropSymbols(attribute){
  leafletMap.eachLayer(function(layer){
    // Only execute following code on the percent change in rural population
    if (layer.feature && layer.feature.properties[attribute]){
      var props = layer.feature.properties;
      //update each feature's radius based on new attribute values
      var radius = calcPropRadius(Math.abs(props[attribute]));

      // var symColors = new SymbolColors(props, attribute);

      // Set colors of the proportional symbols based on positive or negative growth
      if (props[attribute] < 0){
        layer.setStyle({fillColor:"#d8b365"});
      }
      else {
        layer.setStyle({fillColor:"#5ab4ac"});
      };


      layer.setRadius(radius);
      console.log(attribute);
      console.log(props[String("Country Name")] + attribute + typeof(radius) + radius);

      // Use consolidated popup content code
      var popupContent = createPopupContent(props, attribute);


      //update popup content
      popup = layer.getPopup();
      popup.setContent(popupContent).update();
      };
    });
};

// Create sequence controls
function createSequenceControls(){
  // Create slider to extend the temporal range of the data
  $('#panel').append('<input class="range-slider" type="range">');

  // Add step buttons
  $('#panel').append('<button class="step" id="reverse">Reverse</button>');
  $('#panel').append('<button class="step" id="forward">Forward</button>');
  // Replace step buttons with images
  $('#reverse').html('<img src="img/StepBackward.png">');
  $('#forward').html('<img src="img/StepForward.png">');
  // Step buttons created by Dmitriy Ivanov from Noun Project


  // console.log(attributes);
  // Set slider attributes such as max, min, initial value, and increments
  $('.range-slider').attr({
    max: 10,
    min: 0,
    value: 0,
    step: 1
  });


  $('.step').click(function(){
    // Records previous slider value
    var index = $('.range-slider').val();
    console.log(index);
    // Conditional statement for when forward button is pressed
    if ($(this).attr('id') == 'forward'){
      // Increment
      index++;
      // Make value go around if an end is surpassed
      index = index > 10 ? 0 : index;
      updatePropSymbols(attributes[index]);
      // Conditional statemnt for when reverse button is pressed
    } else if ($(this).attr('id') == 'reverse'){
      // Decrement
      index--;
      index = index < 0 ? 10 : index;
      // // Make proportional symbols reflect
      // // the current value from the attributes array
      updatePropSymbols(attributes[index]);
    };

    // Make proportional symbols reflect
    // the current value from the attributes array

    // Make range slider value equal the new index value
    $('.range-slider').val(index);
  });

// Event listener for the range slider,
// which keeps track of the value of the slider and reassigns it
  $('.range-slider').on('input', function(){
    var index = $(this).val();
    console.log(index);
    console.log(attributes);
    console.log(attributes[index]);
    updatePropSymbols(attributes[index]);
  });
};

// Add proportional symbols to the map after specifying their attributes
function createPropSymbols(data, attributes){


// Create function to keep pointToLayer in L.geoJSON uncluttered
  function pointToLayer(feature, latlng, attributes){
    //Choose attribute to visulaize with proportional symbols
    // Choose intial value for map and slider
    var attribute = attributes[0];
    console.log(attribute);

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


    // symColors = SymbolColors(Number(feature.properties),attribute);

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

    // Create popup content with consolidated code
    var popupContent = createPopupContent (feature.properties, attribute);

    //Bind the popup to the circle marker and create an offset
    layer.bindPopup(popupContent, {
      offset: new L.Point(0,-options.radius * 0.5)
    });

    //Return the circle marker to the L.geoJson pointToLayer option
    return layer;
};

  L.geoJson(data, {
    pointToLayer: function(feature, latlng){
      // Add attributes to their respective proportional symbols
      return pointToLayer(feature, latlng, attributes);
    }
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

// Use AJAX for asynchronous data and page loading
function getData(leafletMap){
    //load the data
    $.ajax("data/RuralPop.geojson", {
        dataType: "json",
        success: function(response){
            var attributes = processData(response);
            minValue = calcMinValue(response);
            //add symbols and UI elements
            createPropSymbols(response, attributes);
            createSequenceControls(attributes);

        }
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
