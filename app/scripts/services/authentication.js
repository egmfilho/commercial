/**
 * Created by egmfilho on 07/07/16.
 */

'use strict';

angular.module('commercialApp.services')
  .factory('AuthenticationService', [
    '$http',
    '$cookies',
    'Usuario',
    'URLS',
    function($http, $cookies, Usuario, URLS) {

      var service = {};

      service.login = Login;
      service.logout = Logout;
      //service.setCredentials = SetCredentials;
      //service.clearCredentials = ClearCredentials;

      function Login(username, password, callback) {

        $http({
          method: 'POST',
          url: URLS.root + 'login.php',
          data: { user: username, pass: password },
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function(res) {
          if (res.status.code == 200) {
            console.log(res.data);
            SetCredentials(new Usuario(Usuario.converterEmEntrada(res.data)));
          }
          callback(res);
        }).error(function(res) {
          callback(res);
        });

      }

      function Logout(callback) {

        var token = '';

        if ($cookies.get('currentUser')) {
          token = $cookies.get('currentUser').token;
        }

        $http({
          method: 'POST',
          url: URLS.root + 'logout.php',
          data: { token: token }
        }).success(function(response) {
          ClearCredentials();
          callback(response);
        });
      }

      function SetCredentials(data) {
        //var expiration = new Date();
        //expiration.setDate(expiration.getDate() + 1);
        //expiration.setSeconds(expiration.getSeconds() + 10);
        //$cookies.putObject('currentUser', data, { 'expires': expiration });

        $cookies.putObject('currentUser', data, { });
        console.log($cookies.getObject('currentUser'));
      }

      function ClearCredentials() {
        $cookies.remove('currentUser');
      }

      return service;

    }]);
