// #######################################################
// #######################################################
// #######################################################
// #######################################################
// #######################################################
// #######################################################
// #######################################################
// ##################### mainHome ########################
// #######################################################
// #######################################################
// #######################################################
// #######################################################
// #######################################################
// #######################################################
// #######################################################
  angular
  .module('starterApp').controller('mainController',  
      function ($scope, $rootScope, $timeout, $mdSidenav, $log, geoFactory, $location) {
    $scope.headerMessage = function(msg){
      $rootScope.message = msg;
    }

    //$scope.showDarkTheme = true;

    $scope.back = function(){
      history.back();
    }

    $scope.headerMessage("Home");

    $scope.weatherData = {
      city:null,
      obs_time: null,
      temp_c: null,
      feelslike_c: null,
      text: null,
      icon_url: null,
      wind: null,
      wind_dir: null,
      wind_degrees: null,
      visibility: null,
      precip_today: null,
      sunrise: null,
      sunset: null,
      forecast: null,
      hourly_forecast: null,
      url: null
    }
    
    $scope.wgSaveData = function(response){
      $scope.weatherData = {
        city: response.data.current_observation.display_location.full,
        obs_time: response.data.current_observation.observation_time_rfc822,
        temp_c: response.data.current_observation.temp_c,
        feelslike_c: response.data.current_observation.feelslike_c,
        text: response.data.current_observation.weather,
        icon_url: response.data.current_observation.icon_url,
        wind: response.data.current_observation.wind_kph,
        wind_dir: response.data.current_observation.wind_dir,
        wind_degrees: response.data.current_observation.wind_degrees,
        visibility: response.data.current_observation.visibility_km,
        precip_today: response.data.current_observation.precip_today_metric,
        sunrise: response.data.sun_phase.sunrise.hour + ":" + response.data.sun_phase.sunrise.minute,
        sunset: response.data.sun_phase.sunset.hour + ":" + response.data.sun_phase.sunset.minute,
        forecast: response.data.forecast.simpleforecast.forecastday,
        hourly_forecast: response.data.hourly_forecast,
        url: response.data.current_observation.ob_url
      };
    }
    if(localStorage.getItem('weatherDataLocal')){
      console.log('localstorage used in main');
      $scope.wgSaveData(JSON.parse(localStorage.getItem('weatherDataLocal')));
      $scope.isData = true;
    } else{
      $scope.isData = false;
    }

    $scope.getGeoAddress = function(){
     geoFactory.getAddress(coords.lat, coords.lon)
       .then(function(response){
         $scope.start = response.data.results[0].formatted_address;
         $scope.coords = {
          lat: coords.lat,
          lon: coords.lon
         }
         $scope.displayMapURL = "http://maps.googleapis.com/maps/api/staticmap?size=640x300&style=element:labels|visibility:on&markers=color:blue%7Clabel:S%7C"+coords.lat+","+coords.lon+"&zoom=16&center="+coords.lat+","+coords.lon;
       }, function(error){
         console.log("error: " + error.message);
       });
    }

    $scope.getGeoLoc = function(){
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position){
          coords = {
            lat: position.coords.latitude,
            lon: position.coords.longitude
          }
          $scope.getGeoAddress();
        })
      }
    }

    if(coords.lat){
      $scope.getGeoAddress();
    } else {
      $scope.getGeoLoc();
    }

    $scope.currentTime = "loading...";
    $scope.tickInterval = 1000;

    var tick = function(){
      $scope.currentTime = Date.now();
      $timeout(tick, $scope.tickInterval);
    }

    $timeout(tick, $scope.tickInterval);

    $scope.selectedIndex = 0;

    $scope.onSwipeUp = function (){

     if ($scope.selectedIndex < 5){
       $scope.selectedIndex  = $scope.selectedIndex + 1;
     }
      // if you want to make all the tour
      else{
       $scope.selectedIndex  = 0;
     }
    }

    $scope.onSwipeDown = function () {

      if ($scope.selectedIndex > 0){
       $scope.selectedIndex  = $scope.selectedIndex - 1;
     }
      // if you want to make all the tour
      else {
       $scope.selectedIndex  = 5;
     }
    }

    $scope.$watch('selectedIndex', function(current, old) {
      switch (current) {
        case 0:
        $location.url("/");
        break;
        case 1:
        $location.url("/weather");
        break;
        case 2:
        $location.url("/navigation");
        break;
        case 3:
        $location.url("/usermedia");
        break;
        case 4:
        $location.url("/facebook");
        break;
        case 5:
        $location.url("/slack");
        break;
      }
    });

    $scope.toggleLeft = buildToggler('left');
    $scope.toggleRight = buildToggler('right');

    $scope.isOpenRight = function(){
      return $mdSidenav('right').isOpen();
    };

    /**
     * Supplies a function that will continue to operate until the
     * time is up.
     */
    function debounce(func, wait, context) {
      var timer;

      return function debounced() {
        var context = $scope,
            args = Array.prototype.slice.call(arguments);
        $timeout.cancel(timer);
        timer = $timeout(function() {
          timer = undefined;
          func.apply(context, args);
        }, wait || 10);
      };
    }

    /**
     * Build handler to open/close a SideNav; when animation finishes
     * report completion in console
     */
    function buildDelayedToggler(navID) {
      return debounce(function() {
        // Component lookup should always be available since we are not using `ng-if`
        $mdSidenav(navID)
          .toggle()
          .then(function () {
            $log.debug("toggle " + navID + " is done");
          });
      }, 200);
    }

    function buildToggler(navID) {
      return function() {
        // Component lookup should always be available since we are not using `ng-if`
        $mdSidenav(navID)
          .toggle()
          .then(function () {
            $log.debug("toggle " + navID + " is done");
          });
      }
    }

   
  })