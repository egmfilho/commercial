/**
 * Created by egmfilho on 13/07/16.
 */

'use strict';

angular.module('commercialApp')
  .directive('filtroMoeda', ['$filter', function($filter) {
    return {
      require: 'ngModel',
      link: function(scope, element, attrs, ngModelController) {
        ngModelController.$parsers.push(function(data) {
          // converte o dado no formato da view para o formato do model
          if (data) {
            return parseFloat(data.toString().replace(',', '.'));
          }

          return parseFloat(data);
        });

        ngModelController.$formatters.push(function(data) {
          // converte o dado no formato do model para o formato da view

          if (data != null) {
            return $filter('number')(data, 2).replace('.', ',');
          }

          return data;
        });
      }
    };
  }]);
