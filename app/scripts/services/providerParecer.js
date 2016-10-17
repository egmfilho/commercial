/**
 * Created by egmfilho on 14/10/16.
 */

'use strict';

angular.module('commercialApp.services')
  .provider('ProviderParecer', ['URLS', function (urls) {

    var url = urls.root + 'attendance_note.php?action=:action',
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

        obterPorId: function (id, getUsuario, getContato) {
          return provider.get({
            action: 'get'
          }, {
            attendance_note_id: id,
            get_attendance_note_maker: getUsuario,
            get_attendance_note_contact_type: getContato
          }).$promise;
        },

        obterPorCodigo: function (codigo, getUsuario, getContato) {
          return provider.get({
            action: 'get'
          }, {
            attendance_note_code: cogido,
            get_attendance_note_maker: getUsuario,
            get_attendance_note_contact_type: getContato
          }).$promise;
        },

        editar: function (attendance_note) {
          return provider.save({
            action: 'edit'
          }, attendance_note).$promise;
        },

        adicionar: function (attendance_note) {
          return provider.save({
            action: 'insert'
          }, attendance_note).$promise;
        },

        excluir: function (id) {
          return provider.save({
            action: 'del'
          }, {
            attendance_note_id: id
          }).$promise;
        }
      };

    }];
  }]);
