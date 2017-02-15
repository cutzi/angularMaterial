// #######################################################
// #######################################################
// #######################################################
// #######################################################
// #######################################################
// #######################################################
// #######################################################
// ##################### FACEBOOK ########################
// #######################################################
// #######################################################
// #######################################################
// #######################################################
// #######################################################
// #######################################################
// #######################################################
  angular
  .module('starterApp').controller('facebookController', function($scope, $http){
    $scope.headerMessage("facebook");

    function statusChangeCallback(response) {
        // The response object is returned with a status field that lets the
        // app know the current login status of the person.
        // Full docs on the response object can be found in the documentation
        // for FB.getLoginStatus().
        if (response.status === 'connected') {
          // Logged into your app and Facebook.
          testAPI();
          userid = response.authResponse.userID;
        } else if (response.status === 'not_authorized') {
          // The person is logged into Facebook, but not your app.
          $scope.fbStatus = 'Please log ' +
            'into this app.';
        } else {
          // The person is not logged into Facebook, so we're not sure if
          // they are logged into this app or not.
          $scope.fbStatus = 'Please log ' +
            'into Facebook.';
        }
      }

      function getFriendList(){
        var FB = window.FB;
        FB.api(
          "/" + userid + "/friends",
          function (response) {
            console.log(response);
            if (response && !response.error) {
              /* handle the result */
            }
          }, {scope: 'user_id'}
        );
      }

      $scope.sendFacebookMessage = function(){
        var message = "mimimimi";
        var FB = window.FB;
          FB.ui({
           method: 'send',
           name: 'Send Private Message to Facebook User using Javascript Facebook API',  
           link: 'http://www.techsirius.com/2012/12/send-private-message-to-facebook-user.html',  
           description: 'In this tutorial I will show you how to send private message to facebook user using Javascript Facebook API. Although it looks very complicated but in real it is very simple, just follow the tutorial.'
         });
        /*FB.login(function(response){
         if (response.authResponse){
          FB.ui({
           method: 'send',
           name: 'Send Private Message to Facebook User using Javascript Facebook API',  
           link: 'http://www.techsirius.com/2012/12/send-private-message-to-facebook-user.html',  
           description: 'In this tutorial I will show you how to send private message to facebook user using Javascript Facebook API. Although it looks very complicated but in real it is very simple, just follow the tutorial.'
         });
        }
      });*/
      }

      // This function is called when someone finishes with the Login
      // Button.  See the onlogin handler attached to it in the sample
      // code below.
      function checkLoginState() {
        FB.getLoginStatus(function(response) {
          statusChangeCallback(response);
        });
      }


      $scope.facebookLogin = function() {
          var FB = window.FB;
          var scopes = 'email,user_likes,public_profile';
       
          FB.login(function(response) {
            if (response.status === 'connected') {
              console.log('The user has logged in!');
              FB.api('/me', function(response) {
                console.log('Good to see you, ' + response.name + '.');
              });
            }
          }, { scope: scopes });
        }
        
      window.fbAsyncInit = function() {
      FB.init({
        appId      : '240945816316988',
        cookie     : true,  // enable cookies to allow the server to access 
                            // the session
        xfbml      : true,  // parse social plugins on this page
        version    : 'v2.8' // use graph api version 2.8
      });

      // Now that we've initialized the JavaScript SDK, we call 
      // FB.getLoginStatus().  This function gets the state of the
      // person visiting this page and can return one of three states to
      // the callback you provide.  They can be:
      //
      // 1. Logged into your app ('connected')
      // 2. Logged into Facebook, but not your app ('not_authorized')
      // 3. Not logged into Facebook and can't tell if they are logged into
      //    your app or not.
      //
      // These three cases are handled in the callback function.

      FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
      });

      };

      // Load the SDK asynchronously
      (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));

      // Here we run a very simple test of the Graph API after login is
      // successful.  See statusChangeCallback() for when this call is made.
      function testAPI() {
        console.log('Welcome!  Fetching your information.... ');
        FB.api('/me', function(response) {
          console.log('Successful login for: ' + response.name);
          $scope.fbStatus = 
            'You\'re logged in as ' + response.name + '!';
        });
      }
  })
