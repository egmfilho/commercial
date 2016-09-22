/**
 * Created by egmfilho on 22/09/16.
 */

'use strict';

angular.module('commercialApp.services')
  .factory('PerfilUsuario', ['AcessoUsuario', function(AcessoUsuario) {

    function PerfilUsuario(perfil) {
      var self = this;
      this.nome = perfil ? perfil.nome : '';
      this.acessos = [ ];

      if (perfil.acessos.length) {
        angular.forEach(perfil.acessos, function(acesso, index) {
          self.acessos.push(new AcessoUsuario(acesso));
        });
      }
    }

    PerfilUsuario.converterEmEntrada = function(p) {
      var perfil = { };

      perfil.nome = p.user_profile_name;

      perfil.acessos = [ ];
      if (p.user_profile_access) {
        angular.forEach(p.user_profile_access, function(item, index) {
          perfil.acessos.push(new AcessoUsuario(AcessoUsuario.converterEmEntrada(item)));
        });
      }

      return perfil;
    };

    return PerfilUsuario;

  }]);
