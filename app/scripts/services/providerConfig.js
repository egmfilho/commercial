/**
 * Created by egmfilho on 01/10/16.
 */

'use strict';

angular.module('commercialApp.services')
  .provider('ProviderConfig', ['URLS', function (urls) {

    var url = urls.root + 'config.php?action=:action',
      provider = null;

    this.$get = ['$resource', function ($resource) {
      provider = $resource(url, {}, {
        get: {
          method: 'GET'
        }
      });

      return {
        obterPermissoes: function () {
          return provider.get({
            action: 'getJsonAccess'
          }).$promise;
        }
      };

    }];
  }]);
