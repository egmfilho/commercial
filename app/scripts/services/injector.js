/**
 * Created by egmfilho on 11/07/16.
 */

'use strict';

angular.module('commercialApp')
  .factory('AuthenticationService', [
    '$http',
    '$httpParamSerializerJQLike',
    '$cookies',
    'URLS',
    function($http, $httpParamSerializerJQLike, $cookies, URLS) {

      var service = {};

      service.login = Login;
      service.logout = Logout;
      //service.setCredentials = SetCredentials;
      //service.clearCredentials = ClearCredentials;

      return service;

      function Login(username, password, callback) {

        $http({
          method: 'POST',
          url: URLS.login,
          data: $httpParamSerializerJQLike({ user: username, pass: password }),
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function(response) {
          SetCredentials({
            user_id: response.data.user_id,
            token: response.data.user_session_id,
            username: response.data.user_user,
            name: response.data.user_name,
            mail: response.data.user_mail
          });
          callback(response);
        });

      }

      function Logout(callback) {

        var token = '';

        if ($cookies.get('currentUser')) {
          token = $cookies.get('currentUser').token;
        }

        $http({
          method: 'POST',
          url: URLS.logout,
          data: $httpParamSerializerJQLike({ token: token }),
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function(response) {
          ClearCredentials();
          callback(response);
        });
      }

      function SetCredentials(data) {
        var expiration = new Date();
        expiration.setDate(expiration.getDate() + 1);
        //expiration.setSeconds(expiration.getSeconds() + 10);

        //$http.defaults.headers.common['user-session-id'] = token;
        $cookies.putObject('currentUser', data, { 'expires': expiration });
      }

      function ClearCredentials() {
        $cookies.remove('currentUser');
        //$http.defaults.headers.common.Authorization = 'Basic';
      }

    }]);
