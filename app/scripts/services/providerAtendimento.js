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

      // PARAMETROS
      // "attendance_user_id": "1001",
      // "attendance_status_id": "1002",
      // "attendance_order": "attendance_code ASC",
      // "attendance_limit": "1",
      // "get_attendance_maker": "1",
      // "get_attendance_order": "1",
      // "get_attendance_note": "1",
      // "get_attendance_last_note": "1",
      // "get_attendance_history": "1",
      // "get_attendance_last_history": "1",
      // "get_attendance_history_maker": "1",
      // "get_attendance_history_status": "1",
      // "get_attendance_history_responsible": "1"
      // "get_order_seller": "1"

      return {
        obterTodos: function (getPedido, getUsuario, getParecer, getHistorico, filtroStatus, filtroCliente, filtroResponsavel, filtroData, filtroDataMin, filtroDataMax) {
          return provider.query({
            action: 'getList'
          }, {
            get_attendance_order: getPedido,
            get_attendance_maker: getUsuario,
            get_attendance_last_note: getParecer,
            get_attendance_note_maker: getParecer,
            get_attendance_note_contact_type: getParecer,
            get_attendance_last_history: getHistorico,
            get_attendance_history_responsible: getHistorico,
            get_attendance_history_status: getHistorico,
            get_order_seller: true,
            attendance_status_id: filtroStatus,
            attendance_client_id: filtroCliente,
            attendance_responsible_id: filtroResponsavel,
            attendance_date_column: filtroData,
            attendance_date_start: filtroDataMin,
            attendance_date_end: filtroDataMax
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
            get_attendance_history_responsible: getHistorico,
            get_attendance_history_status: getHistorico
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
            get_attendance_history_responsible: getHistorico,
            get_attendance_history_status: getHistorico,
            get_order_seller: true
          }).$promise;
        },

        obterPorCodigoPedido: function (codigo, getPedido, getUsuario, getParecer, getHistorico) {
          return provider.get({
            action: 'get'
          }, {
            attendance_order_code: codigo,
            get_attendance_order: getPedido,
            get_attendance_maker: getUsuario,
            get_attendance_note: getParecer,
            get_attendance_note_maker: getParecer,
            get_attendance_note_contact_type: getParecer,
            get_attendance_history: getHistorico,
            get_attendance_history_maker: getHistorico,
            get_attendance_history_responsible: getHistorico,
            get_attendance_history_status: getHistorico,
            get_order_seller: true
          }).$promise;
        },

        obterTodosPorCodigoPedido: function (codigo, getPedido, getUsuario, getParecer, getHistorico, filtroStatus, filtroResponsavel, filtroData, filtroDataMin, filtroDataMax) {
          return provider.get({
            action: 'getList'
          }, {
            attendance_order_code: codigo,
            get_attendance_order: getPedido,
            get_attendance_maker: getUsuario,
            get_attendance_note: getParecer,
            get_attendance_note_maker: getParecer,
            get_attendance_note_contact_type: getParecer,
            get_attendance_history: getHistorico,
            get_attendance_history_maker: getHistorico,
            get_attendance_history_responsible: getHistorico,
            get_attendance_history_status: getHistorico,
            get_order_seller: true,
            attendance_status_id: filtroStatus,
            attendance_responsible_id: filtroResponsavel,
            attendance_date_column: filtroData,
            attendance_date_start: filtroDataMin,
            attendance_date_end: filtroDataMax
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

        adicionarEmLote: function (attendance) {
          return provider.save({
            action: 'insertBatch'
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
