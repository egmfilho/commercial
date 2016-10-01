/**
 * Created by egmfilho on 21/09/16.
 */

'use strict';

angular.module('commercialApp.services')
  .factory('Usuario', ['PerfilUsuario', function (PerfilUsuario) {

    function Usuario(usuario) {
      this.id = usuario ? usuario.id : '';
      this.perfilId = usuario ? usuario.perfilId : '';
      this.sessao = usuario ? usuario.sessao : '';
      this.ativo = usuario ? usuario.ativo : true;
      this.nome = usuario ? usuario.nome : '';
      this.usuario = usuario ? usuario.usuario : '';
      this.senha = usuario ? usuario.senha : '';
      this.email = usuario ? usuario.email : '';
      this.ultimoAcesso = usuario ? usuario.ultimoAcesso : new Date();

      this.perfil = usuario ? new PerfilUsuario(usuario.perfil) : new PerfilUsuario();
    }

    Usuario.prototype = {
      setPerfil: function(perfil) {
        this.perfil = new PerfilUsuario(perfil);
        this.perfilId = perfil.id;
      }
    };

    Usuario.converterEmEntrada = function (user) {
      var usuario = {};

      usuario.id = user.user_id;
      usuario.perfilId = user.user_profile_id;
      usuario.sessao = user.user_current_session_id;
      usuario.ativo = user.user_active == 'Y';
      usuario.nome = user.user_name;
      usuario.usuario = user.user_user;
      usuario.email = user.user_mail;
      usuario.ultimoAcesso = new Date(user.user_login);

      if (user.user_profile) {
        usuario.perfil = new PerfilUsuario(PerfilUsuario.converterEmEntrada(user.user_profile));
      } else {
        usuario.perfil = new PerfilUsuario();
      }

      return usuario;
    };

    Usuario.converterEmSaida = function (usuario) {
      var user = { };

      user.user_id = usuario.id;
      user.user_profile_id = usuario.perfilId;
      user.user_active = usuario.ativo;
      user.user_user = usuario.usuario;
      user.user_pass = usuario.senha;
      user.user_name = usuario.nome;
      user.user_mail = usuario.email;

      user.user_profile_access = PerfilUsuario.converterEmSaida(usuario.perfil).user_profile_access;

      return user;
    };

    return Usuario;

  }]);
