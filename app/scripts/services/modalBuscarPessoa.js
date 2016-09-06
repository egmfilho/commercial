/**
 * Created by egmfilho on 01/09/16.
 */

'use strict';

angular.module('commercialApp.services')
  .factory('ModalBuscarPessoa', ['$uibModal', function($uibModal) {

    return {
      show: function(tipo, callback) {
        $uibModal.open({
          animation: true,
          templateUrl: 'partials/modalBuscarPessoa.html',
          controller: 'ModalBuscarPessoaCtrl',
          size: 'lg',
          resolve: {
            tipo: function() {
              return tipo;
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
