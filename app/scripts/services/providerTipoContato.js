/**
 * Created by egmfilho on 19/10/16.
 */

angular.module('commercialApp.services')
  .provider('ProviderTipoContato', ['URLS', function (urls) {

    var url = urls.root + 'contact_type.php?action=:action',
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
        obterTodos: function () {
          return provider.query({
            action: 'getList'
          }, {

          }).$promise;
        },

        obterPorId: function (id) {
          return provider.get({
            action: 'get'
          }, {
            attendance_note_contact_type_id: id
          }).$promise;
        },

        editar: function (tipo) {
          return provider.save({
            action: 'edit'
          }, status).$promise;
        },

        adicionar: function (tipo) {
          return provider.save({
            action: 'insert'
          }, status).$promise;
        },

        excluir: function (id) {
          return provider.save({
            action: 'del'
          }, {
            attendance_note_contact_type_id: id
          }).$promise;
        }
      };

    }];
  }]);
