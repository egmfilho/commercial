/**
 * Created by egmfilho on 21/06/16.
 */

'use strict';

angular.module('commercialApp.directives')
    .directive('redireciona', ['$location', function($location) {

    return function(scope, element, attrs) {
      var path;

      attrs.$observe('redireciona', function(val) {
        path = val;
      });

      element.bind('click', function() {
        scope.$apply(function() {
          $location.path(path);
        });
      });
    };

  }]);
