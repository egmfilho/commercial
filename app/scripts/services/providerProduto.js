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
          obterProdutosPorDescricao: function(descricao) {
            return provider.query({
              action: 'getList'
            }, {
              NmProduto: descricao,
              Limite: 10
            }).$promise;
          },
          obterProdutoPorCodigo: function(codigo) {
            return provider.get({
              action: 'get'
            }, {
              CdProduto: codigo
            }).$promise;
          },
          obterProdutoPorId: function(id) {
            return provider.get({
              action: 'get'
            }, {
              IdProduto: id
            }).$promise;
          }
        };

      }];
  }]);


