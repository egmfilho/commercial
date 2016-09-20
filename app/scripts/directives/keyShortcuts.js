/**
 * Created by egmfilho on 20/09/16.
 */

'use strict';

angular.module('commercialApp.directives')
  .directive('keyShortcuts', ['KEY_CODES', 'KeyBuffer', function(keys, buffer) {

    function link(scope, element, attrs) {

      element.bind('keydown', function(event) {
        if (event.keyCode in buffer) {

          switch (event.keyCode) {
            case keys.F1:
              if (!buffer[event.keyCode]) {
                buffer[event.keyCode] = true;
                scope.$apply(function() {
                  scope.$eval(scope.f1);
                  //element.blur();
                });
              }
              break;

            case keys.F5:
              if (!buffer[event.keyCode]) {
                buffer[event.keyCode] = true;
                scope.$apply(function() {
                  scope.$eval(scope.f5);
                });
              }
              break;

            case keys.SHIFT:
              if (!buffer[event.keyCode]) {
                buffer[event.keyCode] = true;
              }
              break;

            case keys.ENTER:
              if (!buffer[event.keyCode]) {
                buffer[event.keyCode] = true;
                scope.$apply(function() {
                  buffer[keys.SHIFT] ? scope.$eval(scope.shiftEnter) : scope.$eval(scope.enter);
                });
              }
              break;

            case keys.ESCAPE:
              if (!buffer[event.keyCode]) {
                buffer[event.keyCode] = true;
                scope.$apply(function() {
                  scope.$eval(scope.escape);
                });
              }
              break;
          }

          event.preventDefault();
        }
      });

      element.bind('keyup', function(event) {
        if (event.keyCode in buffer) {
          buffer[event.keyCode] = false;
        }
      });

    }

    return {
      restrict: 'AE',
      scope: {
        enter: '&',
        shiftEnter: '&',
        f1: '&',
        f5: '&',
        escape: '&'
      },
      link: link
    }

  }]);
