/**
 * Created by egmfilho on 14/06/16.
 */

angular.module('commercialApp')
  .directive('alerta', [function() {
    return {
      restrict: 'E',
      scope: {
        titulo: '@',
        mensagem: '@'
      },
      templateUrl: '/partials/alerta.html'
    }
  }]);