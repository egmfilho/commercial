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

        // var fakeRes = JSON.parse('{"status":{"code":200,"message":"Ok."},"data":{"user_max_discount": "10","user_id": "1003","user_shop_id": "1","user_price_id": "00A0000001","user_profile_id": "1001","user_session_id": null,"user_active": "Y","user_user": "eduardo","user_name": "Eduardo Miranda","user_mail": "edumig12@hotmail.com","user_login": "2016-11-10 20:08:20","user_update": "2016-11-14 12:36:46","user_date": "2016-09-22 12:09:34","user_current_session_id": "dquvtm317078pvrd0h4so33gg0","user_shop": {"shop_id": 1,"shop_code": "01","shop_name": "Base Teste Loja: 01"},"user_price": {"price_id": 1,"price_code": "0000PRECO1","price_name": "PREÇO VAREJO"},"user_session": {"user_session_value": "dquvtm317078pvrd0h4so33gg0","user_session_date": "2016-11-16 17:38:38"},"user_profile": {"user_profile_id": "1001","user_profile_name": "Administrador","user_profile_update": "2016-11-01 10:39:22","user_profile_date": "2016-06-20 11:46:20","user_profile_access": {"order": {"name": "Orçamento","access": {"name": "Acesso","value": "Y","data_type": "bool"},"max_al_discount": {"name": "Alíquota máxima de desconto","value": "50","data_type": "percent"}},"report": {"name": "Relatórios","access": {"name": "Acesso","value": "Y","data_type": "bool"}},"follow_up": {"name": "Follow Up","access": {"name": "Acesso","value": "Y","data_type": "bool"}},"product": {"name": "Produtos","access": {"name": "Acesso","value": "Y","data_type": "bool"}},"client": {"name": "Clientes","access": {"name": "Acesso","value": "Y","data_type": "bool"}},"config": {"name": "Configurações","access": {"name": "Acesso","value": "Y","data_type": "bool"}}}}}}');
        // console.log(fakeRes);
        // SetCredentials(new Usuario((Usuario.converterEmEntrada(fakeRes.data))));
        // callback(fakeRes);
        // return;


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
          url: URLS.root + 'logout.php'
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
