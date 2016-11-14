/**
 * Created by egmfilho on 21/10/16.
 */

'use strict';

angular.module('commercialApp.directives')
  .directive('alertPopup', [function() {
    return {
      restrict: 'E',
      scope: {
        title: '@titulo',
        message: '@mensagem'
      },
      templateUrl: 'partials/alertPopup.html'
    };
  }]);
