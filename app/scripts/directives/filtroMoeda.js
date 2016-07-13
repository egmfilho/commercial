/**
 * Created by egmfilho on 13/07/16.
 */

'use strict';

angular.module('commercialApp')
  .directive('filtroMoeda', [function() {
    return {
      require: 'ngModel',
      link: function(scope, element, attrs, ngModelController) {
        ngModelController.$parsers.push(function(data) {
          // converte o dado no formato da view para o formato do model
          if (data) {
            return data.toString().replace(',', '.');
          } else {
            return data;
          }
        });

        ngModelController.$formatters.push(function(data) {
          // converte o dado do modelo do formato para o modelo da view
          if (data) {
            return data.toString().replace('.', ',');
          } else {
            return data;
          }
        });
      }
    }
  }]);
