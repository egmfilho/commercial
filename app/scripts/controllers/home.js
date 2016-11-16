'use strict';

angular.module('commercialApp.controllers')
  .controller('HomeCtrl', ['$scope', '$location', 'ModalBuscarPedido', function ($scope, $location, modalBuscarPedido) {

    function redimensiona() {
      var min = 480, current = jQuery(window).height() - 160 - 60;
      jQuery('div[name="view-principal"]').height(current < min ? min : current);
    }

    $scope.$on('$viewContentLoaded', function () {
      redimensiona();
      jQuery(window).resize(redimensiona);
    });

    $scope.$on("$destroy", function () {
      jQuery(window).off('resize');
    });

    $scope.abrirTela = function (url) {
      $location.path(url);
    };

    $scope.botoes = [
      {
        nome: 'Novo<br>orçamento',
        icone: 'glyphicon-shopping-cart',
        url: '/orcamento/new'
      },
      {
        nome: 'Buscar<br>orçamento',
        icone: 'glyphicon-search',
        url: '/buscar-orcamento'
      },
      // {
      //   nome: 'Relatórios',
      //   icone: 'glyphicon-print',
      //   url: '/relatorios'
      // },
      {
        nome: 'Follow Up',
        icone: 'glyphicon-comment',
        url: '/follow-up'
      },
      // {
      //   nome: 'Produtos',
      //   icone: 'glyphicon-tags',
      //   url: '/produtos'
      // },
      // {
      //   nome: 'Clientes',
      //   icone: 'glyphicon-user',
      //   url: '/clientes'
      // },
      {
        nome: 'Configurações',
        icone: 'glyphicon-cog',
        url: '/configuracoes'
      }];

  }]);
