/**
 * Created by egmfilho on 20/03/17.
 */

'use strict';

angular.module('commercialApp.services')
  .provider('ProviderPermissao', ['URLS', function(urls) {

    var url = urls.root + 'permission.php',
        provider = null;

    this.$get = ['$resource', function($resource) {

      provider = $resource(url, {}, {
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

        autorizar: function(modulo, acesso, usuario, senha) {
          return provider.save({
          }, {
            module: modulo,
            access: acesso,
            user_user: usuario,
            user_pass: senha
          }).$promise;
        }

      }


    }];

  }]);
