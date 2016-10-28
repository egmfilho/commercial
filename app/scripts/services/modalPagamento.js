/**
 * Created by egmfilho on 30/08/16.
 */

'use strict';

angular.module('commercialApp.services')
  .factory('ModalPagamento', ['$uibModal', function($uibModal) {

    return {
      show: function(pedido, callback) {
        $uibModal.open({
          animation: true,
          templateUrl: 'partials/modalPagamento2.html',
          controller: 'ModalPagamentoCtrl',
          size: 'lg',
          resolve: {
            pedido: function() {
              return pedido;
            }
          }
        }).result.then(function(result) {
            callback(result);
          }, function() {
            callback(null);
          });
      }
    };

  }]);
