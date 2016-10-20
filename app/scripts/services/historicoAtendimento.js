/**
 * Created by egmfilho on 14/10/16.
 */

'use strict';

angular.module('commercialApp.services')
  .factory('HistoricoAtendimento', ['$cookies', 'StatusHistoricoAtendimento', 'Usuario', function ($cookies, StatusHistoricoAtendimento, Usuario) {

    function HistoricoAtendimento(historico) {
      var me = JSON.parse(window.atob($cookies.get('currentUser')));
      this.id = historico ? historico.id : '';
      this.usuarioId = historico ? historico.usuarioId : me.id;
      this.usuario = historico ? historico.usuario : new Usuario(me);
      this.statusId = historico ? historico.statusId : '1001';
      this.status = historico ? historico.status : new StatusHistoricoAtendimento();
      this.responsavelId = historico ? historico.responsavelId : me.id;
      this.responsavel = historico ? historico.responsavel : new Usuario(me);
      this.proximoContato = historico ? historico.proximoContato : new Date();
      this.dataCadastro = historico ? historico.dataCadastro : new Date();
    }

    HistoricoAtendimento.converterEmEntrada = function(history) {
      var historico = { };

      historico.id = history.attendance_history_id;
      historico.usuarioId = history.attendance_history_user_id;
      historico.usuario = history.attendance_history_maker ? new Usuario(Usuario.converterEmEntrada(history.attendance_history_maker)) : new Usuario();
      historico.statusId = history.attendance_history_status_id;
      historico.status = history.attendance_history_status ? new StatusHistoricoAtendimento(StatusHistoricoAtendimento.converterEmEntrada(history.attendance_history_status)) : new StatusHistoricoAtendimento();
      historico.responsavelId = history.attendance_history_responsible_id;
      historico.responsavel = history.attendance_history_responsible ? new Usuario(Usuario.converterEmEntrada(history.attendance_history_responsible)) : new Usuario();
      historico.proximoContato = new Date(history.attendance_history_deadline);
      historico.dataCadastro = new Date(history.attendance_history_date);

      return historico;
    };

    HistoricoAtendimento.converterEmSaida = function(historico) {
      var history = { };

      history.attendance_history_id = historico.id;
      history.attendance_history_user_id = historico.usuarioId;
      history.attendance_history_status_id = historico.statusId;
      history.attendance_history_responsible_id = historico.responsavelId;

      return history;
    };

    return HistoricoAtendimento;

  }]);
