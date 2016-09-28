/**
 * Created by egmfilho on 05/09/16.
 */

'use strict';

angular.module('commercialApp.services')
  .factory('ModalBuscarProduto', ['$q', '$uibModal', function ($q, $uibModal) {

    return {
      show: function (key) {
        return $uibModal.open({
          animation: true,
          templateUrl: 'partials/modalBuscarProduto.html',
          controller: 'ModalBuscarProdutoCtrl',
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
