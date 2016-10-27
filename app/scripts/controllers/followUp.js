/**
 * Created by egmfilho on 13/10/16.
 */

'use strict';

angular.module('commercialApp.controllers')
  .controller('FollowUpCtrl', [
    '$rootScope',
    '$scope',
    '$location',
    'Atendimento',
    'Usuario',
    'ProviderAtendimento',
    'ModalAtendimento',
    'ProviderStatusAtendimento',
    'StatusHistoricoAtendimento',
    'ModalBuscarPedido',
    'ModalBuscarPessoa',
    function ($rootScope, $scope, $location, Atendimento, Usuario, providerAtendimento, modalAtendimento, providerStatus, StatusHistoricoAtendimento, modalBuscarPedido, modalBuscarPessoa) {

      var self = this;

      $scope.$on('$viewContentLoaded', function () {
        getStatusAtendimento();
        getAtendimentos();
      });

      self.showFiltros = false;

      self.pagination = {
        current: 1,
        max: 15,
        total: 0
      };

      self.filtro = {
        atendimento: '',
        pedido: '',
        cliente: { id: null, nome: null},
        responsavel: null,
        dataMin: null,
        dataMax: null,
        valorMin: null,
        valorMax: null,
        status: ''
      };

      function getAtendimentos() {
        self.atendimentos = [];
        $rootScope.loading.load();
        providerAtendimento.obterTodos(true, true, true, true, self.filtro.status, self.filtro.cliente.id).then(function (success) {
          angular.forEach(success.data, function (item, index) {
            self.atendimentos.push(new Atendimento(Atendimento.converterEmEntrada(item)));
          });
          $rootScope.loading.unload();
        }, function (error) {
          console.log(error);
          $rootScope.loading.unload();
        });
      }

      function getAtendimento(codigo) {
        self.atendimentos = [];
        $rootScope.loading.load();
        providerAtendimento.obterPorCodigo(codigo, true, true, true, true).then(function (success) {
          self.atendimentos.push(new Atendimento(Atendimento.converterEmEntrada(success.data)));
          $rootScope.loading.unload();
        }, function (error) {
          console.log(error);
          $rootScope.loading.unload();
        });
      }

      function getAtendimentosPorCodigoDePedido(codigo) {
        self.atendimentos = [];
        $rootScope.loading.load();
        providerAtendimento.obterTodosPorCodigoPedido(codigo, true, true, true, true, self.filtro.status).then(function (success) {
          angular.forEach(success.data, function (item, index) {
            self.atendimentos.push(new Atendimento(Atendimento.converterEmEntrada(item)))
          });
          $rootScope.loading.unload();
        }, function (error) {
          console.log(error);
          $rootScope.loading.unload();
        });
      }

      this.filtrar = function () {
        self.showFiltros = false;

        if (this.filtro.atendimento) {
          getAtendimento(this.filtro.atendimento);
          return;
        }

        if (this.filtro.pedido) {
          getAtendimentosPorCodigoDePedido(this.filtro.pedido);
          return;
        }

        getAtendimentos();
      };

      function getStatusAtendimento() {
        self.statusArray = [];
        $rootScope.loading.load();
        providerStatus.obterTodos().then(function (success) {
          angular.forEach(success.data, function (item, index) {
            self.statusArray.push(new StatusHistoricoAtendimento(StatusHistoricoAtendimento.converterEmEntrada(item)));
          });
          $rootScope.loading.unload();
        }, function (error) {
          console.log(error);
          $rootScope.loading.unload();
        });
      }

      this.atualizar = function () {
        getAtendimentos();
      };

      $scope.buscarCliente = function () {
        modalBuscarPessoa.show('Cliente').then(function (result) {
          if (result) {
            self.filtro.cliente = result;
          }
        }, function (error) {

        });
      };

      this.buscarPedido = function () {
        modalBuscarPedido.show().then(function (result) {
          if (result) {
            if (result.atendimentoId) {
              $location.path('/atendimento/open').search('type', 'order').search('code', result.codigo);
            } else {
              $location.path('/atendimento/new').search('type', 'order').search('code', result.codigo);
            }
          }
        });
      };
    }]);
