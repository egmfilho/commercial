/**
 * Created by egmfilho on 22/08/16.
 */

'use strict';

angular.module('commercialApp.services')
  .provider('ProviderPessoa', ['URLS', function(urls) {

    var url = urls.root + 'person.php?action=:action',
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

        obterPessoaPorId: function(tipo, id) {
          return provider.get({
            action: 'get'
          }, {
            TpPessoa: tipo,
            IdPessoa: id
          }).$promise;
        },

        obterPessoaPorCodigo: function(tipo, codigo) {
          return provider.get({
            action: 'get'
          }, {
            TpPessoa: tipo,
            CdPessoa: codigo
          }).$promise;
        },

        obterPessoaPorNome: function(tipo, nome) {
          return provider.query({
            action: 'getList'
          }, {
            TpPessoa: tipo,
            NmPessoa: nome
          }).$promise;
        },

        adicionarPessoa: function(tipo, nome, telefone, celular, email) {
          return provider.save({
            action: ''
          }, {
            NmPessoa: nome
          }).$promise;
        }

      }

    }];

  }]);
