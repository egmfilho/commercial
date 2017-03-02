/**
 * Created by egmfilho on 10/11/16.
 */

'use strict';

angular.module('commercialApp.controllers')
  .controller('ModalConfirmCtrl', [
    '$scope',
    '$timeout',
    '$uibModalInstance',
    'options',
    function($scope, $timeout, $uibModalInstance, options) {

      $scope.title = options.title;
      $scope.message = options.message;
      $scope.positive = options.positive;
      $scope.negative = options.negative;
      $scope.hideButtonIcons = options.hideButtonIcons;

      $uibModalInstance.opened.then(function() {
        $timeout(function() {
          jQuery('button[name="positivo"]').focus();
        }, 200);
      });

      $scope.ok = function(reason) {
        $uibModalInstance.close(reason);
      };

      $scope.cancel = function(reason) {
        $uibModalInstance.dismiss(reason);
      };

    }]);
