angular
.module('starterApp').factory("slackFactory", ['$http', function($http, $scope) {
    var slackFactory = {};
    slackFactory.apiGet = function(url) {
      //return $http.get("data/" + weatherlocation + ".json");
      return $http.get(url)
    };
    return slackFactory;
  }])