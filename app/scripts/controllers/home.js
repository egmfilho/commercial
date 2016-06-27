'use strict';

angular.module('commercialApp')
  .controller('HomeCtrl', ['$scope', '$location', function ($scope, $location) {

    $scope.abrirTela = function(url) {
      $location.path(url);
    };

    $scope.botoes = [
      {
        nome: 'Orçamento',
        icone: 'glyphicon-shopping-cart',
        url: '/orcamento'
      }, {
        nome: 'Relatórios',
        icone: 'glyphicon-print',
        url: '/relatorios'
      }, {
        nome: 'Follow Up',
        icone: 'glyphicon-comment',
        url: '/follow'
      }, {
        nome: 'Produtos',
        icone: 'glyphicon-tags',
        url: '/produtos'
      }, {
        nome: 'Clientes',
        icone: 'glyphicon-user',
        url: '/clientes'
      }, {
        nome: 'Configurações',
        icone: 'glyphicon-cog',
        url: '/configuracoes'
      }];

  }]);
