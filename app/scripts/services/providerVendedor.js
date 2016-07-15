/**
 * Created by egmfilho on 15/07/16.
 */
'use strict';

angular.module('commercialApp')
  .provider('ProviderVendedor', [function() {

    var url = 'http://172.16.4.17/commercial/public/php/order.php?action=:action&:parametro=:valor',
      provider = null;

    this.$get = ['$resource', function($resource) {
      provider = $resource(url, {}, {
        get: {
          method: 'GET',
          headers: '',
          isArray: false
        },
        query: {
          method: 'GET',
          headers: '',
          isArray: true
        }
      });

      return {
        obterVendedorPorCodigo: function(codigo) {
          return provider.get({
            action: 'getSeller',
            parametro: 'CdVendedor',
            valor: codigo,
          }).$promise;
        },
        obterVendedorPorNome: function(nome){
          return provider.query({
            action: 'searchSeller',
            parametro: 'NmVendedor',
            valor: nome
          }).$promise;
        }
      }

    }];
  }]);
