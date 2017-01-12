/**
 * Created by egmfilho on 05/09/16.
 */

'use strict';

angular.module('commercialApp.controllers')
  .controller('ModalBuscarProdutoCtrl', [
    '$rootScope',
    '$scope',
    '$cookies',
    '$uibModalInstance',
    'ProviderProduto',
    'Produto',
    'key',
    function($rootScope, $scope, $cookies, $uibModalInstance, provider, Produto, key) {

      $scope.pagination = {
        current: 1,
        max: 10,
        total: 0,
        mudarPagina: function (nome) {
          $scope.buscarPorNome(nome);
        }
      };

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
        $rootScope.loading.load();

        provider.obterProdutoPorCodigo(codigo).then(function(success) {
          $scope.produtos = [ ];
          $scope.produtos.push(new Produto(Produto.converterEmEntrada(success.data)));
          $rootScope.loading.unload();
        }, function(error) {
          //@ console.log(error);
          $rootScope.loading.unload();
        });
      };

      $scope.buscarPorNome = function(nome) {
        $rootScope.loading.load();

        provider.obterProdutosPorDescricao(nome).then(function(success) {
          $scope.pagination.total = success.data.length;
          $scope.produtos = [ ];
          angular.forEach(success.data, function(item, index) {
            $scope.produtos.push(new Produto(Produto.converterEmEntrada(item)));
          });
          ordenarPorCodigo();
          setTimeout(function() {
            jQuery('input[name="nmProduto"]').focus();
          }, 300);
          $rootScope.loading.unload();
        }, function(error) {
          //@ console.log(error);
          $rootScope.loading.unload();
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
