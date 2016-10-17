/**
 * Created by egmfilho on 14/10/16.
 */

'use strict';

angular.module('commercialApp.controllers')
  .controller('ModalAtendimentoCtrl', [
    '$rootScope',
    '$scope',
    '$uibModalInstance',
    'atendimento',
    function($rootScope, $scope, $uibModalInstance, atendimento) {

      $uibModalInstance.opened.then(function() {

      });

      $scope.cancel = function() {
        $uibModalInstance.dismiss();
      };

    }
  ]);
