/**
 * Created by egmfilho on 29/09/16.
 */

'use strict';

angular.module('commercialApp.controllers')
  .controller('ConfiguracoesCtrl', ['$rootScope', '$scope', 'ProviderUsuario', 'Usuario', 'ProviderPerfilUsuario', 'PerfilUsuario', 'ModalUsuario', function ($rootScope, $scope, providerUsuario, Usuario, providerPerfil, PerfilUsuario, ModalUsuario) {

    var self = this,
      height = jQuery(window).height() - 160 - 60;

    jQuery('.controle').css('height', height + 'px');
    jQuery('.dashboard').css('height', height + 'px');
    jQuery('.logs').css('height', height + 'px');

    $scope.$on('$viewContentLoaded', function () {
      self.novoUsuario = new Usuario();
      getUsuarios();
      getPerfis();
    });

    function getUsuarios() {
      $rootScope.isLoading = true;
      providerUsuario.obterTodos(true).then(function (success) {
        self.usuarios = [];
        angular.forEach(success.data, function (item, index) {
          self.usuarios.push(new Usuario(Usuario.converterEmEntrada(item)));
        });
        $rootScope.isLoading = false;
      }, function (error) {
        $rootScope.isLoading = false;
      });
    }

    function getPerfis() {
      $rootScope.isLoading = true;
      providerPerfil.obterTodos().then(function(success) {
        self.perfis = [];
        angular.forEach(success.data, function(item, index) {
          self.perfis.push(new PerfilUsuario(PerfilUsuario.converterEmEntrada(item)));
        });
        $rootScope.isLoading = false;
      }, function(error) {
        console.log(error);
        $rootScope.isLoading = false;
      });
    }

    function validarCadastro() {
      if (!self.novoUsuario.nome) {
        $rootScope.alerta.show('Preencha o nome do usuário!');
        return false;
      }

      if (!self.novoUsuario.usuario) {
        $rootScope.alerta.show('Preencha o nome de usuário!');
        return false;
      }

      if (!self.novoUsuario.senha || !self.senhaCheck) {
        $rootScope.alerta.show('Preencha a senha do usuário!');
        return false;
      }

      if (self.novoUsuario.senha !== self.senhaCheck) {
        $rootScope.alerta.show('As senhas não conferem!');
        return false;
      }

      if (!self.novoUsuario.perfilId) {
        $rootScope.alerta.show('Selecione um perfil!');
        return false;
      }

      return true;
    }

    this.cadastrar = function () {
      console.log(Usuario.converterEmSaida(self.novoUsuario));

      if (validarCadastro()) {
        $rootScope.isLoading = true;
        providerUsuario.adicionar(Usuario.converterEmSaida(self.novoUsuario)).then(function(success) {
          $rootScope.isLoading = false;
          getUsuarios();
          $rootScope.alerta.show('Usuário cadastrado', 'alert-success');
        }, function(error) {
          console.log(error);
          $rootScope.alerta.show('Não foi possível cadastrar o usuário', 'alert-danger');
          $rootScope.isLoading = false;
        });
      }
    };

    this.editarUsuario = function(usuario) {
      ModalUsuario.show(usuario, self.perfis).then(function(success) {
        $rootScope.alerta.show(success, 'alert-success');
      });
    };

    this.limparCadastro = function () {
      self.usuario = new Usuario();
      self.senhaCheck = '';
    };

  }]);
