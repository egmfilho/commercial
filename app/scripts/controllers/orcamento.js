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

    $scope.produtos = [];

    $scope.buscaCodigo = function(codigo) {

    };

    $scope.buscaDescricao = function(descricao) {

        return provider.obterProdutosPorDescricao(descricao).then(function(data) {
          data.push({ NmProduto: 'Mais resultados...', buscar: '#/home'});
          console.log(data);
          return data;
        }, function(err) {
          console.log(err);
        });

    };

  }]);
