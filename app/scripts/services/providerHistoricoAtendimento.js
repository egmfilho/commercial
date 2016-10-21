
'use strict';

angular.module('commercialApp.services')
  .provider('ProviderHistoricoAtendimento', ['URLS', function (urls) {

    var url = urls.root + 'attendance_history.php?action=:action',
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

        obterPorId: function (id, getUsuario, getStatus) {
          return provider.get({
            action: 'get'
          }, {
            attendance_history_id: id,
            get_attendance_history_maker: getUsuario,
            get_attendance_history_status: getStatus
          }).$promise;
        },

        obterPorCodigo: function (codigo, getUsuario, getStatus) {
          return provider.get({
            action: 'get'
          }, {
            attendance_history_code: cogido,
            get_attendance_history_maker: getUsuario,
            get_attendance_history_status: getStatus
          }).$promise;
        },

        editar: function (attendance_history) {
          return provider.save({
            action: 'edit'
          }, attendance_history).$promise;
        },

        adicionar: function (attendance_history) {
          return provider.save({
            action: 'insert'
          }, attendance_history).$promise;
        },

        excluir: function (id) {
          return provider.save({
            action: 'del'
          }, {
            attendance_history_id: id
          }).$promise;
        }
      };

    }];
  }]);
