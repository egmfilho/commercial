/**
 * Created by egmfilho on 29/08/16.
 */

'use strict';

angular.module('commercialApp.services')
  .factory('KeyBuffer', ['KEY_CODES', function(keys) {

    var map = { };

    map[keys.F1] = false;
    map[keys.F5] = false;

    map[keys.SHIFT] = false;
    map[keys.ENTER] = false;

    return map;

  }]);
