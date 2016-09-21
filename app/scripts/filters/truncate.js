/**
 * Created by egmfilho on 21/09/16.
 */

'use strict';

angular.module('commercialApp.filters')
  .filter('truncate', function() {
    return function(value, max, tail) {

      if (!value)
        return '';

      max = parseInt(max, 10);
      if (!max)
        return value;

      if (value.length <= max)
        return value;

      value = value.substring(0, max);

      var lastSpace = value.lastIndexOf(' ');

      if (lastSpace != -1) {
        if (value.charAt(lastSpace - 1) == ',' || value.charAt(lastSpace - 1) == '.') {
          lastSpace = lastSpace - 1;
        }
      }

      return value.substring(0, lastSpace) + (tail || '…');
    }
  });
