/**
 * Created by egmfilho on 01/09/16.
 */

'use strict';

angular.module('commercialApp.services')
  .provider('ProviderModalidadePagamento', ['URLS', function(urls) {

    var url = urls.root + 'payment.php?action=:action',
      provider = null;

    this.$get = ['$resource', function($resource) {

      provider = $resource(url, { }, {
        get: {
          method: 'POST',
          isArray: false
        },
        query: {
          method: 'POST',
          isArray: false
        },
        save: {
          method: 'POST',
          isArray: false
        }
      });

      return {

        obterPorCodigo: function(codigo) {
          return provider.get({
            action: 'get'
          }, {
            CdPagamento: codigo
          }).$promise;
        },

        obterTodos: function(codigo) {
          return provider.query({
            action: 'getList'
          }, { }).$promise;
        }

      };

    }];

  }]);
