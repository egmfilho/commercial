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
    'key',
    function($rootScope, $scope, $uibModalInstance, provider, Pedido, key) {

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

      $scope.buscarPorCodigo = function(codigo) {
        if (!$scope.cdPedido) {
          $scope.obterTodos();
          return;
        }

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
