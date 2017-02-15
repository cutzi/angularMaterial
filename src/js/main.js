

angular
.module('starterApp',['ngMaterial', 'ngMessages', 'chart.js', 'ngRoute'])

.config(function($routeProvider) {
  $routeProvider

  .when('/', {
    templateUrl : 'pages/home.html', 
    controller : 'mainController'
  })

    .when('/weather', {
      templateUrl : 'pages/weather.html', 
      controller : 'weatherController'
    })

    .when('/navigation', {
      templateUrl: 'pages/navigation.html',
      controller : 'navigationController'
    })

    .when('/usermedia', {
      templateUrl: 'pages/usermedia.html',
      controller : 'usermediaController'
    })

    .when('/facebook', {
      templateUrl: 'pages/facebook.html',
      controller : 'facebookController'
    })

    .when('/slack', {
      templateUrl: 'pages/slack.html',
      controller : 'slackController'
    })
  })

  .config(function($mdThemingProvider) {
    // Configure a dark theme with primary foreground yellow
    $mdThemingProvider.theme('default')
      .primaryPalette('teal')
      .dark();
    $mdThemingProvider.theme('dark-grey').backgroundPalette('grey').dark();
    $mdThemingProvider.theme('dark-orange').backgroundPalette('orange').dark();
    $mdThemingProvider.theme('dark-purple').backgroundPalette('deep-purple').dark();
    $mdThemingProvider.theme('dark-blue').backgroundPalette('blue').dark();

  });

  
