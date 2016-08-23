/**
 * Created by egmfilho on 15/07/16.
 */
'use strict';

angular.module('commercialApp.filters')
  .filter('filtroDecimal', ['$filter', function($filter) {

    return function(value, fractionSize) {

      if (!value) return '';

      var number = parseFloat(value);

      return number ? $filter('number')(number, fractionSize).toString().replace('.', ',') : value;
    };

  }]);
