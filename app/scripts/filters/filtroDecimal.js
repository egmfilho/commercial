/**
 * Created by egmfilho on 15/07/16.
 */
'use strict';

angular.module('commercialApp')
  .filter('filtroDecimal', [function() {

    return function(input) {
      return input ?  input.toString().replace('.', ',') : null;
    }

  }]);
