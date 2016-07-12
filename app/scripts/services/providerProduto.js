/**
 * Created by egmfilho on 16/06/16.
 */

angular.module('commercialApp')
  .provider('ProviderProduto', [function() {

    var url = 'http://enterprise/commercial/public/order.php?action=:action&:parametro=:valor&limit=:limite',
        provider = null;

      this.$get = ['$resource', function($resource) {
        provider = $resource(url, {}, {
          get: {
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
            return provider.query({
              action: 'getProduct',
              parametro: 'CdProduto',
              valor: codigo,
              limite: ''
            }).$promise;
          },
          obterProdutoPorId: function(id) {
            return provider.query({
              action: 'getProduct',
              parametro: 'IdProduto',
              valor: id
            }).$promise;
          }
        }

      }];
  }]);


