/*********************************************
 * Global map variables
 *********************************************/

var map;  // Google map object
var markers = [];  // Keeps track of all parking lot markers
var locationMarker;  // Keeps track of the current location marker
var closestLotLine;  // Keeps track of the line to the closest lot
var lastOpenInfoWindow;  // Keeps track of the last open info window 

/*********************************************
* Page elements
**********************************************/

$('#locate-button').click(function () {
  navigator.geolocation.getCurrentPosition(gotLocation);
});

// Handler for when we get the user's geolocation 
function gotLocation(position) {
  console.log(position.coords);
  getClosestLot(position.coords);
}

$('#about-button').click(function () {
  swal({
    title: 'About',
    html: 'This web app displays live parking data in the City of Luxembourg, tracks historical trends in parking behavior, and quickly finds the closest available parking lot to your current location.<br/><br/>Built by <a href="http://kennysong.com" target="_blank">Kenny Song</a> and <a href="https://www.linkedin.com/in/naelstudentatbuaa" target="_blank">Nael Hailemariam</a> in 24 hours for the <a href="http://www.gameofcode.eu/" target="_blank">Game of Code 2016</a>.',
    confirmButtonText: 'Awesome!',
  });
});

$('#history-button').click(function () {
  window.location = '/history';
});

$('#parklux-text').click(function () {
  window.location = '/';
})

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

      var marker;
      if (lot.available > 0 && lot.open) {
        // Lot is open and has available spots
        marker = new MarkerWithLabel({
          position: {lat: lot.latitude, lng: lot.longitude},
          map: map,
          labelContent: lot.available + '/' + lot.capacity,
          labelAnchor: new google.maps.Point(32, -4),
          labelClass: "marker-label-available",
          animation: google.maps.Animation.DROP,
          icon: '/static/img/available_icon.png'
        });
      } else {
        // Lot is closed or is full
        var labelContent = !lot.open ? 'CLOSED' : '0';
        marker = new MarkerWithLabel({
          position: {lat: lot.latitude, lng: lot.longitude},
          map: map,
          labelContent: labelContent,
          labelAnchor: new google.maps.Point(32, -4),
          labelClass: "marker-label-unavailable",
          animation: google.maps.Animation.DROP,
          icon: '/static/img/unavailable_icon.png'
        });
      }

      // Add InfoWindow to the marker
      var className = (lot.available > 0 && lot.open) ? 'green' : 'red';
      var infoContent = '<h2 class=' + className + '>' + lotName + '</h2>' +
                        '<p><strong>Available</strong>: ' + lot.available + '</p>' +
                        '<p><strong>Capacity</strong>: ' + lot.capacity + '</p>' +
                        '<p><strong>Currently Open</strong>: ' + (lot.open ? 'Yes' : 'No') + '</p>' +
                        '<p><strong>Coordinates</strong>: <a href="http://maps.google.com/maps?q=' + lot.latitude + ',' + lot.longitude + '&z=14&ll=' + lot.latitude + ',' + lot.longitude + '" target="_blank">(' + lot.latitude + ', ' + lot.longitude + ')</a></p>';
      markerAddInfoWindow(marker, infoContent);

      // Add it to the global markers list
      markers.push(marker);
    }
  }
}

// Add event listener to open a InfoWindow with content when marker is clicked
function markerAddInfoWindow(marker, content) {
  var infoWindow = new google.maps.InfoWindow({
    content: content
  });
  google.maps.event.addListener(marker, "click", function (e) { 
    if (lastOpenInfoWindow) { lastOpenInfoWindow.close(); }
    infoWindow.open(map, this); 
    lastOpenInfoWindow = infoWindow;
  });
}

// Undraws all parking lot markers on the map and empties the markers array
function eraseAllLots() {
  markers.forEach(function (marker) {
    marker.setMap(null);
  });
  markers = [];
}

// Gets the closest parking lot to the current location
function getClosestLot(coords) {
  // Calculate distances to each parking lot
  distances = [];
  markers.forEach(function (marker) {
    if (marker.labelContent === 'CLOSED' || marker.labelContent === '0') {
      distances.push(Infinity);
    } else {
      var dist = Math.pow(marker.position.lat() - coords.latitude, 2) + Math.pow(marker.position.lng() - coords.longitude, 2);
      distances.push(dist);
    }
  });

  // Get the closest parking lot
  var smallest_index = argmin(distances);
  var closest_lot = markers[smallest_index];
  console.log(closest_lot);

  // Display new location information
  if (locationMarker) { locationMarker.setMap(null); }
  locationMarker = new MarkerWithLabel({
    position: {lat: coords.latitude - 0.00025, lng: coords.longitude},
    map: map,
    icon: '/static/img/location.png',
    animation: google.maps.Animation.DROP,
  });

  // Move map to closest parking lot
  map.panTo(closest_lot.getPosition());

  // Set marker of closest parking lot marker
  // TODO: Recolor all markers in the correct color before making a new one blue
  closest_lot.setIcon('/static/img/closest_icon.png');

  // Draw line to closest parking lot
  if (closestLotLine) { closestLotLine.setMap(null); }
  closestLotLine = new google.maps.Polyline({
    path: [{lat: coords.latitude, lng: coords.longitude}, 
           {lat: closest_lot.position.lat(), lng: closest_lot.position.lng()}],
    strokeOpacity: 0,
    icons: [{
      icon: {
        path: 'M 0,-1 0,1',
        strokeOpacity: 1,
        scale: 3,
        strokeColor: '#00a8ff',
        fillColor: '#00a8ff',
      },
      offset: '0',
      repeat: '20px',
    }],
    map: map
  });

  // Draw line to closest parking lot
  locationMarkerContent = '<h2 style="color:rgb(0, 168, 255);">Your Location</h2>' + 
                          '<p><strong>Coordinates</strong>: <a href="http://maps.google.com/maps?q=' + coords.latitude + ',' + coords.longitude + '&z=14&ll=' + coords.latitude + ',' + coords.longitude + '" target="_blank">(' + coords.latitude + ', ' + coords.longitude + ')</a></p>';
  markerAddInfoWindow(locationMarker, locationMarkerContent);
}

// Argmin function for an array
function argmin(A) {
  var min_index = 0;
  for (i = 1; i < A.length; i++) {
    if (A[i] < A[min_index]) {
      min_index = i;
    }
  }
  return min_index;
}

/*********************************************
 * Data handling functions
 *********************************************/

var db = new Firebase('https://parklux.firebaseio.com');

// Set listener for new parking lot data from Firebase
function setDataListener(callback) {
  db.orderByKey().limitToLast(1).on('child_added', callback);
}

// Gets all data from Firebase and then calls callback
function getAllData(callback) {
  db.orderByKey().once('value', callback);
}

/*********************************************
 * Run this on load 
 *********************************************/

google.maps.event.addDomListener(window, 'load', initializeMap);
