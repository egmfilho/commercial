/**
 * Created by egmfilho on 05/09/16.
 */

'use strict';

angular.module('commercialApp.services')
  .factory('ModalBuscarProduto', ['$uibModal', function($uibModal) {

    return {
      show: function(key, callback) {
        $uibModal.open({
          animation: true,
          templateUrl: 'partials/modalBuscarProduto.html',
          controller: 'ModalBuscarProdutoCtrl',
          size: 'lg',
          resolve: {
            key: function() {
              return key;
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
