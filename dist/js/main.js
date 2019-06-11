"use strict";

function initMap(gmap) {
  var routeBtn = document.querySelectorAll('[data-coordinates]');
  var directionsDisplay = new google.maps.DirectionsRenderer();
  var directionsService = new google.maps.DirectionsService();
  var start = new google.maps.LatLng();
  var finish = new google.maps.LatLng({
    lat: 50.479136,
    lng: 30.343218
  });
  var coordinates = {
    lat: 50.479136,
    lng: 30.343218
  };
  var map = new google.maps.Map(gmap, {
    zoom: 18,
    center: coordinates
  });
  var marker = new google.maps.Marker({
    position: coordinates,
    map: map
  });
  directionsDisplay.setMap(map);

  var calculateRoute = function calculateRoute() {
    marker.setMap(null);
    start = new google.maps.LatLng({
      lat: 50.465852,
      lng: 30.355782
    });
    var request = {
      origin: start,
      destination: finish,
      travelMode: 'TRANSIT'
    };
    directionsService.route(request, function (result, status) {
      if (status == "OK") directionsDisplay.setDirections(result);
    });
  };

  document.querySelector('.route').onclick = function () {
    calculateRoute();
  };
}

window.addEventListener('load', function () {
  var mapWidjet = document.querySelector('#map');
  if (mapWidjet) initMap(mapWidjet);
});
"use strict";