/**
 * Created by egmfilho on 05/09/16.
 */

'use strict';

angular.module('commercialApp.controllers')
  .controller('ModalBuscarProdutoCtrl', [
    '$rootScope',
    '$scope',
    '$uibModalInstance',
    'ProviderProduto',
    'Produto',
    'key',
    function($rootScope, $scope, $uibModalInstance, provider, Produto, key) {

      $uibModalInstance.opened.then(function() {
        $scope.produtos = [ ];

        if (key) {
          $scope.nmProduto = key;
          $scope.buscarPorNome(key);
        } else {
          setTimeout(function() {
            jQuery('input[name="cdProduto"]').focus();
          }, 300);
        }
      });

      $scope.buscarPorCodigo = function(codigo) {
        $rootScope.isLoading = true;

        provider.obterProdutoPorCodigo(codigo).then(function(success) {
          $scope.produtos = [ ];
          $scope.produtos.push(new Produto(Produto.converterEmEntrada(success.data)));
          $rootScope.isLoading = false;
        }, function(error) {
          console.log(error);
          $rootScope.isLoading = false;
        });
      };

      $scope.buscarPorNome = function(nome) {
        $rootScope.isLoading = true;

        provider.obterProdutosPorDescricao(nome).then(function(success) {
          $scope.produtos = [ ];
          angular.forEach(success.data, function(item, index) {
            $scope.produtos.push(new Produto(Produto.converterEmEntrada(item)));
          });
          ordenarPorCodigo();
          setTimeout(function() {
            jQuery('input[name="nmProduto"]').focus();
          }, 300)
          $rootScope.isLoading = false;
        }, function(error) {
          console.log(error);
          $rootScope.isLoading = false;
        });
      };

      function ordenarPorNome() {
        $scope.produtos = $scope.produtos.sort(function(a, b) {
          return a.nome - b.nome;
        });
      }

      function ordenarPorCodigo() {
        $scope.produtos = $scope.produtos.sort(function(a, b) {
          return a.codigo - b.codigo;
        });
      }

      $scope.selecionarProduto = function(produto) {
        $uibModalInstance.close(new Produto(produto));
      };

      $scope.cancel = function() {
        $uibModalInstance.dismiss();
      };
    }
  ]);
