/**
 * Created by egmfilho on 10/11/16.
 */

'use strict';

angular.module('commercialApp.controllers')
  .controller('ImpressaoCtrl', ImpressaoCtrl);

ImpressaoCtrl.$inject = [ '$scope', '$routeParams', '$http', 'Pedido', 'URLS' ];

function ImpressaoCtrl($scope, $routeParams, $http, Pedido, urls) {

  var self = this;

  $scope.getHoje = function () {
    return new Date();
  };

  this.pedido = new Pedido();

  $scope.$on('$viewContentLoaded', function () {

    if ($routeParams.code) {
      $http({
        method: 'POST',
        url: urls.root + 'order.php?action=get',
        headers: {
          'x-session-token': 'lucilei'
        },
        data: {
          order_code: $routeParams.code,
          get_order_seller: 1,
          get_order_items: 1,
          get_order_items_product: 1,
          get_order_client: 1,
          get_order_payments: 1,
          get_order_payments_modality: 1,
          get_order_shop: 1,
          get_shop_cep: 1
        }
      }).then(function(success) {
        self.pedido = new Pedido(Pedido.converterEmEntrada(success.data.data));
        window.callPhantom();
      }, function(error) {
        //@ console.log(error);
      });
    }
  });

}
