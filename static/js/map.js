/*********************************************
 * Global map variables
 *********************************************/

var map;  // Google map object

var createAllMenu = document.createElement('div');  // DOM object containing the menu for editing speed limit and hazards
createAllMenu.id = 'createAllMenu';
var editSpeedMenu = document.createElement('div');  // DOM object containing the menu for editing speed limits only
editSpeedMenu.id = 'editSpeedMenu';
var editHazardMenu = document.createElement('div');  // DOM object containing the menu for editing hazards only
editHazardMenu.id = 'editHazardMenu';

/*********************************************
* Page elements
**********************************************/

$('#locate-button').click(function () {
  navigator.geolocation.getCurrentPosition(gotLocation);
});

// Handler for when we get the user's geolocation 
function gotLocation(position) {
  console.log(position.coords);
}

/*********************************************
 * Map manipulation functions
 *********************************************/

// Initializes the Google map, called on page load
function initializeMap() {
  // Style config for the Google map
  var mapStyle = [
      {
          "featureType": "all",
          "elementType": "labels.text.fill",
          "stylers": [
              {
                  "color": "#ffffff"
              }
          ]
      },
      {
          "featureType": "all",
          "elementType": "labels.text.stroke",
          "stylers": [
              {
                  "color": "#000000"
              },
              {
                  "lightness": 13
              }
          ]
      },
      {
          "featureType": "administrative",
          "elementType": "geometry.fill",
          "stylers": [
              {
                  "color": "#000000"
              }
          ]
      },
      {
          "featureType": "administrative",
          "elementType": "geometry.stroke",
          "stylers": [
              {
                  "color": "#144b53"
              },
              {
                  "lightness": 14
              },
              {
                  "weight": 1.4
              }
          ]
      },
      {
          "featureType": "landscape",
          "elementType": "all",
          "stylers": [
              {
                  "color": "#08304b"
              }
          ]
      },
      {
          "featureType": "poi",
          "elementType": "geometry",
          "stylers": [
              {
                  "color": "#0c4152"
              },
              {
                  "lightness": 5
              }
          ]
      },
      {
          "featureType": "road.highway",
          "elementType": "geometry.fill",
          "stylers": [
              {
                  "color": "#000000"
              }
          ]
      },
      {
          "featureType": "road.highway",
          "elementType": "geometry.stroke",
          "stylers": [
              {
                  "color": "#0b434f"
              },
              {
                  "lightness": 25
              }
          ]
      },
      {
          "featureType": "road.arterial",
          "elementType": "geometry.fill",
          "stylers": [
              {
                  "color": "#000000"
              }
          ]
      },
      {
          "featureType": "road.arterial",
          "elementType": "geometry.stroke",
          "stylers": [
              {
                  "color": "#0b3d51"
              },
              {
                  "lightness": 16
              }
          ]
      },
      {
          "featureType": "road.local",
          "elementType": "geometry",
          "stylers": [
              {
                  "color": "#000000"
              }
          ]
      },
      {
          "featureType": "transit",
          "elementType": "all",
          "stylers": [
              {
                  "color": "#146474"
              }
          ]
      },
      {
          "featureType": "water",
          "elementType": "all",
          "stylers": [
              {
                  "color": "#021019"
              }
          ]
      }
  ]

  // Initialize Google map object
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14,
    center: {lat: 49.611220, lng: 6.131489},
    disableDefaultUI: true,
    zoomControl: true,
    styles: mapStyle
  });

  // Attach our custom menus at the top of the Google map
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(createAllMenu);
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(editSpeedMenu);
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(editHazardMenu);

  // Set listener to get live and initial data from the Firebase map_regions table
  // setDataListener(drawShapesFromSnapshot);
}

/*********************************************
 * Run this on load 
 *********************************************/

google.maps.event.addDomListener(window, 'load', initializeMap);
