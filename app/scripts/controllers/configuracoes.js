/**
 * Created by egmfilho on 29/09/16.
 */

'use strict';

angular.module('commercialApp.controllers')
  .controller('ConfiguracoesCtrl', [
    '$rootScope',
    '$scope',
    'ProviderUsuario',
    'Usuario',
    'ProviderPerfilUsuario',
    'PerfilUsuario',
    'ModalUsuario',
    'ModalPerfil',
    'ProviderConfig',
    'PermissoesUsuario',
    function ($rootScope, $scope, providerUsuario, Usuario, providerPerfil, PerfilUsuario, ModalUsuario, ModalPerfil, providerConfig, PermissoesUsuario) {

      var self = this,
        width = parseInt(jQuery(window).width()),
        banner = 100,
        header = 60,
        footer = 60,
        height = jQuery(window).height() - banner - header - footer;

      self.usuariosPagination = {
        current: 1,
        max: 15,
        total: 0
      };

      self.perfisPagination = {
        current: 1,
        max: 15,
        total: 0
      };

      if (width >= 768) {
        jQuery('.controle').css('height', height + 'px');
        jQuery('.dashboard').css('height', height + 'px');
        jQuery('.logs').css('height', height + 'px');
      } else {
        self.usuariosPagination.max = 10;
        self.perfisPagination.max = 10;
      }

      $scope.$on('$viewContentLoaded', function () {
        self.novoUsuario = new Usuario();
        getUsuarios();
        getPerfis();
        getPermissoes();
      });

      function getUsuarios() {
        $rootScope.isLoading = true;
        providerUsuario.obterTodos(true).then(function (success) {
          self.usuariosPagination.total = success.data.length;
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
        providerPerfil.obterTodos().then(function (success) {
          self.perfisPagination.total = success.data.length;
          self.perfis = [];
          angular.forEach(success.data, function (item, index) {
            self.perfis.push(new PerfilUsuario(PerfilUsuario.converterEmEntrada(item)));
          });
          $rootScope.isLoading = false;
        }, function (error) {
          console.log(error);
          $rootScope.isLoading = false;
        });
      }

      function getPermissoes() {
        $rootScope.isLoading = true;
        providerConfig.obterPermissoes().then(function (success) {
          self.permissoes = new PermissoesUsuario(PermissoesUsuario.converterEmEntrada(success.data));
          $rootScope.isLoading = false;
        }, function (error) {
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

      this.atualizarUsuarios = function () {
        getUsuarios();
      };

      this.cadastrar = function () {
        console.log(Usuario.converterEmSaida(self.novoUsuario));

        if (validarCadastro()) {
          $rootScope.isLoading = true;
          providerUsuario.adicionar(Usuario.converterEmSaida(self.novoUsuario)).then(function (success) {
            $rootScope.isLoading = false;
            getUsuarios();
            $rootScope.alerta.show('Usuário cadastrado', 'alert-success');
          }, function (error) {
            console.log(error);
            $rootScope.alerta.show('Não foi possível cadastrar o usuário', 'alert-danger');
            $rootScope.isLoading = false;
          });
        }
      };

      this.editarUsuario = function (usuario) {
        if (!self.perfis) {
          getPerfis();
        }

        $rootScope.isLoading = true;
        providerUsuario.obterPorId(usuario.id, true, true).then(function (success) {
          $rootScope.isLoading = false;
          ModalUsuario.show(new Usuario(Usuario.converterEmEntrada(success.data)), self.perfis).then(function (success) {
            getUsuarios();
          });
        }, function (error) {
          console.log(error);
          $rootScope.isLoading = false;
        });
      };

      this.adicionarUsuario = function () {
        if (!self.perfis) {
          getPerfis();
        }

        if (!self.permissoes) {
          getPermissoes();
        }

        ModalUsuario.show(new Usuario(), self.perfis, self.permissoes).then(function (success) {
          getUsuarios();
        });
      };

      this.atualizarPerfis = function () {
        getUsuarios();
      };

      this.editarPerfil = function (perfil) {
        $rootScope.isLoading = true;
        providerPerfil.obterPorId(perfil.id, true).then(function (success) {
          $rootScope.isLoading = false;
          ModalPerfil.show(new PerfilUsuario(PerfilUsuario.converterEmEntrada(success.data))).then(function (success) {
            self.atualizarPerfis();
          });
        }, function (error) {
          console.log(error);
          $rootScope.isLoading = false;
        });
      };

      this.adicionarPerfil = function () {
        if (!self.permissoes) {
          getPermissoes();
        }

        ModalPerfil.show(new PerfilUsuario(), self.permissoes).then(function (success) {
          self.atualizarPerfis();
        });
      };

      this.excluirPerfil = function (perfil) {
        if (!confirm('Excluir perfil?')) {
          return;
        }

        $rootScope.isLoading = true;
        providerPerfil.excluir(perfil.id).then(function (success) {
          $rootScope.isLoading = false;
          $rootScope.alerta.show('Perfil excluído!', 'alert-success');
          self.getPerfis();
        }, function (error) {
          console.log(error);
          $rootScope.isLoading = false;
        });
      }

    }]);
