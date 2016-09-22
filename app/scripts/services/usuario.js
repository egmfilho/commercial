/**
 * Created by egmfilho on 21/09/16.
 */

'use strict';

angular.module('commercialApp.services')
  .factory('Usuario', ['PerfilUsuario', function(PerfilUsuario) {

    function Usuario(usuario) {
      this.id = usuario ? usuario.id : '';
      this.perfilId = usuario ? usuario.perfilId : '';
      this.sessao = usuario ? usuario.sessao : '';
      this.ativo = usuario ? usuario.ativo : true;
      this.nome = usuario ? usuario.nome : '';
      this.email = usuario ? usuario.email : '';

      this.perfil = usuario ? new PerfilUsuario(usuario.perfil) : new PerfilUsuario();
    }

    Usuario.converterEmEntrada = function(user) {
      var usuario = { };

      usuario.id = user.user_id;
      usuario.perfilId = user.user_profile_id;
      usuario.sessao = user.user_current_session_id;
      usuario.ativo = user.user_active == 'Y';
      usuario.nome = user.user_name;
      usuario.email = user.user_mail;

      if (user.user_profile) {
        usuario.perfil = new PerfilUsuario(PerfilUsuario.converterEmEntrada(user.user_profile));
      } else {
        usuario.perfil = new PerfilUsuario();
      }

      return usuario;
    };

    return Usuario;

  }]);
