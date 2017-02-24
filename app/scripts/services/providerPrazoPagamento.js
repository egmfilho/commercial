/**
 * Created by egmfilho on 24/02/17.
 */

/**
 * Created by egmfilho on 09/11/16.
 */

'use strict';

angular.module('commercialApp.services')
  .provider('ProviderPrazoPagamento', ProviderPrazoPagamento);

ProviderPrazoPagamento.$inject = [ 'URLS' ];

function ProviderPrazoPagamento(urls) {
  var url = urls.root + 'payment_term.php?action=:action',
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

      obterTodos: function(limite) {
        return provider.query({
          action: 'getList'
        }, {
          payment_term_limt: limite
        }).$promise;
      },

      obterPorId: function(id) {
        return provider.get({
          action: 'get'
        }, {
          payment_term_id: id,
          get_payment_mode: true
        }).$promise;
      },

      obterPorCodigo: function(codigo) {
        return provider.get({
          action: 'get'
        }, {
          payment_term_code: codigo,
          get_payment_mode: true
        }).$promise;
      },

      obterPorDescricao: function(descricao) {
        return provider.query({
          action: 'getList'
        }, {
          payment_term_description: descricao,
          payment_term_limit: 10
        }).$promise;
      },

      salvar: function(prazo) {
        return provider.save({
          action: 'insert'
        }, prazo).$promise;
      },

      editar: function(prazo) {
        return provider.save({
          action: 'edit'
        }, prazo).$promise;
      },

      excluir: function(prazo) {
        return provider.save({
          action: 'del'
        }, prazo).$promise;
      }

    }
  }];
}

