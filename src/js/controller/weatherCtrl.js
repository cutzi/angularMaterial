var apikey = "5daf5f7feb05ae33";
// #######################################################
// #######################################################
// #######################################################
// #######################################################
// #######################################################
// #######################################################
// #######################################################
// ##################### WEATHER #########################
// #######################################################
// #######################################################
// #######################################################
// #######################################################
// #######################################################
// #######################################################
// #######################################################
  angular
  .module('starterApp').controller('weatherController', ['$scope', 'dataFactory', function($scope, dataFactory){
    $scope.headerMessage("Weather");
    $scope.showDetails = false;

    $scope.clearData = function(){
      localStorage.removeItem('weatherDataLocal');
      $scope.isData = false;
    }

    $scope.drawChart = function(){
      var hourly = $scope.weatherData.hourly_forecast;
      $scope.labels = [];
      $scope.data = [];
      var temp = [];
      $scope.series = ["Temperature"];

      var min = hourly[0].temp.metric;
      var max = hourly[0].temp.metric;
      for (var i = 0; i < 10; i++){
        $scope.labels[i] = hourly[i].FCTTIME.civil;
        temp[i] = hourly[i].temp.metric;
        if(hourly[i].temp.metric > max){
          max = hourly[i].temp.metric;
        }
        if(hourly[i].temp.metric < min){
          min = hourly[i].temp.metric;
        }
      }
      $scope.data[0] = temp;
      $scope.onClick = function (points, evt) {
        console.log(points, evt);
      };
      $scope.datasetOverride = [
      { 
        yAxisID: 'y-axis-1',
      }
      ];
      $scope.options = {
        scales: {
          yAxes: [
          {
            id: 'y-axis-1',
            type: 'linear',
            display: true,
            position: 'left',
            ticks: {
              suggestedMin: parseInt(min)-1,
              suggestedMax: parseInt(max)+1
            },
            gridLines: {
              display:false
            }
          }],
          xAxes: [
          {
            gridLines: {
              display: false
            }
          }
          ]
        }
      };
    };


    if(localStorage.getItem('weatherDataLocal')){
      //console.log('localstorage used');
      $scope.wgSaveData(JSON.parse(localStorage.getItem('weatherDataLocal')));
      $scope.drawChart();
    }

    $scope.wgShowData = function(weatherlocation){
      //console.log('api used');
      dataFactory.getwgData(weatherlocation).then(function(response){
        $scope.wgSaveData(response);
        localStorage.setItem('weatherDataLocal', JSON.stringify(response));
        $scope.isData = true;
        $scope.drawChart();
        return response.data;
      }, function(error){
        console.log("error: " + error.message);

      });
    };

    $scope.refreshWeatherData = function(){
      if ($scope.weatherData.city){
        $scope.wgShowData($scope.weatherData.city.split(',',1));
      } else {
        console.log("keine stadt eingegeben");
      }
    }
  }])