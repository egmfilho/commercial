/**
 * Created by egmfilho on 12/07/16.
 */

'use strict';

angular.module('commercialApp')
  .directive('pressEnter', ['KEY_CODES', function(keys) {
    return function(scope, element, attrs) {
      element.bind("keypress", function(event) {

        if (event.which === keys.ENTER) {
          //scope.$apply(function() {
            scope.$eval(attrs.pressEnter);
          //});

          event.preventDefault();
        }
      });
    };
  }]);
