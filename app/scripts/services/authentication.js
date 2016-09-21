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
    function($rootScope, $http, $cookies, Usuario, URLS) {

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

          console.log(res.data);

          switch (res.status.code) {
            case 404:
                  //$rootScope.alerta.show('Usuário não encontrado!');
                  break;
            case 200:
                  SetCredentials(new Usuario(Usuario.converterEmEntrada(res.data)));
                  callback(res);
                  break;
            default:
                  break;
          }
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
        var expiration = new Date();
        expiration.setDate(expiration.getDate() + 1);
        //expiration.setSeconds(expiration.getSeconds() + 10);
        //$cookies.putObject('currentUser', data, { 'expires': expiration });

        $cookies.putObject('currentUser', data, { });
      }

      function ClearCredentials() {
        $cookies.remove('currentUser');
      }

      return service;

    }]);
