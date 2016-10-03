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
      this.dataCadastro = perfil ? perfil.dataCadastro : new Date();
      this.dataUpdate = perfil ? perfil.dataUpdate : null;
    }

    PerfilUsuario.converterEmEntrada = function(profile) {
      var perfil = { };

      perfil.id = profile.user_profile_id;
      perfil.nome = profile.user_profile_name;
      perfil.dataCadastro = new Date(profile.user_profile_date);
      perfil.dataUpdate = new Date(profile.user_profile_update || profile.user_profile_date);

      if (profile.user_profile_access) {
        perfil.permissoes = new PermissoesUsuario(PermissoesUsuario.converterEmEntrada(profile.user_profile_access));
      } else {
        perfil.permissoes = { };
      }

      return perfil;
    };

    PerfilUsuario.converterEmSaida = function(perfil) {
      var profile = { };

      profile.user_profile_id = perfil.id;
      profile.user_profile_name = perfil.nome;
      profile.user_profile_access = PermissoesUsuario.converterEmSaida(perfil.permissoes);

      return profile;
    };

    return PerfilUsuario;

  }]);
