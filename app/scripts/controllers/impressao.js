/**
 * Created by egmfilho on 10/11/16.
 */

'use strict';

angular.module('commercialApp.controllers')
  .controller('ImpressaoCtrl', ImpressaoCtrl);

ImpressaoCtrl.$inject = [ '$scope', '$routeParams', 'ProviderPedido', 'Pedido' ];

function ImpressaoCtrl($scope, $routeParams, provider, Pedido) {

  var self = this;

  $scope.getHoje = function () {
    return new Date();
  };

  this.pedido = new Pedido();

  $scope.$on('$viewContentLoaded', function () {

    if ($routeParams.code) {
      provider.obterPedidoPorCodigo($routeParams.code, true, true, true, true, true, true).then(function(success) {
        self.pedido = new Pedido(Pedido.converterEmEntrada(success.data));
        jQuery('.impressao').css('display', 'block');
      }, function(error) {
        console.log(error);
      });
    }

  });

}
