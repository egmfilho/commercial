/**
 * Created by egmfilho on 29/08/16.
 */

'use strict';

angular.module('commercialApp.services')
  .factory('ShiftEnterMap', ['KEY_CODES', function(keys) {

    var map = { };
    map[keys.SHIFT] = false;
    map[keys.ENTER] = false;

    return map;

  }]);
