/**
 * Created by egmfilho on 01/09/16.
 */

'use strict';

angular.module('commercialApp.services')
  .factory('ModalBuscarPessoa', ['$q', '$uibModal', function ($q, $uibModal) {

    return {
      show: function (tipo) {
        return $uibModal.open({
          animation: true,
          templateUrl: 'partials/modalBuscarPessoa.html',
          controller: 'ModalBuscarPessoaCtrl',
          size: 'lg',
          resolve: {
            tipo: function () {
              return tipo;
            }
          }
        }).result;
      }
    };

  }]);
