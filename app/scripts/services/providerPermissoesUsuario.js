/**
 * Created by egmfilho on 01/10/16.
 */

'use strict';

angular.module('commercialApp.services')
  .provider('ProviderPermissoesUsuario', ['URLS', function (urls) {

    //var url = urls.root + 'user.php?action=:action',
    //  provider = null;
    //
    //this.$get = ['$resource', function ($resource) {
    //  provider = $resource(url, {}, {
    //    get: {
    //      method: 'POST'
    //    },
    //    query: {
    //      method: 'POST',
    //      isArray: false
    //    }
    //  });
    //
    //  return {
    //    obterTodos: function (getPerfil, getAcessos, getSessao) {
    //      return provider.query({
    //        action: 'getList'
    //      }, {
    //        get_user_profile: getPerfil,
    //        get_user_profile_access: getAcessos,
    //        get_user_session: getSessao
    //      }).$promise;
    //    },
    //
    //    editar: function (user) {
    //      return provider.save({
    //        action: 'edit'
    //      }, user).$promise;
    //    },
    //
    //    adicionar: function (user) {
    //      return provider.save({
    //        action: 'insert'
    //      }, user).$promise;
    //    },
    //
    //    excluir: function (id) {
    //      return provider.save({
    //        action: 'del'
    //      }, {
    //        user_id: id
    //      }).$promise;
    //    }
    //  };

    //}];
  }]);
