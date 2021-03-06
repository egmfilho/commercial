/**
 * Created by egmfilho on 14/06/16.
 */

'use strict';

angular.module('commercialApp.directives')
  .directive('alerta', [function() {
    return {
      restrict: 'E',
      scope: {
        titulo: '@',
        mensagem: '@'
      },
      templateUrl: '/partials/alerta.html'
    };
  }]);
