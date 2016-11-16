/**
 * Created by egmfilho on 16/11/16.
 */

'use strict';

angular.module('commercialApp.services')
  .factory('ModalAlert', ['$uibModal', function($uibModal) {

    return {
      show: function(title, message) {
        return $uibModal.open({
          animation: true,
          templateUrl: 'partials/modalAlert.html',
          controller: ['$scope', '$uibModalInstance', 'options', function($scope, $uibModalInstance, options) {
            $scope.title = options.title;
            $scope.message = options.message;
            $scope.ok = function () {
              $uibModalInstance.close();
            }
          }],
          size: 'sm',
          windowClass: 'modal-confirm',
          resolve: {
            options: function() {
              return {
                title: title,
                message: message
              };
            }
          }
        }).result;
      }
    }

  }]);
