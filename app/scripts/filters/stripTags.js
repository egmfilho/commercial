/**
 * Created by egmfilho on 25/10/16.
 */

'use strict';

angular.module('commercialApp.filters')
  .filter('stripTags', [function() {

    return function(text) {
      return text ? String(text).replace(/<[^>]+>/gm, '') : '';
    }

  }]);
