/**
 * Created by egmfilho on 07/07/16.
 */

'use strict';

angular.module('commercialApp.services')
  .factory('AuthenticationService', [
    '$rootScope',
    '$http',
    '$cookies',
    'Usuario',
    'URLS',
    function ($rootScope, $http, $cookies, Usuario, URLS) {

      var service = {};

      service.login = Login;
      service.logout = Logout;
      //service.setCredentials = SetCredentials;
      //service.clearCredentials = ClearCredentials;

      function Login(username, password, callback) {

        // var fakeRes = JSON.parse('{"status":e

        $http({
          method: 'POST',
          url: URLS.root + 'login.php',
          data: { user: username, pass: password },
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function(res) {
          if (res.status.code == 200) {
            SetCredentials(new Usuario(Usuario.converterEmEntrada(res.data)));
          }
          callback(res);
        }).error(function(res) {
          callback(res);
        });

      }

      function Logout(callback) {
        $http({
          method: 'POST',
          url: URLS.root + 'logout.php',
        }).success(function (response) {
          ClearCredentials();
          callback(response);
        });
      }

      function SetCredentials(data) {
        //var expiration = new Date();
        //expiration.setDate(expiration.getDate() + 1);
        //expiration.setSeconds(expiration.getSeconds() + 10);
        //$cookies.putObject('currentUser', data, { 'expires': expiration });

        console.log(data);
        $cookies.put('currentUser', window.btoa(JSON.stringify(data)), {});
      }

      function ClearCredentials() {
        $cookies.remove('currentUser');
      }

      return service;

    }]);
