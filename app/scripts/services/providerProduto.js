/**
 * Created by egmfilho on 16/06/16.
 */

angular.module('commercialApp')
  .provider('ProviderProduto', [function() {

    var url = 'http://enterprise/commercial/public/teste.php?action=productSearch&:parametro=:valor&limit=:limite',
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
              parametro: 'NmProduto',
              valor: produto,
              limite: 10
            }).$promise;
          },
          obterProdutosPorCodigo: function(codigo) {
            return provider.query({
              parametro: 'CdProduto',
              valor: codigo,
              limite: ''
            }).$promise;
          }
        }

      }];
  }]);


