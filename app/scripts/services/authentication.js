'use strict';

angular.module('commercialApp')
  .factory('AuthenticationService', [
    '$http',
    '$cookieStore',
    '$rootScope',
    'URLS',
    function($http, $cookieStore, $rootScope, URLS) {

      var service = {};

      service.login = Login;
      service.setCredentials = SetCredentials;
      service.clearCredentials = ClearCredentials;

      return service;

      function Login(username, password, callback) {

        console.log('usuario: ' + username);
        console.log('senha: ' + password);

        $http({
          method: 'POST',
          url: URLS.login,
          data: { user: username, pass: password }
          //headers: { }
        }).success(function(response) {
            console.log('response: ' + response);
            //callback(response);
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

        $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata;
        $cookieStore.put('globals', $rootScope.globals);
      }

      function ClearCredentials() {
        $rootScope.globals = { };
        $cookieStore.remove('globals');
        $http.defaults.headers.common.Authorization = 'Basic';
      }

    }]);
