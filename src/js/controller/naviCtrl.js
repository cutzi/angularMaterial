var target = {
  latitude: 0, 
  longitude: 0
}

//50.5658844,9.9651181
var options = {
  enableHighAccuracy: false,
  timeout: 5000,
  maximumAge: 0
};

var coords = {};




  
/*function successWatchPosition(pos){
  var crd = pos.coords;
  updateMarkerPosition(crd);
  if (target.latitude === crd.latitude && target.longitude === crd.longitude) {
    console.log('Congratulations, you reached the target');
    navigator.geolocation.clearWatch(id);
  }
}

function updateMarkerPosition(crd){
  console.log(crd);
  console.log(target);

  var newLatLng = new google.maps.LatLng(crd.latitude, crd.longitude);
  currentLocMarker.setPosition(newLatLng);

  map.panTo(newLatLng);
}

function errorWatchPosition(error){
  console.warn('ERROR(' + error.code + '): ' + error.message);
}*/



//var id = navigator.geolocation.watchPosition(successWatchPosition, errorWatchPosition, options);
// #######################################################
// #######################################################
// #######################################################
// #######################################################
// #######################################################
// #######################################################
// #######################################################
// ##################### Navigat #########################
// #######################################################
// #######################################################
// #######################################################
// #######################################################
// #######################################################
// #######################################################
// #######################################################
  angular
  .module('starterApp').controller('navigationController', ['$http', '$scope', 'geoFactory', function($http, $scope, geoFactory){
    $scope.destination = "frankfurt";

    $scope.headerMessage("Navigation");

    var displayMap = function() {
      geoFactory.getAddress(coords.lat, coords.lon)
      .then(function(response){
        $scope.start = response.data.results[0].formatted_address;
        initMap(coords.lat, coords.lon);
      }, function(error){
        console.log("error: " + error.message);
      });
    }
    

    if(coords.lat){
      displayMap();
    } else if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position){
          coords.lat = position.coords.latitude;
          coords.lon = position.coords.longitude;
          displayMap();
      })
    }

    var initMap = function(lat, lon){
      var directionsService = new google.maps.DirectionsService;
      var directionsDisplay = new google.maps.DirectionsRenderer;

      var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 14,
        center: {lat: lat, lng: lon}
      });
      $scope.markers = [];
      var infoWindow = new google.maps.InfoWindow();
      var marker = new google.maps.Marker({
        map: map,
        position: new google.maps.LatLng(lat, lon),
        title: "your position"
      });
      google.maps.event.addListener(marker, 'click', function(){
        infoWindow.setContent('<h2>' + marker.title + '</h2>' + lat + ", " + lon);
        infoWindow.open(map, marker);
      });
      $scope.markers.push(marker);
      $scope.openInfoWindow = function(e, selectedMarker){
        e.preventDefault();
        google.maps.event.trigger(selectedMarker, 'click');
      }


      directionsDisplay.setMap(map);
      directionsDisplay.setPanel(document.getElementById('panel'));

      $scope.submit = function(){
       calculateAndDisplayRoute(directionsService, directionsDisplay);
       var start = $scope.start;
       var end = $scope.destination;
       $scope.routingLinkActive = true;
       $scope.routingLink = 'http://maps.google.com/maps?saddr=' + start + '&daddr=' + end;

       var destinationCoordsUrl = "https://maps.google.com/maps/api/geocode/json?address=" + end;
       $http.get(destinationCoordsUrl, function(data){
        //console.log(data);
        target = { 
          latitude : data.results[0].geometry.location.lat,
          longitute : data.results[0].geometry.location.lng
        };
      });  
     };
   }

   //default initialization
   initMap(50.540583, 9.678624);

   var calculateAndDisplayRoute = function(directionsService, directionsDisplay){
    directionsService.route({
      origin: $scope.start,
      destination: $scope.destination,
      travelMode: google.maps.TravelMode.DRIVING
    }, function(response, status) {
      if (status === google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }

  // Get some required handles
  var recognizing = false;
  var rec = null;
  var final_transcript_start = '';
  var final_transcript_destination = '';
  $scope.rec = function(){
    try {
      rec = new webkitSpeechRecognition();
      recognizing = !recognizing;
      if (recognizing){
        rec.start();
      } else {
        rec.stop();
      }
    }
    catch(e){
      console.log(e);
    }
    if (rec && recognizing){
      console.log(rec);
      rec.continuous = true;
      rec.interimResults = false;
      rec.lang = 'de';

      // Define a threshold above which we are confident(!) that the recognition results are worth looking at 
      var confidenceThreshold = 0.5;

      // Simple function that checks existence of s in str
      var userSaid = function(str, s) {
        str = str.toLowerCase();
        return str.indexOf(s) > -1;
      }
      // Process the results when they are returned from the recogniser
      rec.onresult = function(e) {
        // Check each result starting from the last one
        if (typeof(event.results) == 'undefined') {
             rec.onend = null;
             
             console.log("undefined");
             rec.stop();
             return;
           }

        
        for (var i = e.resultIndex; i < e.results.length; ++i) {
          // If this is a final result
              if (e.results[i].isFinal) {
                // If the result is equal to or greater than the required threshold
                if (parseFloat(e.results[i][0].confidence) >= parseFloat(confidenceThreshold)) {
                  var str = e.results[i][0].transcript;
                  console.log('Recognised: ' + str);
                  // If the user said 'video' then parse it further
                  if (userSaid(str, 'anfang')){
                    if (final_transcript_start){
                      final_transcript_start = '';
                    }
                    final_transcript_start += e.results[i][0].transcript.split(' ').slice(1).join(' ');
                    console.log (final_transcript_start);
                  } else if (userSaid(str, 'ende')) {
                    if (final_transcript_destination){
                      final_transcript_destination = '';
                    }
                    final_transcript_destination += e.results[i][0].transcript.split(' ').slice(1).join(' ');
                  }
                }
              }
          }
          if(final_transcript_start !== ''){
            $scope.start = final_transcript_start;
          }
          if(final_transcript_destination !== ''){
            $scope.destination = final_transcript_destination;
          }
          recognizing = false;
      };
    }
  }
   
}])