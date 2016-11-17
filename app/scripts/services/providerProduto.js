/**
 * Created by egmfilho on 16/06/16.
 */

'use strict';

angular.module('commercialApp.services')
  .provider('ProviderProduto', ['URLS', function(urls) {

    var url = urls.root + 'product.php?action=:action',
        provider = null;

      this.$get = ['$resource', function($resource) {
        provider = $resource(url, {}, {
          get: {
            method: 'POST',
            isArray: false
          },
          query: {
            method: 'POST',
            isArray: false
          }
        });

        return {
          obterProdutosPorDescricao: function(descricao, limite, idTabelaPrecos) {
            return provider.query({
              action: 'getList'
            }, {
              NmProduto: descricao,
              Limite: limite,
              price_id: idTabelaPrecos
            }).$promise;
          },
          obterProdutoPorCodigo: function(codigo, idTabelaPrecos) {
            return provider.get({
              action: 'get'
            }, {
              CdProduto: codigo,
              price_id: idTabelaPrecos
            }).$promise;
          },
          obterProdutoPorId: function(id, idTabelaPrecos) {
            return provider.get({
              action: 'get'
            }, {
              IdProduto: id,
              price_id: idTabelaPrecos
            }).$promise;
          }
        };

      }];
  }]);


