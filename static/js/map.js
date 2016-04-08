/*********************************************
 * Global map variables
 *********************************************/

var map;  // Google map object
var markers = [];  // Keeps track of all parking lot markers

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

$('#about-button').click(function () {
  swal({
    title: 'About',
    html: 'This web app displays live parking data in the City of Luxembourg, and allows you to find the closest available parking lot to your current location.<br/><br/>Built by <a href="http://kennysong.com" target="_blank">Kenny Song</a> and Nael Hailemariam in 24 hours for the <a href="http://www.gameofcode.eu/" target="_blank">Game of Code 2016</a>.',
    confirmButtonText: 'Awesome!',
  });
});

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
      "stylers": [{ "color": "#ffffff" }]
    },
    {
      "featureType": "all",
      "elementType": "labels.text.stroke",
      "stylers": [{ "color": "#000000" }, { "lightness": 13 }]
    },
    {
      "featureType": "administrative",
      "elementType": "geometry.fill",
      "stylers": [{ "color": "#000000" }]
    },
    {
      "featureType": "administrative",
      "elementType": "geometry.stroke",
      "stylers": [{ "color": "#144b53" }, { "lightness": 14 }, { "weight": 1.4 }]
    },
    {
      "featureType": "landscape",
      "elementType": "all",
      "stylers": [{ "color": "#08304b" }]
    },
    {
      "featureType": "poi",
      "elementType": "geometry",
      "stylers": [{ "color": "#0c4152" }, { "lightness": 5 }]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry.fill",
      "stylers": [{ "color": "#000000" }]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry.stroke",
      "stylers": [{ "color": "#0b434f" }, { "lightness": 25 }]
    },
    {
      "featureType": "road.arterial",
      "elementType": "geometry.fill",
      "stylers": [{ "color": "#000000" }]
    },
    {
      "featureType": "road.arterial",
      "elementType": "geometry.stroke",
      "stylers": [{ "color": "#0b3d51"}, {"lightness": 16 }]
    },
    {
      "featureType": "road.local",
      "elementType": "geometry",
      "stylers": [{ "color": "#000000" }]
    },
    {
      "featureType": "transit",
      "elementType": "all",
      "stylers": [{ "color": "#146474" }]
    },
    {
      "featureType": "water",
      "elementType": "all",
      "stylers": [{ "color": "#021019" }]
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

  // Set listener to get live and initial data from the Firebase map_regions table
  setDataListener(drawLotsFromSnapshot);
}

// Draws parking lots on map from Firebase snapshot data
function drawLotsFromSnapshot(snapshot) {
  eraseAllLots();

  snapshot = snapshot.val();
  console.log('Data received from Firebase', snapshot);

  for (var lotName in snapshot) {
    if (snapshot.hasOwnProperty(lotName)) {
      var lot = snapshot[lotName];

      if (lot.available > 0 && lot.open) {
        // Lot is open and has available spots
        var marker = new MarkerWithLabel({
          position: {lat: lot.latitude, lng: lot.longitude},
          map: map,
          labelContent: lot.available + '/' + lot.capacity,
          labelAnchor: new google.maps.Point(22, -4),
          labelClass: "marker-label-available",
          animation: google.maps.Animation.DROP,
          icon: '/static/img/available_icon.png'
        });
      } else {
        // Lot is closed or is full
        var labelContent = !lot.open ? 'CLOSED' : '0';
        var marker = new MarkerWithLabel({
          position: {lat: lot.latitude, lng: lot.longitude},
          map: map,
          labelContent: labelContent,
          labelAnchor: new google.maps.Point(24, -4),
          labelClass: "marker-label-unavailable",
          animation: google.maps.Animation.DROP,
          icon: '/static/img/unavailable_icon.png'
        });
      }

      markers.push(marker);
    }
  }
}

// Undraws all parking lot markers on the map and empties the markers array
function eraseAllLots() {
  markers.forEach(function (marker) {
    marker.setMap(null);
  });
  markers = [];
}

/*********************************************
 * Data handling functions
 *********************************************/

var db = new Firebase('https://parklux.firebaseio.com');

// Set listener for new parking lot data from Firebase
function setDataListener(callback) {
  db.on('child_added', callback);
}

/*********************************************
 * Run this on load 
 *********************************************/

google.maps.event.addDomListener(window, 'load', initializeMap);
