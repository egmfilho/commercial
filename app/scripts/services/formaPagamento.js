/**
 * Created by egmfilho on 24/02/17.
 */

'use strict';

angular.module('commercialApp.services')
  .factory('FormaPagamento', [function() {

    function FormaPagamento(forma) {
      this.id = forma ? forma.id : '';
      this.codigo = forma ? forma.codigo : '';
      this.descricao = forma ? forma.descricao : '';
      this.troco = forma ? forma.troco : false;
      this.baixaNaInclusao = forma ? forma.baixaNaInclusao : false;
      this.ativo = forma ? forma.ativo : true;
      this.tipo = forma ? forma.tipo : '';
      this.dataCadastro = forma ? forma.dataCadastro : '';
      this.dataUpdate = forma ? forma.dataUpdate : '';
    }

    FormaPagamento.converterEmEntrada = function(mode) {
      var forma = { };

      forma.id = mode.payment_mode_id;
      forma.codigo = mode.payment_mode_code;
      forma.descricao = mode.payment_mode_description;
      forma.troco = mode.payment_mode_change === 'Y';
      forma.baixaNaInclusao = mode.payment_mode_drop_inclusion === 'Y';
      forma.ativo = mode.payment_mode_active === 'Y';
      forma.tipo = mode.payment_mode_type;
      forma.dataCadastro = new Date(mode.payment_mode_date);
      forma.dataUpdate = mode.payment_mode_update ? new Date(mode.payment_mode_update) : null;

      return forma;
    };

    FormaPagamento.converterEmSaida = function(forma) {
      var mode = { };

      mode.payment_mode_id = forma.id;
      mode.payment_mode_code = forma.codigo;
      mode.payment_mode_description = forma.descricao;
      mode.payment_mode_change = forma.troco ? 'Y' : 'N';
      mode.payment_mode_drop_inclusion = forma.baixaNaInclusao ? 'Y' : 'N';
      mode.payment_mode_active = forma.ativo ? 'Y' : 'N';

      return mode;
    };

    return FormaPagamento;

  }]);
