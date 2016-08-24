/**
 * Created by egmfilho on 24/08/16.
 */

'use strict';

angular.module('commercialApp.directives')
  .directive('numberOnly', [function() {

    return {
      require: 'ngModel',
      link: function(scope, element, attr, ngModelCtrl) {
        ngModelCtrl.$parsers.push(function(text) {
          var transformedInput = text.replace(/[^0-9\,\.]/g, '');
          if (transformedInput !== text) {
            ngModelCtrl.$setViewValue(transformedInput);
            ngModelCtrl.$render();
          }
          return transformedInput;
        });
      }
    };

  }]);
