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

        // var fakeRes = JSON.parse('{"status":{"code":200,"message":"Ok."},"data":{"user_id":"1002","user_shop_id":"31","user_price_id":"00A0000001","user_profile_id":"1001","user_seller_id":"00A0002C8N","user_session_id":null,"user_active":"Y","user_user":"alessandro","user_name":"Alessandro Menezes","user_mail":"alessandro@futuraagencia.com.br","user_max_discount":10,"user_unlock_device":"Y","user_login":"2017-04-13 13:25:01","user_update":"2017-04-12 16:00:32","user_date":"2017-02-03 17:36:00","user_current_session_id":"he3n6ic5sbonhg6eqfoq445187","user_shop":{"shop_id":31,"shop_code":31,"shop_name":"CARTON MATERIAIS DE CONSTRUCAO EIRELI EPP","shop_cnpj":"26.938.169\/0001-80","shop_phone":"(21) 2743-4200      ","shop_complement":"WENCESLAU JOSE DE MEDEIROS","shop_cep":"25976-345","shop_district":"PRATA"},"user_price":{"price_id":"00A0000001","price_code":"01","price_name":"Pre\u00e7o Varejo"},"user_session":{"user_session_value":"he3n6ic5sbonhg6eqfoq445187","user_session_date":"2017-04-13 13:29:10"},"user_profile":{"user_profile_id":"1001","user_profile_name":"Administrador","user_profile_update":"2017-02-03 21:28:13","user_profile_date":"2016-06-20 11:46:20","user_profile_access":{"order":{"name":"Or\u00e7amento","access":{"name":"Acesso","value":"Y","data_type":"bool"},"max_al_discount":{"name":"Al\u00edquota m\u00e1xima de desconto","value":"50","data_type":"percent"}},"report":{"name":"Relat\u00f3rios","access":{"name":"Acesso","value":"Y","data_type":"bool"}},"follow_up":{"name":"Follow Up","access":{"name":"Acesso","value":"Y","data_type":"bool"}},"product":{"name":"Produtos","access":{"name":"Acesso","value":"Y","data_type":"bool"}},"client":{"name":"Clientes","access":{"name":"Acesso","value":"Y","data_type":"bool"}},"config":{"name":"Configura\u00e7\u00f5es","access":{"name":"Acesso","value":"Y","data_type":"bool"}}}},"user_seller":{"Id":"00A0002C8N","IdLoja":null,"IdCep":null,"Codigo":"107602","Nome":"ALESSANDRO MENEZES DA SILVA","Doc":null,"Tp":null,"Telefone":null,"Celular":null,"Email":null,"Ativo":0,"IEstadual":null,"Cadastro":null}},"info":null}');
        // console.log(fakeRes);
        // SetCredentials(new Usuario(Usuario.converterEmEntrada(fakeRes.data)));
        // callback(fakeRes);
        // return;

        $http({
          method: 'POST',
          url: URLS.root + 'login.php',
          data: { user: username, pass: password },
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function(res) {
          if (res.status == 200) {
            SetCredentials(new Usuario(Usuario.converterEmEntrada(res.data.data)));
          }
          callback(res.data);
        }, function(res) {
          console.log(res);
          callback(res.data);
        });

      }

      function Logout(callback) {
        $http({
          method: 'POST',
          url: URLS.root + 'logout.php'
        }).then(function (response) {
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
