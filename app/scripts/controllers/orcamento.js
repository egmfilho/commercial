/**
 * Created by egmfilho on 14/06/16.
 */

'use strict';

angular.module('commercialApp')
  .controller('OrcamentoCtrl', ['$scope', '$filter', 'ProviderProduto', function($scope, $filter, provider) {

    // retira o padding-right que compensa o scroll se o SO for um MacOS
    if (navigator.platform === 'MacIntel') {
      angular.element('#tabela-orcamento thead tr').css('padding-right', '0px');
    }

    $scope.$on('$viewContentLoaded', function() {

    });

    function limparDados() {
      //$scope.produto.cdProduto = '';
      //$scope.produto.nmProduto = '';
      //$scope.produto.vlPreco = '';
      //$scope.produto.unidade = 'und';
    }

    this.produtos = [];

    this.selectProduto = function(item) {

      if (item.CdProduto == -1) {
        alert('mais resultados');
        $scope.produto.nmProduto = '';
      } else {
        this.buscaCodigo(item.CdProduto);
      }

    };

    this.updateTotal = function() {
      $scope.produto.total = ($scope.produto.vlPreco * $scope.produto.quantidade) - $scope.produto.desconto_dinheiro;
    };

    this.buscaCodigo = function(codigo) {

      provider.obterProdutoPorCodigo(codigo).then(function(data) {
        console.log(data);
        $scope.produto.cdProduto = data.CdProduto;
        $scope.produto.nmProduto = data.NmProduto;
        $scope.produto.vlPreco = data.VlPreco;
        $scope.produto.unidade = data.Unidade;
        $scope.produto.quantidade = 1;
        $scope.produto.desconto_percent = 0;
        $scope.produto.desconto_dinheiro = 0;
        $scope.produto.total = $scope.produto.vlPreco * $scope.produto.quantidade;
      }, function(err) {
        console.log(err);
      });

    };

    this.buscaDescricao = function(descricao) {

        return provider.obterProdutosPorDescricao(descricao).then(function(data) {
          data.push({ NmProduto: 'Mais resultados...', CdProduto: -1});
          return data;
        }, function(err) {
          console.log(err);
        });

    };

  }]);
