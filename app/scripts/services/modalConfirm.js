/**
 * Created by egmfilho on 10/11/16.
 */

'use strict';

angular.module('commercialApp.services')
  .factory('ModalConfirm', ['$uibModal', function($uibModal) {

    return {
      show: function(title, message, positive, negative) {
        return $uibModal.open({
          animation: true,
          templateUrl: 'partials/modalConfirm.html',
          controller: 'ModalConfirmCtrl',
          size: 'md',
          windowClass: 'modal-confirm',
          resolve: {
            options: function() {
              return {
                title: title,
                message: message,
                positive: positive,
                negative: negative
              };
            }
          }
        }).result;
      }
    }

  }]);
