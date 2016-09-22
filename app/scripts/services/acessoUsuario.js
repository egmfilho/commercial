/**
 * Created by egmfilho on 22/09/16.
 */

'use strict';

angular.module('commercialApp.services')
  .factory('AcessoUsuario', ['Acesso', function(Acesso) {

    function AcessoUsuario(acesso) {
      var self = this;

      this.nome = acesso ? acesso.nome : '';

      this.acessos = [ ];
      angular.forEach(acesso.acessos, function(item, index) {
        self.acessos.push(new Acesso(item));
      });
    }

    AcessoUsuario.converterEmEntrada = function(a) {
      var acesso = { };

      acesso.nome = a.user_profile_access_name ? a.user_profile_access_name : '';

      acesso.acessos = [ ];
      if (a.user_profile_access_list) {
        angular.forEach(a.user_profile_access_list, function(item, index) {
          acesso.acessos.push(new Acesso(Acesso.converterEmEntrada(item)));
        });
      }

      return acesso;
    };

    return AcessoUsuario;

  }]);
