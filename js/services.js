angular.module('starter.services', [])
.service('locations', [function() {
	// Location array can be also injected as http request
	this.locations = ['London', 'Berlin', 'Serramanna', 'Rome'];
}])
.factory('geo', function($http) {
	var fn = [];
	
	// The request is async it's necessary to be called as geo.getCoordinates().then({ ... })
	fn.getCoordinates = function(location) {
		console.log($http);
		var promise = $http.get('https://maps.googleapis.com/maps/api/geocode/json?address='+window.encodeURIComponent(location)+'&location_type=APPROXIMATE&key=AIzaSyC3ViO8Cb9uPsXMgrIQ8Cg5MTqgndVD3wk').then(function (response) {
			var tmp_final_address_components = {};
			// Searching for the result without details (we don't need street or number)
			angular.forEach(response.data.results, function(d) {
				var tmp_address_components = {};
				angular.forEach(d.address_components, function(v) {
					tmp_address_components[v.types[0]] = v.long_name;
				});
				if (angular.isUndefined(tmp_address_components.street_number) && !angular.isUndefined(tmp_address_components.locality)) {
					item = d;
					tmp_final_address_components = tmp_address_components;
				}
			});
			return { location : tmp_final_address_components["administrative_area_level_3"], coordinates : item.geometry.location, area : { north : item.geometry.bounds.northeast, south : item.geometry.bounds.southwest }};
	    });
		return promise;
	};
	return fn;
})
.factory('weather', function($http) {
	var fn = [];
	
	// The request is async it's necessary to be called as weather.getWeather().then({ ... })
	// @ coordinates as { lat : 0, lng : 0}
	
	fn.getWeather = function(coordinates) {
		var promise = $http.get('http://api.openweathermap.org/data/2.5/weather?lat='+window.encodeURIComponent(coordinates.lat)+'&lon='+window.encodeURIComponent(coordinates.lng)+'&appid=bd82977b86bf27fb59a04b61b657fb6f').then(function (response) {
	        return response.data;
	    });
		return promise;
	};
	
	fn.getWeatherNextDays = function(coordinates) {
		var promise = $http.get('http://api.openweathermap.org/data/2.5/forecast?lat='+window.encodeURIComponent(coordinates.lat)+'&lon='+window.encodeURIComponent(coordinates.lng)+'&appid=bd82977b86bf27fb59a04b61b657fb6f').then(function (response) {
	        return response.data;
	    });
		return promise;
	};
	return fn;
})
.factory('photos', function($http, $ionicPlatform) {
	var fn = [];
	// Retrieving a photo for the background
	// The request is async it's necessary to be called as weather.getWeather().then({ ... })
	// @ coordinates as { lat : 0, lng : 0}
	
	fn.getPhotoForGeoLocation = function(coordinates) {
		// Check connection type to avoid an excessive bandwidth usage
		if (!angular.isUndefined(navigator) && !angular.isUndefined(navigator.connection) && !angular.isUndefined(navigator.connection.type) && (navigator.connection.type == "wifi" || navigator.connection.type == "ethernet"))
			var quality = "original";
		else
			var quality = "medium";
		
		var promise = $http.get('https://ssl.panoramio.com/map/get_panoramas?order=popularity&set=public&size='+quality+'&from=0&to=50&minx='+window.encodeURIComponent(coordinates.south.lng)+'&miny='+window.encodeURIComponent(coordinates.south.lat)+'&maxx='+window.encodeURIComponent(coordinates.north.lng)+'&maxy='+window.encodeURIComponent(coordinates.north.lat)+'&mapfilter=true').then(function (response) {
	        return response.data.photos;
	    });
		return promise;
	};
	return fn;
});