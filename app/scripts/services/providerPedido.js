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

        obterPedidoPorCodigo: function(codigo, vendedor, items, produtos, cliente, pagamentos, modalidades) {
          return provider.get({
            action: 'get'
          }, {
            order_code: codigo,
            get_order_seller: vendedor,
            get_order_items: items,
            get_order_items_product: produtos,
            get_order_client: cliente,
            get_order_payments: pagamentos,
            get_order_payments_modality: modalidades
          }).$promise;
        },

        obterPedidoPorId: function(id, vendedor, items, produtos, cliente, pagamentos, modalidades) {
          return provider.get({
            action: 'get'
          }, {
            order_id: id,
            get_order_seller: vendedor,
            get_order_items: items,
            get_order_items_product: produtos,
            get_order_client: cliente,
            get_order_payments: pagamentos,
            get_order_payments_modality: modalidades
          }).$promise;
        },

        obterTodos: function(vendedor, items, produtos, cliente, pagamentos, modalidades) {
          return provider.query({
            action: 'getList'
          }, {
            get_order_seller: vendedor,
            get_order_items: items,
            get_order_items_product: produtos,
            get_order_client: cliente,
            get_order_payments: pagamentos,
            get_order_payments_modality: modalidades
          }).$promise;
        },

        adicionarPedido: function(pedido) {
          return provider.save({
            action: 'insert'
          }, pedido).$promise;
        }

      };

    }];

  }]);
