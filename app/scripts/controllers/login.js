'use strict';

angular.module('commercialApp.controllers')
  .controller('LoginCtrl', ['$rootScope', '$location', 'AuthenticationService', function($rootScope, $location, authentication) {

    this.login = function(username, password) {
      authentication.login(username, password, function(res) {

        switch (res.status) {
          case 401:
            $rootScope.alerta.show('Usuário não autorizado!', 'alert-danger');
            break;
          case 404:
            $rootScope.alerta.show('Usuário ou senha inválidos!', 'alert-danger');
            break;
          case 200:
            $rootScope.alerta.show('Login efetuado!', 'alert-success');
            $location.path('buscar-orcamento');
            break;
          default:
            break;
        }
      });
    };

    this.avancar = function() {
      jQuery('input[name="senha"]').focus().select();
    };

  }]);
