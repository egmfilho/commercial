/**
 * Created by egmfilho on 14/10/16.
 */

'use strict';

angular.module('commercialApp.services')
  .factory('StatusHistoricoAtendimento', [function () {

    function StatusHistoricoAtendimento(status) {
      this.id = status ? status.id : '';
      this.nome = status ? status.nome : '';
      this.cor = status ? status.cor : '#ff0000';
      this.dataCadastro = status ? status.dataCadastro : new Date();
      this.dataUpdate = status ? status.dataUpdate : null;
    }

    StatusHistoricoAtendimento.converterEmEntrada = function (s) {
      var status = {};

      status.id = s.attendance_history_status_id;
      status.nome = s.attendance_history_status_name;
      status.cor = s.attendance_history_status_color;
      status.dataCadastro = new Date(s.attendance_history_status_date);
      status.dataUpdate = s.attendance_history_status_update ? new Date(s.attendance_history_status_update) : null;

      return status;
    };

    StatusHistoricoAtendimento.converterEmSaida = function (status) {
      var s = {};

      s.attendance_history_status_id = status.id;
      s.attendance_history_status_name = status.nome;
      s.attendance_history_status_color = status.cor;

      return s;
    };

    return StatusHistoricoAtendimento;

  }]);
