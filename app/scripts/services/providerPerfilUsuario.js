/**
 * Created by egmfilho on 29/09/16.
 */

'use strict';

angular.module('commercialApp.services')
  .provider('ProviderPerfilUsuario', ['URLS', function (urls) {

    var url = urls.root + 'user_profile.php?action=:action',
      provider = null;

    this.$get = ['$resource', function ($resource) {
      provider = $resource(url, {}, {
        get: {
          method: 'POST'
        },
        query: {
          method: 'POST',
          isArray: false
        }
      });

      return {
        obterPorId: function(id, getAcessos) {
          return provider.query({
            action: 'get'
          }, {
            user_profile_id: id,
            get_user_profile_access: getAcessos
          }).$promise;
        },

        obterTodos: function (getAcessos) {
          return provider.query({
            action: 'getList'
          }, {
            get_user_profile_access: getAcessos
          }).$promise;
        },

        obterPorNome: function (nome, getAcessos) {
          return provider.query({
            action: 'getList'
          }, {
            user_profile_name: nome,
            get_user_profile_access: getAcessos
          }).$promise;
        },

        editar: function (perfil) {
          return provider.save({
            action: 'edit'
          }, perfil).$promise;
        },

        adicionar: function (perfil) {
          return provider.save({
            action: 'insert'
          }, perfil).$promise;
        }
      };

    }];
  }]);
