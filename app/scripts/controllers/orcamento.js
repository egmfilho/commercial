/**
 * Created by egmfilho on 14/06/16.
 */

'use strict';

angular.module('commercialApp')
  .controller('OrcamentoCtrl', ['$scope', 'ProviderProduto', '$http', function($scope, provider, $http) {

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
