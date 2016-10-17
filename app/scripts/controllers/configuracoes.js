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
    'TipoFollowUp',
    'CRFollowUp',
    function ($rootScope, $scope, providerUsuario, Usuario, providerPerfil, PerfilUsuario, ModalUsuario, ModalPerfil, providerConfig, PermissoesUsuario, TipoFollowUp, CRFollowUp) {

      var self = this,
        width = parseInt(jQuery(window).width()),
        banner = 100,
        header = 60,
        footer = 60,
        height = jQuery(window).height() - banner - header - footer;

      self.tipoFollowUp = new TipoFollowUp();
      self.crFollowUp = new CRFollowUp();

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

      self.tiposFollowUpPagination = {
        current: 1,
        max: 15,
        total: 0
      };

      self.crsFollowUpPagination = {
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
        self.tiposFollowUpPagination.max = 10;
        self.crsFollowUpPagination.max = 10;
      }

      $scope.$on('$viewContentLoaded', function () {
        // self.novoUsuario = new Usuario();
        getUsuarios();
        getPerfis();
        getPermissoes();
        getTiposFollowUp();
        getCRsFollowUp();
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

      function getTiposFollowUp() {
        self.tiposFollowUp = [ new TipoFollowUp({
          codigo: 1001,
          nome: 'Tipo teste',
          dataCadastro: new Date(),
          dataUpdate: new Date()
        }) ];
      }

      function getCRsFollowUp() {
        self.crsFollowUp = [ new CRFollowUp({
          codigo: 1001,
          nome: 'CR teste',
          dataCadastro: new Date(),
          dataUpdate: new Date()
        }) ];
      }

      this.atualizarUsuarios = function () {
        getUsuarios();
      };

      this.editarUsuario = function (usuario) {
        if (!self.perfis) {
          getPerfis();
        }

        $rootScope.isLoading = true;
        providerUsuario.obterPorId(usuario.id, true, true).then(function (success) {
          $rootScope.isLoading = false;
          ModalUsuario.show(new Usuario(Usuario.converterEmEntrada(success.data)), self.perfis).then(function (success) {
            self.atualizarUsuarios();
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
          self.atualizarUsuarios();
        });
      };

      this.atualizarPerfis = function () {
        getPerfis();
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
          self.atualizarPerfis();
          $rootScope.alerta.show('Perfil excluído!', 'alert-success');
          self.getPerfis();
        }, function (error) {
          console.log(error);
          $rootScope.isLoading = false;
        });
      };

      this.atualizarTiposFollowUp = function () {
        getTiposFollowUp();
      };

      this.editarTipoFollowUp = function (tipo) {
        self.tipoFollowUp = new TipoFollowUp(tipo);
        jQuery('#modalTipo').modal('show');
      };

      this.adicionarTipoFollowUp = function () {
        jQuery('#modalTipo').modal('show');
      };

      this.excluirTipoFollowUp = function () {
        jQuery('#modalTipo').modal('show');
      };

      this.salvarTipoFollowUp = function () {
        jQuery('#modalTipo').modal('hide');
      };

      this.cancelarModalTipoFollowUp = function () {
        jQuery('#modalTipo').modal('hide');
        self.tipoFollowUp = new TipoFollowUp();
      };

      this.atualizarCRsFollowUp = function () {
        getCRsFollowUp();
      };

      this.editarCRFollowUp = function (cr) {
        self.crFollowUp = new CRFollowUp(cr);
        jQuery('#modalCR').modal('show');
      };

      this.adicionarCRFollowUp = function () {
        jQuery('#modalCR').modal('show');
      };

      this.excluirCRFollowUp = function () {
        jQuery('#modalCR').modal('show');
      };

      this.salvarCRFollowUp = function () {
        jQuery('#modalCR').modal('hide');
      };

      this.cancelarModalCRFollowUp = function () {
        jQuery('#modalCR').modal('hide');
        self.crFollowUp = new CRFollowUp();
      };

    }]);
