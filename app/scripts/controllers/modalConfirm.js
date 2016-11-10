/**
 * Created by egmfilho on 10/11/16.
 */

'use strict';

angular.module('commercialApp.controllers')
  .controller('ModalConfirmCtrl', [
    '$scope',
    '$uibModalInstance',
    'options',
    function($scope, $uibModalInstance, options) {

      $scope.title = options.title;
      $scope.message = options.message;
      $scope.positive = options.positive;
      $scope.negative = options.negative;

      $scope.ok = function() {
        $uibModalInstance.close();
      };

      $scope.cancel = function() {
        $uibModalInstance.dismiss();
      };

    }]);
