/**
 * Created by egmfilho on 05/09/16.
 */

'use strict';

angular.module('commercialApp.services')
  .factory('ModalBuscarPedido', ['$q', '$uibModal', function ($q, $uibModal) {

    return {
      show: function (key) {
        return $uibModal.open({
          animation: true,
          templateUrl: 'partials/modalBuscarPedido.html',
          controller: 'ModalBuscarPedidoCtrl',
          size: 'lg',
          resolve: {
            key: function () {
              return key;
            }
          }
        }).result;
      }
    };

  }]);
