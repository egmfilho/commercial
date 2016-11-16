/**
 * Created by egmfilho on 16/11/16.
 */

'use strict';

angular.module('commercialApp.services')
  .provider('ProviderLoja', ['URLS', function(urls) {

    var url = urls.root + 'shop.php?action=:action',
      provider = null;

    this.$get = ['$resource', function($resource) {

      provider = $resource(url, { }, {
        get: {
          method: 'POST'
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

        obterTodos: function() {
          return provider.query({
            action: 'getList'
          }, {}).$promise;
        }

      };

    }];

  }]);
