/**
 * Created by egmfilho on 10/11/16.
 */

'use strict';

angular.module('commercialApp.controllers')
  .controller('ImpressaoCtrl', ImpressaoCtrl);

ImpressaoCtrl.$inject = [ '$scope', 'pedido' ];

function ImpressaoCtrl($scope, pedido) {

  var self = this;

  $scope.getHoje = function () {
    return new Date();
  };

  console.log(pedido);
  // this.pedido = new Pedido();
  this.pedido = pedido;
  // jQuery('.impressao').css('display', 'block');

  $scope.$on('$viewContentLoaded', function () {

    // if ($routeParams.code) {
    //   provider.obterPedidoPorCodigo($routeParams.code, true, true, true, true, true, true).then(function(success) {
    //     self.pedido = new Pedido(Pedido.converterEmEntrada(success.data));
    //     jQuery('.impressao').css('display', 'block');
    //   }, function(error) {
    //     console.log(error);
    //   });
    // }
    window.callPhantom();
  });

}
