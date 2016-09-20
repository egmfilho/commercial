/**
 * Created by egmfilho on 20/09/16.
 */

'use strict';

angular.module('commercialApp.directives')
  .directive('relogio', ['$timeout', function($timeout) {

    function controller($scope) {
      $scope.relogio = 'carregando relógio';

      function tick() {
        $scope.relogio = Date.now();
        $timeout(tick, 1000);
      }

      $timeout(tick, 1000);
    }

    return {
      restrict: 'E',
      controller: controller,
      template: '<span>{{relogio | date: "medium"}}</span>'
    }

  }]);
