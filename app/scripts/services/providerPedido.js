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

        obterPedidosPorVendedor: function(codigo, nome) {
          return provider.query({
            action: 'getList'
          }, {

          }).$promise;
        },

        obterPedidosPorCliente: function(codigo, nome) {
          return provider.query({
            action: 'getList'
          }, {

          }).$promise;
        },

        obterPedidosPorData: function(inicial, final, vendedor, items, produtos, cliente, pagamentos, modalidades) {
          return provider.query({
            action: 'getList'
          }, {
            order_date_start: inicial,
            order_date_end: final,
            get_order_seller: vendedor,
            get_order_items: items,
            get_order_items_product: produtos,
            get_order_client: cliente,
            get_order_payments: pagamentos,
            get_order_payments_modality: modalidades
          }).$promise;
        },

        obterPedidosComFiltros: function(id_vendedor, id_cliente, data_inicial, data_final, get_vendedor, get_cliente, get_items, get_produtos, get_pagamentos, get_modalidades) {
          return provider.query({
            action: 'getList'
          }, {
            order_seller_id: id_vendedor,
            order_client_id: id_cliente,
            order_date_start: data_inicial,
            order_date_end: data_final,
            get_order_seller: get_vendedor,
            get_order_client: get_cliente,
            get_order_items: get_items,
            get_order_items_product: get_produtos,
            get_order_payments: get_pagamentos,
            get_order_payments_modality: get_modalidades
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
        },

        editarPedido: function(pedido) {
          return provider.save({
            action: 'edit'
          }, pedido).$promise;
        },

        excluirPedido: function(pedido) {
          return provider.save({
            action: 'del'
          }, {
            order_id: pedido.id
          }).$promise;
        }

      };

    }];

  }]);
