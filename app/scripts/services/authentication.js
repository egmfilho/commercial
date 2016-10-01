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

        var fakeRes = JSON.parse('{"status":{"code":200,"message":"Ok."},"data":{"user_id":"1003","user_profile_id":"1001","user_session_id":null,"user_active":"Y","user_user":"eduardo","user_name":"Eduardo Miranda","user_mail":"eduardo@futuraagencia.com.br","user_login":"2016-10-01 11:43:40","user_update":null,"user_date":"2016-09-22 12:09:34","user_current_session_id":"2q3098rvq7912n139cqcnk0f36","user_session":{"user_session_value":"2q3098rvq7912n139cqcnk0f36","user_session_date":"2016-10-01 11:46:11"},"user_profile":{"user_profile_id":"1001","user_profile_name":"Administrador","user_profile_update":null,"user_profile_date":"2016-06-20 11:46:20","user_profile_access":{"order":{"access":{"value":"Y","data_type":"bool"},"max_al_discount":{"value":"50","data_type":"float"}},"report":{"access":{"value":"Y","data_type":"bool"}},"follow_up":{"access":{"value":"Y","data_type":"bool"}},"product":{"access":{"value":"Y","data_type":"bool"}},"client":{"access":{"value":"Y","data_type":"bool"}},"config":{"access":{"value":"N","data_type":"bool"}}}}}}');
        SetCredentials(new Usuario((Usuario.converterEmEntrada(fakeRes.data))));
        callback(fakeRes);

        //$http({
        //  method: 'POST',
        //  url: URLS.root + 'login.php',
        //  data: { user: username, pass: password },
        //  headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        //}).success(function(res) {
        //  if (res.status.code == 200) {
        //    SetCredentials(new Usuario(Usuario.converterEmEntrada(res.data)));
        //  }
        //  callback(res);
        //}).error(function(res) {
        //  callback(res);
        //});

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
        $rootScope.currentUser = {
          nome: data.nome,
          usuario: data.usuario,
          email: data.email,
          perfil: data.perfil.nome
        };
        $cookies.put('currentUser', window.btoa(JSON.stringify(data)), {});
      }

      function ClearCredentials() {
        $cookies.remove('currentUser');
      }

      return service;

    }]);
