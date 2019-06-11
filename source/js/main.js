function initMap(gmap) {
	let routeBtn = document.querySelectorAll('[data-coordinates]');
	let directionsDisplay = new google.maps.DirectionsRenderer();
	let directionsService = new google.maps.DirectionsService();
	let start = new google.maps.LatLng();
	let finish = new google.maps.LatLng({
		lat: 50.479136, 
		lng: 30.343218
	});
	let coordinates = {
		lat: 50.479136,
		lng: 30.343218
	};
		
	let map = new google.maps.Map(gmap, {
		zoom: 18,
		center: coordinates
	});

	let marker = new google.maps.Marker({
		position: coordinates, 
		map: map
	});

	directionsDisplay.setMap(map);

	let calculateRoute = () => {
		marker.setMap(null);

		start = new google.maps.LatLng({
			lat: 50.465852, 
			lng: 30.355782
		});

		let request = {
			origin: start,
			destination: finish,
			travelMode: 'TRANSIT'
		}

		directionsService.route(request, function(result, status){
			if(status == "OK") directionsDisplay.setDirections(result);
		})
	}

	document.querySelector('.route').onclick= function() {
		calculateRoute();
	}
}

window.addEventListener('load', () => {
	let mapWidjet = document.querySelector('#map')
	if (mapWidjet) initMap(mapWidjet);
})
