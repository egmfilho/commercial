/**
 * Created by egmfilho on 03/09/16.
 */

'use strict';

angular.module('commercialApp.services')
  .provider('ProviderPedido', ['URLS', function(urls) {

    var url = urls.root + 'order.php?action=:action',
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

        obterPedidoPorCodigo: function(codigo) {
          return provider.get({
            action: 'get'
          }, {
            CdPedido: codigo
          }).$promise;
        },

        obterTodos: function() {
          return provider.query({
            action: 'getList'
          }, { }).$promise;
        },

        adicionarPedido: function(pedido) {
          return provider.save({
            action: 'insert'
          }, pedido).$promise;
        }

      };

    }];

  }]);
