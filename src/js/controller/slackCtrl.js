// #######################################################
// #######################################################
// #######################################################
// #######################################################
// #######################################################
// #######################################################
// #######################################################
// ##################### SLACK ###########################
// #######################################################
// #######################################################
// #######################################################
// #######################################################
// #######################################################
// #######################################################
// #######################################################


  angular
  .module('starterApp').controller('slackController', function($scope, slackFactory){
    $scope.headerMessage("slack");
    var token = "token=xoxp-129764168451-130523008727-130512743894-db64ec2401158fa7fc612055be4a4c53";
    var activeTab;
    var activeDMUser;
    var history = [];

      var authenticateUser = function(){
        slackFactory.apiGet('https://slack.com/api/auth.test?'+token+'&pretty=1')
        .then(function successCallback(response){
          $scope.slackusername = response.data.user;
        }, function errorCallback(response){
          console.log("slack error");
        })
      }
      authenticateUser();

      var getChannel = function(){
        slackFactory.apiGet('https://slack.com/api/channels.list?'+token+'&pretty=1')
        .then(function successCallback(response){
          $scope.channels = response.data.channels;
          $scope.activeChannelSend = $scope.channels[1].id;
          $scope.activeChannelHistory = $scope.channels[1].id;
          $scope.getSlackMessages();
        }, function errorCallback(response){
          console.log("slack error");
        })
      }
      getChannel();

      var dmChannel = [];
      var getDirectMessageChannel = function(){
        slackFactory.apiGet('https://slack.com/api/im.list?' + token + '&pretty=1')
        .then(function successCallback(response){
          dmChannel = response.data.ims;
        }, function errorCallback(response){
          console.log("slack error");
        })
      }
      getDirectMessageChannel();

      var getTeamInfo = function(){
        slackFactory.apiGet('https://slack.com/api/team.info?'+token+'&pretty=1')
        .then(function successCallback(response){
          $scope.domain = response.data.team.domain + ".slack.com";
          $scope.teamName = response.data.team.name;
        }, function errorCallback(response){
          console.log("slack error");
        })
      }
      getTeamInfo();

      var getUsersList = function(){
        slackFactory.apiGet('https://slack.com/api/users.list?'+token+'&pretty=1')
        .then(function successCallback(response){
          $scope.userList = response.data.members;
        }, function errorCallback(response){
          console.log("slack error");
        })
      }
      getUsersList();

      $scope.update = function(){
        if(activeTab === 0){
          $scope.getSlackMessages();
        }else {
          getDmMessages();
        }
      }

      $scope.sendSlackMessage = function(){
        var sendId; 
        if (activeTab === 0){
          sendId = $scope.activeChannelSend;
        } else {
          sendId = $scope.toUser; 
        }
        slackFactory.apiGet('https://slack.com/api/chat.postMessage?'+token+'&channel='+ sendId +'&text='+$scope.slackmessage+'&as_user=true&pretty=1')
        .then(function successCallback(response){
          $scope.slackmessage = '';
          $scope.update();
        }, function errorCallback(response){
          console.log("slack error");
        })
      }

      $scope.showTable = false;

      $scope.getSlackMessages = function(){
        slackFactory.apiGet('https://slack.com/api/channels.history?'+token+'&channel='+$scope.activeChannelHistory+'&count=10&pretty=1')
        .then(function successCallback(response){
          history = response.data.messages;
          $scope.showTable = true;
          timestampToDate();
        }, function errorCallback(response){
          console.log("slack error");
        })
      }

      var getDmMessages = function(){
        slackFactory.apiGet('https://slack.com/api/im.history?'+token+'&channel='+activeDMUser+'&count=10&pretty=1')
        .then(function successCallback(response){
          history = response.data.messages;
          timestampToDate();
        }, function errorCallback(response){
          console.log("slack error");
        })
      }

      var getDmIdByUserId = function(){
        console.log("bla")
        for (var i = 0; i < dmChannel.length; i++){
          if($scope.toUser === dmChannel[i].user){
            return dmChannel[i].id;
          }
        }
      }

      $scope.changeChannel = function(){
        $scope.activeChannelHistory = $scope.activeChannelSend;
        $scope.update();
      }
      
      $scope.changeDmChannel = function(){
        activeDMUser = getDmIdByUserId();
        $scope.update();
      }

      
      var timestampToDate = function(){
        $scope.messagehistory = [];
        if(history){
          for (var i = 0; i < history.length; i++){
            var temp = history[i].ts.split('.');
            history[i].ts = temp[0];
            history[i].username = getUsernameByID(history[i].user);
            $scope.messagehistory[i] = history[i];
          }
        }
      }

      var getUsernameByID = function(id){
        for (var i = 0; i < $scope.userList.length; i++){
          if (id === $scope.userList[i].id){
            return $scope.userList[i].name;
          }
        }
        return "der Geist";
      }

      // 0 = general messages, 1 = direct message
      $scope.getActiveTab = function(currentTabIndex){
        activeTab = currentTabIndex;
        console.log('Current tab ' + currentTabIndex);
        $scope.update();
        //U3UFD08MD
      };
  })
