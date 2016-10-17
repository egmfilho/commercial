/**
 * Created by egmfilho on 14/10/16.
 */

'use strict';

angular.module('commercialApp.services')
  .factory('StatusHistoricoAtendimento', [function () {

    function StatusHistoricoAtendimento(status) {
      this.id = status ? status.id : '';
      this.nome = status ? status.nome : '';
      this.dataCadastro = status ? status.dataCadastro : new Date();
      this.dataUpdate = status ? status.dataUpdate : null;
    }

    StatusHistoricoAtendimento.converterEmEntrada = function (s) {
      var status = {};

      status.id = s.attendance_history_status_id;
      status.nome = s.attendance_history_status_name;
      status.dataCadastro = new Date(s.attendance_history_status_date);
      status.dataUpdate = new Date(s.attendance_history_status_update);

      return status;
    };

    StatusHistoricoAtendimento.converterEmSaida = function (status) {
      var s = {};

      s.attendance_history_status_id = status.id;
      s.attendance_history_status_name = status.nome;

      return s;
    };

    return StatusHistoricoAtendimento;

  }]);
