angular
.module('starterApp').factory("geoFactory", function($http) {
    var factory = {};
    
    factory.getAddress = function(coord_lat, coord_lon){
      return $http.get("http://maps.googleapis.com/maps/api/geocode/json?latlng=" + coord_lat + "," + coord_lon + "&sensor=false&callback=myLocation")
    }
    return factory;
  })
