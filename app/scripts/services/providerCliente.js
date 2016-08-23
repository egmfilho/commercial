/**
 * Created by egmfilho on 15/07/16.
 */

'use strict';

angular.module('commercialApp.services')
  .provider('ProviderCliente', [function() {

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
        obterClientePorCodigo: function(codigo) {
          return provider.get({
            action: 'getClient',
            parametro: 'CdCliente',
            valor: codigo,
          }).$promise;
        },
        obterClientePorNome: function(nome) {
          return provider.query({
            action: 'searchClient',
            parametro: 'NmCliente',
            valor: nome
          }).$promise;
        }
      };

    }];
  }]);
