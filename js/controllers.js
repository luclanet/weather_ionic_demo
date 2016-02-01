angular.module('starter.controllers', [])
.run(function($rootScope, locations) {
	$rootScope.locations = locations.locations;
})
.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
	if (ionic.Platform.isIOS()) $scope.platform = 'iOS';
	else $scope.platform = 'android';
})

.controller('LocationCtrl', function($scope, $stateParams, geo, weather, photos, $window, $ionicPopup) {
	$scope.getPageData = function() {
		// Photo in background is not visible (can't be, we have no pictures and isn't preloaded yet)
			$scope.photoHidden = true;
			
		// Reset the secondary information box
		$scope.currentWeatherNextDays = {};
		
		// The user has select to see the weater based on his location
		if ($stateParams.location == "geo") {
			// Current location is still unknown
			// We must find coordinates
			navigator.geolocation.getCurrentPosition(function(position) {
				$scope.currentCoordinates = {};
				$scope.currentCoordinates.lat = position.coords.latitude;
				$scope.currentCoordinates.lng = position.coords.longitude;
				
				geo.getCoordinates($scope.currentCoordinates.lat+","+$scope.currentCoordinates.lng).then(function(ret) {
					// Saving coordinates and coordinates area from google api service
					$scope.currentCoordinatesArea = ret.area;
					$scope.currentLocation = ret.location;
					
					$scope.getWeather();
				});
			}, function() {
				$ionicPopup.alert({
					title: 'Error',
					template: 'Please enable geolocation to your smartphone'
				});
			});
		} else {
			// Retrieve the location from the Url
			$scope.currentLocation = $stateParams.location;
			
			// First request: transform the location name to geo thanks to google apis
			geo.getCoordinates($scope.currentLocation).then(function(ret) {
				// Saving coordinates and coordinates area from google api service
				$scope.currentCoordinates = ret.coordinates;
				$scope.currentCoordinatesArea = ret.area;
				
				$scope.getWeather();
			});
		}
	};
	
	// A function to avoid duplicated code
	$scope.setImg = function(img) {
		$scope.photoHidden = false;
		$scope.photo = img;
		$scope.$apply(); // Angular can't intercept this event because it's trigged by the load of the image so we have to run the digest manually
	};
	
	
	// Finally retrieve the weater of current location
	$scope.getWeather = function() {
		weather.getWeather($scope.currentCoordinates).then(function(ret) {
			// Save data from openweather service
			$scope.currentWeather = ret;
			// If we are forcing the updating process, now it's ended
			$scope.$broadcast('scroll.refreshComplete');
		});
		
		weather.getWeatherNextDays($scope.currentCoordinates).then(function(ret) {
			// Save data from openweather service
			$scope.currentWeatherNextDays = ret;
		});
		
		// Let's get some color to the page with a background picture
		photos.getPhotoForGeoLocation($scope.currentCoordinatesArea).then(function(photos) {
			// Setting the background image directly we will get a bad 56k effect on loading
			// The solution is to preload the image and show it only when it's cached
			
			// Nothing to do, if there aren't images about this place
			if (photos.length == 0) return;
			
			// Retriving a random image
			var tmp_photo = (photos[Math.floor(Math.random() * photos.length)].photo_file_url);
			// Create a new element for preload it
			var preload_el = angular.element('<img src="'+tmp_photo+'">');
			// Attaching an event that will be trigged when the image is loaded
			// but it won't be called if the image is already loaded...
			preload_el.on('load', function() {
				$scope.setImg(tmp_photo);
		  	});
			
			// ...so check if it's already loaded
			if (preload_el.complete || (preload_el.width+preload_el.height) > 0) {
				// and force the changing of the image
				$scope.setImg(tmp_photo);
			}
		});
	};
	
	// Set night or day used in icons
	$scope.$watch(function() { return new Date().getHours(); }, function(d) {
		// Just a small check on time
		// Night : >20 and <8
		// Day: >8 and <20
		$scope.dayNight = (d > 8 && d < 20 ? 'day' : 'night');
	});
	
	// Init
	$scope.getPageData();
});
