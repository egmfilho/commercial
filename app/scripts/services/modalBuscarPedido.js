/**
 * Created by egmfilho on 05/09/16.
 */

'use strict';

angular.module('commercialApp.services')
  .factory('ModalBuscarPedido', ['$uibModal', function($uibModal) {

    return {
      show: function(key, callback) {
        $uibModal.open({
          animation: true,
          templateUrl: 'partials/modalBuscarPedido.html',
          controller: 'ModalBuscarPedidoCtrl',
          size: 'lg',
          resolve: {
            key: function() {
              return key;
            }
          }
        }).result.then(function(result) {
            if (callback) {
              callback(result);
            }
          }, function() {
            if (callback) {
              callback(null);
            }
          });
      }
    };

  }]);
