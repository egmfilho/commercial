/**
 * Created by egmfilho on 08/11/16.
 */

'use strict';

angular.module('commercialApp.directives')
  .directive('confirmPopup', function() {

    function link(scope, element, attrs) {
      var html =
        '<div>' +
        scope.message +
        '<br><br>' +
        '<div class="clearfix">' +
        '<button class="btn btn-default pull-left" name="ok" style="margin: 0"><span class="glyphicon glyphicon-ok"></span> ' + (scope.okText || 'Sim') + '</button>' +
        '<button class="btn btn-default pull-right" name="cancel" style="margin: 0"><span class="glyphicon glyphicon-remove"></span> ' + (scope.cancelText || 'Não') + '</button>' +
        '</div>' +
        '</div>';

      element.popover({
        html: true,
        content: html,
        trigger: 'focus',
        title: scope.title,
        placement: scope.placement || 'top'
      });

      element.bind('click', function(e) {
        e.stopPropagation();

        jQuery('.popover button[name="ok"]').click(function(e) {
          scope.$apply(function () {
            scope.$eval(scope.okFunc);
          });
        });

        jQuery('.popover button[name="cancel"]').click(function(e) {
          scope.$apply(function () {
            scope.$eval(scope.cancelFunc);
          });
        });
      });
    }

    return {
      restrict: 'A',
      scope: {
        title: '@',
        message: '@',
        placement: '@',
        okText: '@',
        cancelText: '@',
        okFunc: '&',
        cancelFunc: '&'
      },
      link: link
    }
  });

