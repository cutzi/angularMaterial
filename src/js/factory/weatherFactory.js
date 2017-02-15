angular
.module('starterApp').factory("dataFactory", ['$http', function($http, $scope) {
    var dataFactory = {};
    dataFactory.getwgData = function(weatherlocation) {
      //return $http.get("data/" + weatherlocation + ".json");
      return $http.get("http://api.wunderground.com/api/5daf5f7feb05ae33/geolookup/conditions/forecast10day/hourly/astronomy/q/Germany/"+weatherlocation+".json")
    };
    return dataFactory;
  }])