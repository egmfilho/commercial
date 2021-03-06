/**
 * Created by egmfilho on 02/09/16.
 */

'use strict';

angular.module('commercialApp.services')
  .factory('ModalBuscarEndereco', ['$uibModal', function($uibModal) {

    return {
      show: function(enderecos) {
        return $uibModal.open({
          animation: true,
          templateUrl: 'partials/modalBuscarEndereco.html',
          controller: 'ModalBuscarEnderecoCtrl',
          size: 'lg',
          resolve: {
            enderecos: function() {
              return enderecos;
            }
          }
        }).result;
      }
    };

  }]);
