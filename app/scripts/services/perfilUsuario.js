/**
 * Created by egmfilho on 26/09/16.
 */

'use strict';

angular.module('commercialApp.services')
  .factory('PerfilUsuario', ['PermissoesUsuario', function(PermissoesUsuario) {

    function PerfilUsuario(perfil) {
      this.id = perfil ? perfil.id : null;
      this.nome = perfil ? perfil.nome : '';
      this.permissoes = perfil ? perfil.permissoes : null;
    }

    PerfilUsuario.converterEmEntrada = function(profile) {
      var perfil = { };

      perfil.id = profile.user_profile_id;
      perfil.nome = profile.user_profile_name;

      if (profile.user_profile_access) {
        perfil.permissoes = new PermissoesUsuario(PermissoesUsuario.converterEmEntrada(profile.user_profile_access));
      } else {
        perfil.permissoes = { };
      }

      return perfil;
    };

    PerfilUsuario.converterEmSaida = function(perfil) {
      var profile = { };

      profile.user_profile_access = PermissoesUsuario.converterEmSaida(perfil.permissoes);

      return profile;
    };

    return PerfilUsuario;

  }]);
