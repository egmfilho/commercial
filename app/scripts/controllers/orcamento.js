/**
 * Created by egmfilho on 14/06/16.
 */

'use strict';

angular.module('commercialApp')
  .controller('OrcamentoCtrl', ['$scope', 'ProviderProduto', function($scope, provider) {

    // retira o padding-right que compensa o scroll se o SO for um MacOS
    if (navigator.platform === 'MacIntel') {
      angular.element('#tabela-orcamento thead tr').css('padding-right', '0px');
    }

    function limparDados() {
      $scope.cdProduto = '';
      $scope.nmProduto = '';
    }

    this.produtos = [];

    this.selectProduto = function(item) {

      if (item.CdProduto == -1) {
        alert('mais resultados');
        $scope.nmProduto = '';
      } else {
        this.buscaCodigo(item.CdProduto);
      }

    };

    this.buscaCodigo = function(codigo) {

      provider.obterProdutoPorCodigo(codigo).then(function(data) {
        console.log(data);
        $scope.cdProduto = data[0].CdProduto;
        $scope.nmProduto = data[0].NmProduto;
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
