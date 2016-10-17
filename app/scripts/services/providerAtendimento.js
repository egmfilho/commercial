/**
 * Created by egmfilho on 14/10/16.
 */

'use strict';

angular.module('commercialApp.services')
  .provider('ProviderAtendimento', ['URLS', function (urls) {

    var url = urls.root + 'attendance.php?action=:action',
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

        obterPorId: function (id, getPedido, getUsuario, getParecer, getHistorico) {
          return provider.get({
            action: 'get'
          }, {
            attendance_id: id,
            get_attendance_order: getPedido,
            get_attendance_maker: getUsuario,
            get_attendance_note: getParecer,
            get_attendance_note_maker: getParecer,
            get_attendance_note_contact_type: getParecer,
            get_attendance_history: getHistorico,
            get_attendance_history_maker: getHistorico,
            get_attendance_history_responsible: getHistorico
          }).$promise;
        },

        obterPorCodigo: function (codigo, getPedido, getUsuario, getParecer, getHistorico) {
          return provider.get({
            action: 'get'
          }, {
            attendance_code: codigo,
            get_attendance_order: getPedido,
            get_attendance_maker: getUsuario,
            get_attendance_note: getParecer,
            get_attendance_note_maker: getParecer,
            get_attendance_note_contact_type: getParecer,
            get_attendance_history: getHistorico,
            get_attendance_history_maker: getHistorico,
            get_attendance_history_responsible: getHistorico
          }).$promise;
        },

        editar: function (attendance) {
          return provider.save({
            action: 'edit'
          }, attendance).$promise;
        },

        adicionar: function (attendance) {
          return provider.save({
            action: 'insert'
          }, attendance).$promise;
        },

        excluir: function (id) {
          return provider.save({
            action: 'del'
          }, {
            attendance_id: id
          }).$promise;
        }
      };

    }];
  }]);
