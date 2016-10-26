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
    function ($rootScope, $scope, $location, $filter, providerPedido, Pedido) {

      var self = this;

      self.pagination = {
        current: 1,
        max: 15,
        total: 0
      };

      $scope.$on('$viewContentLoaded', function () {

        $rootScope.loading.load();
        self.pedidos = [];
        providerPedido.obterTodos(true, false, false, true).then(function (success) {
          angular.forEach(success.data, function (item, index) {
            self.pedidos.push({
              checked: false,
              pedido: new Pedido(Pedido.converterEmEntrada(item))
            });
          });
          $rootScope.loading.unload();
        }, function (error) {
          console.log(error);
          $rootScope.loading.unload();
        });

      });

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

    }]);
