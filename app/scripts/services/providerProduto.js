/**
 * Created by egmfilho on 16/06/16.
 */

'use strict';

angular.module('commercialApp')
  .provider('ProviderProduto', [function() {

    var url = 'http://172.16.4.17/commercial/public/php/order.php?action=:action&:parametro=:valor&limit=:limite',
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
          obterProdutosPorDescricao: function(produto) {
            return provider.query({
              action: 'searchProduct',
              parametro: 'NmProduto',
              valor: produto,
              limite: 10
            }).$promise;
          },
          obterProdutoPorCodigo: function(codigo) {
            return provider.get({
              action: 'getProduct',
              parametro: 'CdProduto',
              valor: codigo,
            }).$promise;
          },
          obterProdutoPorId: function(id) {
            return provider.get({
              action: 'getProduct',
              parametro: 'IdProduto',
              valor: id
            }).$promise;
          }
        }

      }];
  }]);


