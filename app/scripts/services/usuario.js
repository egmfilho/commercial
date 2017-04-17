/**
 * Created by egmfilho on 21/09/16.
 */

'use strict';

angular.module('commercialApp.services')
  .factory('Usuario', ['PerfilUsuario','Pessoa', function (PerfilUsuario,Pessoa) {

    function Usuario(usuario) {
      this.id = usuario ? usuario.id : '';
      this.perfilId = usuario ? usuario.perfilId : '';
      this.lojaId = usuario ? usuario.lojaId : '';
      this.representanteId = usuario ? usuario.representanteId : '';
      this.loja = usuario ? usuario.loja : null;
      this.representante = usuario ? usuario.representante : null;
      this.precosId = usuario ? usuario.precosId : '';
      this.precos = usuario ? usuario.precos : null;
      this.sessao = usuario ? usuario.sessao : '';
      this.ativo = usuario ? usuario.ativo : true;
      this.desbloqueador = usuario ? usuario.desbloqueador : false;
      this.nome = usuario ? usuario.nome : '';
      this.usuario = usuario ? usuario.usuario : '';
      this.senha = usuario ? usuario.senha : '';
      this.email = usuario ? usuario.email : '';
      this.ultimoAcesso = usuario ? usuario.ultimoAcesso : new Date();
      this.maxDesconto = usuario ? usuario.maxDesconto : 0;

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
      usuario.lojaId = parseInt(user.user_shop_id);
      usuario.representanteId = user.user_seller_id;
      usuario.loja = user.user_shop;
      usuario.precosId = user.user_price_id;
      usuario.precos = user.user_price;
      usuario.sessao = user.user_current_session_id;
      usuario.ativo = user.user_active == 'Y';
      usuario.desbloqueador = user.user_unlock_device == 'Y';
      usuario.nome = user.user_name;
      usuario.usuario = user.user_user;
      usuario.email = user.user_mail;
      usuario.ultimoAcesso = user.user_login ? new Date(user.user_login) : null;
      usuario.maxDesconto = parseFloat(user.user_max_discount) || 0;

      if (user.user_profile) {
        usuario.perfil = new PerfilUsuario(PerfilUsuario.converterEmEntrada(user.user_profile));
      } else {
        usuario.perfil = new PerfilUsuario();
      }

      if (user.user_seller) {
        usuario.representante = new Pessoa(Pessoa.converterEmEntrada(user.user_seller));
      } else {
        usuario.representante = new Pessoa();
      }

      return usuario;
    };

    Usuario.converterEmSaida = function (usuario) {
      var user = { };

      user.user_id = usuario.id;
      user.user_profile_id = usuario.perfilId;
      user.user_shop_id = usuario.lojaId;
      user.user_seller_id = usuario.representanteId;
      user.user_price_id = usuario.precosId;
      user.user_active = usuario.ativo ? 'Y' : 'N';
      user.user_unlock_device = usuario.desbloqueador ? 'Y' : 'N';
      user.user_user = usuario.usuario;
      user.user_pass = usuario.senha;
      user.user_name = usuario.nome;
      user.user_mail = usuario.email;
      user.user_max_discount = usuario.maxDesconto;

      //user.user_profile_access = PerfilUsuario.converterEmSaida(usuario.perfil).user_profile_access;

      return user;
    };

    return Usuario;

  }]);
