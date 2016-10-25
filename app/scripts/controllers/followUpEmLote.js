/**
 * Created by egmfilho on 25/10/16.
 */

'use strict';

angular.module('commercialApp.controllers')
  .controller('FollowUpEmLoteCtrl', [
    '$rootScope',
    '$scope',
    'ProviderPedido',
    'Pedido',
    function ($rootScope, $scope, providerPedido, Pedido) {

      var self = this;

      $scope.$on('$viewContentLoaded', function () {

        $rootScope.loading.load();
        self.pedidos = [];
        providerPedido.obterTodos(true, false, false, true).then(function (success) {
          angular.forEach(success.data, function (item, index) {
            self.pedidos.push(new Pedido(Pedido.converterEmEntrada(item)));
          });
          $rootScope.loading.unload();
        }, function (error) {
          console.log(error);
          $rootScope.loading.unload();
        });

      });

    }]);
