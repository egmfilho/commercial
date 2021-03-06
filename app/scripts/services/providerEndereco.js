/**
 * Created by egmfilho on 02/09/16.
 */

'use strict';

angular.module('commercialApp.services')
  .provider('ProviderEndereco', ['URLS', function(urls) {

    var url = urls.root + 'cep.php?action=:action',
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

        obterEnderecosPorCEP: function(cep) {
          return provider.query({
            action: 'getList'
          }, {
            CdCep: cep
          }).$promise;
        },

        obterEnderecosPorLogradouro: function(logradouro, cidade) {
          return provider.query({
            action: 'getList'
          }, {
            Logradouro: logradouro,
            Cidade: cidade
          }).$promise;
        }

      };

    }];

  }]);
