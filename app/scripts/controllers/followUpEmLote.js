/**
 * Created by egmfilho on 25/10/16.
 */

'use strict';

angular.module('commercialApp.controllers')
  .controller('FollowUpEmLoteCtrl', [
    '$rootScope',
    '$scope',
    '$location',
    '$filter',
    'ProviderPedido',
    'Pedido',
    'ModalBuscarPessoa',
    'DataSaida',
    function ($rootScope, $scope, $location, $filter, providerPedido, Pedido, modalBuscarPessoa, DataSaida) {

      var self = this;

      self.pagination = {
        current: 1,
        max: 15,
        total: 0
      };

      self.filtro = {
        pedido: '',
        cliente: {id: null, nome: null},
        vendedor: {id: null, nome: null},
        dataMin: null,
        dataMax: null,
        valorMin: null,
        valorMax: null
      };

      $scope.$on('$viewContentLoaded', function () {

        getPedidos();
      });

      function getPedidos() {
        $rootScope.loading.load();
        self.pedidos = [];
        providerPedido.obterPedidosComFiltros(self.filtro.vendedor.id, self.filtro.cliente.id, self.filtro.valorMin, self.filtro.valorMax, DataSaida.converter(self.filtro.dataMin), DataSaida.converter(self.filtro.dataMax), 'N', true, false, false, true).then(function (success) {
          angular.forEach(success.data, function (item, index) {
            self.pedidos.push({
              checked: false,
              pedido: new Pedido(Pedido.converterEmEntrada(item))
            });
          });
          $rootScope.loading.unload();
          $scope.showFiltros = false;
        }, function (error) {
          console.log(error);
          $rootScope.loading.unload();
        });
      }

      function getPedido(codigo) {
        $rootScope.loading.load();
        self.pedidos = [];
        providerPedido.obterPedidoPorCodigo(true, false, false, true).then(function (success) {
          angular.forEach(success.data, function (item, index) {
            self.pedidos.push({
              checked: false,
              pedido: new Pedido(Pedido.converterEmEntrada(item))
            });
          });
          $rootScope.loading.unload();
          $scope.showFiltros = false;
        }, function (error) {
          console.log(error);
          $rootScope.loading.unload();
        });
      }

      this.atualizar = function () {
        getPedidos();
      };

      this.marcarTodos = function (value) {
        angular.forEach(self.pedidos, function (item, index) {
          item.checked = value;
        });
      };

      this.criar = function () {
        var codes = '',
          clientes = [],
          vendedores = [],
          min = new Date(),
          max = new Date();

        angular.forEach(self.pedidos, function (item, index) {
          if (item.checked) {
            if (clientes.length != 0) {
              codes += 'x';
            }
            codes += item.pedido.codigo;

            if (!clientes.contains(item.pedido.idCliente)) {
              clientes.push(item.pedido.idCliente);
            }

            if (!vendedores.contains(item.pedido.idVendedor)) {
              vendedores.push(item.pedido.idVendedor);
            }

            min = item.pedido.dataPedido < min ? item.pedido.dataPedido : min;
            max = item.pedido.dataPedido > max ? item.pedido.dataPedido : max;
          }
        });

        if (!codes) {
          return;
        }

        $location.path('/atendimento/batch')
          .search('type', 'order')
          .search('codes', codes)
          .search('v', vendedores.length)
          .search('c', clientes.length)
          .search('min', $filter('date')(min, 'dd/MM/yyyy'))
          .search('max', $filter('date')(max, 'dd/MM/yyyy'));
      };

      this.filtrar = function () {
        if (this.filtro.pedido) {
          getPedido(self.filtro.pedido);
          return;
        }

        if (angular.isDate(this.filtro.dataMin) && angular.isDate(this.filtro.dataMax)) {
          if (this.filtro.dataMin > this.filtro.dataMax) {
            $rootScope.alerta.show('A data final não pode ser menor que a inicial!', 'alert-danger');
            return;
          }
        }

        if (this.filtro.valorMax && this.filtro.valorMin) {
          if (this.filtro.valorMax < this.filtro.valorMin) {
            $rootScope.alerta.show('O valor máximo não pode ser menor que o mínimo!', 'alert-danger');
            return;
          }
        }

        getPedidos();
      };

      $scope.removeFiltros = function () {
        self.filtro = {
          pedido: '',
          cliente: {id: null, nome: null},
          vendedor: {id: null, nome: null},
          dataMin: null,
          dataMax: null,
          valorMin: null,
          valorMax: null
        };
      };

      $scope.buscarCliente = function () {
        modalBuscarPessoa.show('Cliente').then(function (result) {
          if (result) {
            self.filtro.cliente = result;
          }
        }, function (error) {

        });
      };

      $scope.removeCliente = function () {
        self.filtro.cliente = {id: null, nome: null};
      };

      $scope.buscarVendedor = function () {
        modalBuscarPessoa.show('Vendedor').then(function (result) {
          if (result) {
            self.filtro.vendedor = result;
          }
        }, function (error) {

        });
      };

      $scope.removeVendedor = function () {
        self.filtro.vendedor = {id: null, nome: null};
      };

    }]);
