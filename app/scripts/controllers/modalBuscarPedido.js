/**
 * Created by egmfilho on 05/09/16.
 */

'use strict';

angular.module('commercialApp.controllers')
  .controller('ModalBuscarPedidoCtrl', [
    '$rootScope',
    '$scope',
    '$uibModalInstance',
    'ProviderPedido',
    'Pedido',
    'DataSaida',
    'key',
    function($rootScope, $scope, $uibModalInstance, provider, Pedido, DataSaida, key) {

      $uibModalInstance.opened.then(function() {
        $scope.pedidos = [ ];

        $scope.obterTodos();

        //if (key) {
        //  $scope.nmPedido = key;
        //  $scope.buscarPorNome(key);
        //} else {
        //  setTimeout(function() {
        //    jQuery('input[name="cdPedido"]').focus();
        //  }, 300);
        //}
      });

      $scope.buscarPorCodigoPedido = function(codigo) {
        if (!codigo) {
          //$scope.obterTodos();
          return;
        }

        console.log('buscar por codigo de pedido: ' + codigo);

        $rootScope.isLoading = true;

        provider.obterPedidoPorCodigo(codigo, true, null, null, true, null, null).then(function(success) {
          $scope.pedidos = [ ];
          $scope.pedidos.push(new Pedido(Pedido.converterEmEntrada(success.data)));
          $rootScope.isLoading = false;
        }, function(error) {
          console.log(error);
          $rootScope.isLoading = false;
          if (error.status == 404) {
            console.log('Orçamento não encontrado!');
            $rootScope.alerta.show('Orçamento não encontrado!');
          }
        });
      };

      $scope.buscarPorCodigoVendedor = function(codigo) {
        if (!codigo) return;

        console.log('buscar por codigo de vendedor: ' + codigo);
      };

      $scope.buscarPorNomeVendedor = function(nome) {
        if (!nome) return;

        console.log('buscar por nome de vendedor: ' + nome);
      };

      $scope.buscarPorCodigoCliente = function(codigo) {
        if (!codigo) return;

        console.log('buscar por codigo de cliente: ' + codigo);
      };

      $scope.buscarPorNomeCliente = function(nome) {
        if (!nome) return;

        console.log('buscar por nome de cliente: ' + nome);
      };

      function parseDate(date) {
        var parts = date.split('/');

        return new Date(parts[2], parts[1] - 1, parts[0]);
      }

      $scope.buscarPorData = function(inicial, final) {
        if (!inicial && !final) return;

        var init = inicial ? DataSaida.converter(parseDate(inicial)) : null,
            end = final ? DataSaida.converter(parseDate(final)) : null;

        $rootScope.isLoading = true;
        provider.obterPedidoPorData(init, end, true, false, false, true).then(function(success) {
          $scope.pedidos = [ ];
          angular.forEach(success.data, function(item, index) {
            $scope.pedidos.push(new Pedido(Pedido.converterEmEntrada(item)));
          });
          $rootScope.isLoading = false;
        }, function(error) {
          console.log(error);
          $rootScope.isLoading = false;
        });
      };

      $scope.obterTodos = function() {
        $rootScope.isLoading = true;

        provider.obterTodos(true, null, null, true, null, null).then(function(success) {
          $scope.pedidos = [ ];
          angular.forEach(success.data, function(item, index) {
            $scope.pedidos.push(new Pedido(Pedido.converterEmEntrada(item)));
          });
          ordenarPorCodigo();
          $rootScope.isLoading = false;
        }, function(error) {
          console.log(error);
          $rootScope.isLoading = false;
        });
      };

      function ordenarPorCodigo() {
        $scope.pedidos = $scope.pedidos.sort(function(a, b) {
          return a.codigo - b.codigo;
        });
      }

      $scope.selecionarPedido = function(pedido) {
        $rootScope.isLoading = true;
        provider.obterPedidoPorCodigo(pedido.codigo, true, true, true, true, true, true).then(function(success) {
          $rootScope.isLoading = false;
          $uibModalInstance.close(new Pedido(Pedido.converterEmEntrada(success.data)));
        }, function(error) {
          console.log(error);
          $rootScope.isLoading = false;
        });
      };

      $scope.cancel = function() {
        $uibModalInstance.dismiss();
      };
    }
  ]);
