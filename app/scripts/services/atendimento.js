/**
 * Created by egmfilho on 13/10/16.
 */

'use strict';

angular.module('commercialApp.services')
  .factory('Atendimento', ['Parecer', 'Pedido', 'HistoricoAtendimento', 'Usuario', function(Parecer, Pedido, HistoricoAtendimento, Usuario) {

    function Atendimento(atendimento) {
      this.id = atendimento ? atendimento.id : '';
      this.codigo = atendimento ? atendimento.codigo : '';
      this.pedidoId = atendimento ? atendimento.pedidoId : '';
      this.pedido = atendimento ? atendimento.pedido : new Pedido();
      this.usuarioId = atendimento ? atendimento.usuarioId : '';
      this.usuario = atendimento ? atendimento.usuario : new Usuario();
      this.parecer = atendimento ? atendimento.parecer : null;
      this.historico = atendimento ? atendimento.historico : new HistoricoAtendimento();
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
      atendimento.parecer = attendance.attendance_note ? new Parecer(Parecer.converterEmEntrada(attendance.attendance_note)) : new Parecer();
      atendimento.historico = attendance.attendance_history ? new HistoricoAtendimento(HistoricoAtendimento.converterEmEntrada(attendance.attendance_history)) : new HistoricoAtendimento();
      atendimento.dataCadastro = atendimento.dataCadastro ? new Date(attendance.attendance_date) : new Date();
      atendimento.dataUpdate= atendimento.dataUpdate ? new Date(attendance.attendance_update) : new Date();

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
