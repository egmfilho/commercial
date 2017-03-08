/**
 * Created by egmfilho on 05/09/16.
 */

'use strict';

angular.module('commercialApp.services')
  .factory('ModalBuscarPedido', ['$q', '$uibModal', function ($q, $uibModal) {

    return {
      show: function (destino, atendimento, origem) {
        return $uibModal.open({
          animation: true,
          templateUrl: 'partials/modalBuscarPedido.html',
          controller: 'ModalBuscarPedidoCtrl',
          size: 'lg',
          resolve: {
            destino: function () {
              return destino;
            },
            atendimento: function () {
              return atendimento;
            },
            origem: function () {
              return origem;
            }
          }
        }).result;
      }
    };

  }]);
