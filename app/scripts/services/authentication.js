'use strict';

angular.module('commercialApp')
  .factory('AuthenticationService', [
    '$http',
    '$cookieStore',
    '$rootScope',
    function($http, $cookieStore, $rootScope) {

      var service = { };

      service.login = Login;
      service.setCredentials = SetCredentials;
      service.clearCredentials = ClearCredentials;

      return service;

      function Login(username, password, callback) {

        $http.post('/api/', { username: username, password: password })
          .success(function(response) {
            callback(response);
          });

      }

      function SetCredentials(username, password) {
        var authdata = atob(username + ':' + password);

        $rootScope.globals = {
          currentUser: {
            username: username,
            authdata: authdata
          }
        };


        $cookieStore.put('globals', $rootScope.globals);
      }

      function ClearCredentials() {
        $rootScope.globals = { };
        $cookieStore.remove('globals');

      }

    }]);
