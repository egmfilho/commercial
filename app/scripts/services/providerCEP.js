/**
 * Created by egmfilho on 02/09/16.
 */

'use strict';

angular.module('commercialApp.services')
  .provider('ProviderCEP', ['URLS', function(urls) {

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

        obterCEPs: function(cep) {
          return provider.query({
            action: 'getList'
          }, {
            CdCep: cep
          }).$promise;
        }

      }

    }];

  }]);
