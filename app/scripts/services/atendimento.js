/**
 * Created by egmfilho on 13/10/16.
 */

'use strict';

angular.module('commercialApp.services')
  .factory('Atendimento', ['$cookies', 'Parecer', 'Pedido', 'HistoricoAtendimento', 'Usuario', function($cookies, Parecer, Pedido, HistoricoAtendimento, Usuario) {

    function Atendimento(atendimento) {
      var me = JSON.parse(window.atob($cookies.get('currentUser')));
      this.id = atendimento ? atendimento.id : '';
      this.codigo = atendimento ? atendimento.codigo : '';
      this.pedidoId = atendimento ? atendimento.pedidoId : '';
      this.pedido = atendimento ? atendimento.pedido : new Pedido();
      this.usuarioId = atendimento ? atendimento.usuarioId : me.id;
      this.usuario = atendimento ? atendimento.usuario : new Usuario(me);
      this.parecer = atendimento ? atendimento.parecer : [ ];
      this.historico = atendimento ? atendimento.historico : [ ];
      this.dataCadastro = atendimento ? atendimento.dataCadastro : new Date();
      this.dataUpdate = atendimento ? atendimento.dataUpdate : null;
    }

    Atendimento.prototype = {

      setPedido: function(pedido) {
        this.pedidoId = pedido.id;
        this.pedido = new Pedido(pedido);
      },

      setCriador: function(criador) {
        this.criadorId = criador.id;
        this.criador = new Usuario(criador);
      },

      getCliente: function() {
        if (this.pedidoId && this.pedido) {
          return this.pedido.cliente;
        }
      },

      isEncerrado: function() {
        return this.historico.length ? this.historico[0].statusId === '1002' : false;
      }

    };

    Atendimento.converterEmEntrada = function(attendance) {
      var atendimento = { };

      atendimento.id = attendance.attendance_id;
      atendimento.codigo = attendance.attendance_code;
      atendimento.pedidoId = attendance.attendance_order_id;
      atendimento.pedido = attendance.attendance_order ? new Pedido(Pedido.converterEmEntrada(attendance.attendance_order)) : new Pedido();
      atendimento.usuarioId = attendance.attendance_user_id;
      atendimento.usuario = attendance.attendance_maker ? new Usuario(Usuario.converterEmEntrada(attendance.attendance_maker)) : new Usuario();

      atendimento.parecer = [ ];
      if (attendance.attendance_note) {
        angular.forEach(attendance.attendance_note, function(item, index) {
          atendimento.parecer.push(new Parecer(Parecer.converterEmEntrada(item)));
        });
      }

      atendimento.historico = [ ];
      if (attendance.attendance_history) {
        angular.forEach(attendance.attendance_history, function(item, index) {
          atendimento.historico.push(new HistoricoAtendimento(HistoricoAtendimento.converterEmEntrada(item)));
        });
      }

      atendimento.dataCadastro = attendance.attendance_date ? new Date(attendance.attendance_date) : new Date();
      atendimento.dataUpdate= attendance.attendance_update ? new Date(attendance.attendance_update) : new Date();

      return atendimento;
    };

    Atendimento.converterEmSaida = function(atendimento) {
      var attendance = { };

      attendance.attendance_id = atendimento.id;
      attendance.attendance_orderId = atendimento.pedidoId;
      attendance.attendance_user_id = atendimento.usuarioId;

      return attendance;
    };

    return Atendimento;

  }]);
