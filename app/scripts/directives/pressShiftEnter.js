/**
 * Created by egmfilho on 29/08/16.
 */

'use strict';

angular.module('commercialApp.directives')
  .directive('pressShiftEnter', ['KEY_CODES', 'ShiftEnterMap', function(keys, map) {
    return function(scope, element, attrs) {

      //var map = { };
      //map[keys.SHIFT] = false;
      //map[keys.ENTER] = false;

      element.bind('keydown', function(event) {
        if (event.keyCode in map) {
          map[event.keyCode] = true;
          if (map[keys.SHIFT] && map[keys.ENTER]) {
            scope.$apply(function() {
              scope.$eval(attrs.pressShiftEnter);
            });
            event.preventDefault();
          }
        }
      });

      element.bind('keyup', function(event) {
        if (event.keyCode in map) {
          map[event.keyCode] = false;
        }
      });
    };
  }]);
