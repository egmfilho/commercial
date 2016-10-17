/**
 * Created by egmfilho on 14/10/16.
 */

'use strict';

angular.module('commercialApp.services')
  .factory('ModalAtendimento', ['$uibModal', function($uibModal) {

    return {
      show: function(atendimento) {
        return $uibModal.open({
          animation: true,
          templateUrl: 'partials/modalAtendimento.html',
          controller: 'ModalAtendimentoCtrl',
          size: 'md',
          resolve: {
            atendimento: function() {
              return atendimento;
            }
          }
        }).result;
      }
    };

  }]);
